import api from '@/services/api.ts'
import { simulateContract, writeContract } from '@wagmi/core'
import TOKEN_CLAIM_APY_ABI from '@/abi/TokenClaimAPY'
import { env } from '@/env.ts'
import { useStatus } from '@/composables/contracts/status.ts'
import { type Transaction, useTransaction } from '@/composables/contracts/transactions.ts'
import { useStaking } from './staking'
import { LOCK_DURATION_ID } from '@/types/staking'
import { bytesToHex, parseEther, toBytes } from 'viem'
import { sendCalls } from '@wagmi/core/experimental'
import { config } from '@/composables/reown'

export const useClaimApy = () => {
  const { updateStatus, handleTransactionError } = useStatus()
  const { waitForTransaction, supportsPaymaster, paymasterCapabilities } =
    useTransaction()
  const { stake } = useStaking()
  const updateClaimApyStatus = updateStatus.bind(
    null,
    'claimAPY',
    'global',
  )
  const updateClaimAndStakeApyStatus = updateStatus.bind(
    null,
    'claimAndStakeAPY',
    'global',
  )

  async function claimApy(claimId: string, amount: string) {
    try {
      updateClaimApyStatus({
        loading: true,
        success: false,
        error: false,
      })

      const { signature } = await api.generateApyEarningClaimSignature({
        claimId,
      })

      if (!signature) {
        throw new Error('Failed to generate signature')
      }

      const parsedAmount = parseEther(amount)
      const claimIdHex = bytesToHex(toBytes(claimId))

      const shouldUsePaymaster = await supportsPaymaster()
      let transaction: Transaction

      if (shouldUsePaymaster) {
        const id = await sendCalls(config, {
          calls: [
            {
              abi: TOKEN_CLAIM_APY_ABI,
              functionName: 'claim',
              args: [parsedAmount, claimIdHex, signature],
              to: env.contracts.base.tokenClaimApyAddress,
            },
          ],
          capabilities: paymasterCapabilities,
        })

        transaction = {
          id,
          type: 'calls',
        }
      } else {
        const { request } = await simulateContract(config, {
          abi: TOKEN_CLAIM_APY_ABI,
          functionName: 'claim',
          args: [parsedAmount, claimIdHex, signature],
          address: env.contracts.base.tokenClaimApyAddress,
        })

        const txHash = await writeContract(config, request)

        transaction = {
          type: 'transaction',
          hash: txHash,
        }
      }

      await waitForTransaction({
        transaction,
        notifyBackend: false,
      })

      const txHash = 'hash' in transaction ? transaction.hash : transaction.id

      await api.markClaimAsDone({
        claimId,
        txHash,
      })

      updateClaimApyStatus({ success: true })

      return true
    } catch (error) {
      console.error(`Error in [claimAPY]:`, error)
      updateClaimApyStatus({ error: true })
      handleTransactionError(error)
      return false
    } finally {
      updateClaimApyStatus({ loading: false })
    }
  }

  async function claimAndStakeApy(claimId: string, amount: string, lockingPeriod: LOCK_DURATION_ID) {
    try {
      await updateClaimAndStakeApyStatus({
        loading: true,
        success: false,
        error: false,
      })

      const claimResult = await claimApy(claimId, amount)
      if (!claimResult) {
        throw new Error('Failed to claim')
      }

      const result = await stake(Number(amount), lockingPeriod)
      if (!result) {
        throw new Error('Failed to stake')
      }

      await updateClaimAndStakeApyStatus({ success: true })

      return true
    } catch (error) {
      console.error(`Error in [claimAndStakeAPY]:`, error)
      await updateClaimAndStakeApyStatus({ error: true })
      handleTransactionError(error)
      return false
    } finally {
      await updateClaimAndStakeApyStatus({ loading: false })
    }
  }

  return {
    claimApy,
    claimAndStakeApy,
  }
}
