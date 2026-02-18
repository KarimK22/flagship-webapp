import { useQuery } from '@tanstack/vue-query'
import api from '@/services/api'

import { useGetMe } from './get-me'

export const useElements = () => {
  const { isConnected, accountAddress } = useGetMe()
  const { data: elements, isLoading: isLoadingElements, refetch: refetchElements } = useQuery({
    queryKey: ['gacha-elements', accountAddress.value],
    queryFn: async () => (await api.getMyGachaElementsV2()).elements,
    enabled: isConnected,
  })

  return {
    elements,
    isLoadingElements,
    refetchElements,
  }
}