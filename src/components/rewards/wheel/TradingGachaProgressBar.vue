<template>
  <div class="w-full">
    <!-- HEADER -->
    <div class="flex items-center justify-between mb-3">
      <div class="text-purple-gray">
        <!-- GOLD -->
        <template v-if="isGoldUnlocked">
          {{ t('rewards.tradingGacha.unlockedTier') }}
          <span
            class="font-semibold"
            :class="tierTextClass"
          >
            {{ currentTierTitle }}
          </span>
        </template>

        <!-- BRONZE / SILVER -->
        <template v-else>
          {{ t('rewards.tradingGacha.yourLeftSpins') }}
          <span class="font-semibold text-lavender">
            {{ spinsLeftToNextTier }}
          </span>
          {{ t('rewards.tradingGacha.untilUnlock') }}
          <span
            class="font-semibold"
            :class="tierTextClass"
          >
            {{ nextTierTitle }}
          </span>
        </template>
      </div>
    </div>

    <!-- BAR + ICONS -->
    <div
      ref="trackRef"
      class="flex items-center w-full gap-3"
    >
      <!-- BRONZE ICON -->
      <div class="flex flex-col items-center">
        <div class="marker-number">
          {{ startThreshold }}
        </div>
        <img
          :src="bronzeIcon"
          class="marker-icon"
        >
      </div>

      <!-- BRONZE → SILVER BAR -->
      <div
        ref="bar1Ref"
        class="flex-1 h-2 rounded-full bg-dark3 overflow-hidden"
      >
        <div
          class="h-full bg-gradient-to-r from-dark1 to-bronze transition-all"
          :style="{ width: `${segment1FillPercent}%` }"
        />
      </div>

      <!-- SILVER ICON -->
      <div class="flex flex-col items-center">
        <div class="marker-number">
          {{ silverThreshold }}
        </div>
        <img
          :src="silverIcon"
          class="marker-icon"
        >
      </div>

      <!-- SILVER → GOLD BAR -->
      <div
        ref="bar2Ref"
        class="flex-1 h-2 rounded-full bg-dark3 overflow-hidden"
      >
        <div
          class="h-full bg-gradient-to-r from-dark1 to-silver transition-all"
          :style="{ width: `${segment2FillPercent}%` }"
        />
      </div>

      <!-- GOLD ICON -->
      <div class="flex flex-col items-center">
        <div class="marker-number">
          {{ goldThreshold }}
        </div>
        <img
          :src="goldIcon"
          class="marker-icon"
        >
      </div>
    </div>

    <!-- YOUR SPINS -->
    <div class="relative mt-4 h-[68px]">
      <div
        class="absolute top-0"
        :style="{ left: `${pointerLeftPx}px` }"
      >
        <div class="spin-box bg-dark3/60">
          <div
            class="spin-number"
            :class="tierReachedTextClass"
          >
            {{ currentSpins }}
          </div>
          <div class="spin-label text-muted-foreground">
            {{ t('rewards.tradingGacha.yourPulls') }}
          </div>
          <div class="spin-arrow bg-dark3/60" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { TradingGacha } from '@/composables/use-wheel-pulls'

import bronzeIcon from '@/assets/images/wheel/bronze-tier.png'
import silverIcon from '@/assets/images/wheel/silver-tier.png'
import goldIcon from '@/assets/images/wheel/gold-tier.png'
import { useTranslation } from '@/composables/use-i18n'

const props = defineProps<{
  tiers: TradingGacha[]
  currentSpins: number
}>()

const { t } = useTranslation()

const sorted = computed(() =>
  [...props.tiers].sort(
    (a, b) => a.pullsCountEligibility - b.pullsCountEligibility,
  ),
)

const bronzeTier = computed(() => sorted.value[0])
const silverTier = computed(() => sorted.value[1])
const goldTier = computed(() => sorted.value[2])

const startThreshold = computed(() => bronzeTier.value?.pullsCountEligibility ?? 0)
const silverThreshold = computed(() => silverTier.value?.pullsCountEligibility ?? 0)
const goldThreshold = computed(() => goldTier.value?.pullsCountEligibility ?? 1)

