import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import api from '@/services/api'
import { useRaffles } from '@/composables/raffles'
import { useGetMe } from '@/composables/get-me'

export const useRaffleReferralProgress = () => {
  const { sortedActiveRaffles } = useRaffles()
  const { isConnected } = useGetMe()

  const carRaffle = computed(() => {
    return sortedActiveRaffles.value.find(
      (r) => r.title.toLowerCase().includes('bitrefill'),
    ) ?? null
  })

  const { data: referralProgress, isLoading } = useQuery({
    queryKey: ['raffleReferralProgress', computed(() => carRaffle.value?.id)],
    queryFn: async () => {
      const response = await api.getRaffleReferralProgress({
        raffleId: carRaffle.value!.id,
      })
      return response.referralProgress
    },
    enabled: computed(() => !!carRaffle.value && isConnected.value),
    refetchOnWindowFocus: false,
  })

  return {
    carRaffle,
    referralProgress,
    isLoading,
  }
}
