<template>
  <div class="flex flex-col items-center mt-8">
    <TooltipWrapper>
      <span class="text-lavender text-lg mb-4">
        Expected value: {{ expectedValue }}
      </span>
      <template #content>
        <TooltipContent
          :title="'Expected Value (EV):'"
          :description="`Represents the average return from spinning the wheel over time, based on the probability and value of each possible prize.`"
        />
      </template>
    </TooltipWrapper>

    <div class="flex flex-wrap justify-center gap-4 mt-4">
      <!-- COMMON -->
      <div
        class="flex items-center gap-2 px-4 py-2 rounded-xl relative overflow-hidden min-w-[140px] border"
        :style="{
          backgroundImage: `url(${commonBg})`,
          borderColor: '#5EB85166'
        }"
      >
        <img :src="commonPoint" class="w-2 h-2" />
        <span class="text-white text-sm font-medium">Common</span>
        <img :src="commonPercent" class="w-10 h-10 ml-auto" />
      </div>

      <!-- RARE -->
      <div
        class="flex items-center gap-2 px-4 py-2 rounded-xl relative overflow-hidden min-w-[140px] border"
        :style="{
          backgroundImage: `url(${rareBg})`,
          borderColor: '#C95CFF66'
        }"
      >
        <img :src="rarePoint" class="w-2 h-2" >
        <span class="text-white text-sm font-medium">Rare</span>
        <img :src="rarePercent" class="w-10 h-10 ml-auto" >
      </div>

      <!-- EPIC -->
      <div
        class="flex items-center gap-2 px-4 py-2 rounded-xl relative overflow-hidden min-w-[140px] border"
        :style="{
          backgroundImage: `url(${epicBg})`,
          borderColor: '#FF9D5C29'
        }"
      >
        <img :src="epicPoint" class="w-2 h-2" >
        <span class="text-white text-sm font-medium">Epic</span>
        <img :src="epicPercent" class="w-10 h-10 ml-auto" >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import commonBg from '@/assets/images/wheel/common-bg.png'
import rareBg from '@/assets/images/wheel/rare-bg.png'
import epicBg from '@/assets/images/wheel/epic-bg.png'

import commonPoint from '@/assets/images/wheel/common-point.png'
import rarePoint from '@/assets/images/wheel/rare-point.png'
import epicPoint from '@/assets/images/wheel/epic-point.png'

import commonPercent from '@/assets/images/wheel/common-rarity.png'
import rarePercent from '@/assets/images/wheel/rare-rarity.png'
import epicPercent from '@/assets/images/wheel/epic-rarity.png'
import TooltipWrapper from '../../TooltipWrapper.vue'
import TooltipContent from '../../TooltipContent.vue'

type Tier = 'silver' | 'gold' | 'diamond'

const props = defineProps<{
  tier?: Tier
}>()

const expectedValue = computed(() => {
  if (!props.tier) return '$4.93'

  const byTier: Record<Tier, string> = {
    silver: '$4.51',
    gold: '$7',
    diamond: '$13.3',
  }

  return byTier[props.tier]
})
</script>

<style scoped>
div[style*="background-image"] {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
</style>