const spinsDone = computed(() => props.currentSpins)

const isGoldUnlocked = computed(() => spinsDone.value >= goldThreshold.value)

const spinsLeftToNextTier = computed(() => {
  if (spinsDone.value < silverThreshold.value) return silverThreshold.value - spinsDone.value
  if (spinsDone.value < goldThreshold.value) return goldThreshold.value - spinsDone.value
  return 0
})

const nextTierTitle = computed(() => {
  if (spinsDone.value < silverThreshold.value) return silverTier.value?.title ?? 'Silver Wheel'
  if (spinsDone.value < goldThreshold.value) return goldTier.value?.title ?? 'Gold Wheel'
  return ''
})

const segment1FillPercent = computed(() =>
  Math.min(spinsDone.value / Math.max(silverThreshold.value, 1), 1) * 100,
)

const segment2FillPercent = computed(() => {
  const range = Math.max(goldThreshold.value - silverThreshold.value, 1)
  return Math.min(Math.max((spinsDone.value - silverThreshold.value) / range, 0), 1) * 100
})

const currentTierTitle = computed(() => {
  if (spinsDone.value >= goldThreshold.value) return goldTier.value?.title ?? 'Gold Wheel'
  if (spinsDone.value >= silverThreshold.value) return silverTier.value?.title ?? 'Silver Wheel'
  return bronzeTier.value?.title ?? 'Bronze Wheel'
})

const displayTierTitle = computed(() => (isGoldUnlocked.value ? currentTierTitle.value : nextTierTitle.value))

const tierTextClass = computed(() => {
  const tt = displayTierTitle.value.toLowerCase()
  if (tt.includes('gold')) return 'text-gold'
  if (tt.includes('silver')) return 'text-silver'
  return 'text-bronze'
})

const tierReachedTextClass = computed(() => {
  if (spinsDone.value >= goldThreshold.value) return 'text-gold'
  if (spinsDone.value >= silverThreshold.value) return 'text-silver'
  return 'text-bronze'
})

const trackRef = ref<HTMLElement | null>(null)
const bar1Ref = ref<HTMLElement | null>(null)
const bar2Ref = ref<HTMLElement | null>(null)

const pointerLeftPx = ref(0)

const BOX_WIDTH = 86
const BOX_HALF = BOX_WIDTH / 2

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max)
}

async function updatePointer() {
  await nextTick()

  const track = trackRef.value
  const bar1 = bar1Ref.value
  const bar2 = bar2Ref.value
  if (!track || !bar1 || !bar2) return

  const trackRect = track.getBoundingClientRect()
  const bar1Rect = bar1.getBoundingClientRect()
  const bar2Rect = bar2.getBoundingClientRect()

  const inBar1 = spinsDone.value <= silverThreshold.value

  let x = 0
  if (inBar1) {
    x = bar1Rect.left + (bar1Rect.width * (segment1FillPercent.value / 100))
  } else {
    x = bar2Rect.left + (bar2Rect.width * (segment2FillPercent.value / 100))
  }

  const localX = x - trackRect.left

  const left = clamp(localX - BOX_HALF, 0, trackRect.width - BOX_WIDTH)
  pointerLeftPx.value = left
}

watch(
  () => [spinsDone.value, segment1FillPercent.value, segment2FillPercent.value, silverThreshold.value, goldThreshold.value],
  () => updatePointer(),
  { immediate: true },
)

function onResize() {
  updatePointer()
}

onMounted(() => {
  window.addEventListener('resize', onResize)
  updatePointer()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
.marker-icon {
  width: 26px;
  height: 26px;
  display: block;
}

.marker-number {
  font-size: 12px;
  margin-bottom: 6px;
}

.spin-box {
  position: relative;
  width: 86px;
  height: 68px;
  backdrop-filter: blur(8px);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 -4px 16px rgba(222, 206, 235, 0.15);
}

.spin-number {
  font-size: 18px;
  font-weight: 600;
  line-height: 1;
}

.spin-label {
  font-size: 12px;
  margin-top: 4px;
}

.spin-arrow {
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 10px;
  height: 10px;
}
</style>