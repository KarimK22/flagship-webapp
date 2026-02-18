import { computed } from 'vue'
import api from '@/services/api.ts'
import { useQuery } from '@tanstack/vue-query'
import { useClaimCustom } from '@/composables/contracts/claim-custom.ts'

import { useInvestorsKOL } from '@/composables/contracts/claim-investorsKOL.ts'
import { useGetMe } from '../get-me'

export const useSnapshot = () => {
  const { totalCustomClaimableBalance, totalCustomClaimedBalance } = useClaimCustom()
  const { totalAllocationAmount } = useInvestorsKOL()

  const { isConnected, accountAddress } = useGetMe()
  const { data: snapshotData, refetch: refetchSnapshot, isLoading: loadingSnapshot } = useQuery({
    queryKey: ['snapshot', accountAddress.value],
    queryFn: async () => {
      return (await api.getSnapshotV2()).snapshot
    },
    enabled: isConnected,
    refetchOnWindowFocus: false,
  })
  const totalTokenAllocation = computed(() => (snapshotData.value?.totalTokenAllocation || 0) + totalCustomClaimableBalance.value + totalCustomClaimedBalance.value + totalAllocationAmount.value)
  const allocationTypes = computed(() => snapshotData.value?.allocationTypes || null)

  return {
    snap: snapshotData,
    loadingSnapshot,
    refetchSnapshot,
    totalTokenAllocation,
    allocationTypes,
  }
}
