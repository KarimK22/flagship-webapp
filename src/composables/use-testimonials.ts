import { useQuery } from '@tanstack/vue-query'
import api from '@/services/api'

export const useTestimonials = () => {
  const { data: testimonials, isSuccess } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => api.getTestimonials().then((res) => res.testimonials),
    select(data) {
      return data.sort(
        (a, b) =>
          new Date(b.postedOn).getTime() - new Date(a.postedOn).getTime(),
      )
    },
    enabled: true,
    initialData: [],
  })

  return {
    testimonials,
    isSuccess,
  }
}
