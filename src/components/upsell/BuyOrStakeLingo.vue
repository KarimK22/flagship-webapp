<template>
  <BaseModal
    :model-value="modelValue"
    class="gap-0 !rounded-2xl w-[420px] min-h-[700px] px-4 flex flex-col justify-between"
    @update:model-value="updateModelValue"
  >
    <!-- Content (with higher z-index) -->
    <div class="z-10 w-full text-lavender flex flex-col">
      <div class="relative w-[336px]">
        <h1
          class="text-light1 font-medium text-[45px] leading-10 tracking-[-2.25px]"
        >
          {{ $t('buyOrStakeLingo.title') }}
        </h1>
        <h1
          class="text-light1 font-medium flare text-[45px] leading-10 tracking-[-2.25px]"
        >
          {{ $t('buyOrStakeLingo.title') }}
        </h1>
      </div>
      <div class="mt-4 flex flex-col gap-1">
        <span
          class="text-xl text-justify md:text-[20px] leading-5 md:leading-6 tracking-[-0.8px] whitespace-pre-line"
          v-html="$t('buyOrStakeLingo.description', { entries })"
        />
      </div>
    </div>

    <template
      #footer
    >
      <div class="w-full flex items-center justify-center">
        <GlowButton
          :color="EButtonColor.BLUE"
          class="w-full"
          @click="handleClick"
        >
          <span v-if="shouldBuyLingo"> {{ $t('buyOrStakeLingo.buy') }} </span>
          <span v-else> {{ $t('buyOrStakeLingo.stake') }} </span>
        </GlowButton>
      </div>
    </template>
    <img
      :src="successBg"
      alt="Success"
      class="w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
  </BaseModal>
</template>

<script setup lang="ts">
import successBg from '@/assets/images/upsell-success-bg.png'
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import { EButtonColor } from '@/types/shared/button'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import mixpanel from 'mixpanel-browser'
import { LingoRouteName, lingoRoutePath } from '@/router/routes'
import { computed, watch } from 'vue'
import { useLingoPrice } from '@/composables/contracts/lingo-price'
import { useStakes } from '@/composables/contracts/stakes'
import { useRouter } from 'vue-router'
import { redirectToService } from '@/composables/helpers'
import { useGetMe } from '@/composables/get-me'
import { useBalance } from '@/composables/contracts/balance'

const props = defineProps<{
  modelValue: boolean
}>()

const { price } = useLingoPrice()
const router = useRouter()
const { tokenBalance } = useBalance()
const { accountAddress } = useGetMe()
const SMASH_POWER_MILES_COST = 100

const { calculatePowerPerDay } = useStakes()

const getPowerMilesPerUsd = (usdAmount: number) => {
  const amount = usdAmount / price.value
  const lockDuration = 365
  const powerMilesPerDay = calculatePowerPerDay(amount)
  return powerMilesPerDay * lockDuration
}

const entries = computed(() => {
  const usdAmount = 10
  const powerMilesPerUsd = getPowerMilesPerUsd(usdAmount)
  return Math.floor(powerMilesPerUsd / SMASH_POWER_MILES_COST)
})

watch(() => props.modelValue, (val) => {
  if (val) {
    mixpanel.track('Get Started Popup View')
  }
})

const shouldBuyLingo = computed(() => {
  return tokenBalance.value <= 0
})

const handleClick = () => {
  if (shouldBuyLingo.value) {
    buyLingo()
  } else {
    goToStake()
  }
}

const buyLingo = () => {
  if (!accountAddress.value) {
    return
  }

  mixpanel.track('Buy LINGO', {
    entryPoint: 'getStartedPopup',
  })
  redirectToService('https://buy.kryptonim.com/redirect-form', {
    currency: 'USD',
    convertedCurrency: 'LINGO',
    amount: 10,
    blockchain: 'Base',
    address: accountAddress.value,
    theme: 'dark',
    successUrl: `${window.location.origin}${lingoRoutePath[LingoRouteName.STAKING_NEW]}?entryPoint=getStartedPopup`,
  })
}

function goToStake() {
  mixpanel.track('Staking Started', {
    entryPoint: 'getStartedPopup',
  })
  emit('update:modelValue', false)
  router.replace({ name: LingoRouteName.STAKING_NEW, query: { presetAmount: '1500' } })
}

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const updateModelValue = (val: boolean) => {
  emit('update:modelValue', val)
}
</script>
<style>
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
