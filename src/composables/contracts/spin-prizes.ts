import { computed, ref } from 'vue'
import api from '@/services/api'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { encodeImageUrl } from '../helpers'
import { useGetMe } from '../get-me'

const PAGE_SIZE = 9

type UseSpinPrizesOptions = {
  initialDisplayCount?: number
  displayIncrement?: number
}

/*
 * This composable is used to fetch the activities history of the user
 * It fetches the data from the api and returns the data and the refetch function
 *
 * @param types - The types of activities to fetch
 * @returns The data and the refetch function
 * @example
 * const { spinPrizes, refetch, isLoading } = useSpinPrizes({
 *  initialDisplayCount: 3,
 *  displayIncrement: 3,
 *  wheelId: '123'
 * })
 *
 * Note: Page size is fixed to 20, min is 20
 */
export const useSpinPrizes = ({
  initialDisplayCount = 3,
  displayIncrement = 3,
}: UseSpinPrizesOptions) => {
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
    queryKey: ['spinPrizes', accountAddress],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await api.getWheelSpinsHistory({
        limit: PAGE_SIZE,
        offset: pageParam,
      })
      return {
        items: response.items.map((spin) => ({
          ...spin,
          imageUrl: encodeImageUrl(spin.prize.image),
        })),
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

  const allSpinPrizes = computed(() => {
    if (!data.value || !isAuthenticated.value || !accountAddress.value) return []

    return data.value.pages.flatMap((page) => page.items)
  })

  const spinPrizes = computed(() => {
    return allSpinPrizes.value.slice(0, displayLimit.value)
  })

  const hasMore = computed(() => {
    const hasMoreInCurrentSet =
      displayLimit.value < allSpinPrizes.value.length
    return hasMoreInCurrentSet || hasNextPage.value
  })

  const loadMore = async () => {
    const currentTotal = allSpinPrizes.value.length
    const nextLimit = displayLimit.value + displayIncrement

    // If we need more data from the API
    if (nextLimit >= currentTotal && hasNextPage.value) {
      await fetchNextPage()
    }

    displayLimit.value = nextLimit
  }

  return {
    spinPrizes,
    isLoading,
    loadingMore: isFetchingNextPage,
    hasMore,
    loadMore,
    refetch,
  }
}
