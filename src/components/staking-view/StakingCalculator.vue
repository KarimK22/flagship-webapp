<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLingoPrice } from '@/composables/contracts/lingo-price'
import { useGetMe } from '@/composables/get-me'
import { useStakes } from '@/composables/contracts/stakes'
import { formatNumberToUS } from '@/composables/helpers'

const { price } = useLingoPrice()
const { isConnected } = useGetMe()
const { totalStakedLingo } = useStakes()

const selectedLock = ref<'3mo' | '6mo' | '12mo'>('12mo')

const PREVIEW_USD = 2500

const lockOptions = [
  { id: '3mo' as const, label: '3 Months', short: '3M' },
  { id: '6mo' as const, label: '6 Months', short: '6M' },
  { id: '12mo' as const, label: '12 Months', short: '12M' },
]

const wheelTiers = {
  '3mo': { name: 'Silver', color: '#8A9AC2', prizes: 'Gift Cards & Merch', multiplier: 1 },
  '6mo': { name: 'Gold', color: '#FFBC70', prizes: 'Tech & Travel', multiplier: 2 },
  '12mo': { name: 'Diamond', color: '#F1E6FA', prizes: 'Luxury Watches, Supercars, LINGO Jackpots', multiplier: 3 },
}

const bonusSpinTiers = [
  { min: 250, max: 499, label: '$250+', bonusPct: 20 },
  { min: 500, max: 999, label: '$500+', bonusPct: 40 },
  { min: 1000, max: 4999, label: '$1K+', bonusPct: 60 },
  { min: 5000, max: 9999, label: '$5K+', bonusPct: 80 },
  { min: 10000, max: 24999, label: '$10K+', bonusPct: 100 },
  { min: 25000, max: Infinity, label: '$25K+', bonusPct: 150 },
]

// When disconnected, use preview data so content is visible behind the overlay
const usdAmount = computed(() => {
  if (!isConnected.value) return PREVIEW_USD
  if (!price.value || price.value <= 0) return 0
  return Math.round(totalStakedLingo.value * price.value)
})

function getBonusPct(usdValue: number): number {
  for (let i = bonusSpinTiers.length - 1; i >= 0; i--) {
    if (usdValue >= bonusSpinTiers[i].min) {
      return bonusSpinTiers[i].bonusPct
    }
  }
  return 0
}

const baseSpins = computed(() => Math.floor(usdAmount.value / 100))

const bonusPct = computed(() => getBonusPct(usdAmount.value))

const bonusSpins = computed(() => Math.floor(baseSpins.value * (bonusPct.value / 100)))

const totalSpins = computed(() => baseSpins.value + bonusSpins.value)

// === Welcome Wheel (one-time) ===
const welcomeValuePerSpin: Record<string, number> = { '3mo': 10, '6mo': 25, '12mo': 100 }
const welcomeEstValue = computed(() => totalSpins.value * (welcomeValuePerSpin[selectedLock.value] ?? 10))

// === Monthly Staking Wheel ===
const monthlyStakingTiers = [
  { name: 'Bronze', color: '#EF8674', minStake: 250, dailySpins: 1, valuePerSpin: 5 },
  { name: 'Silver', color: '#8A9AC2', minStake: 2500, dailySpins: 2, valuePerSpin: 10 },
  { name: 'Gold', color: '#FFBC70', minStake: 10000, dailySpins: 3, valuePerSpin: 25 },
  { name: 'Diamond', color: '#A8D8FF', minStake: 50000, dailySpins: 5, valuePerSpin: 50 },
]

const currentMonthlyTier = computed(() => {
  let matched = monthlyStakingTiers[0]
  for (const tier of monthlyStakingTiers) {
    if (usdAmount.value >= tier.minStake) matched = tier
  }
  return usdAmount.value >= monthlyStakingTiers[0].minStake ? matched : null
})

const monthlySpins = computed(() => currentMonthlyTier.value ? currentMonthlyTier.value.dailySpins * 30 : 0)
const monthlyEstValue = computed(() => currentMonthlyTier.value ? monthlySpins.value * currentMonthlyTier.value.valuePerSpin : 0)
</script>

