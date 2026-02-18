import { useQuery } from '@tanstack/vue-query'
import api from '@/services/api'
import type { Beneficiary } from '@/types/beneficiary'
import { useGetMe } from '../get-me'

type ApiResponse = {
  claims?: Record<string, number>
} & Record<string, number>

export const useLastClaims = () => {
  const { isConnected } = useGetMe()
  const { data: lastClaimsData, isLoading, refetch: fetchLastClaims } = useQuery<Record<string, number>, Error>({
    queryKey: ['lastClaims'],
    queryFn: async () => {
      const result = await api.lastClaims() as ApiResponse

      // Get the claims data, whether it's directly returned or nested
      return result.claims || result
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: isConnected,
  })

  const getTimeSinceLastClaim = (beneficiary: Beneficiary): string => {

    // Access the claims object from the response and convert beneficiary to string
    const beneficiaryKey = beneficiary.toString()
    const lastClaimTime = lastClaimsData.value?.[beneficiaryKey]

    if (!lastClaimTime) {
      return 'Never claimed'
    }

    const now = Date.now()
    const lastClaimTimeMs = lastClaimTime * 1000 // Convert Unix seconds to milliseconds
    const diff = now - lastClaimTimeMs
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ago`
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m ago`
    }
    return `${minutes}m ago`
  }

  return {
    lastClaimsData,
    isLoading,
    fetchLastClaims,
    getTimeSinceLastClaim,
  }
}
