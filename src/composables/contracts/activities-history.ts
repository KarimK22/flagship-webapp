import { computed, ref, type VNode } from 'vue'
import api from '@/services/api'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { ACTIVITY_TYPE } from '@/types/shared/activity'
import { ActivityHistory } from '@/types/activity-history'
import { useRaffles } from '../raffles'
import type { Activity } from '@/types/shared/activity'
import { GACHA_ASTEROID_PRIZE_TYPE } from '@/types/shared/gacha-game'
import type { GachaAsteroidPrize } from '@/types/shared/gacha-game'
import { useGetMe } from '../get-me'
import { useTranslation } from '../use-i18n'

export type ActivityItem = {
	title: string
	description: string | VNode
	referenceImageSrc?: string
  buttonLabel?: string
  buttonAnimated?: boolean
  actionButton?: boolean
  secondaryDescription?: string
}

type UseActivitiesHistoryOptions = {
	types: ACTIVITY_TYPE[]
	initialDisplayCount?: number
	displayIncrement?: number
}

type ActivityResponse = {
	items: Activity[]
	meta: { nextPageToken: string | null }
}

const PAGE_SIZE = 20

const isElementPrize = (prize: GachaAsteroidPrize): prize is { type: GACHA_ASTEROID_PRIZE_TYPE.ELEMENT, elementId: number, raffleId: string | null } => {
  return prize.type === GACHA_ASTEROID_PRIZE_TYPE.ELEMENT
}

/*
 * This composable is used to fetch the activities history of the user
 * It fetches the data from the api and returns the data and the refetch function
 *
 * @param types - The types of activities to fetch
 * @returns The data and the refetch function
 * @example
 * const { activities, refetch, isLoading } = useActivitiesHistory({
 *  types: [ACTIVITY_TYPE.PURCHASE_RAFFLE_TICKET, ACTIVITY_TYPE.WIN_RAFFLE_PRIZE],
 *  initialDisplayCount: 3,
 *  displayIncrement: 3
 * })
 *
 * Note: Page size is fixed to 20, min is 20
 */
export const useActivitiesHistory = ({
  types,
  initialDisplayCount = 3,
  displayIncrement = 3,
}: UseActivitiesHistoryOptions) => {
  // Set up translations for ActivityHistory
  const { t } = useTranslation()

  const { raffles, fetchedRaffles } = useRaffles()
  const displayLimit = ref(initialDisplayCount)

  const { accountAddress, isConnected } = useGetMe()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } = useInfiniteQuery({
    queryKey: ['activitiesHistory', accountAddress.value, types],
    queryFn: async ({ pageParam = undefined }) => {
      return await api.getUserActivities({
        pageSize: PAGE_SIZE,
        types,
        pageToken: pageParam,
      })
    },
    getNextPageParam: (lastPage: ActivityResponse) => lastPage.meta.nextPageToken || undefined,
    initialPageParam: undefined as string | undefined,
    enabled: computed(() => isConnected.value && fetchedRaffles.value),
    refetchOnWindowFocus: false,
  })

  const getRaffle = (raffleId: string) => {
    return raffles.value?.find((r) => r.id === raffleId)
  }

  const processActivity = (activity: Activity): ActivityHistory => {
    const processedActivity = new ActivityHistory(activity, t)
    switch (activity.type) {
    case ACTIVITY_TYPE.PURCHASE_RAFFLE_TICKET:
    case ACTIVITY_TYPE.WIN_RAFFLE_PRIZE: {
      processedActivity.relatedRaffle = getRaffle(activity.metadata.raffleId)
      break
    }
    case ACTIVITY_TYPE.SMASH_ASTEROID: {
      const prize = activity.metadata.prize
      if (isElementPrize(prize) && prize.raffleId) {
        processedActivity.relatedRaffle = getRaffle(prize.raffleId)
      }
      break
    }
    }

    return processedActivity
  }

  const allActivities = computed(() => {
    if (!data.value) return []

    return data.value.pages.flatMap((page: ActivityResponse) =>
      page.items.map(processActivity),
    ).sort((a, b) => {
      return b.activity.timestamp.getTime() - a.activity.timestamp.getTime()
    })
  })

  const activities = computed(() => {
    return allActivities.value.slice(0, displayLimit.value)
  })

  const hasMore = computed(() => {
    const hasMoreInCurrentSet = displayLimit.value < allActivities.value.length
    return hasMoreInCurrentSet || hasNextPage.value
  })

  const loadMore = async () => {
    const currentTotal = allActivities.value.length
    const nextLimit = displayLimit.value + displayIncrement

    // If we need more data from the API
    if (nextLimit >= currentTotal && hasNextPage.value) {
      await fetchNextPage()
    }

    displayLimit.value = nextLimit
  }

  return {
    activities,
    isLoading,
    loadingMore: isFetchingNextPage,
    hasMore,
    loadMore,
    refetch,
  }
}
