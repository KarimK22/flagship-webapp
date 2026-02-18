import api from '@/services/api.ts'
import { useQuery } from '@tanstack/vue-query'

import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import { useGetMe } from './get-me'

export const useRaffleWinners = (raffleId: MaybeRefOrGetter<string>) => {
  const { accountAddress } = useGetMe()

  const {
    data: raffleWinners,
    refetch: refetchRaffleWinners,
    isLoading: loadingRaffleWinners,
    isFetching: fetchingRaffleWinners,
  } = useQuery({
    queryKey: ['raffleWinners', accountAddress.value, toValue(raffleId)],
    queryFn: async () => {
      return (await api.getRaffleWinnersV2(toValue(raffleId))).winners
    },
    initialData: [],
    refetchOnWindowFocus: false,
  })

  return {
    raffleWinners,
    refetchRaffleWinners,
    loadingRaffleWinners,
    fetchingRaffleWinners,
  }
}
