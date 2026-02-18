import { readContract, writeContract } from '@wagmi/core'
import { config } from '@/composables/reown.ts'
import investorsKOLAddress from '@/abi/LingoInvestorsKOL.json'
import { env } from '@/env.ts'
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useStatus } from '@/composables/contracts/status.ts'
import { useTransaction } from '@/composables/contracts/transactions.ts'
import { useStaking } from '@/composables/contracts/staking.ts'
import { useApproval } from '@/composables/contracts/approval.ts'
import { LOCK_DURATION_ID } from '@/types/staking.ts'
import { formatEther } from 'viem'
import { useGetMe } from '../get-me'

type Pool = {
  cliff: bigint
  duration: bigint
  initialUnlockPercent: bigint
  interval: bigint
  isDisabled: boolean
  name: string
  revocable: boolean
  start: bigint
  timestamps: bigint[]
  unlockPerInterval: bigint
  vestType: number
}

type WhitelistInfo = {
  wallet: string
  dcbAmount: bigint
  distributedAmount: bigint
  joinDate: bigint
  revokeDate: bigint
  revoke: boolean
  disabled: boolean
}

interface ProcessedWhitelistInfo {
  poolIndex: number
  poolName: string
  wallet: string
  dcbAmount: string
  distributedAmount: string
  releasableAmount: string
  joinDate: string
  revokeDate: string
  revoke: boolean
  disabled: boolean
}

