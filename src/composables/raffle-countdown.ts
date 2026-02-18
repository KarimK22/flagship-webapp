import api from '@/services/api'
import { useQuery } from '@tanstack/vue-query'
import { DateTime } from 'luxon'
import { computed, onUnmounted, ref, watchEffect } from 'vue'

export function useRaffleCountdown(
) {
  const { data: raffleBanner } = useQuery({
    queryKey: ['raffleBanner'],
    queryFn: () => api.getRaffleBanner(),
  })

  const cd = ref('00:00:00:00')
  let intervalId: NodeJS.Timeout | null = null
  const banner = computed(() => raffleBanner.value?.metadata.banner)
  const shouldShow = ref(false)

  function updateCountdown() {
    if (!banner.value?.endDate) return
    const now = DateTime.now()
    const endDate = DateTime.fromISO(banner.value?.endDate)
    const startDate = DateTime.fromISO(banner.value?.startDate)
    const diff = endDate
      .diff(now, ['days', 'hours', 'minutes', 'seconds'])
      .toObject()
    shouldShow.value = now.toMillis() >= startDate.toMillis()

    const days = Math.max(0, Math.floor(diff.days ?? 0))
      .toString()
      .padStart(2, '0')
    const hours = Math.max(0, Math.floor(diff.hours ?? 0))
      .toString()
      .padStart(2, '0')
    const minutes = Math.max(0, Math.floor(diff.minutes ?? 0))
      .toString()
      .padStart(2, '0')
    const seconds = Math.max(0, Math.floor(diff.seconds ?? 0))
      .toString()
      .padStart(2, '0')

    cd.value = `${days}:${hours}:${minutes}:${seconds}`
  }

  const clearCountdown = () => {
    if (intervalId) {
      clearInterval(intervalId)
    }
  }

  watchEffect(() => {
    if (banner.value?.endDate) {
      updateCountdown()
      intervalId = setInterval(updateCountdown, 1000)
    } else {
      cd.value = '00:00:00:00'
      clearCountdown()
    }
  })

  onUnmounted(() => {
    clearCountdown()
  })

  return {
    raffleBanner,
    cd,
    shouldShow,
    banner,
  }
}
