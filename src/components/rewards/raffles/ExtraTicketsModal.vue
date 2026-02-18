<template>
  <BaseModal
    :model-value="modelValue"
    :class="currentStep === 1 ? 'gap-0 p-0 !rounded-2xl w-[96vw] md:w-auto !max-w-[none] max-h-[96vh] md:max-h-[90%] h-auto' : '!p-0 max-w-[420px]'"
    @update:model-value="(val: boolean) => emit('update:modelValue', val)"
  >
    <ExtraTicketsFirstStep
      v-if="currentStep === 1"
      :extra-tickets="extraTickets"
      :name="name"
      :variant="variant"
      :button-action="hasSufficientBalance ? startStaking : handleBuy"
      :has-sufficient-balance="hasSufficientBalance"
      :tickets-received="ticketsReceived"
      :price="price"
    />
    <div
      v-else
      class="bg-dark2 text-white py-8 px-4 rounded-2xl relative overflow-hidden max-w-[420px] sm:w-[420px] min-h-[620px] md:min-h-[708px] flex flex-col bg-cover bg-[center_24px] md:bg-top bg-no-repeat"
      :style="{ backgroundImage: `url(${stepsContent[currentStep-1].image})` }"
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
                {{ stepsContent[currentStep-1].title }}
              </h2>
              <div
                v-if="stepsContent[currentStep-1].subtitle"
                class="relative"
              >
                <h2 class="text-light1 text-[48px] leading-10 font-medium tracking-[-2.8px]">
                  {{ stepsContent[currentStep-1].subtitle }}
                </h2>
                <h2 class="flare text-light1 text-[48px] leading-10 font-medium tracking-[-2.8px]">
                  {{ stepsContent[currentStep-1].subtitle }}
                </h2>
              </div>
            </div>

            <p
              v-if="stepsContent[currentStep-1].description"
              class="text-purple-gray mb-4 max-w-[350px] text-[20px] leading-6 -tracking-[0.6px] font-normal"
              :class="{
                'font-semibold text-base leading-4 tracking-[-0.32px] mt-4': currentStep === 1,
                'text-left': currentStep === 1 && isBanner,
              }"
            >
              <span v-html="stepsContent[currentStep-1].description" />
            </p>

            <p
              v-if="stepsContent[currentStep-1].secondaryDescription"
              class="text-base leading-4 text-purple-gray font-semibold tracking-[-0.32px]"
            >
              <span v-html="stepsContent[currentStep-1].secondaryDescription" />
            </p>

            <transition name="fade">
              <LockPeriods
                v-if="stepsContent[currentStep-1].showLockPeriods"
                v-model="lockPeriod"
                :narrow="true"
                :extra-tickets="extraTickets"
                :transaction-type="TRANSACTION_TYPE.STAKE"
                class="mb-0 md:mb-3"
              />
            </transition>

            <div class="flex flex-col gap-3 mt-auto mx-4">
              <transition name="fade">
                <GlowButton
                  v-if="stepsContent[currentStep-1].buttonText"
                  :color="EButtonColor.BLUE"
                  class="w-full"
                  :loading="loadingButton"
                  :disabled="loadingButton"
                  @click="stepsContent[currentStep-1].buttonAction"
                >
                  {{ stepsContent[currentStep-1].buttonText }}
                </GlowButton>
              </transition>

              <transition name="fade">
                <p
                  v-if="stepsContent[currentStep-1].footerText"
                  class="text-sm leading-4 text-purple-gray font-semibold pt-2 text-center"
                >
                  {{ stepsContent[currentStep-1].footerText }}
                </p>
              </transition>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </BaseModal>
</template>
<script setup lang="ts">
import boostImageBanner from '@/assets/images/rewards/boost-your-odds-banner.png'
import extraTicketsCongratsImage from '@/assets/images/rewards/extra-tickets.png'
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import { useBalance } from '@/composables/contracts/balance.ts'
import type { Raffle } from '@/services/api.ts'
import { useLingoPrice } from '@/composables/contracts/lingo-price'
import { computed, ref, watch } from 'vue'
import LockPeriods from '@/components/staking-view/stake-flow/LockPeriods.vue'
import { LOCK_DURATION_ID, TRANSACTION_TYPE } from '@/types/staking.ts'
import { useStakes } from '@/composables/contracts/stakes.ts'
import mixpanel from 'mixpanel-browser'
import { useStaking } from '@/composables/contracts/staking.ts'
import { LingoRouteName, lingoRoutePath } from '@/router/routes.ts'
import { formatNumberToUS, redirectToService } from '@/composables/helpers.ts'
import { useRaffles } from '@/composables/raffles.ts'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button.ts'
import { useGetMe } from '@/composables/get-me'
import { useTranslation } from '@/composables/use-i18n'
import ExtraTicketsFirstStep from './ExtraTicketsFirstStep.vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  extraTickets: Raffle['metadata']['extraTickets']
  name?: string
  purchaseSuccessId?: string
  variant?: 'raffle' | 'banner'
}>(), {
  purchaseSuccessId: undefined,
  variant: 'raffle',
  name: '',
})

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void
}>()

const { tokenBalance, refetchTokenBalance } = useBalance()
const { refetchMyStakes } = useStakes()
const { price } = useLingoPrice()
const { stake } = useStaking()

const { accountAddress } = useGetMe()
const { t } = useTranslation()

const currentStep = ref(1)
const loadingButton = ref(false)

const minAmount = props.extraTickets.onStake?.minAmount || 0
const hasSufficientBalance = computed(() => {
  return Number(tokenBalance.value) >= minAmount
})
const lockPeriod = ref<LOCK_DURATION_ID>(LOCK_DURATION_ID.TWELVE_MONTHS)

