<template>
  <div class="relative rounded-2xl overflow-hidden">
    <!-- Background image -->
    <div class="absolute inset-0">
      <img
        src="@/assets/images/PTScore/pt-bg.png"
        alt=""
        class="w-full h-full background-size: auto 100%"
      >
    </div>

    <!-- Content -->
    <div class="relative z-10 flex items-center justify-between gap-6 p-6">
      <!-- Left side: Text -->
      <div class="flex flex-col gap-3 flex-1">
        <div>
          <h3 class="text-light1 text-2xl leading-[28.8px]">
            {{ t('rewards.PTScore.title', { tier: tierLetter }) }}
          </h3>
          <p class="text-purple-gray text-xs font-normal leading-[18px] mt-0.5">
            {{ t('rewards.PTScore.percentage') }}
            <span class="text-light1 font-semibold">
              {{ (tier.PtRelativeProbIncrease * 100).toFixed(1) }}%
            </span>
          </p>
          <div class="flex flex-col gap-0.5 mt-1 text-sm">
            <span class="text-light1 font-semibold">
              {{ t('rewards.PTScore.tierLabel', { tier: tierLetter }) }}
            </span>

            <div
              v-for="(p, i) in tier.prizes"
              :key="i"
              class="flex flex-wrap ml-2"
            >
              <span class="text-purple-gray">
                {{ t('rewards.PTScore.tierText', {
                  prizeName: p.name,
                  baseProbability: p.baseProbability,
                  boostedProbability: p.boostedProbability,
                }) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Guaranteed Reward info -->
        <div class="flex items-center gap-2">
          <!-- Gift icon -->
          <div
            class="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0
                    bg-dark1/90
                    border border-blue-gray/10
                    backdrop-blur-sm
                    shadow-[inset_0_-28px_24px_-16px] shadow-light1/10"
          >
            <img
              src="@/assets/images/PTScore/pt-gift.png"
              alt="Gift"
              class="w-4 h-4 object-contain"
            >
          </div>
          <span class="text-light1 text-xs font-medium leading-[18px]">
            {{ t('rewards.PTScore.guaranteedReward', { score: tier.ptScoreThreshold }) }}
          </span>
        </div>
      </div>

      <!-- Right side: Circular Progress -->
      <div class="relative w-[120px] h-[120px] flex-shrink-0">
        <!-- Outer gradient ring -->
        <div
          v-if="progress > 0"
          class="absolute inset-0 rounded-full"
          :style="progressRingStyle"
        />

        <!-- Inactive ring -->
        <div
          v-else
          class="absolute inset-0 rounded-full bg-dark3/50"
        />

        <!-- Inner dark ring -->
        <div class="absolute inset-[16px] rounded-full" />

        <!-- Knob -->
        <div
          v-if="progress > 0"
          class="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div
            class="w-3 h-3 rounded-full bg-light1"
            :style="knobStyle"
          />
        </div>

        <!-- Center text -->
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-light1 text-2xl leading-[28.8px]">
            {{ tier.ptScore }}/{{ tier.ptScoreThreshold }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTranslation } from '@/composables/use-i18n'
import type { PTTier } from '@/composables/use-wheel-pulls'

const { t } = useTranslation()

const props = defineProps<{
  tier: PTTier
}>()

const tierLetter = computed(() => {
  // Extract letter from tier name
  return props.tier.tier.replace('Tier', '')
})

const MIN_VISIBLE_PROGRESS = 0.000001

const progress = computed(() => {
  if (props.tier.ptScore <= 0) {
    return MIN_VISIBLE_PROGRESS
  }

  return Math.min(
    props.tier.ptScore / props.tier.ptScoreThreshold,
    1,
  )
})

const progressRingStyle = computed(() => {
  const angle = progress.value * 360

  return {
    background: `
      conic-gradient(
        #C95CFF 0deg,
        #5858F5 ${Math.min(angle, 180)}deg,
        #FF9D5C ${angle}deg,
        #262638 ${angle}deg,
        #262638 360deg
      )
    `,
    mask: `
      radial-gradient(
        farthest-side,
        transparent calc(100% - 13px),
        black calc(100% - 16px)
      )
    `,
    WebkitMask: `
      radial-gradient(
        farthest-side,
        transparent calc(100% - 13px),
        black calc(100% - 16px)
      )
    `,
    boxShadow: '0px 0px 24px rgba(197, 174, 255, 0.35)',
  }
})

const knobStyle = computed(() => {
  const angle = progress.value * 360 - 90
  return {
    transform: `rotate(${angle}deg) translate(54px)`,
  }
})
</script>