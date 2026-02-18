<template>
  <div
    class="mx-auto bg-dark2 text-white p-2 rounded-2xl relative overflow-hidden w-[288px] h-[512px] flex flex-col bg-cover bg-center"
    :style="{ backgroundImage: `url(${prizeImage})` }"
  >
    <!-- Content (with higher z-index) -->
    <div class="relative z-10 flex flex-col h-full">
      <!-- BaseHeader Section -->
      <div class="text-purple-gray text-xl leading-8 -tracking-[0.6px] mt-4 select-none">
        {{ $t('components.raffleWonCard.congratulations') }}
      </div>

      <!-- Title Section -->
      <div class="mb-8 mx-2 select-none">
        <h2 class="inline text-5xl leading-10 font-medium -tracking-[2.4px]">
          {{ prizeTitle }}
        </h2>
      </div>

      <!-- Enter BaseButton -->
      <GlowButton
        :color="EButtonColor.BLUE"
        class="mb-6 mt-auto mx-5 select-none"
        @click="handleClaim"
      >
        {{ buttonLabel }}
      </GlowButton>
    </div>
  </div>

  <RaffleWonModal
    v-model="showWonModal"
    :raffle="raffle"
    :prize-submitted-data="myRaffleStatus?.prizeSubmittedData"
    :prize-title="prizeTitle"
    :prize-image="prizeImage"
    :won-prize="wonPrize"
  />
</template>

<script lang="ts" setup>
import { type Raffle, RAFFLE_PRIZE_TYPE, type RaffleStatus } from '@/services/api.ts'
import { computed, ref } from 'vue'
import { useTranslation } from '@/composables/use-i18n'
import RaffleWonModal from '@/components/rewards/raffles/raffles-won/RaffleWonModal.vue'
import backgroundImage from '@/assets/images/dummies/raffle-card-test.png'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button.ts'

const props = defineProps<{
    raffle: Raffle
    myRaffleStatus?: RaffleStatus
}>()

const { t } = useTranslation()

const showWonModal = ref(false)

const handleClaim = () => {
  showWonModal.value = true
}

const wonPrize = computed(() => {
  return props.myRaffleStatus?.wonPrizeV2 as RaffleStatus['wonPrizeV2'] & { imageUrl: string }
})

const prizeTitle = computed(() => {
  if (props.myRaffleStatus?.wonPrizeV2?.type === RAFFLE_PRIZE_TYPE.PHYSICAL) {
    return t('components.raffleWonCard.youWon', { prize: props.myRaffleStatus?.wonPrizeV2?.name })
  } else if (props.myRaffleStatus?.wonPrizeV2?.type === RAFFLE_PRIZE_TYPE.VOUCHERS) {
    return t('components.raffleWonCard.youReceived', { amount: props.myRaffleStatus?.wonPrizeV2?.amount })
  } else {
    return t('components.raffleWonCard.youWonExclamation')
  }
})

const prizeImage = computed(() => {
  return props.raffle.prizes.find((prize) => {
    if (props.myRaffleStatus?.wonPrizeV2?.type === RAFFLE_PRIZE_TYPE.PHYSICAL){
      return prize.name === props.myRaffleStatus.wonPrizeV2.name
    } else if (props.myRaffleStatus?.wonPrizeV2?.type === RAFFLE_PRIZE_TYPE.VOUCHERS) {
      return prize.id === props.myRaffleStatus.wonPrizeV2.id
    }
  })?.imageUrl || backgroundImage
})

const buttonLabel = computed(() => {
  if (!props.myRaffleStatus?.prizeSubmittedData) {
    return t('components.raffleWonCard.claim')
  }
  return t('components.raffleWonCard.viewDetails')
})
</script>

<style scoped>
</style>