<template>
  <BaseModal
    :model-value="modelValue"
    class="gap-0 p-0 !rounded-2xl w-[96vw] md:w-auto !max-w-[none] max-h-[96vh] md:max-h-[90%] h-auto"
    @update:model-value="updateModelValue"
  >
    <!-- Content (with higher z-index) -->
    <div class="z-10 w-full md:w-[640px] text-lavender">
      <div class="flex flex-col w-full p-8 pt-12">
        <h2 class=" text-3xl md:text-[40px] leading-8 font-normal pr-16 tracking-[-2px]">
          <span v-html="$t('components.afterFreeSmashModal.title', { entries: entries })"></span>
        </h2>
        <div class="mt-6 flex flex-col gap-1">
          <span class="md:pr-18 text-xl md:text-[20px] leading-4 md:leading-6 tracking-[-0.6px]">
            <span v-html="$t('components.afterFreeSmashModal.joinFor10', { entries: entries })"></span>
            <span class="list-item ml-5 marker:text-lavender" v-html="$t('components.afterFreeSmashModal.higherOdds', { entries: entries })"></span>
            <span class="list-item ml-5 marker:text-lavender">{{ $t('components.afterFreeSmashModal.autoRenewing') }}</span>
          </span>
        </div>
      </div>
      <img
        :src="rewards"
        alt="rewards"
        class="w-full h-[100px] md:h-[200px] object-contain md:object-cover"
      >
      <div class="p-8 pr-16">
        <span class="text-3xl md:text-[36px] leading-6 md:leading-8 tracking-[-1.8px]">
          <span v-html="$t('components.afterFreeSmashModal.passHoldersWin')"></span>
        </span>
      </div>
    </div>

    <template
      #footer
    >
      <div class="p-4 w-full flex gap-4 items-center justify-center pb-8 pt-4 md:pt-9 relative">
        <span class="text-[32px] absolute top-10 md:top-1/2 left-16 md:left-50 -translate-x-1/2 -translate-y-1/2 z-10">👉</span>
        <GlowButton
          :color="EButtonColor.BLUE"
          class="w-[188px]"
          @click="goToStake"
        >
          <span> {{ $t('components.afterFreeSmashModal.getPassNow') }} </span>
        </GlowButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import rewards from '@/assets/images/rewards-options-flayer.png'
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import { EButtonColor } from '@/types/shared/button'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import mixpanel from 'mixpanel-browser'
import { LingoRouteName } from '@/router/routes'
import { computed, watch } from 'vue'
import { EUpsellSteps } from '@/types/staking'
import { useLingoPrice } from '@/composables/contracts/lingo-price'
import { useStakes } from '@/composables/contracts/stakes'
import { useRouter } from 'vue-router'
import { useDynamicHome } from '@/composables/dynamic-home'
import { useUpsellModals } from '@/composables/upsell-modals'

const props = defineProps<{
  modelValue: boolean
}>()

const { price } = useLingoPrice()
const router = useRouter()
const SMASH_POWER_MILES_COST = 100

const { calculatePowerPerDay } = useStakes()
const { persistentPrizeData } = useDynamicHome()
const { showUpsellModal, upsellStep } = useUpsellModals()

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
    mixpanel.track('After Free Smash Modal Opened')
  }
})

function goToStake() {
  const url = new URL(window.location.href)
  const isFreeAsteroidParam = url.searchParams.get('fs_init')
  const isBuySelectorParam = url.searchParams.get('fs_step') === EUpsellSteps.BUY_SELECTOR
  if (isBuySelectorParam || !!persistentPrizeData.value?.code) {
    emit('update:modelValue', false)
    upsellStep.value = EUpsellSteps.BUY_SELECTOR
    showUpsellModal.value = true
    return
  }
  const random = Math.random()
  const variant = random < 0.5 ? 'basic' : 'simplified_select_amount_only'
  mixpanel.people.set({
    $variant: variant,
  })

  if (isFreeAsteroidParam === 'true' && variant === 'simplified_select_amount_only') {
    mixpanel.track('Staking Started', {
      entryPoint: 'freeAsteroidUpsellPopup',
      variant: 'simplified_select_amount_only',
    })
    emit('update:modelValue', false)
    router.replace({ name: LingoRouteName.HOME, query: { fs_continue: 'true', fs_step: EUpsellSteps.BUY_SELECTOR } })

  } else {
    // clear the url params
    url.searchParams.delete('fs_init')
    url.searchParams.delete('lp_var')
    url.searchParams.delete('lp_code')
    window.history.replaceState({}, '', url.toString())
    mixpanel.track('Staking Started', {
      entryPoint: 'freeAsteroidUpsellPopup',
      variant: 'basic',
    })
    emit('update:modelValue', false)
    router.replace({ name: LingoRouteName.STAKING_NEW, query: { presetAmount: '1500' } })
  }
}

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'on-click-stake'): void
}>()

const updateModelValue = (val: boolean) => {
  emit('update:modelValue', val)
}
</script>
