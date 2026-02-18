import { computed, ref, watch } from 'vue'
import { readContract } from '@wagmi/core'
import vestingContractDefinition from '@/abi/TokenVesting.json'
import { beneficiaryMapping } from '@/types/beneficiary.ts'
import { formatEther, parseEther } from 'viem'
import { env } from '@/env.ts'
import tokenContractDefinition from '@/abi/LingoToken.json'
import { config } from '@/composables/reown.ts'
import { useClaimCustom } from '@/composables/contracts/claim-custom.ts'
import { useSnapshot } from '@/composables/contracts/snapshot.ts'
import type { Snapshot } from '@/types/snapshot.ts'
import { useQuery } from '@tanstack/vue-query'
import { useLastClaims } from '@/composables/contracts/last-claims'
import { useInvestorsKOL } from '@/composables/contracts/claim-investorsKOL'
import { useGetMe } from '../get-me'

const claimableAllocationTypes = ref<Snapshot['allocationTypes'] | null>(null)
const CLAIM_COOLDOWN = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export const useBalance = () => {
  const { accountAddress } = useGetMe()
  const { totalTokenAllocation, allocationTypes } = useSnapshot()
  const { totalCustomClaimedBalance } = useClaimCustom()
  const { totalCustomClaimableBalance, islandTokens } = useClaimCustom()
  const { lastClaimsData } = useLastClaims()
  const { totalReleasableAmount, totalDistributedAmount } = useInvestorsKOL()

  const hasAirdrop = computed(() => {
    const hasDreamTokens = islandTokens.value === null ? false : islandTokens.value.dream > 0
    const hasClaimableAllocationsAirdrops = !claimableAllocationTypes.value ? false : Object.keys(claimableAllocationTypes.value).some((key) => /airdrop/i.test(key))
    return hasClaimableAllocationsAirdrops || hasDreamTokens
  })

  const canClaimType = (vestingType: string): boolean => {
    if (!lastClaimsData.value) return true
    const beneficiaryType = beneficiaryMapping[vestingType]
    const lastClaimTime = lastClaimsData.value[beneficiaryType]
    if (!lastClaimTime) return true

    const now = Date.now()
    return now - lastClaimTime >= CLAIM_COOLDOWN
  }

  const getNextClaimTime = (vestingType: string): number | null => {
    if (!lastClaimsData.value) return null
    const beneficiaryType = beneficiaryMapping[vestingType]
    const lastClaimTime = lastClaimsData.value[beneficiaryType]
    if (!lastClaimTime) return null

    const nextClaimTime = lastClaimTime + CLAIM_COOLDOWN
    const now = Date.now()
    return now >= nextClaimTime ? null : nextClaimTime
  }

  // Claimable balance
  async function getClaimableBalance(vestingType: string) {
    if (!allocationTypes.value || !accountAddress.value) {
      console.log('no allocation types', allocationTypes.value)
      return BigInt('0')
    }
    return await readContract(config, {
      abi: vestingContractDefinition.abi,
      functionName: 'claimableTokenOf',
      args: [accountAddress.value, beneficiaryMapping[vestingType], parseEther(String(allocationTypes.value[vestingType]))],
      address: env.contracts.base.vestingAddress,
    }) as bigint
  }

  async function checkClaimable(vestingType: string) {
    const claimableToken = await getClaimableBalance(vestingType)
    return (claimableToken >= parseEther('1')) as boolean
  }

  watch(allocationTypes, async (newVal) => {
    if (!newVal) {
      claimableAllocationTypes.value = null
      return
    }

    const entries = await Promise.all(
      Object.entries(newVal).map(async ([key, value]) => {
        const isClaimable = await checkClaimable(key)
        return isClaimable ? [key, value] : null
      }),
    )

    claimableAllocationTypes.value = Object.fromEntries(
        entries.filter((entry) => entry !== null) as [string, number][],
    )
  }, { immediate: true })

  async function getAllClaimable() {
    if (!allocationTypes.value) return BigInt('0')
    const claimableBalances = await Promise.all(
      Object.keys(allocationTypes.value)
        .filter(canClaimType)
        .map(getClaimableBalance),
    )

    return claimableBalances.reduce((acc: bigint, claimable: bigint | undefined) =>
      claimable && claimable >= parseEther('1') ? acc + claimable : acc, BigInt(0),
    )
  }

  const { data: totalClaimableData, isLoading: loadingClaimableBalance, refetch: refetchClaimableBalance  } = useQuery({
    queryKey: ['totalClaimable', accountAddress.value, lastClaimsData.value],
    queryFn: async () => {
      return await getAllClaimable()
    },
    enabled: computed(() => !!accountAddress.value && !!allocationTypes.value),
    initialData: BigInt('0'),
    refetchOnWindowFocus: false,
  })

  const totalClaimableBalance = computed(() => {
    return Number(formatEther(BigInt(String(totalClaimableData.value)))) + totalCustomClaimableBalance.value + totalReleasableAmount.value
  })

  // Claimed balance
  async function getClaimedBalance(vestingType: string) {
    return await readContract(config, {
      abi: vestingContractDefinition.abi,
      functionName: 'claimedTokens',
      args: [accountAddress.value, beneficiaryMapping[vestingType]],
      address: env.contracts.base.vestingAddress,
    }) as bigint
  }

  async function getAllClaimedBalance() {
    if (!allocationTypes.value) return BigInt('0')
    const claimedBalances = await Promise.all(
      Object.keys(allocationTypes.value).map(getClaimedBalance),
    )

    return claimedBalances.reduce((acc: bigint, claimed: bigint | undefined) => {
      return claimed && claimed !== BigInt(0) ? acc + claimed : acc
    }, BigInt(0))
  }

  const { data: totalClaimedData, isLoading: loadingClaimedBalance, refetch: refetchClaimedBalance } = useQuery({
    queryKey: ['totalClaimed', accountAddress.value, allocationTypes.value],
    queryFn: getAllClaimedBalance,
    enabled: computed(() => !!accountAddress.value && !!allocationTypes.value),
    initialData: BigInt('0'),
    refetchOnWindowFocus: false,
  })

  const totalClaimedBalance = computed(() => {
    return Number(formatEther(BigInt(String(totalClaimedData.value)))) + totalCustomClaimedBalance.value + totalDistributedAmount.value
  })

  // Unvested balance
  const unvested = computed(() => {
    return totalTokenAllocation.value - totalClaimedBalance.value - totalClaimableBalance.value
  })

  // Token balance
  async function getTokenBalance() {
    return await readContract(config, {
      abi: tokenContractDefinition.abi,
      functionName: 'balanceOf',
      args: [accountAddress.value],
      address: env.contracts.base.tokenAddress,
    }) as bigint
  }

  const { data: tokenBalanceData, refetch: refetchTokenBalance, isLoading: loadingTokenBalance } = useQuery({
    queryKey: ['tokenBalanceData', accountAddress.value],
    queryFn: async () => {
      return await getTokenBalance()
    },
    enabled: computed(()=> !!accountAddress.value),
    initialData: BigInt('0'),
    refetchOnWindowFocus: false,
  })

  const tokenBalance = computed(() => {
    if (!accountAddress.value) return 0
    return Number(formatEther(BigInt(String(tokenBalanceData.value)))) || 0
  })

  const tokenBalanceAsString = computed(() => {
    if (!accountAddress.value) return '0'
    const ether = formatEther(tokenBalanceData.value)
    return ether || '0'
  })

  const refetch = () => {
    refetchTokenBalance()
    refetchClaimableBalance()
    refetchClaimedBalance()
  }

  return {
    refetch,
    unvested,
    totalClaimedBalance,
    refetchClaimedBalance,
    loadingClaimedBalance,
    totalClaimableBalance,
    refetchClaimableBalance,
    loadingClaimableBalance,
    claimableAllocationTypes,
    hasAirdrop,
    tokenBalance,
    refetchTokenBalance,
    loadingTokenBalance,
    canClaimType,
    getNextClaimTime,
    tokenBalanceAsString,
  }
}