<template>
  <RewardsCarousel
    class="mb-12"
    type="raffles"
    @get-more="showTicketSimulator = true"
    @open-simulator="showTicketSimulator = true"
    @active-raffle-changed="activeRaffleId = $event"
  />

  <!-- Car raffle info — only visible when car raffle is active -->
  <Transition
    enter-active-class="transition-all duration-400 ease-out"
    leave-active-class="transition-all duration-300 ease-in"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <CarRaffleInfo v-if="isCarRaffleActive" />
  </Transition>

  <!--  <RecentClaimsSliderNew />-->
  <!--  <div class="w-full overflow-hidden">-->
  <!--    <div class="container relative">-->
  <!--      <RecentClaimsSlider-->
  <!--        class="w-full md:w-[50vw] max-w-[calc(50vw+384px)]"-->
  <!--      />-->
  <!--    </div>-->
  <!--  </div>-->
  <RewardsHistoryList
    :items="wonRafflesList"
    :is-loading="isLoading"
    :is-loading-more="loadingMore"
    :all-shown="!hasMore"
    :items-clickable="true"
    image-class="!bg-cover"
    :empty-text="isConnected ? t('components.rafflesWrapper.rewardsEmpty') : t('components.rafflesWrapper.loginToSeeRewards')"
    :title="t('components.rafflesWrapper.yourRafflePrizes')"
    class="container mt-[98px]"
    @activity-click="handleWonRaffleClick"
    @show-more="loadMore"
  />
  <FinishedRafflesHistory
    v-model:show-modal="showWinnersModal"
    @raffle-clicked="handleFinishedRaffleSelected"
  />
  <div class="container px-4 py-6 mt-4">
    <p class="text-sm leading-4 text-[#F1E6FA] opacity-64 font-semibold">
      <strong>{{ t('components.rafflesWrapper.disclaimerLabel') }}</strong> {{ t('components.rafflesWrapper.disclaimer') }}
    </p>
  </div>
  <RaffleWinnersModal
    v-if="clickedRaffle"
    v-model="showWinnersModal"
    :raffle="clickedRaffle"
    :participants-count="clickedRaffle.metadata.participantsCount"
    :won-prize="myRafflesStatus[clickedRaffle.id]?.wonPrizeV2"
  />

  <RaffleWonModal
    v-if="clickedWonRaffle"
    v-model="showWonModal"
    :raffle="clickedWonRaffle"
    :prize-submitted-data="myRafflesStatus[clickedWonRaffle.id]?.prizeSubmittedData"
    :won-prize="wonPrize(clickedWonRaffle.id)"
    :prize-title="prizeTitle(clickedWonRaffle.id)"
    :prize-image="prizeImage(clickedWonRaffle)"
  />

  <!-- Ticket Simulator Modal -->
  <TicketSimulatorModal v-model="showTicketSimulator" />
</template>
<script setup lang="ts">
import { useTranslation } from '@/composables/use-i18n'
import RewardsCarousel from '@/components/RewardsCarousel.vue'
import RewardsHistoryList from '@/components/rewards/RewardsHistoryList.vue'
import { prefilledRaffle, useRaffles } from '@/composables/raffles.ts'
import { computed, onMounted, ref } from 'vue'
import { DateTime } from 'luxon'
import RaffleWinnersModal from '@/components/rewards/raffles/raffles-won/RaffleWinnersModal.vue'
import { type Raffle, RAFFLE_PRIZE_TYPE, type RaffleStatus } from '@/services/api.ts'
import { useRoute } from 'vue-router'
import RaffleWonModal from '@/components/rewards/raffles/raffles-won/RaffleWonModal.vue'
import { useGetMe } from '@/composables/get-me'
import FinishedRafflesHistory from './raffles/FinishedRafflesHistory.vue'
import { useWonRaffles } from '@/composables/contracts/won-raffles'
import TicketSimulatorModal from './raffles/TicketSimulatorModal.vue'
import CarRaffleInfo from './raffles/CarRaffleInfo.vue'

