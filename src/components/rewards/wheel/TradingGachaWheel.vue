<template>
  <div class="relative rounded-full h-[320px] sm:h-[404px] w-full">
    <!-- Timer overlay -->
    <Transition name="zoom-in">
      <SpinTimer
        v-if="showTimer"
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] select-none"
        :end-date-timestamp="endDateTimestamp"
        :progress="progress"
      />
    </Transition>

    <!-- Timer background -->
    <img
      v-if="showTimer"
      :src="timerBg"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[90] h-[296px] select-none pointer-events-none"
    >

    <!-- Tiered wheel background -->
    <template v-else>
      <!-- GLOW BG -->
      <img
        :src="assets.bg"
        class="absolute hidden md:block w-[960px]
               top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
               z-[10] select-none pointer-events-none"
        alt=""
      >

      <!-- BORDER RING -->
      <img
        :src="assets.border"
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
               size-[326px] sm:size-[410px] z-[70] object-contain
               pointer-events-none select-none"
        alt=""
      >
    </template>

    <!-- Wheel With Prizes -->
    <TradingGachaWithPrizes
      class="absolute size-[320px] sm:size-[404px] overflow-hidden
             top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
             select-none z-[80]"
      :target-section="targetSection"
      :spinning="spinning"
      @click="emit('click')"
      @finished="onReset"
    />

    <!-- Tier Arrow -->
    <img
      v-if="!showTimer"
      :src="assets.arrow"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
             size-[56px] md:size-[79px] z-[95] object-contain
             pointer-events-none select-none"
      alt=""
    >
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import TradingGachaWithPrizes from './TradingGachaWithPrizes.vue'
import SpinTimer from '@/components/ui/timer/SpinTimer.vue'

import timerBg from '@/assets/images/wheel/timer-bg.png'

import bronzeBg from '@/assets/images/wheel/bronze-wheel-bg.png'
import bronzeBorder from '@/assets/images/wheel/bronze-wheel-border.png'
import bronzeArrow from '@/assets/images/wheel/bronze-wheel-arrow.png'

import silverBg from '@/assets/images/wheel/silver-wheel-bg.png'
import silverBorder from '@/assets/images/wheel/silver-wheel-border.png'
import silverArrow from '@/assets/images/wheel/silver-wheel-arrow.png'

import goldBg from '@/assets/images/wheel/gold-wheel-bg.png'
import goldBorder from '@/assets/images/wheel/gold-wheel-border.png'
import goldArrow from '@/assets/images/wheel/gold-wheel-arrow.png'

const props = defineProps<{
  spinning: boolean
  targetSection?: string
  showTimer: boolean
  endDateTimestamp: number
  progress: number
  tier: 'bronze' | 'silver' | 'gold'
}>()

const emit = defineEmits<{
  (e: 'finished'): void
  (e: 'click'): void
  (e: 'reset'): void
}>()

const assets = computed(() => {
  if (props.tier === 'gold') return { bg: goldBg, border: goldBorder, arrow: goldArrow }
  if (props.tier === 'silver') return { bg: silverBg, border: silverBorder, arrow: silverArrow }
  return { bg: bronzeBg, border: bronzeBorder, arrow: bronzeArrow }
})

function onReset() {
  emit('finished')
  emit('reset')
}
</script>

<style scoped>
.zoom-in-enter-active {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  transition-delay: 0.3s;
}

.zoom-in-leave-active {
  transition: transform 0.1s ease-in-out, opacity 0.1s ease-in-out;
  transition-delay: 0s;
}

.zoom-in-enter-from,
.zoom-in-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>