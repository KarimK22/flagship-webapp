<template>
  <div
    class="bg-dark2 text-white pt-8 px-4 w-full md:w-[640px]"
  >
    <div class="flex flex-col md:flex-row max-md:items-center gap-4 md:gap-8 h-full">
      <transition
        name="fade"
        mode="out-in"
      >
        <div
          :key="currentStep"
          class="flex flex-col justify-center max-md:text-center h-full w-full"
        >
          <div class="title-container">
            <h2 class="text-light1 text-[32px] font-medium leading-7 tracking-[-1.28px] mb-2">
              {{ stepsContent.title }}
            </h2>
            <div
              v-if="stepsContent.subtitle"
              class="relative"
            >
              <h2 class="text-light1 text-[48px] leading-10 font-medium tracking-[-2.8px]">
                {{ stepsContent.subtitle }}
              </h2>
              <h2 class="flare text-light1 text-[48px] leading-10 font-medium tracking-[-2.8px]">
                {{ stepsContent.subtitle }}
              </h2>
            </div>
          </div>

          <div
            class="mb-4 text-lavender text-left tracking-[-0.8px] text-xl font-normal leading-5"
          >
            <span
              v-html="t('components.extraTicketsModal.step1.text1', {
                amount: minAmount,
                price: formatNumberToUS(minAmount * price),
              })"
            />
            <div class="flex flex-col gap-2 py-4 pl-1">
              <span>{{ t('components.extraTicketsModal.step1.text2', {
                tickets: ticketsReceived,
              }) }}</span>
              <span>{{ t('components.extraTicketsModal.step1.text3') }}</span>
              <span>{{ t('components.extraTicketsModal.step1.text4') }}</span>
            </div>
            <span>{{ t('components.extraTicketsModal.step1.text5') }}</span>
          </div>
        </div>
      </transition>
    </div>
  </div>
  <img
    :src="rewards"
    alt="rewards"
    class="w-full h-[100px] md:h-[200px] object-contain md:object-cover mb-4"
  >
  <div
    class="pb-8 px-4 flex flex-col w-full md:w-[640px]"
  >
    <div class="flex flex-col items-center gap-3 mt-auto mx-4">
      <div
        class="relative"
      >
        <span class="text-[32px] absolute -left-10">👉</span>
        <GlowButton

          :color="EButtonColor.BLUE"
          class="w-[288px]"
          :loading="loadingButton"
          :disabled="loadingButton"
          @click="stepsContent.buttonAction"
        >
          {{ stepsContent.buttonText }}
        </GlowButton>
      </div>
      <transition name="fade">
        <p
          v-if="stepsContent.footerText"
          class="text-sm leading-4 text-purple-gray font-semibold pt-2 text-center"
        >
          {{ stepsContent.footerText }}
        </p>
      </transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Raffle } from '@/services/api.ts'
import { computed, ref } from 'vue'
import rewards from '@/assets/images/rewards-options-flayer.png'
import { formatNumberToUS } from '@/composables/helpers.ts'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button.ts'
import { useTranslation } from '@/composables/use-i18n'

const props = withDefaults(defineProps<{
  extraTickets: Raffle['metadata']['extraTickets']
  name?: string
  purchaseSuccessId?: string
  variant?: 'raffle' | 'banner'
  buttonAction: () => void
  hasSufficientBalance: boolean
  ticketsReceived?: number
  price: number
}>(), {
  purchaseSuccessId: undefined,
  variant: 'raffle',
  name: '',
  ticketsReceived: 0,
})

const { t } = useTranslation()

const currentStep = ref(1)
const loadingButton = ref(false)

const minAmount = props.extraTickets.onStake?.minAmount || 0

const stepsContent = computed(() => ({
  title: t('components.extraTicketsModal.dontMissOut'),
  subtitle: t('components.extraTicketsModal.getMoreChances', { count: props.ticketsReceived }),
  buttonText: props.hasSufficientBalance ? t('components.extraTicketsModal.continue') : t('components.extraTicketsModal.buyLingoWithCard'),
  buttonAction: props.buttonAction,
  showFooterText: !props.hasSufficientBalance,
  footerText: !props.hasSufficientBalance ? t('components.extraTicketsModal.redirectedToKryptonim') : '',
}))
</script>
<style scoped>
.title-container {
  margin-bottom: 1rem;
  text-align: left;
}

.flare {
  width: 100%;
  position: absolute;
  filter: blur(4px);
  overflow: hidden;
  top: 0px;
  left: 0px;
  background: radial-gradient(104.64% 67.93% at 115.38% 32.81%, #F1E6FA 0%, rgba(241, 230, 250, 0.00) 100%);
  background-clip: text;
  color: transparent;
  transition: all 0.3s;
  mix-blend-mode: plus-lighter;
  pointer-events: none;
}
</style>