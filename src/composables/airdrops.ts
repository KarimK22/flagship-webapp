import { useQuery } from '@tanstack/vue-query'
import api from '@/services/api'

import type { Airdrop } from '@/const/airdrops.ts'
import { DateTime } from 'luxon'
import { computed, ref, watch, watchEffect } from 'vue'
import { useGetMe } from '@/composables/get-me'
import { useNotifications } from './notifications'
import { useTranslation } from '@/composables/use-i18n'

const showAirdropCardModal = ref(false)
const showAirdropFinishedModal = ref(false)
const showAirdropClaimCardModal = ref(false)
const clickedAirdrop = ref<Airdrop>()
const sortAscendingFn = (a: Airdrop, b: Airdrop) => {
  if (!a.endDate) return 1
  if (!b.endDate) return -1
  return (
    DateTime.fromISO(a.endDate).toMillis() -
    DateTime.fromISO(b.endDate).toMillis()
  )
}
const sortDescendingFn = (a: Airdrop, b: Airdrop) => {
  if (!a.endDate) return -1
  if (!b.endDate) return 1
  return (
    DateTime.fromISO(b.endDate).toMillis() -
    DateTime.fromISO(a.endDate).toMillis()
  )
}

export function useAirdrops() {
  const { t } = useTranslation()
  const { accountAddress, isAuthenticated } = useGetMe()
  const elegibleAirdrops = ref<Airdrop[]>([])

  const fetchQuery = async () => {
    const airdrops = await api.getAirdrops()
    if (!isAuthenticated.value) {
      return airdrops.airdrops.map((airdrop) => {
        return {
          ...airdrop,
          readyToClaim: false,
          claimed: false,
        }
      })
    }
    const claimedAirdrops = await api.getMyAirdropClaims()
    return airdrops.airdrops.map((airdrop) => {
      const isClaimed = claimedAirdrops.claims.some(
        (claim) => claim.airdropId === airdrop.id,
      )
      return {
        ...airdrop,
        claimed: isClaimed,
      }
    })
  }

  const { data, refetch, isLoading } = useQuery({
    queryKey: ['airdrops', accountAddress.value],
    queryFn: fetchQuery,
    initialData: [],
    refetchOnWindowFocus: false,
  })

  const isEligibleForAirdrop = (airdrop: Airdrop) => {
    return (
      accountAddress.value && airdrop.wallets.includes(accountAddress.value)
    )
  }

  const airdropActive = (airdrop: Airdrop) => {
    if (!airdrop.startDate) return false
    if (!airdrop.endDate) {
      return DateTime.now() > DateTime.fromISO(airdrop.startDate)
    }
    return (
      DateTime.now() < DateTime.fromISO(airdrop.endDate) &&
      DateTime.now() > DateTime.fromISO(airdrop.startDate)
    )
  }

  const airdropDisabled = (airdrop: Airdrop) => {
    return (
      !airdrop.startDate || DateTime.now() < DateTime.fromISO(airdrop.startDate)
    )
  }

  const sortedAirdrops = computed(() => {
    const active = data.value.filter((airdrop) => airdropActive(airdrop))
    const disabled = data.value.filter((airdrop) => airdropDisabled(airdrop))

    const sortedActive = active.sort(sortAscendingFn)
    const sortedDisabled = disabled.sort(sortAscendingFn)
    return [...sortedActive, ...sortedDisabled]
  })

  const finishedAirdrops = computed(() => {
    return data.value
      .filter((a) => a.endDate && DateTime.fromISO(a.endDate) < DateTime.now())
      .sort(sortDescendingFn)
      .map((a) => {
        return {
          ...a,
          isFinished: true,
        }
      })
  })

  const handleAirdropClick = (index: number) => {
    clickedAirdrop.value = finishedAirdrops.value[index]
    showAirdropFinishedModal.value = true
  }

  const handleClickMyAirdrops = (index: number) => {
    const airdrop = elegibleAirdrops.value[index]
    if (airdrop.readyToClaim) {
      clickedAirdrop.value = airdrop
      showAirdropClaimCardModal.value = true
    }
  }

  const handleClaimAirdrop = async (airdrop: Airdrop) => {
    try {
      const response = await api.claimAirdrop({ airdropId: airdrop.id })
      if (response.success) {
        refetch()
      }
    } catch (error) {
      console.error(error)
    }
  }

  watchEffect(() => {
    if (!isAuthenticated.value) {
      elegibleAirdrops.value = []
      return
    }
    elegibleAirdrops.value = data.value
      .filter((airdrop) => isEligibleForAirdrop(airdrop))
      .sort(sortDescendingFn)
  })

  const { addNotification, clearType } = useNotifications()
  watch(
    elegibleAirdrops,
    (newVal) => {
      const pendingToClaim = newVal.filter(
        (airdrop) => airdrop.readyToClaim && !airdrop.claimed,
      )
      if (pendingToClaim.length > 0) {
        addNotification({
          id: pendingToClaim[0].id,
          title: t('common.notifications.airdrop.title', { name: pendingToClaim[0].name }),
          button: t('common.notifications.airdrop.button'),
          type: 'airdrop',
          action: () => {
            handleCtaButtonClick(pendingToClaim[0])
          },
        })
      } else {
        clearType('airdrop')
      }
    },
    { immediate: true },
  )

  const handleCtaButtonClick = (airdrop: Airdrop) => {
    clickedAirdrop.value = airdrop
    showAirdropClaimCardModal.value = true
  }

  return {
    airdrops: sortedAirdrops,
    finishedAirdrops,
    refetchAirdrops: refetch,
    loadingAirdrops: isLoading,
    isEligibleForAirdrop,
    airdropActive,
    airdropDisabled,
    clickedAirdrop,
    showAirdropFinishedModal,
    showAirdropCardModal,
    showAirdropClaimCardModal,
    handleAirdropClick,
    handleClickMyAirdrops,
    elegibleAirdrops,
    handleClaimAirdrop,
  }
}

