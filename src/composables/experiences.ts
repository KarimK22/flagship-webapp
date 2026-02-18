import type { ExclusiveEvent } from '@/services/api.ts'
import api from '@/services/api.ts'
import { useQuery } from '@tanstack/vue-query'
import { useStakes } from '@/composables/contracts/stakes.ts'
import { computed } from 'vue'
import { encodeImageUrl } from '@/composables/helpers'
import { useGetMe } from '@/composables/get-me'
import { useUserLevel } from '@/composables/user-level'

export const useExperiences = () => {
  const { isConnected, accountAddress } = useGetMe()
  const { data: experiences, refetch: refetchExperiences, isLoading: loadingExperiences, isFetched: fetchedExperiences } = useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const response = await api.getExclusiveEvents()
      return response.exclusiveEvents.map(experience => ({
        ...experience,
        imageUrl: encodeImageUrl(experience.imageUrl),
      }))
    },
    refetchOnWindowFocus: false,
  })

  const { data: myExperiencesStatus, refetch: refetchMyExperiencesStatus, isLoading: loadingMyExperiencesStatus } = useQuery({
    queryKey: ['myExperiencesStatus', accountAddress.value],
    queryFn: async () => {
      const response = await api.getUserExclusiveClaimedEvents()
      return response.claims.reduce((acc, claim) => {
        acc[claim.eventId] = claim.timestamp
        return acc
      }, {} as Record<string, string>)
    },
    initialData: {},
    enabled: isConnected,
    refetchOnWindowFocus: false,
  })

  const { myStakesList } = useStakes()
  const { currentLevel } = useUserLevel()

  const isUserEligibleForExperience = (experience: ExclusiveEvent) => {
    if (!isConnected.value) return false

    if (currentLevel.value.value > 0 && currentLevel.value.value <= experience.minLevel) return true

    const totalValidStaked = myStakesList.value
      .filter((stake) => {
        return stake.unlockDurationBlocks >= experience.minLockDurationBlocks
      })
      .reduce((sum, stake) => sum + Number(stake.amount)*Number(stake.lingoPrice), 0)

    return totalValidStaked >= experience.minAmountStaked
  }

  async function claimExclusiveEvent(eventId: string) {
    try {
      const response = await api.claimExclusiveEvent({ eventId })
      await refetchMyExperiencesStatus()
      return response
    } catch (error) {
      console.error(error)
      throw new Error('Failed to claim exclusive event')
    } finally {
      await refetchExperiences()
    }
  }

  const now = new Date()

  const isActive = (experience: ExclusiveEvent) => {
    const startDate = new Date(experience.startDate)
    const endDate = new Date(experience.endDate)
    return startDate <= now && endDate >= now
  }

  const isFuture = (experience: ExclusiveEvent) => {
    const startDate = new Date(experience.startDate)
    return startDate > now
  }

  const isFinished = (experience: ExclusiveEvent) => {
    const endDate = new Date(experience.endDate)
    return endDate < now
  }

  const orderActiveExperiences = (experiences: ExclusiveEvent[]): ExclusiveEvent[] => {
    return experiences
      .filter((e) => isActive(e) || isFuture(e))
      .sort((a, b) => {
        // Helper function to get sort priority
        const getSortPriority = (exp: ExclusiveEvent): number => {
          if (isActive(exp)) {
            if (myExperiencesStatus.value[exp.id]) return 4 // Claimed by user
            if (exp.quantity && exp.claimed >= exp.quantity) return 3 // Out of stock
            return 1 // Active and available
          }
          if (isFuture(exp)) return 2 // Future experience
          return 5 // Fallback
        }

        const priorityA = getSortPriority(a)
        const priorityB = getSortPriority(b)

        if (priorityA !== priorityB) {
          return priorityA - priorityB
        }

        // If same priority, sort by start date
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
      })
  }

  const finishedExperiences = computed(() => {
    if (!experiences.value) return []
    return experiences.value.filter(isFinished).sort((a: ExclusiveEvent, b: ExclusiveEvent) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
  })

  const userClaimedExperiences = computed(() => {
    if (!experiences.value) return []
    return experiences.value.filter(experience => myExperiencesStatus.value[experience.id])
      .map(experience => ({
        ...experience,
        claimedDate: myExperiencesStatus.value[experience.id],
      }))
  })

  return {
    experiences,
    orderActiveExperiences,
    finishedExperiences,
    userClaimedExperiences,
    loadingExperiences,
    fetchedExperiences,
    refetchExperiences,
    myExperiencesStatus,
    loadingMyExperiencesStatus,
    refetchMyExperiencesStatus,
    isActive,
    isFuture,
    isFinished,
    isUserEligibleForExperience,
    claimExclusiveEvent,
  }
}