import { computed, ref } from 'vue'
import { useMutation, useQuery } from '@tanstack/vue-query'
import api from '@/services/api'
import { useGetMe } from './get-me'
import { encodeImageUrl } from './helpers'

export interface TradingGachaPrize {
  id: string
  gachaId: string
  name: string
  description?: string
  image?: string
  imageOnGacha?: string
  order?: number
  type?: 'Lingo' | 'Physical'
  lingoAmount?: number | null
}

export interface TieredWheelEligibility {
  isEligible: boolean
  userPullsCount: number
  pullsCountRequired: number
}

export interface TradingGacha {
  id: string
  title: string
  tradeVolumeEligibility: number
  pullsCountEligibility: number
  startDate: string | null
  endDate: string | null
  prizes: TradingGachaPrize[]
  isLocked: boolean
  tieredWheelEligibility: TieredWheelEligibility
}

export interface TradingGachaPullWithImage {
  id: string
  timestamp: string
  prize: TradingGachaPrize
  voucherCode?: string | null
  imageUrl: string
  raw?: any
}

export interface PTPrize {
  id: string
  name: string
  baseProbability: number
  boostedProbability: number
}

export interface PTTier {
  tier: string
  prizes: PTPrize[]
  ptScore: number
  ptScoreThreshold: number
  PtRelativeProbIncrease: number
}

export interface PTScoresResponse {
  gachaId: string
  userId: string
  tiers: PTTier[]
}

export const useTradingGacha = () => {
  const { isAuthenticated } = useGetMe()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['tradingGachas'],
    queryFn: () => api.getTradingGachas(),
    initialData: { gachas: [] as TradingGacha[] },
    enabled: () => Boolean(isAuthenticated.value),
  })

  const allGachas = computed<TradingGacha[]>(() => {
    return (data.value?.gachas ?? []).slice().sort(
      (a, b) => a.pullsCountEligibility - b.pullsCountEligibility,
    )
  })

  const currentTierIndex = computed(() => {
    if (!allGachas.value.length) return 0

    let idx = 0

    for (let i = 0; i < allGachas.value.length; i++) {
      const g = allGachas.value[i]
      if (g.tieredWheelEligibility.userPullsCount >= g.pullsCountEligibility) {
        idx = i
      }
    }

    return idx
  })

  const currentGacha = computed(() => {
    return allGachas.value[currentTierIndex.value] ?? null
  })

  const nextGacha = computed(() => {
    return allGachas.value[currentTierIndex.value + 1] ?? null
  })

  return {
    allGachas,
    currentGacha,
    nextGacha,
    currentTierIndex,
    isLoading,
    refetchTradingGachas: refetch,
  }
}

// ---------- LEADERBOARD ----------

export const useLeaderboards = () => {
  const { isAuthenticated } = useGetMe()

  const {
    data: leaderboardsResponse,
    isLoading: isLoadingLeaderboards,
  } = useQuery({
    queryKey: ['leaderboards'],
    queryFn: () => api.getLeaderboards(),
    initialData: { leaderboards: [] },
    enabled: () => Boolean(isAuthenticated.value),
  })

  const now = computed(() => Date.now())

  const leaderboards = computed(() => {
    return leaderboardsResponse.value?.leaderboards ?? []
  })
  const currentLeaderboard = computed(() => {
    return leaderboards.value.find(l => {
      const start = new Date(l.startDate).getTime()
      const end = new Date(l.endDate).getTime()
      return now.value >= start && now.value <= end
    }) ?? null
  })

  const leaderboardId = computed(() => currentLeaderboard.value?.id ?? null)

  return {
    leaderboardsResponse,
    currentLeaderboard,
    leaderboardId,
    isLoadingLeaderboards,
  }
}
export const useUserLeaderboardPrizes = () => {
  const { isAuthenticated } = useGetMe()

  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: ['leaderboard-user-prizes'],
    queryFn: () => api.getUserLeaderboardPrizes(),
    enabled: () => Boolean(isAuthenticated.value),
    initialData: { items: [] },
  })

  return {
    prizes: computed(() => data.value.items),
    isLoading,
  }
}