<template>
  <!-- Lock Period / Wheel Selection -->
  <div class="section-card mb-4">
    <h3 class="text-lavender text-sm font-semibold tracking-[0.42px] mb-3">Lock Period</h3>
    <div class="grid grid-cols-3 gap-2">
      <button
        v-for="opt in lockOptions"
        :key="opt.id"
        class="wheel-card"
        :class="{ 'wheel-card--active': selectedLock === opt.id }"
        @click="selectedLock = opt.id"
      >
        <div
          class="wheel-dot"
          :style="{ background: wheelTiers[opt.id].color }"
        />
        <span
          class="wheel-tier-name"
          :style="{ color: wheelTiers[opt.id].color }"
        >
          {{ wheelTiers[opt.id].name }}
        </span>
        <span class="text-purple-gray text-xs mt-0.5">{{ opt.label }}</span>
        <span class="wheel-prizes">{{ wheelTiers[opt.id].prizes }}</span>
      </button>
    </div>
  </div>

  <!-- Reward Cards -->
  <div class="reward-cards-row">
    <!-- Welcome Wheel (One-time) -->
    <div class="reward-card reward-card--welcome">
      <span class="reward-card-tag">One-time</span>
      <span class="reward-card-label">Welcome Wheel</span>
      <span class="reward-card-value">{{ totalSpins }} <span class="reward-card-unit">spins</span></span>
      <span class="reward-card-sub">~${{ formatNumberToUS(welcomeEstValue) }} est. value</span>
    </div>

    <!-- Monthly Staking Wheel -->
    <div class="reward-card reward-card--monthly">
      <span class="reward-card-tag">Recurring</span>
      <span class="reward-card-label">Monthly Wheel</span>
      <span class="reward-card-value">{{ monthlySpins }} <span class="reward-card-unit">spins</span></span>
      <span class="reward-card-sub">~${{ formatNumberToUS(monthlyEstValue) }}/mo</span>
    </div>
  </div>
</template>

<style scoped>
.section-card {
  background: rgba(12, 12, 20, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  padding: 20px;
}

/* Wheel Cards */
.wheel-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px 8px;
  border-radius: 14px;
  background: rgba(20, 20, 31, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.04);
  cursor: pointer;
  transition: all 0.25s ease;
  text-align: center;
}

.wheel-card:hover {
  background: rgba(38, 38, 56, 0.6);
  border-color: rgba(255, 255, 255, 0.08);
}

.wheel-card--active {
  background: rgba(88, 88, 245, 0.08);
  border-color: rgba(88, 88, 245, 0.25);
  box-shadow: 0 0 20px rgba(88, 88, 245, 0.08);
}

.wheel-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-bottom: 2px;
  box-shadow: 0 0 8px currentColor;
}

.wheel-tier-name {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.3px;
}

.wheel-prizes {
  font-size: 11px;
  color: var(--color-purple-gray);
  line-height: 1.3;
  margin-top: 4px;
}

/* === Reward Cards (Two side-by-side) === */
.reward-cards-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.reward-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 18px 12px 14px;
  border-radius: 14px;
  background: rgba(12, 12, 20, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.reward-card--welcome {
  border-color: rgba(88, 88, 245, 0.15);
}

.reward-card--monthly {
  border-color: rgba(201, 92, 255, 0.15);
}

.reward-card-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  padding: 2px 6px;
  border-radius: 6px;
  background: rgba(88, 88, 245, 0.12);
  color: #7878ff;
}

.reward-card--monthly .reward-card-tag {
  background: rgba(201, 92, 255, 0.12);
  color: #d490ff;
}

.reward-card-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-purple-gray);
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.reward-card-value {
  font-size: 28px;
  font-weight: 800;
  color: var(--color-lavender);
  letter-spacing: -1.2px;
  line-height: 1;
}

.reward-card-unit {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-purple-gray);
  letter-spacing: 0;
}

.reward-card-sub {
  font-size: 12px;
  color: var(--color-purple-gray);
  font-weight: 500;
}
</style>
