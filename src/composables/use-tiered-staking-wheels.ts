import { computed, ref } from 'vue'
import { useMutation, useQuery } from '@tanstack/vue-query'
import api from '@/services/api'
import { useGetMe } from './get-me'
import { encodeImageUrl } from './helpers'

import type {
  TieredStakingWheel,
  TieredStakingWheelLockMultipliers,
  TieredStakingWheelSpin,
  TieredStakingWheelSpinsHistoryResponse,
  TieredStakingWheelsResponse,
} from '@/services/api'

export type TieredStakingWheelSpinWithImage = TieredStakingWheelSpin & {
  imageUrl: string
  raw?: unknown
}

export const useTieredStakingWheels = () => {
  const { accountAddress } = useGetMe()

  const { data: wheels, isLoading: isLoadingWheels } =
    useQuery<TieredStakingWheelsResponse>({
      queryKey: ['tieredStakingWheels', accountAddress],
      queryFn: () => api.getTieredStakingWheels(),
      initialData: {
        wheels: [],
        isAuthenticated: false,
        lockMultipliers: {} as TieredStakingWheelLockMultipliers,
      },
    })

  const currentWheel = computed<TieredStakingWheel | null>(() => {
    const eligible = wheels.value.wheels.filter(
      (w: TieredStakingWheel) => w.userEligibility?.eligible === true,
    )
    if (eligible.length > 0) {
      return eligible[eligible.length - 1]
    }
    return wheels.value.wheels[wheels.value.wheels.length - 1] ?? null
  })

  const lockMultipliers = computed(() => wheels.value.lockMultipliers)
  const isEligible = computed(
    () => currentWheel.value?.userEligibility?.eligible ?? false,
  )
  const remainingSpins = computed(
    () => currentWheel.value?.userEligibility?.remainingSpins ?? 0,
  )

  return {
    wheels,
    isLoadingWheels,
    currentWheel,
    lockMultipliers,
    isEligible,
    remainingSpins,
  }
}

export const useTieredStakingWheelSpin = () => {
  const { accountAddress } = useGetMe()
  const { currentWheel, isEligible, remainingSpins } = useTieredStakingWheels()

  const wheelId = computed(() => currentWheel.value?.id)

  const spinMutation = useMutation({
    mutationKey: ['tieredStakingWheelSpin', wheelId, accountAddress],
    mutationFn: async (): Promise<TieredStakingWheelSpinWithImage> => {
      if (!wheelId.value) {
        throw new Error('No wheelId available for tiered staking wheel spin')
      }

      const result = await api.spinTieredStakingWheel({
        wheelId: wheelId.value,
      })

      const img = result.prize.image

      return {
        ...result,
        imageUrl: encodeImageUrl(img),
        raw: result,
      }
    },
  })

  return {
    spinMutation,
    isLoadingSpin: spinMutation.isPending,
    isEligible,
    remainingSpins,
  }
}

export const useTieredStakingWheelSpinsHistory = () => {
  const { isAuthenticated } = useGetMe()

  const spins = ref<TieredStakingWheelSpinWithImage[]>([])
  const isLoadingHistory = ref(false)
  const loadingMore = ref(false)
  const hasMore = ref(false)

  const limit = 10
  const offset = ref(0)

  const mapHistoryItem = (
    item: TieredStakingWheelSpin,
  ): TieredStakingWheelSpinWithImage => {
    const img = item.prize.image
    return {
      ...item,
      imageUrl: encodeImageUrl(img),
      raw: item,
    }
  }

  const computeHasMore = (
    res: TieredStakingWheelSpinsHistoryResponse,
    receivedCount: number,
  ) => {
    if (typeof res.total === 'number' && res.total > 0) {
      return spins.value.length < res.total
    }

    return receivedCount === limit
  }

  const fetchHistory = async () => {
    if (!isAuthenticated.value) {
      spins.value = []
      hasMore.value = false
      return
    }

    isLoadingHistory.value = true
    try {
      offset.value = 0

      const res = await api.getTieredStakingWheelSpinsHistory({
        limit,
        offset: offset.value,
      })

      const mapped = (res.items ?? []).map(mapHistoryItem)
      spins.value = mapped
      hasMore.value = computeHasMore(res, mapped.length)
    } finally {
      isLoadingHistory.value = false
    }
  }

  const loadMore = async () => {
    if (!isAuthenticated.value) return
    if (!hasMore.value || loadingMore.value) return

    loadingMore.value = true
    try {
      offset.value += limit

      const res = await api.getTieredStakingWheelSpinsHistory({
        limit,
        offset: offset.value,
      })

      const mapped = (res.items ?? []).map(mapHistoryItem)

      const existing = new Set(spins.value.map(s => s.id))
      const filtered = mapped.filter(s => !existing.has(s.id))

      spins.value.push(...filtered)
      hasMore.value = computeHasMore(res, mapped.length)
    } finally {
      loadingMore.value = false
    }
  }

  return {
    spins,
    isLoadingHistory,
    loadingMore,
    hasMore,
    fetchHistory,
    loadMore,
  }
}
