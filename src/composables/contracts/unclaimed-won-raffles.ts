import { computed, ref } from 'vue'
import api, { RAFFLE_PRIZE_TYPE } from '@/services/api'
import { useInfiniteQuery, useQuery } from '@tanstack/vue-query'
import { encodeImageUrl } from '../helpers'
import { useGetMe } from '../get-me'

const PAGE_SIZE = 9

type UseUnclaimedRafflesOptions = {
  initialDisplayCount?: number
  displayIncrement?: number
}

/*
 * This composable is used to fetch the unclaimed raffles of the user
 * It fetches the data from the api and returns the data and the refetch function
 *
 * @param types - The types of raffles to fetch
 * @returns The data and the refetch function
 * @example
 * const { unclaimedRaffles, refetch, isLoading } = useUnclaimedRaffles({
 *  initialDisplayCount: 3,
 *  displayIncrement: 3
 * })
 *
 * Note: Page size is fixed to 20, min is 20
 */
export const useWonUnclaimedRaffles = ({
  initialDisplayCount = 3,
  displayIncrement = 3,
}: UseUnclaimedRafflesOptions) => {
  const displayLimit = ref(initialDisplayCount)
  const { isAuthenticated, accountAddress } = useGetMe()
  const {
    data: myRafflesStatus,
    refetch: refetchMyRafflesStatus,
    isLoading: loadingMyRafflesStatus,
  } = useQuery({
    queryKey: ['myRafflesStatus', accountAddress],
    queryFn: async () => {
      return (await api.getUserStatusForRaffles()).me
    },
    initialData: {},
    enabled: computed(() => !!accountAddress.value),
    refetchOnWindowFocus: false,
  })

  const {
    data,
    refetch,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['unclaimedRaffles', accountAddress],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await api.getUnclaimedRaffles({
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
    enabled: isAuthenticated && !loadingMyRafflesStatus.value,
  })

  const allUnclaimedRaffles = computed(() => {
    if (!data.value || !isAuthenticated.value || !accountAddress.value || !myRafflesStatus.value) return []
    const flatMap = data.value.pages.flatMap((page) => page.items)
    const statuses = flatMap.map((raffle) => myRafflesStatus.value[raffle.id])

    return flatMap.map((raffle, index) => ({
      ...raffle,
      ...statuses[index],
      showNotification: statuses[index]?.prizeSubmittedData === null && statuses[index]?.wonPrizeV2 && statuses[index]?.wonPrizeV2.type !== RAFFLE_PRIZE_TYPE.NONE,
    }))
  })

  const unclaimedRaffles = computed(() => {
    return allUnclaimedRaffles.value.slice(0, displayLimit.value)
  })

  const hasMore = computed(() => {
    const hasMoreInCurrentSet =
      displayLimit.value < allUnclaimedRaffles.value.length
    return hasMoreInCurrentSet || hasNextPage.value
  })

  const loadMore = async () => {
    const currentTotal = allUnclaimedRaffles.value.length
    const nextLimit = displayLimit.value + displayIncrement

    // If we need more data from the API
    if (nextLimit >= currentTotal && hasNextPage.value) {
      await fetchNextPage()
    }

    displayLimit.value = nextLimit
  }

  return {
    unclaimedRaffles,
    isLoading: loadingMyRafflesStatus || isLoading,
    loadingMore: isFetchingNextPage,
    hasMore,
    loadMore,
    refetch: () => {
      refetch()
      refetchMyRafflesStatus()
    },
  }
}
