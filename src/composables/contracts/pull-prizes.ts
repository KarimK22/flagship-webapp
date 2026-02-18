import { computed, ref } from 'vue'
import api from '@/services/api'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { encodeImageUrl } from '../helpers'
import { useGetMe } from '../get-me'

const PAGE_SIZE = 9

type UsePullPrizesOptions = {
  initialDisplayCount?: number
  displayIncrement?: number
}

export const usePullPrizes = ({
  initialDisplayCount = 3,
  displayIncrement = 3,
}: UsePullPrizesOptions) => {
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
    queryKey: ['pullPrizes', accountAddress],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await api.getTradingGachaPullsHistory({
        limit: PAGE_SIZE,
        offset: pageParam,
      })

      const items = response.items.map((pull: any) => {
        const prize = pull.prize ?? {}
        const img = prize.image ?? prize.imageOnGacha ?? ''

        return {
          ...pull,
          imageUrl: encodeImageUrl(img),
        }
      })

      return {
        items,
        total: response.total,
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce(
        (sum, page) => sum + page.items.length,
        0,
      )
      return totalFetched < lastPage.total ? totalFetched : undefined
    },
    initialPageParam: 0,
    refetchOnWindowFocus: false,
    enabled: isAuthenticated,
  })

  const allPullPrizes = computed(() => {
    if (!data.value || !isAuthenticated.value || !accountAddress.value) return []
    return data.value.pages.flatMap((page) => page.items)
  })

  const pullPrizes = computed(() => {
    return allPullPrizes.value.slice(0, displayLimit.value)
  })

  const hasMore = computed(() => {
    const hasMoreInCurrentSet =
      displayLimit.value < allPullPrizes.value.length
    return hasMoreInCurrentSet || hasNextPage.value
  })

  const loadMore = async () => {
    const currentTotal = allPullPrizes.value.length
    const nextLimit = displayLimit.value + displayIncrement

    if (nextLimit >= currentTotal && hasNextPage.value) {
      await fetchNextPage()
    }

    displayLimit.value = nextLimit
  }

  return {
    pullPrizes,
    isLoading,
    loadingMore: isFetchingNextPage,
    hasMore,
    loadMore,
    refetch,
  }
}