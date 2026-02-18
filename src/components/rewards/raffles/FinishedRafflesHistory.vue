<template>
  <RewardsHistoryList
    :items="items"
    :is-loading="isLoading"
    :is-loading-more="loadingMore"
    :all-shown="!hasMore"
    :items-clickable="true"
    image-class="!bg-cover"
    :empty-text="t('components.rafflesWrapper.finishedRafflesEmpty')"
    :title="t('components.rafflesWrapper.finishedRaffles')"
    class="container mt-[98px]"
    @activity-click="handleFinishedRaffleClick"
    @show-more="loadMore"
  />
</template>
<script setup lang="ts">
import { useTranslation } from '@/composables/use-i18n'
import RewardsHistoryList from '@/components/rewards/RewardsHistoryList.vue'
import { prefilledRaffle } from '@/composables/raffles.ts'
import { computed, onMounted } from 'vue'
import { DateTime } from 'luxon'
import { type Raffle } from '@/services/api.ts'
import mixpanel from 'mixpanel-browser'
import { useRoute } from 'vue-router'
import { useFinishedRaffles } from '@/composables/contracts/finished-raffles'

const { t } = useTranslation()

const showWinnersModal = defineModel<boolean>('showModal', { required: true })
const emit = defineEmits<{ (e: 'raffle-clicked', raffle: Raffle): void }>()

const finishedRafflePrizesTitles = (raffle: Raffle) => {
  return raffle.prizes.map((prize) => {
    return `${prize.name}`
  }).join(', or ')
}

const {
  finishedRaffles,
  hasMore,
  isLoading,
  loadMore,
  loadingMore,
} = useFinishedRaffles({
  initialDisplayCount: 3,
  displayIncrement: 3,
})

const items = computed(() => {
  return finishedRaffles.value.map((raffle) => {
    const prizeCount = raffle.prizes.reduce((acc, prize) => acc + prize.count, 0)
    return ({
      title: DateTime.fromISO(raffle.concludedAt)
        .toFormat('d LLL yyyy · h:mma')
        .toLowerCase(),
      description: `${prizeCount} ${prizeCount != 1 ? t('components.rafflesWrapper.luckyWinnersPlural') : t('components.rafflesWrapper.luckyWinners')} ${t('components.rafflesWrapper.won')} ${finishedRafflePrizesTitles(raffle)}`,
      referenceImageSrc: raffle.imageUrl,
    })
  })
})

const handleFinishedRaffleClick = (index: number) => {
  mixpanel.track('Finished Raffle Popup View', {
    raffleId: finishedRaffles.value[index].id,
    entryPoint: 'rafflesHistory',
  })
  emit('raffle-clicked', finishedRaffles.value[index])
  showWinnersModal.value = true
}

const route = useRoute()

const raffleCode = route.query.rafflecode as string
const raffleId = route.query.raffleId as string

onMounted(() => {
  if (raffleCode && raffleId) {
    prefilledRaffle.value = { raffleCode, raffleId }
  }
})
</script>

<style scoped></style>