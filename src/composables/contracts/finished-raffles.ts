import { computed, ref } from 'vue'
import api from '@/services/api'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { encodeImageUrl } from '../helpers'

const PAGE_SIZE = 9

type UseFinishedRafflesOptions = {
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
 * const { finishedRaffles, refetch, isLoading } = useFinishedRaffles({
 *  initialDisplayCount: 3,
 *  displayIncrement: 3
 * })
 *
 * Note: Page size is fixed to 20, min is 20
 */
export const useFinishedRaffles = ({
  initialDisplayCount = 3,
  displayIncrement = 3,
}: UseFinishedRafflesOptions) => {
  const displayLimit = ref(initialDisplayCount)

  const {
    data,
    refetch,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['finishedRaffles'],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await api.getFinishedRaffles({
        limit: PAGE_SIZE,
        offset: pageParam,
      })
      return {
        items: response.items.map((raffle) => ({
          ...raffle,
          imageUrl: encodeImageUrl(raffle.imageUrl),
          prizes: raffle.prizes.map((prize) => ({
            ...prize,
            imageUrl: encodeImageUrl(prize.imageUrl),
          })),
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
  })

  const allFinishedRaffles = computed(() => {
    if (!data.value) return []

    return data.value.pages.flatMap((page) => page.items)
  })

  const finishedRaffles = computed(() => {
    return allFinishedRaffles.value.slice(0, displayLimit.value)
  })

  const hasMore = computed(() => {
    const hasMoreInCurrentSet =
      displayLimit.value < allFinishedRaffles.value.length
    return hasMoreInCurrentSet || hasNextPage.value
  })

  const loadMore = async () => {
    const currentTotal = allFinishedRaffles.value.length
    const nextLimit = displayLimit.value + displayIncrement

    // If we need more data from the API
    if (nextLimit >= currentTotal && hasNextPage.value) {
      await fetchNextPage()
    }

    displayLimit.value = nextLimit
  }

  return {
    finishedRaffles,
    isLoading,
    loadingMore: isFetchingNextPage,
    hasMore,
    loadMore,
    refetch,
  }
}
