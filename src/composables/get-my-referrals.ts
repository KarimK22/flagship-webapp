import api from '@/services/api.ts'

import { useMutation, useQuery } from '@tanstack/vue-query'
import { useGetMe } from './get-me'

export const useGetMyReferrals = () => {
  const { isConnected, accountAddress } = useGetMe()

  const { data, refetch, isLoading } = useQuery({
    queryKey: ['getMyReferrals', accountAddress.value],
    queryFn: () => api.getMyReferrals(),
    select(data) {
      return data.me
    },
    initialData: {
      me: {
        referralCode: '',
        referral: {
          users: {
            total: 0,
            active: 0,
            inactive: 0,
          },
          power: 0,
        },
      },
    },
    enabled: isConnected,
    refetchOnWindowFocus: false,
  })

  const { mutate: claimFirstStakeReward } = useMutation({
    mutationFn: (referralBonusPowerMiles: number) => api.getFirstStakeReward({ referralBonusPowerMiles }),
  })

  return {
    data,
    refetch,
    isLoading,
    claimFirstStakeReward,
  }
}
