<template>
  <div class="relative rounded-full h-[320px] sm:h-[404px] w-full">
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

    <!-- Wheel With Prizes -->
    <TieredStakingWheelWithPrizes
      class="absolute size-[320px] sm:size-[404px] overflow-hidden
             top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
             select-none z-[80]"
      :prizes="prizes"
      :target-section="targetSection"
      :spinning="spinning"
      @click="emit('click')"
      @finished="onReset"
    />

    <!-- Tier Arrow -->
    <img
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
import TieredStakingWheelWithPrizes from './TieredStakingWheelWithPrizes.vue'
import type { TieredStakingWheelPrize } from '@/services/api'

import bronzeBg from '@/assets/images/wheel/bronze-wheel-bg.png'
import bronzeBorder from '@/assets/images/wheel/bronze-wheel-border.png'
import bronzeArrow from '@/assets/images/wheel/bronze-wheel-arrow.png'

import silverBg from '@/assets/images/wheel/silver-wheel-bg.png'
import silverBorder from '@/assets/images/wheel/silver-wheel-border.png'
import silverArrow from '@/assets/images/wheel/silver-wheel-arrow.png'

import goldBg from '@/assets/images/wheel/gold-wheel-bg.png'
import goldBorder from '@/assets/images/wheel/gold-wheel-border.png'
import goldArrow from '@/assets/images/wheel/gold-wheel-arrow.png'

import diamondBg from '@/assets/images/wheel/diamond-wheel-bg.png'
import diamondBorder from '@/assets/images/wheel/diamond-wheel-border.png'
import diamondArrow from '@/assets/images/wheel/diamond-wheel-arrow.png'

type Tier = 'bronze' | 'silver' | 'gold' | 'diamond'

const props = defineProps<{
  prizes: TieredStakingWheelPrize[]
  spinning: boolean
  targetSection?: string
  tier: Tier
}>()

const emit = defineEmits<{
  (e: 'finished'): void
  (e: 'click'): void
  (e: 'reset'): void
}>()

const assets = computed(() => {
  if (props.tier === 'gold') return { bg: goldBg, border: goldBorder, arrow: goldArrow }
  if (props.tier === 'diamond') return { bg: diamondBg, border: diamondBorder, arrow: diamondArrow }
  if (props.tier === 'silver') return { bg: silverBg, border: silverBorder, arrow: silverArrow }
  return { bg: bronzeBg, border: bronzeBorder, arrow: bronzeArrow }
})

function onReset() {
  emit('finished')
  emit('reset')
}
</script>
