<template>
  <div class="pl-4 pb-4 rounded-2xl bg-dark2/80 backdrop-blur-[12px] border border-orange1/16 relative">
    <img
      :src="bg"
      alt="bg"
      class="absolute inset-0 w-full h-full object-cover -z-10"
    >
    <div class="flex items-center gap-4 mb-1.5">
      <h1 class="text-4xl font-bold mb-4 mt-8 text-lavender">
        <span class="block text-[48px] leading-12 font-medium -tracking-[2.4px] mb-2">{{ $t('components.experienceEligibleStatus.reach') }}</span>
        <span class="inline-block text-[32px] leading-7 font-medium -tracking-[1.28px]"><span class="text-orange2">{{ $t('components.experienceEligibleStatus.level') }} {{ minLevel }}</span> {{ $t('components.experienceEligibleStatus.orStake') }} {{ formatNumberToUS(roundedStakeAmount) }} {{ $t('components.experienceEligibleStatus.lingoToClaim') }} </span>
      </h1>
      <LevelMedal
        class="w-[250px] sm:!w-[380px] !h-auto !mt-0"
        :level="currentLevel"
      />
    </div>
    <GlowButton
      :color="EButtonColor.PURPLE"
      class="w-full leading-6"
      @click="goToStaking"
    >
      <span class="flex items-center justify-center gap-1 ">
        <span>{{ $t('components.experienceEligibleStatus.stakeLingo') }}</span>
        <InlineSvg
          :src="lingoIcon"
          class="size-6"
        />
      </span>
    </GlowButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ExclusiveEvent } from '@/services/api.ts'
import { levelsObj } from '@/const/tiers'
import LevelMedal from '@/components/staking-view/LevelMedal.vue'
import { EButtonColor } from '@/types/shared/button.ts'
import lingoIcon from '@/assets/images/lingo-icon.svg'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import InlineSvg from 'vue-inline-svg'
import { LingoRouteName } from '@/router/routes.ts'
import { useRouter } from 'vue-router'
import bg from '@/assets/images/experiences/exlusible-status-bg.png'
import { useLingoPrice } from '@/composables/contracts/lingo-price.ts'
import { formatNumberToUS } from '@/composables/helpers.ts'
import mixpanel from 'mixpanel-browser'

const props = defineProps<{
	minLevel: ExclusiveEvent['minLevel']
	minAmount: ExclusiveEvent['minAmountStaked']
}>()

const currentLevel = computed(() =>
  levelsObj.find(level => level.value === props.minLevel) || levelsObj[0],
)
const router = useRouter()
const goToStaking = () => {
  mixpanel.track('Staking Started', {
    entryPoint: 'experiencePopup',
  })
  router.push({ name: LingoRouteName.STAKING_NEW, query: { presetAmount: roundedStakeAmount.value, redirect: 'experiences' } })
}

const { price } = useLingoPrice()

const roundedStakeAmount = computed(() => {
  const amount = props.minAmount / price.value
  return Math.ceil(amount / 100) * 100
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>