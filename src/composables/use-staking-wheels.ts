import { computed, ref } from 'vue'
import { useMutation, useQuery } from '@tanstack/vue-query'
import api from '@/services/api'
import { useGetMe } from './get-me'
import { encodeImageUrl } from './helpers'

export interface StakingWheelPrize {
  id: string
  wheelId: string
  name: string
  description: string
  image: string
  imageOnWheel: string
  probability: number
  order: number
  type: string
  lingoAmount: number | null
  powerAmount: number | null
  voucherAmount: number | null
}

export interface StakingWheelUserEligibility {
  eligible: boolean
  remainingSpins: number
  spinsUsed: string
  totalEligibleSpins: number
}

export interface StakingWheel {
  id: string
  title: string
  startDate: string
  endDate: string
  lockDuration: string
  lockAmountEligibility: number
  maxSpins: number
  isStakingWheel: boolean
  prizes: StakingWheelPrize[]
  userEligibility?: StakingWheelUserEligibility | null
}

export interface StakingWheelsResponse {
  wheels: StakingWheel[]
  isAuthenticated: boolean
}

export interface StakingWheelEligibilityResponse {
  eligible: boolean
  remainingSpins: number
}

export interface StakingWheelSpin {
  id: string
  userId: string
  prize: StakingWheelPrize
  timestamp: string
  voucherCode: string | null
  stakeHash: string | null
  txHash: string | null
}

export interface StakingWheelSpinWithImage {
  id: string
  userId: string
  prize: StakingWheelPrize
  timestamp: string
  voucherCode: string | null
  stakeHash: string | null
  txHash: string | null
  imageUrl: string
  raw?: unknown
}

export interface StakingWheelSpinsHistoryResponse {
  total: number
  items: StakingWheelSpin[]
}

export const useStakingWheels = () => {
  const { accountAddress } = useGetMe()

  const { data: wheels, isLoading: isLoadingWheels } =
    useQuery<StakingWheelsResponse>({
      queryKey: ['stakingWheels', accountAddress],
      queryFn: () => api.getStakingWheels(),
      initialData: { wheels: [], isAuthenticated: false },
    })

  const currentWheel = computed<StakingWheel | null>(() => {
    return (
      wheels.value.wheels.find(
        w => w.userEligibility?.eligible === true,
      ) ?? null
    )
  })

  return {
    wheels,
    isLoadingWheels,
    currentWheel,
  }
}

export const useStakingWheelSpin = () => {
  const { isAuthenticated, accountAddress } = useGetMe()
  const { currentWheel } = useStakingWheels()

  const wheelId = computed(() => currentWheel.value?.id)

  const spinMutation = useMutation({
    mutationKey: ['stakingWheelSpin', wheelId, accountAddress],
    mutationFn: async (): Promise<StakingWheelSpinWithImage> => {
      if (!wheelId.value) {
        throw new Error('No wheelId available for staking wheel spin')
      }

      const result = await api.spinStakingWheel({
        wheelId: wheelId.value,
      })

      const img =
        result.prize.image ||
        result.prize.imageOnWheel

      return {
        ...result,
        imageUrl: encodeImageUrl(img),
        raw: result,
      }
    },
  })

  const {
    data: eligibility,
    isLoading: isLoadingEligibility,
    refetch: refetchEligibility,
  } = useQuery<StakingWheelEligibilityResponse>({
    queryKey: ['stakingWheelEligibility', wheelId, accountAddress],
    queryFn: () => {
      if (!wheelId.value) {
        throw new Error('No wheelId available for eligibility check')
      }
      return api.getStakingWheelEligibility({ wheelId: wheelId.value })
    },
    enabled: () => Boolean(wheelId.value && isAuthenticated.value),
  })

  const isEligible = computed(() => eligibility.value?.eligible ?? false)
  const remainingSpins = computed(() => eligibility.value?.remainingSpins ?? 0)

  return {
    spinMutation,
    isLoadingSpin: spinMutation.isPending,
    eligibility,
    isLoadingEligibility,
    refetchEligibility,
    isEligible,
    remainingSpins,
  }
}

export const useStakingWheelSpinsHistory = () => {
  const { isAuthenticated } = useGetMe()

  const spins = ref<StakingWheelSpinWithImage[]>([])
  const isLoadingHistory = ref(false)
  const loadingMore = ref(false)
  const hasMore = ref(false)

  const limit = 10
  const offset = ref(0)

  const mapHistoryItem = (item: StakingWheelSpin): StakingWheelSpinWithImage => {
    const img = item.prize.image || item.prize.imageOnWheel
    return {
      ...item,
      imageUrl: encodeImageUrl(img),
      raw: item,
    }
  }

  const computeHasMore = (res: StakingWheelSpinsHistoryResponse, receivedCount: number) => {
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

      const res = await api.getStakingWheelSpinsHistory({
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

      const res = await api.getStakingWheelSpinsHistory({
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