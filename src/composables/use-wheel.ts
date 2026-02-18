import api from '@/services/api'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useGetMe } from './get-me'
import { encodeImageUrl } from './helpers'

export const useWheel = () => {
  const { accountAddress } = useGetMe()
  const { data: wheels, isLoading: isLoadingWheels } = useQuery({
    queryKey: ['wheels', accountAddress],
    initialData: { wheels: [] },
    queryFn: () => api.getWheels(),
  })

  const currentWheel = computed(() => {
    return wheels.value.wheels[0]
  })

  return { wheels, isLoadingWheels, currentWheel }
}

export const useWheelSpin = () => {
  const { currentWheel } = useWheel()
  const wheelId = computed(() => {
    return currentWheel.value?.id
  })

  const { isAuthenticated, accountAddress } = useGetMe()
  const wheelSpin = useMutation({
    mutationKey: ['wheelSpin', wheelId, accountAddress],
    mutationFn: async () => {
      const result = await api.wheelSpin({ wheelId: wheelId.value })
      return {
        ...result,
        imageUrl: encodeImageUrl(result.prize.image),
      }
    },
  })

  const {
    data: wheelSpinCount,
    isLoading: isLoadingWheelSpinCount,
    refetch: refetchWheelSpinCount,
  } = useQuery({
    queryKey: ['wheelSpinCount', wheelId, accountAddress],
    queryFn: () => api.getWheelSpinCount({ wheelId: wheelId.value }),
    enabled: () => Boolean(wheelId.value && isAuthenticated.value),
  })

  const {
    data: wheelEligibility,
    isLoading: isLoadingWheelEligibility,
  } = useQuery({
    queryKey: ['wheelEligibility', wheelId, accountAddress],
    queryFn: () => api.getWheelEligibility({ wheelId: wheelId.value }),
    enabled: () => Boolean(wheelId.value && isAuthenticated.value),
  })

  const isEligible = computed(() => {
    return wheelEligibility.value?.eligible
  })

  return {
    wheelSpin,
    isLoadingWheelSpin: wheelSpin.isPending,
    wheelSpinCount,
    isLoadingWheelSpinCount:
      isLoadingWheelSpinCount || isLoadingWheelEligibility,
    refetchWheelSpinCount,
    isEligible,
  }
}
