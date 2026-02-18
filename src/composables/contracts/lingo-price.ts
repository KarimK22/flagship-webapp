import { useQuery } from '@tanstack/vue-query'
import api from '@/services/api.ts'
import { computed } from 'vue'

export const useLingoPrice = () => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ['lingoPrice'],
    queryFn: async () => {
      return await api.getLingoPrice()
    },
    initialData: {
      price: 0,
      changePercentage24h: 0,
    },
    refetchOnWindowFocus: false,
  })
  return {
    price: computed(() => data.value.price),
    changePercentage24h: computed(() => data.value.changePercentage24h),
    refetchLingoPrice: refetch,
    loadingLingoPrice: isLoading,
  }
}
