import { computed, ref } from 'vue'
import api from '@/services/api'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { encodeImageUrl } from '@/composables/helpers'
import { useGetMe } from '@/composables/get-me'
import type { StakingWheelSpin } from '../use-staking-wheels'

const PAGE_SIZE = 9

type UseStakingWheelSpinsOptions = {
  initialDisplayCount?: number
  displayIncrement?: number
}

type HistoryResponse = {
  total: string | number
  items: StakingWheelSpin[]
}

export const useStakingWheelSpins = ({
  initialDisplayCount = 3,
  displayIncrement = 3,
}: UseStakingWheelSpinsOptions) => {
  const displayLimit = ref(initialDisplayCount)
  const { isAuthenticated, accountAddress } = useGetMe()

  const {
    data,
    refetch,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['stakingWheelSpinsHistory', accountAddress],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await api.getStakingWheelSpinsHistory({
        limit: PAGE_SIZE,
        offset: pageParam,
      }) as HistoryResponse

      const total = Number(response.total ?? 0)

      const items = (response.items ?? []).map((spin) => {
        const prize = spin.prize ?? {}
        const img = prize.image ?? prize.imageOnWheel ?? ''
        return {
          ...spin,
          imageUrl: encodeImageUrl(img),
        }
      })

      return { items, total }
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((sum, page) => sum + page.items.length, 0)
      return totalFetched < lastPage.total ? totalFetched : undefined
    },
    initialPageParam: 0,
    refetchOnWindowFocus: false,
    enabled: isAuthenticated,
  })

  const allSpins = computed(() => {
    if (!data.value || !isAuthenticated.value || !accountAddress.value) return []
    return data.value.pages.flatMap((page) => page.items)
  })

  const spins = computed(() => allSpins.value.slice(0, displayLimit.value))

  const hasMore = computed(() => {
    const hasMoreInCurrentSet = displayLimit.value < allSpins.value.length
    return hasMoreInCurrentSet || !!hasNextPage.value
  })

  const loadMore = async () => {
    const currentTotal = allSpins.value.length
    const nextLimit = displayLimit.value + displayIncrement

    if (nextLimit >= currentTotal && hasNextPage.value) {
      await fetchNextPage()
    }
    displayLimit.value = nextLimit
  }

  const resetDisplay = () => {
    displayLimit.value = initialDisplayCount
  }

  return {
    spins,
    isLoading,
    loadingMore: isFetchingNextPage,
    hasMore,
    loadMore,
    refetch,
    resetDisplay,
  }
}