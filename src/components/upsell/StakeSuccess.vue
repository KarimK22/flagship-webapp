<template>
  <div class="flex flex-col justify-between gap-4 w-[90vw] md:w-[388px] min-h-[500px] md:min-h-[700px]">
    <div class="z-10 flex flex-col gap-2">
      <h2 class="text-light1 text-[32px] leading-7 tracking-[-1.28px]">
        {{ t('components.stakeSuccess.congrats') }}
      </h2>
      <div class="relative">
        <h1 class="text-light1 font-medium text-[45px] leading-10 tracking-[-2.25px] whitespace-pre-line">
          {{ t('components.stakeSuccess.lingoPassActive') }}
        </h1>
        <h1 class="text-light1 font-medium flare text-[45px] leading-10 tracking-[-2.25px] whitespace-pre-line">
          {{ t('components.stakeSuccess.lingoPassActive') }}
        </h1>
      </div>
      <span class="text-lavender text-xl leading-6 tracking-[-0.8px] pt-2 pb-2">
        {{ t('components.stakeSuccess.accumulatingPowerMiles') }}<br>
        {{ t('components.stakeSuccess.powerMilesDescription') }}<br>
        <span class="text-[#FFBC70]">{{ powerMilesPerDayOnLatestStake }} {{ t('components.stakeSuccess.powerMilesPerDay') }}</span>
      </span>
    </div>
    <div class="flex justify-center">
      <div class="p-4 pt-0 w-full flex justify-center mt-4 z-10">
        <GlowButton
          :color="EButtonColor.BLUE"
          class="w-full"
          @click="handleExitUpsell"
        >
          <span>
            {{ t('components.stakeSuccess.thankYou') }}
          </span>
        </GlowButton>
      </div>
    </div>
  </div>
  <img
    :src="successBg"
    alt="Success"
    class="w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
  >
</template>

<script setup lang="ts">
import { useTranslation } from '@/composables/use-i18n'
import successBg from '@/assets/images/upsell-success-bg.png'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import router from '@/router'
import { LingoRouteName } from '@/router/routes'
import { EButtonColor } from '@/types/shared/button'
import { useStakes } from '@/composables/contracts/stakes'
import { computed } from 'vue'
import { formatNumberToUS } from '@/composables/helpers'

const { t } = useTranslation()
const { myStakes } = useStakes()

const powerMilesPerDayOnLatestStake = computed(() => {
  const stake = myStakes.value.stakes[0]
  if (!stake) {
    return 0
  }
  return formatNumberToUS(stake.dailyPowerWithBoost)
})

const handleExitUpsell = () => {
  router.push({ name: LingoRouteName.HOME })
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
