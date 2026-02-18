import api from '@/services/api.ts'
import { computed, ref } from 'vue'
import { readContract, writeContract } from '@wagmi/core'
import { config } from '@/composables/reown.ts'
import islandsClaimContractDefinition from '@/abi/LingoClaimIslands.json'
import { parseEther } from 'viem'
import { env } from '@/env.ts'
import { useStatus } from '@/composables/contracts/status.ts'
import { useStaking } from '@/composables/contracts/staking.ts'
import { LOCK_DURATION_ID } from '@/types/staking.ts'
import { useApproval } from '@/composables/contracts/approval.ts'
import { useQuery } from '@tanstack/vue-query'
import { useTransaction } from '@/composables/contracts/transactions.ts'
import { useGetMe } from '../get-me'

const areClaimedIslandTokens = ref<boolean>(false)
export const useClaimCustom = () => {
  const { accountAddress, isConnected } = useGetMe()
  const { waitForTransaction } = useTransaction()
  const totalCustomClaimableBalance = computed(() => {
    if (areClaimedIslandTokens.value) return 0
    return Object.values(islandTokens.value).reduce((acc, value) => acc + value, 0)
  })

  const totalCustomClaimedBalance = computed(() => {
    if (!areClaimedIslandTokens.value) return 0
    return Object.values(islandTokens.value).reduce((acc, value) => acc + value, 0)
  })

  const {
    data: islandTokens,
    refetch: refetchIslandTokens,
    isLoading: loadingIslandTokens,
  } = useQuery({
    queryKey: ['islandTokens', accountAddress],
    queryFn: async () => {
      const response = (await api.getIslandCampaignAmount()).amounts
      areClaimedIslandTokens.value = await hasClaimedIslandTokens()
      return response
    },
    enabled: isConnected,
    initialData: { firstClass: 0, dream: 0 },
    refetchOnWindowFocus: false,
  })

  const availableIslandTokens = computed(() => {
    return Object.fromEntries(
      Object.entries({
        'Missing First Class': islandTokens.value.firstClass,
        'Dreams Come True': islandTokens.value.dream,
      }).filter(([_, value]) => value > 0),
    )
  })

  async function hasClaimedIslandTokens() {
    return await readContract(config, {
      abi: islandsClaimContractDefinition,
      functionName: 'hasClaimed',
      args: [accountAddress.value],
      address: env.contracts.base.lingoTokenAddress,
    }) as boolean
  }

  // claim
  const { updateStatus, handleTransactionError } = useStatus()

  async function claimCustom() {
    try {
      await updateStatus('claimCustom', 'global', { loading: true, success: false, error: false })

      const signatureResponse = await api.getIslandCampaignSignature()

      if (!signatureResponse.signature) {
        throw new Error('Signature not available')
      }

      const txHash = await writeContract(config, {
        abi: islandsClaimContractDefinition,
        functionName: 'claim',
        args: [parseEther(String(signatureResponse.amount)), signatureResponse.signature],
        address: env.contracts.base.lingoTokenAddress,
      })

      await waitForTransaction({
        transaction: { type: 'transaction', hash: txHash },
        notifyBackend: false,
      })

      await updateStatus('claimCustom', 'global', { success: true })
      return true
    } catch (error) {
      console.error('Error in claimTokens:', error)
      await updateStatus('claimCustom', 'global', { error: true })
      handleTransactionError(error)
      return false
    } finally {
      await updateStatus('claimCustom', 'global', { loading: false })
    }
  }

  const { stake } = useStaking()
  const { approve } = useApproval()

  async function claimAndStakeCustom(lockingPeriod: LOCK_DURATION_ID) {
    try {
      await updateStatus('claimAndStakeCustom', 'global', { loading: true, success: false, error: false })

      const approval = await approve()

      if (!approval) {
        throw new Error('Approval failed')
      }

      const claimResponse = await claimCustom()
      if (!claimResponse) {
        await updateStatus('claimAndStakeCustom', 'global', { error: true })
        throw new Error('Claim failed')
      } else {
        await refetchIslandTokens()
      }
      const stakeResponse = await stake(totalCustomClaimedBalance.value, lockingPeriod)

      if (!stakeResponse) {
        await updateStatus('claimAndStakeCustom', 'global', { error: true })
        throw new Error('Stake failed')
      }
      await updateStatus('claimAndStakeCustom', 'global', { success: true })
      return true
    } catch (error) {
      console.error('Error in claimAndStakeCustom:', error)
      await updateStatus('claimAndStakeCustom', 'global', { error: true })
      handleTransactionError(error)
      return false
    } finally {
      await updateStatus('claimAndStakeCustom', 'global', { loading: false })
    }
  }

  return {
    islandTokens,
    refetchIslandTokens,
    loadingIslandTokens,
    availableIslandTokens,
    totalCustomClaimableBalance,
    claimCustom,
    claimAndStakeCustom,
    totalCustomClaimedBalance,
    areClaimedIslandTokens,
  }
}
