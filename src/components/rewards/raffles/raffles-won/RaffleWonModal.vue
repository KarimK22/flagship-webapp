<template>
  <BaseModal
    :model-value="modelValue"
    class="p-0 rounded-2xl"
    @update:model-value="(val: boolean) => emit('update:modelValue', val)"
  >
    <div
      class="bg-dark2 text-white px-4 py-6 rounded-2xl relative overflow-hidden sm:w-[420px] h-[640px] flex flex-col bg-cover bg-center transition-all duration-500"
      :style="{ backgroundImage: `url(${prizeImage})` }"
    >
      <!-- Content (with higher z-index) -->
      <div class="relative z-10 flex flex-col h-full">
        <!-- BaseHeader Section -->
        <div class="text-purple-gray text-xl leading-8 -tracking-[0.6px] select-none transition-all duration-300 animate-fadeIn">
          {{ $t('components.raffleWonModal.congratulations') }}
        </div>

        <!-- Title Section -->
        <div class="mb-8 transition-all duration-500 animate-slideUp">
          <h2 class="text-lavender text-5xl leading-10 font-medium -tracking-[2.4px] mb-2 transition-all duration-300">
            {{ prizeTitle }}
          </h2>
          <BaseButton
            v-if="!hideShareButton"
            variant="classic"
            size="classic"
            class="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
            @click="shareOnX"
          >
            <InlineSvg
              :src="gradientX"
              class="transition-transform duration-200 hover:rotate-12"
            />
            <span>{{ $t('components.raffleWonModal.share') }}</span>
          </BaseButton>
        </div>

        <!-- Claim -->
        <template v-if="wonPrize">
          <Transition
            name="fade"
            mode="out-in"
            appear
          >
            <RaffleWonModalPhysicalContent
              v-if="wonPrize.type === RAFFLE_PRIZE_TYPE.PHYSICAL"
              :key="RAFFLE_PRIZE_TYPE.PHYSICAL"
              :raffle-id="raffle.id"
              :prize-submitted-data="prizeSubmittedData"
              :hide-winners-button="hideWinnersButton"
              class="transition-all duration-300"
              @hide="emit('update:modelValue', false)"
              @show-all-winners="showWinnersModal = true"
            />
            <RaffleWonModalVouchersContent
              v-else
              :key="RAFFLE_PRIZE_TYPE.VOUCHERS"
              :won-prize="wonPrize"
              class="transition-all duration-300"
              @hide="emit('update:modelValue', false)"
              @show-all-winners="showWinnersModal = true"
            />
          </Transition>
        </template>
      </div>
      <RaffleWinnersModal
        v-if="!hideWinnersButton"
        v-model="showWinnersModal"
        :raffle="raffle"
        :participants-count="raffle.metadata.participantsCount"
        :won-prize="wonPrize"
      />
    </div>
  </BaseModal>
</template>
<script setup lang="ts">
import { type Raffle, RAFFLE_PRIZE_TYPE, type RaffleStatus } from '@/services/api.ts'
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import RaffleWonModalPhysicalContent from '@/components/rewards/raffles/raffles-won/RaffleWonModalPhysicalContent.vue'
import RaffleWonModalVouchersContent from '@/components/rewards/raffles/raffles-won/RaffleWonModalVouchersContent.vue'
import { BaseButton } from '@/components/ui/button'
import gradientX from '@/assets/icons/gradient-x.svg'
import InlineSvg from 'vue-inline-svg'
import { tweets } from '@/const/tweets.ts'
import { useGetMe } from '@/composables/get-me.ts'
import { computed, ref, watch } from 'vue'
import RaffleWinnersModal from '@/components/rewards/raffles/raffles-won/RaffleWinnersModal.vue'
import mixpanel from 'mixpanel-browser'
import { useUnclaimedRaffles } from '@/composables/unclaimed-raffles'

const props = defineProps<{
    modelValue: boolean
    raffle: Raffle
    prizeImage?: string
    prizeTitle?: string
    prizeSubmittedData?: RaffleStatus['prizeSubmittedData']
    wonPrize?: RaffleStatus['wonPrizeV2']
    hideWinnersButton?: boolean
    hideShareButton?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const showWinnersModal = ref(false)

watch(showWinnersModal, (val) => {
  if (val) {
    mixpanel.track('Finished Raffle Popup View', {
      raffleId: props.raffle.id,
      entryPoint: 'rewardPopup',
    })
  }
})
const { referralCode } = useGetMe()

const prizeName = computed(() => {
  if (props.wonPrize?.type === RAFFLE_PRIZE_TYPE.PHYSICAL) {
    return props.wonPrize?.name
  } else if (props.wonPrize?.type === RAFFLE_PRIZE_TYPE.VOUCHERS) {
    return `$${props.wonPrize?.amount} Voucher`
  } else {
    return 'Prize'
  }
})

function shareOnX() {
  mixpanel.track('Share On X Started', {
    entryPoint: 'prizePopup',
  })
  const randomTweet = tweets.raffleWon[Math.floor(Math.random() * tweets.raffleWon.length)]
  const urlWithReferral = `app.lingocoin.io/rewards?ref=${referralCode.value}`
  const tweet = randomTweet.replace('[reward]', prizeName.value).replace('app.lingocoin.io/rewards', urlWithReferral)
  const tweetText = encodeURIComponent(tweet).replace(/%20/g, '+')
  window.open(`https://x.com/intent/post?text=${tweetText}`, '_blank')
}
const { submitRafflePrizeData } = useUnclaimedRaffles()
const { meData } = useGetMe()

const handlePrizeSubmission = async () => {
  if (!props.wonPrize) {
    // console.log('No prize won')
    return
  }
  if (props.prizeSubmittedData) {
    // console.log('Prize already submitted')
    return
  }

  try {
    if (props.wonPrize.type === RAFFLE_PRIZE_TYPE.VOUCHERS) {
      // console.log('Voucher sub')
      await submitRafflePrizeData(props.raffle.id)
      return
    }

    const userEmail = meData.value?.email
    if (!userEmail) {
      // console.error('No email for prize submit')
      return
    }

    await submitRafflePrizeData(props.raffle.id, userEmail)
  } catch (error) {
    console.error('Failed to submit prize data:', error)
  }
}

watch(() => props.modelValue, async (isOpen) => {
  // console.log('Modal open:', isOpen)
  if (isOpen) {
    mixpanel.track('Reward Popup View')
    // console.log('Reward Popup View')
    await handlePrizeSubmission()
  }
},
)
</script>

<style scoped>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-slideUp {
  animation: slideUp 0.8s ease-out forwards;
  animation-delay: 0.2s;
  opacity: 0;
  animation-fill-mode: forwards;
}

/* Button hover effects */
:deep(.base-button) {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

:deep(.base-button:hover) {
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
}

:deep(.base-button:active) {
  transform: scale(0.98);
}

/* Background image transition */
.bg-cover {
  transition: transform 10s ease-in-out;
}

.bg-cover:hover {
  transform: scale(1.05);
}
</style>
