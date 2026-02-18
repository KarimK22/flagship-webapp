<template>
  <StakingWheelReward
    v-model:selected-tier="selectedTier"
    @on-spin-finished="onSpinFinished"
  />

  <!-- RARITY SECTION -->
  <TradingGachaRarities
    class="mt-10"
    :tier="selectedTier"
  />

  <RewardsHistoryList
    :items="wonSpinsList"
    :is-loading="isLoading"
    :is-loading-more="loadingMore"
    :all-shown="!hasMore"
    :items-clickable="true"
    image-class="!bg-cover"
    :empty-text="isConnected ? t('rewards.wheel.noSpinsYet') : t('rewards.wheel.loginToSeeYourSpins')"
    :title="t('rewards.stakingWheel.historyTitle')"
    class="container mt-16"
    @activity-click="handleWonSpinClick"
    @show-more="loadMore"
  />

  <TradingGachaPrizeModal
    v-if="clickedSpinPrize"
    v-model="showWonModal"
    :won-prize="clickedSpinPrize"
    :voucher-code="clickedSpinPrize.voucherCode ?? undefined"
    :prize-title="prizeTitle(clickedSpinPrize)"
    :prize-image="prizeImage(clickedSpinPrize)"
    source="staking"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { DateTime } from 'luxon'
import { useTranslation } from '@/composables/use-i18n'
import { useGetMe } from '@/composables/get-me'
import { encodeImageUrl } from '@/composables/helpers'

import RewardsHistoryList from '@/components/rewards/RewardsHistoryList.vue'
import TradingGachaPrizeModal from './wheel/TradingGachaPrizeModal.vue'
import StakingWheelReward from './wheel/StakingWheelReward.vue'
import TradingGachaRarities from './wheel/TradingGachaRarities.vue'

import { useStakingWheelSpins } from '@/composables/contracts/staking-spin-prizes'
import type { StakingWheelSpin } from '@/composables/use-staking-wheels'

const { t } = useTranslation()
const { isConnected } = useGetMe()

type SpinWithImageUrl = StakingWheelSpin & { imageUrl: string }

const showWonModal = ref(false)
const clickedSpinPrize = ref<SpinWithImageUrl | null>(null)
const selectedTier = ref<'silver' | 'gold' | 'diamond'>('silver')

const {
  spins,
  isLoading,
  loadingMore,
  hasMore,
  loadMore,
  refetch,
  resetDisplay,
} = useStakingWheelSpins({
  initialDisplayCount: 3,
  displayIncrement: 3,
})

onMounted(() => {
  refetch()
})

const normalize = (spin: StakingWheelSpin): SpinWithImageUrl => {
  const img = spin.prize.image || spin.prize.imageOnWheel || ''
  return { ...spin, imageUrl: encodeImageUrl(img) }
}

const onSpinFinished = (spin: StakingWheelSpin) => {
  clickedSpinPrize.value = normalize(spin)
  showWonModal.value = true
  resetDisplay()
  setTimeout(() => refetch(), 600)
}

const prizeTitle = (spin: SpinWithImageUrl) => {
  return t('components.rafflesWrapper.youWon') + ' ' + (spin.prize?.name ?? t('rewards.wheel.unknownPrize'))
}

const prizeImage = (spin: SpinWithImageUrl) => {
  return spin.imageUrl
}

const wonSpinsList = computed(() => {
  return spins.value.map((spin: StakingWheelSpin) => {
    const s = normalize(spin)
    return {
      title: DateTime.fromISO(s.timestamp)
        .toFormat('d LLL yyyy · h:mma')
        .toLowerCase(),
      referenceImageSrc: s.imageUrl,
      description: prizeTitle(s),
      buttonLabel: t('components.rafflesWrapper.details'),
      buttonAnimated: false,
    }
  })
})

const handleWonSpinClick = (index: number) => {
  const spin = spins.value[index]
  if (!spin) return

  clickedSpinPrize.value = normalize(spin)
  setTimeout(() => {
    showWonModal.value = true
  }, 200)
}

</script>

<style scoped></style>