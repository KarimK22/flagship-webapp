import { useQuery } from '@tanstack/vue-query'
import api from '@/services/api.ts'
import { LOCK_DURATION_ID } from '@/types/staking'
import type { LockConfig } from '@/types/lock-config'

export const useConfig = () => {

  const { data: lockConfigData, refetch, isLoading } = useQuery<LockConfig>({
    queryKey: ['lockConfig'],
    queryFn: () => {
      return api.getConfig()
    },
    initialData: {
      tiers: {},
      airdropWalletsCount: 0,
      walletAddresses: [],
      lockDurations: {
        [LOCK_DURATION_ID.NO_LOCK]: { lockDurationBlocks: 0, boost: 0, index: 0 },
        [LOCK_DURATION_ID.ONE_MONTH]: { lockDurationBlocks: 0, boost: 0, index: 1 },
        [LOCK_DURATION_ID.THREE_MONTHS]: { lockDurationBlocks: 0, boost: 0, index: 2 },
        [LOCK_DURATION_ID.SIX_MONTHS]: { lockDurationBlocks: 0, boost: 0, index: 3 },
        [LOCK_DURATION_ID.TWELVE_MONTHS]: { lockDurationBlocks: 0, boost: 0, index: 4 },
      },
      power: {
        base: 0,
        decimalCount: 0,
      },
    },
    refetchOnWindowFocus: false,
  })

  return {
    lockConfig: lockConfigData,
    refetchLockConfig: refetch ,
    isLoadingLockConfig: isLoading,
  }
}
