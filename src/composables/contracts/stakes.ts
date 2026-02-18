import { computed, watch } from 'vue'
import api from '@/services/api.ts'
import { useQuery } from '@tanstack/vue-query'
import { DateTime } from 'luxon'
import { useNow } from '@vueuse/core'
import { useGetMe } from '@/composables/get-me'
import { LOCK_DURATION_ID } from '@/types/staking'
import { useConfig } from '@/composables/config'

const MINIMUM_POWER_MILES = 100
const DELAY_AFTER_GENERATION_SEC = 10
export const useStakes = () => {
  const { isAuthenticated, accountAddress } = useGetMe()
  const {
    data: myStakes,
    refetch: refetchMyStakes,
    isLoading: loadingMyStakes,
  } = useQuery({
    queryKey: ['myStakes', accountAddress],
    queryFn: async () => {
      return await api.getStakes()
    },
    enabled: isAuthenticated,
    initialData: {
      stakes: [],
      powerConfig: {
        manualBoost: null,
        oneLingoBaseDailyPower: 0,
        lastPowerMileGenerationTimestamp: Math.floor(Date.now() / 1000),
      },
      powers: {
        total: '0',
      },
      referral: {
        count: 0,
        power: '0',
      },
    },
    refetchOnWindowFocus: false,
  })

  const { lockConfig } = useConfig()
  const now = useNow()
  const hour = computed(() => now.value.getHours())
  watch(hour, async () => {
    await new Promise(resolve => setTimeout(resolve, DELAY_AFTER_GENERATION_SEC * 1000))
    await refetchMyStakes()
  })

  const myStakesList = computed(() => {
    return myStakes.value.stakes
  })
  const hasStakes = computed(() => {
    return myStakesList.value.length > 0
  })

  const currentDailyPowerMileGeneration = computed(() => {
    return myStakesList.value.reduce((acc, stake) => acc + Number(stake.dailyPowerWithBoost), 0)
  })

  const myBoost = computed(() => {
    return myStakes.value.powerConfig.manualBoost
  })
  const oneLingoBaseDailyPower = computed(() => {
    return myStakes.value.powerConfig.oneLingoBaseDailyPower
  })

  const referral = computed(() => {
    return myStakes.value.referral
  })

  const totalPowerMiles = computed(() => {
    const v = +myStakes.value?.powers?.total || 0
    return v
  })

  const timestampToReach100PM = computed(() => {
    const missingAmount = MINIMUM_POWER_MILES - totalPowerMiles.value
    if (!currentDailyPowerMileGeneration.value) return DateTime.utc().plus({ year: 1 }).toMillis()
    if (missingAmount <= 0 || !myStakes.value?.powerConfig?.lastPowerMileGenerationTimestamp) return 0
    return DateTime
      .fromSeconds(myStakes.value.powerConfig.lastPowerMileGenerationTimestamp)
      .plus({ day: missingAmount / currentDailyPowerMileGeneration.value })
      .endOf('hour')
      .plus({ second: DELAY_AFTER_GENERATION_SEC })
      .toMillis()
  })

  const progressTo100PM = computed(() => {
    if (totalPowerMiles.value >= MINIMUM_POWER_MILES) return 100
    const totalDuration = timestampToReach100PM.value - myStakes.value.powerConfig.lastPowerMileGenerationTimestamp * 1000
    const durationProgress = (DateTime.fromJSDate(now.value).toUnixInteger() - myStakes.value.powerConfig.lastPowerMileGenerationTimestamp) * 1000
    return Math.floor(totalPowerMiles.value + (durationProgress / totalDuration) * (100 - totalPowerMiles.value))
  })

  const totalStakedLingo = computed(
    () =>
      myStakesList.value.reduce(
        (acc, stake) => acc + Number(stake.amount),
        0,
      ) || 0,
  )

  function calculatePowerPerDay(
    coins: number,
    lockDuration = LOCK_DURATION_ID.TWELVE_MONTHS,
  ) {
    if (!lockConfig.value) {
      throw new Error('Lock config not available')
    }

    const lockData = lockConfig.value.lockDurations[lockDuration]
    if (!lockData) {
      throw new Error(`Invalid lock duration: ${lockDuration}`)
    }
    const boost = 1 + lockData.boost
    const factor = oneLingoBaseDailyPower.value
    return coins * factor * boost
  }

  return {
    myStakes,
    myStakesList,
    refetchMyStakes,
    loadingMyStakes,
    hasStakes,
    myBoost,
    timestampToReach100PM,
    progressTo100PM,
    oneLingoBaseDailyPower,
    referral,
    totalPowerMiles,
    totalStakedLingo,
    calculatePowerPerDay,
  }
}