export const useTradingGachaPulls = () => {
  const { isAuthenticated, accountAddress } = useGetMe()

  const { currentGacha, nextGacha } = useTradingGacha()

  const gachaId = computed(() => currentGacha.value?.id)

  // ---------- PULL MUTATION (ONE-OFF) ----------
  const pullMutation = useMutation({
    mutationKey: ['tradingGachaPull', gachaId, accountAddress],
    mutationFn: async (): Promise<TradingGachaPullWithImage> => {
      if (!gachaId.value) {
        throw new Error('No gachaId available for trading gacha pull')
      }

      const result: any = await api.executeTradingGachaPull({
        gachaId: gachaId.value,
      })

      const prize: TradingGachaPrize = result.prize ?? ({} as TradingGachaPrize)
      const img = prize.imageOnGacha ?? prize.image ?? result.image ?? ''

      const normalized: TradingGachaPullWithImage = {
        id: result.id ?? crypto.randomUUID(),
        timestamp: result.timestamp ?? new Date().toISOString(),
        prize,
        voucherCode: result.voucherCode ?? null,
        imageUrl: encodeImageUrl(img),
        raw: result,
      }

      return normalized
    },
  })

  // ---------- PULL COUNT ----------
  const {
    data: pullCount,
    isLoading: isLoadingPullCount,
    refetch: refetchPullCount,
  } = useQuery({
    queryKey: ['tradingGachaPullCount', gachaId, accountAddress],
    queryFn: () =>
      api.getTradingGachaPullCount({
        gachaId: gachaId.value as string,
      }),
    enabled: () => Boolean(gachaId.value && isAuthenticated.value),
  })

  // ---------- ELIGIBILITY ----------
  const {
    data: eligibility,
    isLoading: isLoadingEligibility,
    refetch: refetchEligibility,
  } = useQuery({
    queryKey: ['tradingGachaEligibility', gachaId, accountAddress],
    queryFn: () =>
      api.getTradingGachaEligibility({
        gachaId: gachaId.value as string,
      }),
    enabled: () => Boolean(gachaId.value && isAuthenticated.value),
  })

  const isEligible = computed(() => Boolean(eligibility.value?.eligible))

  // ---------- HISTORY ----------
  const pulls = ref<TradingGachaPullWithImage[]>([])
  const isLoadingHistory = ref(false)
  const loadingMore = ref(false)
  const hasMore = ref(true)

  const limit = 10
  const offset = ref(0)

  const mapHistoryItem = (item: any): TradingGachaPullWithImage => {
    const prize: TradingGachaPrize = item.prize ?? ({} as TradingGachaPrize)
    const img = prize.image ?? item.image ?? ''

    return {
      id: item.id,
      timestamp: item.timestamp ?? new Date().toISOString(),
      prize,
      voucherCode: item.voucherCode ?? null,
      imageUrl: encodeImageUrl(img),
      raw: item,
    }
  }

  const fetchHistory = async () => {
    if (!isAuthenticated.value) return

    isLoadingHistory.value = true
    try {
      const res = await api.getTradingGachaPullsHistory({
        limit,
        offset: offset.value,
      })

      const items = (res.items ?? []).map(mapHistoryItem)
      pulls.value = items
      const total = res.total ?? items.length
      hasMore.value = pulls.value.length < total
    } finally {
      isLoadingHistory.value = false
    }
  }

  const loadMore = async () => {
    if (!hasMore.value || loadingMore.value || !isAuthenticated.value) return

    loadingMore.value = true
    try {
      offset.value += limit
      const res = await api.getTradingGachaPullsHistory({
        limit,
        offset: offset.value,
      })
      const items = (res.items ?? []).map(mapHistoryItem)
      pulls.value.push(...items)
      const total = res.total ?? pulls.value.length
      hasMore.value = pulls.value.length < total
    } finally {
      loadingMore.value = false
    }
  }

  const refetchHistory = async () => {
    offset.value = 0
    await fetchHistory()
  }

  const pullsCountNumber = computed(() => pullCount.value?.count ?? 0)
  const totalTradedVolume = computed(() => pullCount.value?.totalTradedVolume ?? 0)
  const isLoadingPullCountCombined = computed(
    () => isLoadingPullCount.value || isLoadingEligibility.value,
  )

  const progressToNextTier = computed(() => {
    if (!currentGacha.value || !nextGacha.value) return 1

    const current = currentGacha.value.tieredWheelEligibility.userPullsCount
    const required = nextGacha.value.pullsCountEligibility

    return Math.min(current / required, 1)
  })

  const pullsUntilNextTier = computed(() => {
    if (!currentGacha.value || !nextGacha.value) return 0

    const current = currentGacha.value.tieredWheelEligibility.userPullsCount
    const required = nextGacha.value.pullsCountEligibility

    return Math.max(required - current, 0)
  })

  const { leaderboardId } = useLeaderboards()

  const {
    data: topTraders,
    isLoading: isLoadingTopTraders,
    refetch: refetchTopTraders,
  } = useQuery({
    queryKey: ['topTraders', leaderboardId],
    queryFn: () =>
      api.getTopTraders({
        leaderboardId: leaderboardId.value as string,
        limit: 10,
        offset: 0,
      }),
    initialData: { items: [], total: 0 },
    enabled: () => Boolean(leaderboardId.value && isAuthenticated.value),
  })

  return {
    currentGacha,
    pullMutation,
    isLoadingPull: pullMutation.isPending,
    pullCount,
    pullsCountNumber,
    totalTradedVolume,
    isLoadingPullCount: isLoadingPullCountCombined,
    isEligible,
    refetchPullCount,
    refetchEligibility,
    pulls,
    progressToNextTier,
    pullsUntilNextTier,
    isLoadingHistory,
    loadingMore,
    hasMore,
    fetchHistory,
    loadMore,
    refetchHistory,
    leaderboardId,
    topTraders,
    isLoadingTopTraders,
    refetchTopTraders,
  }
}

// ---------- PT SCORES ----------

export const usePTScores = () => {
  const { isAuthenticated, accountAddress } = useGetMe()
  const { currentGacha } = useTradingGacha()

  const gachaId = computed(() => currentGacha.value?.id)

  const {
    data: ptScores,
    isLoading,
    refetch: refetchPTScores,
  } = useQuery<PTScoresResponse>({
    queryKey: ['ptScores', gachaId, accountAddress],
    queryFn: async () => {
      if (!gachaId.value) {
        throw new Error('No gachaId available')
      }

      const response = await api.getPTScores({
        gachaId: gachaId.value,
      })

      return response
    },
    enabled: () => Boolean(gachaId.value && isAuthenticated.value),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 30000, // Cache for 30 seconds
  })

  return {
    ptScores,
    isLoading,
    refetchPTScores,
  }
}