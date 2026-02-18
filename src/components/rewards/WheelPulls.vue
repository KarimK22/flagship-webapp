<template>
  <!-- Top section: wheel + pulls CTA + counter (encapsulated) -->
  <TradingGachaReward
    @on-pull-finished="onPullFinished"
  />
  <!-- RARITY SECTION -->
  <TradingGachaRarities
    class="mt-10"
  />

  <PTScores />

  <!-- Leaderboard -->
  <TradingGachaTopTraders
    v-if="isConnected"
    class="container mt-16"
  />

  <!-- History list -->
  <RewardsHistoryList
    :items="wonPullsList"
    :is-loading="isLoading"
    :is-loading-more="loadingMore"
    :all-shown="!hasMore"
    :items-clickable="true"
    image-class="!bg-cover"
    :empty-text="isConnected ? t('rewards.tradingGacha.noPullsYet') : t('rewards.tradingGacha.loginToSeeYourPulls')"
    :title="t('rewards.tradingGacha.historyTitle')"
    class="container mt-16"
    @activity-click="handleWonPullClick"
    @show-more="loadMore"
  />

  <!-- Prize modal -->
  <TradingGachaPrizeModal
    v-if="clickedPullPrize"
    v-model="showSpinPrizeModal"
    :won-prize="clickedPullPrize"
    :voucher-code="clickedPullPrize.voucherCode ?? undefined"
    :prize-title="prizeTitle(clickedPullPrize)"
    :prize-image="prizeImage(clickedPullPrize)"
    source="trading"
  />

  <!-- Leaderboard Prizes History list -->
  <LeaderboardHistoryWins
    v-if="leaderboardPrizes.length"
    :items="leaderboardPrizesHistory"
    :is-loading="isLoadingLeaderboardPrizes"
    :all-shown="true"
    :items-clickable="true"
    :empty-text="isConnected ? t('rewards.leaderboard.prizesHistory.noPrizesYet') : t('rewards.leaderboard.prizesHistory.loginToSeeYourPrizes')"
    :title="t('rewards.leaderboard.prizesHistory.title')"
    class="container mt-16"
    @activity-click="handleLeaderboardPrizeClick"
  />

  <!-- Leaderboard Prizes Modal -->
  <LeaderboardWinnersPrizeModal
    v-if="selectedLeaderboardPrize"
    v-model="showLeaderboardPrizeModal"
    :won-prize="selectedLeaderboardPrize"
    :prize-image="selectedLeaderboardPrize.image"
    :prize-title="selectedLeaderboardPrize.name"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { DateTime } from 'luxon'
import { useTranslation } from '@/composables/use-i18n'
import { useGetMe } from '@/composables/get-me'

import RewardsHistoryList from '@/components/rewards/RewardsHistoryList.vue'
import TradingGachaPrizeModal from '@/components/rewards/wheel/TradingGachaPrizeModal.vue'
import TradingGachaReward from './wheel/TradingGachaReward.vue'
import LeaderboardHistoryWins from './LeaderboardHistoryWins.vue'
import LeaderboardWinnersPrizeModal from './LeaderboardWinnersPrizeModal.vue'

import { usePullPrizes } from '@/composables/contracts/pull-prizes'
import type { TradingGachaPullWithImage } from '@/composables/use-wheel-pulls'
import TradingGachaTopTraders from '@/components/rewards/TradingGachaTopTraders.vue'
import TradingGachaRarities from './wheel/TradingGachaRarities.vue'
import { useUserLeaderboardPrizes } from '@/composables/use-wheel-pulls'
import PTScores from '@/components/rewards/PTScores.vue'

const { t } = useTranslation()
const { isConnected } = useGetMe()

const showSpinPrizeModal = ref(false)
const showLeaderboardPrizeModal = ref(false)
const clickedPullPrize = ref<TradingGachaPullWithImage | null>(null)

const {
  pullPrizes,
  isLoading,
  loadingMore,
  hasMore,
  loadMore,
  refetch,
} = usePullPrizes({
  initialDisplayCount: 3,
  displayIncrement: 3,
})

const {
  prizes: leaderboardPrizes,
  isLoading: isLoadingLeaderboardPrizes,
} = useUserLeaderboardPrizes()

const leaderboardPrizesHistory = computed(() => {
  return leaderboardPrizes.value.map(item => ({
    title: item.leaderboard.title,
    secondaryDescription: formatLeaderboardDate(item.leaderboard),
    referenceImageSrc: item.prize.image,
    description: item.prize.name,
    buttonLabel: t('rewards.leaderboard.prizesHistory.viewPrize'),
    buttonAnimated: false,
  }))
})

const lastRefetchedPullId = ref<string | null>(null)

const onPullFinished = (pull: TradingGachaPullWithImage) => {
  clickedPullPrize.value = pull
  showSpinPrizeModal.value = true

  if (lastRefetchedPullId.value !== pull.id) {
    lastRefetchedPullId.value = pull.id
    setTimeout(() => {
      refetch()
    }, 600)
  }
}

const prizeTitle = (pull: TradingGachaPullWithImage) => {
  return (
    t('components.rafflesWrapper.youWon') +
    ' ' +
    (pull.prize?.name ?? t('rewards.tradingGacha.unknownPrize'))
  )
}

const prizeImage = (pull: TradingGachaPullWithImage) => {
  return pull.prize?.image || pull.imageUrl
}

const buttonLabel = (_pull: TradingGachaPullWithImage) => {
  return t('components.rafflesWrapper.details')
}
const buttonAnimated = (_pull: TradingGachaPullWithImage) => false

const wonPullsList = computed(() => {
  return pullPrizes.value.map((pull) => ({
    title: DateTime.fromISO(pull.timestamp)
      .toFormat('d LLL yyyy · h:mma')
      .toLowerCase(),
    referenceImageSrc: prizeImage(pull) || pull.prize?.imageOnGacha || pull.prize?.image || '',
    description: prizeTitle(pull),
    buttonLabel: buttonLabel(pull),
    buttonAnimated: buttonAnimated(pull),
  }))
})

const handleWonPullClick = (index: number) => {
  const pull = pullPrizes.value[index] as TradingGachaPullWithImage | undefined
  if (!pull) return
  clickedPullPrize.value = pull
  setTimeout(() => {
    showSpinPrizeModal.value = true
  }, 200)
}

type LeaderboardLike = {
  id: string
  title: string
  startDate: string
  endDate: string
}

const selectedLeaderboardPrize = ref<any | null>(null)

const handleLeaderboardPrizeClick = (index: number) => {
  const item = leaderboardPrizes.value[index]
  if (!item) return

  selectedLeaderboardPrize.value = item.prize
  showLeaderboardPrizeModal.value = true
}
const formatLeaderboardDate = (lb: LeaderboardLike) => {
  const rangeFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
  const yearFmt = new Intl.DateTimeFormat('en-US', { year: 'numeric' })

  return `${rangeFmt.format(new Date(lb.startDate))} – ${rangeFmt.format(new Date(lb.endDate))} (${yearFmt.format(new Date(lb.startDate))})`
}
</script>

<style scoped></style>