export const useInvestorsKOL = () => {
  const { updateStatus, handleTransactionError } = useStatus()
  const { waitForTransaction } = useTransaction()
  const { stake } = useStaking()
  const { approve } = useApproval()

  const { isConnected, accountAddress } = useGetMe()

  const { data: pools, isLoading: loadingPools, refetch: refetchPools } = useQuery({
    queryKey: ['investorsKOLPools', accountAddress.value],
    queryFn: async () => {
      const result = await readContract(config, {
        abi: investorsKOLAddress,
        functionName: 'getAllVestingPools',
        address: env.contracts.base.investorsKOLAddress,
      }) as Pool[]
      return result.map(pool => ({
        name: pool.name,
        cliff: pool.cliff.toString(),
        duration: pool.duration.toString(),
        initialUnlockPercent: pool.initialUnlockPercent.toString(),
        start: pool.start.toString(),
        isDisabled: pool.isDisabled,
        revocable: pool.revocable,
        vestType: pool.vestType,
      }))
    },
    enabled: isConnected,
    initialData: [],
  })

  const { data: whitelistInfo, isLoading: loadingWhitelistInfo, refetch: refetchWhitelistInfo } = useQuery({
    queryKey: ['whitelistInfo', accountAddress, pools],
    queryFn: async () => {
      if (!pools.value || pools.value.length === 0) return []

      try {
        const whitelistPromises = pools.value.map(async (_, index) => {
          try {
            const [whitelistResult, releasableAmount] = await Promise.all([
              await readContract(config, {
                abi: investorsKOLAddress,
                functionName: 'getWhitelist',
                address: env.contracts.base.investorsKOLAddress,
                args: [index, accountAddress.value],
              }) as Promise<WhitelistInfo>,
              await readContract(config, {
                abi: investorsKOLAddress,
                functionName: 'getReleasableAmount',
                address: env.contracts.base.investorsKOLAddress,
                args: [index, accountAddress.value],
              }) as Promise<bigint>,
            ])

            const result = {
              poolIndex: index,
              poolName: pools.value[index].name,
              wallet: whitelistResult.wallet,
              dcbAmount: formatEther(whitelistResult.dcbAmount),
              distributedAmount: formatEther(whitelistResult.distributedAmount),
              releasableAmount: formatEther(releasableAmount),
              joinDate: whitelistResult.joinDate.toString(),
              revokeDate: whitelistResult.revokeDate.toString(),
              revoke: whitelistResult.revoke,
              disabled: whitelistResult.disabled,
            }
            return result
          } catch (_error) {
            return null
          }
        })

        const results = (await Promise.all(whitelistPromises)).filter((item): item is ProcessedWhitelistInfo => item !== null)
        return results.filter(info => Number(info.dcbAmount) > 0 || Number(info.releasableAmount) > 0)
      } catch (_error) {
        return []
      }
    },
    enabled: computed(() => isConnected.value && !!pools.value && pools.value.length > 0),
    initialData: [],
    refetchOnWindowFocus: false,
  })

  const releasablePools = computed(() => {
    if (!whitelistInfo.value?.length) return []
    return whitelistInfo.value
      .filter(info => Number(info.releasableAmount) > 0)
      .map(info => ({
        index: info.poolIndex,
        info,
        name: info.poolName,
        releasableAmount: Number(info.releasableAmount),
      }))
  })

  const totalReleasableAmount = computed(() => {
    if (!whitelistInfo.value?.length) return 0
    return whitelistInfo.value.reduce((acc, info) => acc + Number(info.releasableAmount), 0)
  })
  const totalAllocationAmount = computed(() => {
    if (!whitelistInfo.value?.length) return 0
    return whitelistInfo.value.reduce((acc, info) => acc + Number(info.dcbAmount), 0)
  })
  const totalDistributedAmount = computed(() => {
    if (!whitelistInfo.value?.length) return 0
    return whitelistInfo.value.reduce((acc, info) => acc + Number(info.distributedAmount), 0)
  })

  async function claimInvestorsKOL(poolIndex: number) {
    try {
      await updateStatus('claimInvestorsKOL', 'global', { loading: true, success: false, error: false })

      const txHash = await writeContract(config, {
        abi: investorsKOLAddress,
        functionName: 'claimDistribution',
        args: [poolIndex, accountAddress.value],
        address: env.contracts.base.investorsKOLAddress,
      })

      await waitForTransaction({
        transaction: { type: 'transaction', hash: txHash },
        notifyBackend: false,
      })

      await refetchWhitelistInfo()
      await updateStatus('claimInvestorsKOL', 'global', { success: true })
      return true
    } catch (error) {
      console.error('Error in claimInvestorsKOL:', error)
      await updateStatus('claimInvestorsKOL', 'global', { error: true })
      handleTransactionError(error)
      return false
    } finally {
      await updateStatus('claimInvestorsKOL', 'global', { loading: false })
    }
  }

  async function claimAndStakeInvestorsKOL(poolIndex: number, lockingPeriod: LOCK_DURATION_ID) {
    try {
      const claimableAmount = totalReleasableAmount.value
      await updateStatus('claimAndStakeInvestorsKOL', 'global', { loading: true, success: false, error: false })

      const approval = await approve()
      if (!approval) {
        throw new Error('Approval failed')
      }

      const claimResponse = await claimInvestorsKOL(poolIndex)
      if (!claimResponse) {
        await updateStatus('claimAndStakeInvestorsKOL', 'global', { error: true })
        throw new Error('Claim failed')
      }

      const poolInfo = whitelistInfo.value?.find(info => info.poolIndex === poolIndex)
      if (!poolInfo) {
        throw new Error('Pool info not found')
      }

      const stakeResponse = await stake(claimableAmount, lockingPeriod)
      if (!stakeResponse) {
        await updateStatus('claimAndStakeInvestorsKOL', 'global', { error: true })
        throw new Error('Stake failed')
      }

      await updateStatus('claimAndStakeInvestorsKOL', 'global', { success: true })
      return true
    } catch (error) {
      console.error('Error in claimAndStakeInvestorsKOL:', error)
      await updateStatus('claimAndStakeInvestorsKOL', 'global', { error: true })
      handleTransactionError(error)
      return false
    } finally {
      await updateStatus('claimAndStakeInvestorsKOL', 'global', { loading: false })
    }
  }

  return {
    pools,
    loadingPools,
    refetchPools,
    whitelistInfo,
    loadingWhitelistInfo,
    refetchWhitelistInfo,
    claimInvestorsKOL,
    claimAndStakeInvestorsKOL,
    totalReleasableAmount,
    totalAllocationAmount,
    totalDistributedAmount,
    releasablePools,
  }
}
