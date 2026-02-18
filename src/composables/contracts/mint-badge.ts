import api from '@/services/api.ts'
import { readContract, simulateContract, writeContract } from '@wagmi/core'
import { config } from '@/composables/reown.ts'
import BADGES_CONTRACT_ABI from '@/abi/LingoBadges'
import { env } from '@/env.ts'
import { useStatus } from '@/composables/contracts/status.ts'
import { useTransaction } from '@/composables/contracts/transactions.ts'
import type { BADGE_ID } from '@/types/shared/badge'

const STATUS_KEY = 'mintBadge'
const VESTING_TYPE = 'global' // NOTE: probably we need to update the naming from status

export const useMintBadge = () => {
  const { updateStatus, handleTransactionError } = useStatus()
  const { waitForTransaction } = useTransaction()
  const updateStatusBind = updateStatus.bind(null, STATUS_KEY, VESTING_TYPE)

  const checkMintedBadges = async (address: string, badgeIds: BADGE_ID[]) => {
    const isMinted = await readContract(config, {
      abi: BADGES_CONTRACT_ABI,
      functionName: 'balanceOfBatch',
      args: [Array(badgeIds.length).fill(address), badgeIds.map((id) => BigInt(id))],
      address: env.contracts.base.badgesContractAddress,
    })

    return Object.fromEntries(
      badgeIds.map((id, index) => [
        id,
        {
          isClaimed: isMinted[index] > 0,
          isLocked: isMinted[index] <= 0,
        },
      ]),
    )
  }

  async function mintBadge(address: `0x${string}`, badgeId: BADGE_ID) {
    try {
      updateStatusBind({
        loading: true,
        success: false,
        error: false,
      })

      const { signature } = await api.getMintBadgeSignature({ badgeId })

      const { request } = await simulateContract(config, {
        abi: BADGES_CONTRACT_ABI,
        functionName: 'mintBadge',
        args: [address, badgeId, signature],
        address: env.contracts.base.badgesContractAddress,
      })

      const txHash = await writeContract(config, request)

      await waitForTransaction({
        transaction: { type: 'transaction', hash: txHash },
        notifyBackend: false,
      })

      updateStatusBind({ success: true })

      return true
    } catch (error) {
      console.error(`Error in [${STATUS_KEY}]:`, error)
      updateStatusBind({ error: true })
      handleTransactionError(error)
      throw error
    } finally {
      updateStatusBind({ loading: false })
    }
  }

  return {
    mintBadge,
    checkMintedBadges,
  }
}
