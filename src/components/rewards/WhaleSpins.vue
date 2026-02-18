<template>
  <WheelReward
    @on-spin-finished="onSpinFinished"
  />

  <RewardsHistoryList
    :items="wonRafflesList"
    :is-loading="isLoading"
    :is-loading-more="loadingMore"
    :all-shown="!hasMore"
    :items-clickable="true"
    image-class="!bg-cover"
    :empty-text="isConnected ? t('rewards.wheel.noSpinsYet') : t('rewards.wheel.loginToSeeYourSpins')"
    :title="'Your Spins History'"
    class="container mt-16"
    @activity-click="handleWonRaffleClick"
    @show-more="loadMore"
  />

  <WheelPrizeModal
    v-if="clickedSpinPrize"
    v-model="showWonModal"
    :won-prize="clickedSpinPrize"
    :voucher-code="clickedSpinPrize.voucherCode"
    :prize-title="prizeTitle(clickedSpinPrize)"
    :prize-image="prizeImage(clickedSpinPrize)"
  />
</template>
<script setup lang="ts">
import { useTranslation } from '@/composables/use-i18n'
import RewardsHistoryList from '@/components/rewards/RewardsHistoryList.vue'
import { computed, ref } from 'vue'
import { DateTime } from 'luxon'
import { useGetMe } from '@/composables/get-me'
import WheelReward from './wheel/WheelReward.vue'
import { useSpinPrizes } from '@/composables/contracts/spin-prizes'
import WheelPrizeModal from './wheel/WheelPrizeModal.vue'
import type { Spin } from '@/services/api'
import { encodeImageUrl } from '@/composables/helpers'

const { t } = useTranslation()

type SpinPrizeWithImageUrl = Spin & {
  imageUrl: string
  voucherCode: string
}

const showWonModal = ref(false)
const clickedSpinPrize = ref<SpinPrizeWithImageUrl>()
const { isConnected } = useGetMe()

const {
  spinPrizes,
  isLoading,
  loadingMore,
  hasMore,
  loadMore,
  refetch,
} = useSpinPrizes({
  initialDisplayCount: 3,
  displayIncrement: 3,
})

const onSpinFinished = (spinPrize: Spin) => {
  clickedSpinPrize.value = {
    ...spinPrize,
    imageUrl: encodeImageUrl(spinPrize.prize.image),
    voucherCode: spinPrize.voucherCode,
  }
  showWonModal.value = true
  refetch()
}

const prizeTitle = (spinPrize: SpinPrizeWithImageUrl) => {
  return t('components.rafflesWrapper.youWon') + ' ' + spinPrize.prize.name
}

const prizeImage = (spinPrize: SpinPrizeWithImageUrl) => {
  return spinPrize.imageUrl
}

const buttonLabel = (_spinPrize: SpinPrizeWithImageUrl) => {
  return t('components.rafflesWrapper.details')
}
const buttonAnimated = (_spinPrize: SpinPrizeWithImageUrl) => {
  return false
}

const wonRafflesList = computed(() => {
  return spinPrizes.value.map((spinPrize) => ({
    title: DateTime.fromISO(spinPrize.timestamp)
      .toFormat('d LLL yyyy · h:mma')
      .toLowerCase(),
    referenceImageSrc: prizeImage(spinPrize),
    description: prizeTitle(spinPrize),
    buttonLabel: buttonLabel(spinPrize),
    buttonAnimated: buttonAnimated(spinPrize),
  }))
})

const handleWonRaffleClick = (index: number) => {
  // mixpanel.track('Finished Raffle Popup View', {
  //   raffleId: finishedRaffles.value[index].id,
  //   entryPoint: 'rafflesHistory',
  // })
  clickedSpinPrize.value = spinPrizes.value[index]
  setTimeout(() => {
    showWonModal.value = true
  }, 200)
}
</script>

<style scoped></style>