import api, { RAFFLE_PRIZE_TYPE, RAFFLE_TAG, type RaffleStatus } from '@/services/api.ts'
import type { Raffle } from '@/services/api.ts'
import { useQuery } from '@tanstack/vue-query'
import { useStakes } from '@/composables/contracts/stakes.ts'
import { computed, ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { encodeImageUrl } from '@/composables/helpers'
import mixpanel from 'mixpanel-browser'
import { useGetMe } from './get-me'

export const prefilledRaffle = useLocalStorage<Record<string, string>>('prefilledRaffle', { raffleCode: '', raffleId: '' })
export const unclaimedRaffleStatusCopy = ref<UnclaimedRaffleStatus & { showNotification: boolean } | null>(null)

export type UnclaimedRaffleStatus = RaffleStatus & {
  id: string
}

export const useRaffles = () => {
  const { isConnected, accountAddress } = useGetMe()
  const { data: raffles, refetch: refetchRaffles, isLoading: loadingRaffles, isFetched: fetchedRaffles } = useQuery({
    queryKey: ['raffles'],
    queryFn: async () => {
      const response = await api.getRaffles()
      // Process the raffles to encode imageUrl
      return response.raffles.map((raffle) => ({
        ...raffle,
        imageUrl: encodeImageUrl(raffle.imageUrl),
        prizes: raffle.prizes.map((prize) => ({
          ...prize,
          imageUrl: encodeImageUrl(prize.imageUrl),
        })),
      }))
    },
    refetchOnWindowFocus: false,
  })

  const { data: myRafflesStatus, refetch: refetchMyRafflesStatus, isLoading: loadingMyRafflesStatus } = useQuery({
    queryKey: ['myRafflesStatus', accountAddress],
    queryFn: async () => {
      return (await api.getUserStatusForRaffles()).me
    },
    initialData: {},
    enabled: computed(() => !!accountAddress.value),
    refetchOnWindowFocus: false,
  })

  const unclaimedRaffleStatus = computed(() => {
    const entries = Object.entries(myRafflesStatus.value)
    const foundEntry = entries.find(([_, raffle]) => raffle.prizeSubmittedData === null && raffle.wonPrizeV2 && raffle.wonPrizeV2.type !== RAFFLE_PRIZE_TYPE.NONE)
    return foundEntry ? { id: foundEntry[0], ...foundEntry[1], showNotification: true } : null
  })

  const { refetchMyStakes } = useStakes()
  async function buyRaffles(raffleId: string, count: number, userData: Record<string, string>) {
    try {
      const buyResponse = await api.buyRaffleTickets({ raffleId, count, userData })
      await refetchMyStakes()
      return buyResponse
    } catch (error) {
      console.error(error)
      throw new Error('Failed to pick voucher')
    }
  }

  async function submitRafflePrizeData(raffleId: string, email?: string) {
    try {
      await api.submitRafflePrizeData({ raffleId, email })
      mixpanel.track('Reward Claimed')
      await refetchMyRafflesStatus()
    } catch (error) {
      console.error(error)
      throw new Error('Failed to submit raffle prize data '+ error)
    }
  }

  const now = new Date()

  const isActive = (raffle: Raffle) => {
    const startDate = new Date(raffle.startDate)
    const endDate = new Date(raffle.endDate)
    return startDate <= now && endDate >= now
  }

  const isFuture = (raffle: Raffle) => {
    const startDate = new Date(raffle.startDate)
    return startDate > now
  }

  const isFinished = (raffle: Raffle) => {
    const endDate = new Date(raffle.endDate)
    return endDate < now && raffle.metadata.isConcluded
  }

  const userParticipationStatus = (raffle: Raffle) => {
    return myRafflesStatus.value[raffle.id]
  }

  const userWon = (raffle: Raffle) => {
    const userHasParticipated = userParticipationStatus(raffle)
    return userHasParticipated && userHasParticipated.wonPrizeV2 && userHasParticipated.wonPrizeV2.type !== RAFFLE_PRIZE_TYPE.NONE
  }
  const userLost = (raffle: Raffle) => {
    const userHasParticipated = userParticipationStatus(raffle)

    if (userHasParticipated === undefined) return false
    const noPrize = userHasParticipated.wonPrizeV2 === null || (userHasParticipated.wonPrizeV2 && userHasParticipated.wonPrizeV2.type === RAFFLE_PRIZE_TYPE.NONE)
    return !!userHasParticipated && noPrize
  }

  const isHighlight = (raffle: Raffle) => {
    return !isFinished(raffle) && raffle.metadata.tags.includes(RAFFLE_TAG.HIGHLIGHTED)
  }

  const orderActiveRaffles = (raffles: Raffle[]): Raffle[] => {
    const highlightActiveRaffles = raffles
      .filter((r) => isHighlight(r) && isActive(r))
      .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
    const activeRaffles = raffles
      .filter((r) => (!isHighlight(r) && isActive(r)) || isFuture(r))
      .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())

    return [...highlightActiveRaffles, ...activeRaffles]
  }

  const sortedActiveRaffles = computed(() => {
    if (!raffles.value) return []
    return orderActiveRaffles(raffles.value)
  })

  const finishedRaffles = computed(() => {
    if (!raffles.value) return []
    return raffles.value.filter(isFinished).sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
  })

  const finishedWonRaffles = computed(() => {
    if (!raffles.value || !isConnected.value) return []
    return raffles.value.filter((r) => isFinished(r) && userWon(r)).sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
  })

  return {
    raffles,
    sortedActiveRaffles,
    finishedWonRaffles,
    finishedRaffles,
    loadingRaffles,
    fetchedRaffles,
    refetchRaffles,
    buyRaffles,
    myRafflesStatus,
    loadingMyRafflesStatus,
    refetchMyRafflesStatus,
    submitRafflePrizeData,
    isActive,
    isFuture,
    isFinished,
    isHighlight,
    userWon,
    userLost,
    userParticipationStatus,
    unclaimedRaffleStatus,
  }
}
