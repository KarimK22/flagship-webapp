import { DateTime, type DurationObjectUnits } from 'luxon'
import { onUnmounted, ref, watch } from 'vue'

export function useCountdown(
) {
  const diff = ref<DurationObjectUnits>({})
  const endDateRef = ref()
  let intervalId: NodeJS.Timeout | null = null

  function getCountdown() {
    if (!endDateRef.value) return
    const now = DateTime.now()
    const endDate = DateTime.fromISO(endDateRef.value)
    const result = endDate.diff(now, ['days', 'hours', 'minutes', 'seconds']).toObject()
    diff.value = result
  }

  const clearCountdown = () => {
    if (intervalId) {
      clearInterval(intervalId)
    }
  }

  watch(endDateRef, () => {
    if (endDateRef.value) {
      getCountdown()
      intervalId = setInterval(getCountdown, 1000)
    }
  }, { immediate: true })

  onUnmounted(() => {
    clearCountdown()
  })

  const parseValue = (value: number | undefined) => {
    if (value === undefined) return '00'
    return Math.max(0, Math.floor(value)).toString().padStart(2, '0')
  }

  return {
    diff,
    endDateRef,
    parseValue,
  }
}
