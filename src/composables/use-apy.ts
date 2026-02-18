import api from '@/services/api.ts'
import { useQuery } from '@tanstack/vue-query'
import { computed, ref, watch } from 'vue'
import { useElements } from '@/composables/elements'
import { useStakes } from '@/composables/contracts/stakes'
import { formatNumber } from '@/composables/helpers'
import { getAverageBaseApy } from '@/lib/apy'
import { DateTime } from 'luxon'
import { useClaimApy } from '@/composables/contracts/claim-apy'
import type { LOCK_DURATION_ID } from '@/types/staking'
import { useGetMe } from '@/composables/get-me'

// let instance: ReturnType<typeof createApy> | undefined

const MIN_DAYS_TO_CLAIM = 90
const TEST_ACCOUNTS = [
  '0x',
]

const failedClaims = ref<
    {
      id: string
      amount: string
      txHash: string
    }[]
  >([])

function createApy() {
  const { elements } = useElements()
  const { myStakes } = useStakes()
  const { claimApy, claimAndStakeApy } = useClaimApy()
  const { accountAddress, isConnected } = useGetMe()

  const hasElementSix = computed(() => {
    if (!elements.value) return false
    return elements.value[6] > 0
  })

  const queryKey = computed(() => ['getApyInfoForUser', accountAddress.value])
  const isEnabled = computed(() => hasElementSix.value && isConnected.value)

  const { data, refetch, isLoading } = useQuery({
    queryKey,
    queryFn: () => api.getApyInfoForUser(),
    initialData: {
      totalEarnings: 0,
      amountEarnedSinceLastClaim: 0,
      averageApy: 0,
      lastClaimTimestamp: '',
      elementUnlockTimestamp: '',
    },
    enabled: isEnabled,
    refetchOnWindowFocus: false,
  })

  const canClaim = computed(() => {
    if (accountAddress.value && TEST_ACCOUNTS.includes(accountAddress.value.toLowerCase())) {
      return true
    }

    const lastClaimTimestamp = DateTime.fromISO(
      data.value.lastClaimTimestamp || data.value.elementUnlockTimestamp,
    )

    const now = DateTime.now()
    const unlockDate = lastClaimTimestamp.plus({
      days: MIN_DAYS_TO_CLAIM,
      minutes: 5,
    })

    return now >= unlockDate
  })

  const remainingDaysToClaim = computed(() => {
    const lastClaimTimestamp = DateTime.fromISO(
      data.value.lastClaimTimestamp || data.value.elementUnlockTimestamp,
    )
    const nextClaimDate = lastClaimTimestamp.plus({ days: MIN_DAYS_TO_CLAIM })
    const now = DateTime.now()

    if (now >= nextClaimDate) return 0

    const diff = nextClaimDate.diff(now, 'days')
    return Math.ceil(diff.days)
  })

  const averageApy = ref(0)

  const getElementSixBoost = computed(() => {
    if (!elements.value) return 0
    if (elements.value[6] >= 15) {
      return 0.15
    } else if (elements.value[6] >= 10) {
      return 0.1
    } else if (elements.value[6] >= 5) {
      return 0.05
    } else {
      return 0
    }
  })

  watch(
    [() => myStakes.value.stakes, () => getElementSixBoost.value],
    ([stakes, getElementSixBoost]) => {
      const averageBaseApy = getAverageBaseApy(stakes)
      averageApy.value = formatNumber(
        (averageBaseApy + getElementSixBoost) * 100,
        2,
      )
    },
    {
      immediate: true,
    },
  )

  const claimApyEarnings = async (shouldStake?: boolean, lockingPeriod?: LOCK_DURATION_ID) => {
    const toClaim = await api.claimApyEarnings()
    if (!toClaim.success || !toClaim.claimId) {
      throw new Error('No claim ID found')
    }
    const claimId = toClaim.claimId
    const claimedAmount = toClaim.claimedAmount

    if (shouldStake && lockingPeriod) {
      await claimAndStakeApy(claimId, claimedAmount, lockingPeriod)
    } else {
      await claimApy(claimId, claimedAmount)
    }
    refetch()
  }

  const retryFailedClaim = async (shouldStake?: boolean, lockingPeriod?: LOCK_DURATION_ID) => {
    const claim = failedClaims.value[0]
    if (shouldStake && lockingPeriod) {
      await claimAndStakeApy(
        claim.id,
        claim.amount,
        lockingPeriod,
      )
    } else {
      await claimApy(claim.id, claim.amount)
    }
    refetch()
  }

  const checkClaims = async () => {
    const previousClaims = await api.getApyEarningClaims()
    if (previousClaims.length > 0) {
      const someFailed = previousClaims.filter((claim) => claim.txHash === null)
      failedClaims.value = someFailed
    }
  }

  watch(
    accountAddress,
    async (address) => {
      if (address) {
        checkClaims()
      }
    },
    {
      immediate: true,
    },
  )

  return {
    data,
    refetch,
    isLoading,
    claimApyEarnings,
    retryFailedClaim,
    hasElementSix,
    averageApy,
    canClaim,
    remainingDaysToClaim,
    failedClaims,
  }
}

export const useApy = createApy