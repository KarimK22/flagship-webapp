import { computed, type ComputedRef } from 'vue'
import { DateTime } from 'luxon'
import { useNow } from '@vueuse/core'

type TimerConfig = {
	endDateTimestamp: number
	progress: ComputedRef<number>
}

export const useTimer = (config: TimerConfig) => {
  const nowJsDate = useNow({ interval: 1000 })
  const DEFAULT_TIME = '0:00'
  const now = computed(() => DateTime.fromJSDate(nowJsDate.value))

  // Calculate the circumference of the circle
  const circumference = computed(() => 2 * Math.PI * 72)
  const strokeDashoffset = computed(() => {
    const normalizedProgress = config.progress.value / 100 // Convert to 0-1 range
    return circumference.value * normalizedProgress
  })

  const timeRemaining = computed(() => {
    if (now.value >= DateTime.fromMillis(config.endDateTimestamp)) return DEFAULT_TIME

    const diff = DateTime.fromMillis(config.endDateTimestamp).diff(now.value, ['days', 'hours', 'minutes', 'seconds'])
    const { days = 0, hours = 0, minutes = 0, seconds = 0 } = diff.toObject()
    const roundedSeconds = Math.floor(seconds)
    if (days > 0) return `${days}d`
    if (hours > 0) return `${hours}:${minutes.toString().padStart(2, '0')}`
    return `${minutes}:${roundedSeconds.toString().padStart(2, '0')}`
  })

  return {
    timeRemaining,
    isComplete: computed(() => config.progress.value >= 100),
    circumference,
    strokeDashoffset,
  }
}
