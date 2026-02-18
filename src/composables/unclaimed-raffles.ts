import { computed, ref, watch } from 'vue'
import api, { RAFFLE_PRIZE_TYPE } from '@/services/api'
import backgroundImage from '@/assets/images/dummies/raffle-card-test.png'
import { useNotifications } from '@/composables/notifications'
import { useTranslation } from '@/composables/use-i18n'
import { useWonUnclaimedRaffles } from './contracts/unclaimed-won-raffles'
import mixpanel from 'mixpanel-browser'

export function useUnclaimedRaffles() {
  const { t } = useTranslation()
  const { addNotification, readNotification, clearType } = useNotifications()
  const showUnclaimedRaffleModal = ref(false)
  const { unclaimedRaffles, refetch } = useWonUnclaimedRaffles({
    initialDisplayCount: 20,
    displayIncrement: 20,
  })

  const unclaimedRaffle = ref<typeof unclaimedRaffles.value[0] | null>()

  const unclaimedRaffleName = ((item: typeof unclaimedRaffles.value[0]) => {
    if (
      item?.wonPrizeV2?.type ===
      RAFFLE_PRIZE_TYPE.PHYSICAL
    ) {
      return item.wonPrizeV2.name
    } else if (
      item?.wonPrizeV2?.type ===
      RAFFLE_PRIZE_TYPE.VOUCHERS
    ) {
      return `$${item.wonPrizeV2.amount} Voucher`
    }
    return ''
  })

  const prizeTitle = computed(() => {
    if (
      unclaimedRaffle.value?.wonPrizeV2?.type === RAFFLE_PRIZE_TYPE.PHYSICAL
    ) {
      return (
        t('common.notifications.raffle.youWon') +
        ' ' +
        unclaimedRaffle.value?.wonPrizeV2?.name
      )
    } else if (
      unclaimedRaffle.value?.wonPrizeV2?.type === RAFFLE_PRIZE_TYPE.VOUCHERS
    ) {
      return `${t('common.notifications.raffle.youReceived')} $${
        unclaimedRaffle.value?.wonPrizeV2?.amount
      } Voucher`
    } else {
      return t('common.notifications.raffle.youWonGeneric')
    }
  })

  const prizeImage = computed(() => {
    return (
      unclaimedRaffle.value?.prizes.find((prize) => {
        if (
          unclaimedRaffle.value?.wonPrizeV2?.type ===
          RAFFLE_PRIZE_TYPE.PHYSICAL
        ) {
          return prize.name === unclaimedRaffle.value?.wonPrizeV2.name
        } else if (
          unclaimedRaffle.value?.wonPrizeV2?.type ===
          RAFFLE_PRIZE_TYPE.VOUCHERS
        ) {
          return prize.id === unclaimedRaffle.value?.wonPrizeV2.id
        }
      })?.imageUrl || backgroundImage
    )
  })

  watch(unclaimedRaffles, (raffles) => {
    if (raffles.length > 0) {
      raffles.map((raffle) => {
        addNotification({
          id: raffle.id,
          title: t('common.notifications.raffle.title', {
            prize: unclaimedRaffleName(raffle),
          }),
          button: t('common.notifications.raffle.button'),
          type: 'raffle',
          action: () => {
            showUnclaimedRaffleModal.value = true
            unclaimedRaffle.value = raffle
            readNotification(raffle.id)
          },
        })
      })
    } else  {
      clearType('raffle')
    }
  })

  const hideWonRaffleModal = () => {
    showUnclaimedRaffleModal.value = false
  }

  async function submitRafflePrizeData(raffleId: string, email?: string) {
    try {
      await api.submitRafflePrizeData({ raffleId, email })
      mixpanel.track('Reward Claimed')
      readNotification(raffleId)
      refetch()
    } catch (error) {
      console.error(error)
      throw new Error('Failed to submit raffle prize data ' + error)
    }
  }

  return {
    showUnclaimedRaffleModal,
    unclaimedRaffle: unclaimedRaffle,
    hideWonRaffleModal,
    submitRafflePrizeData,
    prizeTitle,
    prizeImage,
    refetch,
  }
}