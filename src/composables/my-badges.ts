import { type Badge, badges } from '@/const/badges'
import { computed, ref, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import api from '@/services/api'
import backsideBadge from '@/assets/images/badges/backside-badge.svg'
import { useMintBadge } from '@/composables/contracts/mint-badge'
import { useGetMe } from './get-me'
import { useNotifications } from './notifications'
import { useTranslation } from '@/composables/use-i18n'

const isProgressMintModalOpen = ref(false)
const showBadgeBanner = ref(false)
const isBadgesSheetOpen = ref(false)
const isMintModalOpen = ref(false)
const badgeToReceive = ref<Badge>()

export function useMyBadges() {
  const { t } = useTranslation()
  const badgesRef = ref<Badge[]>([])

  const { isAuthenticated, accountAddress } = useGetMe()
  const enabled = computed(() =>
    Boolean(isAuthenticated.value && accountAddress.value),
  )
  const { data, refetch } = useQuery({
    queryKey: ['myBadges', accountAddress.value],
    queryFn: () => api.getBadges().then((badges) => ({ badges })),
    initialData: {
      badges: [],
    },
    enabled: enabled,
  })

  const { mintBadge, checkMintedBadges } = useMintBadge()
  const { addNotification } = useNotifications()

  const handleReceive = (badge: Badge) => {
    badgeToReceive.value = badge
    isMintModalOpen.value = true
  }

  watch(
    data,
    async (newData) => {
      if (!isAuthenticated.value || !accountAddress.value) {
        return
      }

      const apiResponseMap = Object.fromEntries(
        newData.badges.map((b) => [
          b.id,
          {
            isClaimable: true,
            isOld: b.isOld,
          },
        ]),
      )
      const isMintedMap = await checkMintedBadges(
        accountAddress.value,
        badges.map((b) => b.id),
      )

      const mergedBadges = badges.map((badge) => {
        const badgeData = apiResponseMap[badge.id]
        const description = badgeData?.isOld
          ? badge.oldDescription
          : badge.description
        return { ...badge, ...badgeData, ...isMintedMap[badge.id], description }
      })
      badgesRef.value = mergedBadges
      checkToShowBadgeBanner()
    },
    { immediate: true },
  )

  const checkToShowBadgeBanner = () => {
    const claimableBadge = badgesRef.value.find(
      (badge) => badge.isClaimable && badge.isLocked,
    )
    if (claimableBadge) {
      addNotification({
        id: claimableBadge.id,
        title: t('common.notifications.badge.title'),
        button: t('common.notifications.badge.button'),
        type: 'badge',
        icon: backsideBadge,
        action: () => {
          isBadgesSheetOpen.value = true
        },
        onClose: () => {
          showBadgeBanner.value = false
        },
      })
    }
  }

  const handleMintBadge = async () => {
    const badge = badgeToReceive.value
    if (!badge || !accountAddress.value) {
      return
    }

    isMintModalOpen.value = false
    isProgressMintModalOpen.value = true
    try {
      await mintBadge(accountAddress.value, badge.id)
      refetch()
      const newState = {
        ...badge,
        isLocked: false,
        isClaimed: true,
        isClaimable: false,
      }
      badgesRef.value = badgesRef.value.map((b) =>
        b.id === badge.id ? newState : b,
      )
      isMintModalOpen.value = true
      isProgressMintModalOpen.value = false
      badgeToReceive.value = newState
      checkToShowBadgeBanner()
    } catch (error) {
      console.error(error)
    }
  }

  return {
    badges: badgesRef,
    myBadges: data,
    isMintModalOpen,
    isProgressMintModalOpen,
    badgeToReceive,
    handleReceive,
    handleMintBadge,
    isBadgesSheetOpen,
    showBadgeBanner,
  }
}
