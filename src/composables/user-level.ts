import { computed } from 'vue'
import { defaultLevel, levelsObj } from '@/const/tiers.ts'
import { useStakes } from '@/composables/contracts/stakes.ts'
import { useConfig } from '@/composables/config'

export const useUserLevel = () => {
  const { lockConfig, isLoadingLockConfig } = useConfig()

  const sortedValues = computed(() => {
    return Object.values(lockConfig.value.tiers || {})
      .map((value) => parseFloat(value.toString()))
      .sort((a, b) => b - a)
  })

  const levelsInfo = computed(() => {
    const tiersTemp = levelsObj.slice(0, sortedValues.value.length)
    return sortedValues.value.map((value, index) => {
      return {
        ...tiersTemp[index],
        minValue: value,
      }
    })
  })

  const { totalPowerMiles } = useStakes()
  const currentLevel = computed(() => {
    if (totalPowerMiles.value < 100) return defaultLevel
    return (
      levelsInfo.value.find((level) => {
        return totalPowerMiles.value >= level.minValue
      }) || defaultLevel
    )
  })

  return {
    levelsInfo,
    currentLevel,
    isLoading: isLoadingLockConfig,
  }
}
