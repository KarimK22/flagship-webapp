import { useQuery } from '@tanstack/vue-query'

import api from '@/services/api'

export const useRecentClaims = () => {
  const {
    data: recentClaims,
    isLoading,
    refetch: fetchRecentClaims,
  } = useQuery({
    queryKey: ['recentClaims'],
    queryFn: async () => (await api.getRecentClaims()).recentClaims,
  })

  return {
    recentClaims,
    isLoading,
    fetchRecentClaims,
  }
}
