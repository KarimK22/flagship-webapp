import { useQuery } from '@tanstack/vue-query'
import api from '@/services/api.ts'

export const useEventClaimers = (eventId: string) => {
  const { data: eventClaimers, refetch: refetchEventClaimers, isLoading: loadingEventClaimers } = useQuery({
    queryKey: ['eventClaimers', eventId],
    queryFn: async () => {
      const response = await api.getExclusiveClaimedEventClaimers({ eventId })
      return response.claimers.map(claim => claim.walletAddress)
    },
    initialData: [],
    refetchOnWindowFocus: false,
  })

  return {
    eventClaimers,
    refetchEventClaimers,
    loadingEventClaimers,
  }
}