const { t } = useTranslation()

const showWinnersModal = ref(false)
const clickedRaffle = ref<Raffle | null>(null)

const showWonModal = ref(false)
const clickedWonRaffle = ref<Raffle | null>(null)

const showTicketSimulator = ref(false)
const activeRaffleId = ref<string | null>(null)

const { isConnected } = useGetMe()

const {
  sortedActiveRaffles,
  myRafflesStatus,
} = useRaffles()

const isCarRaffleActive = computed(() => {
  if (!activeRaffleId.value) return false
  const activeRaffle = sortedActiveRaffles.value.find(r => r.id === activeRaffleId.value)
  return activeRaffle?.title.toLowerCase().includes('bitrefill') ?? false
})

const {
  wonRaffles,
  isLoading,
  loadingMore,
  hasMore,
  loadMore,
} = useWonRaffles({
  initialDisplayCount: 3,
  displayIncrement: 3,
})

const wonPrize = (raffleId: Raffle['id']) => {
  return myRafflesStatus.value[raffleId]?.wonPrizeV2 as RaffleStatus['wonPrizeV2'] & { imageUrl: string }
}

const prizeTitle = (raffleId: Raffle['id']) => {
  if (myRafflesStatus.value[raffleId]?.wonPrizeV2?.type === RAFFLE_PRIZE_TYPE.PHYSICAL) {
    return t('components.rafflesWrapper.youWon') + ' ' + myRafflesStatus.value[raffleId]?.wonPrizeV2?.name
  } else if (myRafflesStatus.value[raffleId]?.wonPrizeV2?.type === RAFFLE_PRIZE_TYPE.VOUCHERS) {
    return `${t('components.rafflesWrapper.youReceived')} $${myRafflesStatus.value[raffleId]?.wonPrizeV2?.amount} ${t('components.rafflesWrapper.voucher')}`
  } else {
    return t('components.rafflesWrapper.youWonExclamation')
  }
}

const prizeImage = (raffle: Raffle) => {
  const wonPrize = myRafflesStatus.value[raffle.id]?.wonPrizeV2
  if (!wonPrize) return raffle.imageUrl
  return raffle.prizes.find((prize) => {
    if (wonPrize.type === RAFFLE_PRIZE_TYPE.PHYSICAL){
      return prize.name === wonPrize?.name
    } else if (wonPrize?.type === RAFFLE_PRIZE_TYPE.VOUCHERS) {
      return prize.id === wonPrize?.id
    }
  })?.imageUrl || raffle.imageUrl
}

const buttonLabel = (raffleId: Raffle['id']) => {
  if (!myRafflesStatus.value[raffleId]?.prizeSubmittedData) {
    return t('components.rafflesWrapper.claim')
  }
  return t('components.rafflesWrapper.details')
}
const buttonAnimated = (raffleId: Raffle['id']) => {
  return !myRafflesStatus.value[raffleId]?.prizeSubmittedData
}

const wonRafflesList = computed(() => {
  return wonRaffles.value.map((raffle) => ({
    title: DateTime.fromISO(raffle.concludedAt)
      .toFormat('d LLL yyyy · h:mma')
      .toLowerCase(),
    referenceImageSrc: prizeImage(raffle),
    description: prizeTitle(raffle.id),
    buttonLabel: buttonLabel(raffle.id),
    buttonAnimated: buttonAnimated(raffle.id),
  }))
})

const handleWonRaffleClick = (index: number) => {
  // mixpanel.track('Finished Raffle Popup View', {
  //   raffleId: finishedRaffles.value[index].id,
  //   entryPoint: 'rafflesHistory',
  // })
  clickedWonRaffle.value = wonRaffles.value[index]
  setTimeout(() => {
    showWonModal.value = true
  }, 200)
}

const handleFinishedRaffleSelected = (raffle: Raffle) => {
  clickedRaffle.value = raffle
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

<style scoped>

</style>