const lockPeriodLabel = computed(() => {
  if (lockPeriod.value === LOCK_DURATION_ID.THREE_MONTHS) return '3 months'
  if (lockPeriod.value === LOCK_DURATION_ID.SIX_MONTHS) return '6 months'
  if (lockPeriod.value === LOCK_DURATION_ID.TWELVE_MONTHS) return '12 months'
  return ''
})

const ticketsReceived = computed(() => {
  if (lockPeriod.value === null) return props.extraTickets.onStake?.ticketsCountByDuration?.[LOCK_DURATION_ID.TWELVE_MONTHS] ?? 0
  return props.extraTickets.onStake?.ticketsCountByDuration?.[lockPeriod.value]
})

const isBanner = computed(() => props.variant === 'banner')

const stepsContent = computed(() => [
  {
    title: t('components.extraTicketsModal.dontMissOut'),
    subtitle: t('components.extraTicketsModal.getMoreChances', { count: ticketsReceived.value }),
    description: t('components.extraTicketsModal.holdLingoDescription', {
      amount: minAmount,
      price: formatNumberToUS(minAmount * price.value),
      tickets: ticketsReceived.value,
      prize: props.name,
    }),
    secondaryDescription: '',
    image: boostImageBanner,
    buttonText: hasSufficientBalance.value ? t('components.extraTicketsModal.continue') : t('components.extraTicketsModal.buyLingoWithCard'),
    buttonAction: hasSufficientBalance.value ? startStaking : handleBuy,
    showFooterText: !hasSufficientBalance.value,
    footerText: !hasSufficientBalance.value ? t('components.extraTicketsModal.redirectedToKryptonim') : '',
  },
  {
    title: t('components.extraTicketsModal.oneEntryOneChance'),
    subtitle: t('components.extraTicketsModal.selectEntries'),
    description: t('components.extraTicketsModal.chooseEntriesAmount', { amount: minAmount }),
    image: '',
    showLockPeriods: true,
    buttonText: t('components.extraTicketsModal.holdForPeriod', { period: lockPeriodLabel.value, entries: props.extraTickets.onStake?.ticketsCountByDuration[lockPeriod.value] }),
    buttonAction: handleStake,
  },
  {
    title: t('components.extraTicketsModal.congrats'),
    subtitle: t('components.extraTicketsModal.receivedExtraEntries', { entries: ticketsReceived.value }),
    description: t('components.extraTicketsModal.goodLuck'),
    image: extraTicketsCongratsImage,
    buttonText: t('components.extraTicketsModal.thankYou'),
    buttonAction: () => emit('update:modelValue', false),
  },
])

async function handleBuy(){
  mixpanel.track('Stake For Raffle Ticket Flow Started')
  mixpanel.track('Buy Started', {
    fiatCurrency: 'USD',
    fiatAmount: minAmount * price.value,
    lingoAmount: minAmount,
  })

  redirectToService('https://buy.kryptonim.com/redirect-form', {
    currency: 'USD',
    convertedCurrency: 'LINGO',
    convertedAmount: minAmount*1.02,
    blockchain: 'Base',
    address: accountAddress.value,
    theme: 'dark',
    successUrl: `${window.location.origin}${lingoRoutePath[LingoRouteName.REWARDS]}?tab=raffles&purchaseSuccessId=${props.purchaseSuccessId}`,
  })
}

// function setLockPeriod(period: LOCK_DURATION_ID) {
//   if (!period) return
//   lockPeriod.value = period
// }

function startStaking() {
  mixpanel.track('Stake For Raffle Ticket Flow Started')
  currentStep.value = 2
}
const { refetchRaffles, refetchMyRafflesStatus } = useRaffles()

async function handleStake() {
  if (!lockPeriod.value) {
    return
  }
  mixpanel.track('Stake For Raffle Ticket Period Selected', { amount: minAmount, lockPeriod: lockPeriod.value })

  loadingButton.value = true
  try {
    const staking = await stake(minAmount, lockPeriod.value)
    if (staking) {
      await refetchTokenBalance()
      await refetchMyStakes()
      await refetchRaffles()
      await refetchMyRafflesStatus()
      mixpanel.track('Stake For Raffle Ticket Done')
      currentStep.value = 3
    }
  } catch (error) {
    console.error(error)
  } finally {
    loadingButton.value = false
  }
}

watch(() => props.modelValue, (value) => {
  if (value && currentStep.value === 1) {
    // mixpanel.track('Stake For Raffle Ticket Pop-up View')
  } else if (!value) {
    currentStep.value = 1
  }
})

watch(() => props.purchaseSuccessId, (value) => {
  if (value) {
    currentStep.value = 2
    mixpanel.track('Buy Finished', {
      fiatCurrency: 'USD',
      fiatAmount: minAmount * price.value,
      lingoAmount: minAmount,
    })
  }
}, { immediate: true })

</script>
<style scoped>
.title-container {
  margin-bottom: 1rem;
  text-align: left;
}

.glow-title2 {
	background: radial-gradient(104.64% 67.93% at 115.38% 32.81%, #F1E6FA 0%, rgba(241, 230, 250, 0.00) 100%);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: #F1E6FA;
	mix-blend-mode: plus-lighter;
	filter: blur(1.5px);
}
.glow-title3 {
	color: #d7c9f4; /* Light purple matching your image */
	text-align: center;

	text-shadow:
		0 0 5px #d7c9f4,
		0 0 10px #d7c9f4,
		0 0 20px #d7c9f4,
		0 0 40px #b493f4,
		0 0 80px #9b6df4;

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

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Background image transition */
.raffle-card {
  transition: background-image 0.3s ease;
}

</style>