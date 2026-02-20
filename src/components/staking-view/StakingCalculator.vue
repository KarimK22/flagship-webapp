<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLingoPrice } from '@/composables/contracts/lingo-price'
import { formatNumberToUS } from '@/composables/helpers'
import InlineSvg from 'vue-inline-svg'
import lingoIcon from '@/assets/images/lingo-icon.svg'

const { price } = useLingoPrice()

const amount = ref<number>(1000)
const selectedLock = ref<'3mo' | '6mo' | '12mo'>('12mo')

const lockOptions = [
  { id: '3mo' as const, label: '3 Months', short: '3M' },
  { id: '6mo' as const, label: '6 Months', short: '6M' },
  { id: '12mo' as const, label: '12 Months', short: '12M' },
]

const wheelTiers = {
  '3mo': { name: 'Silver', color: '#8A9AC2', prizes: 'Gift Cards & Merch' },
  '6mo': { name: 'Gold', color: '#FFBC70', prizes: 'Tech & Travel' },
  '12mo': { name: 'Diamond', color: '#F1E6FA', prizes: 'Luxury Watches, Supercars, LINGO Jackpots' },
}

const bonusSpinTiers = [
  { min: 250, max: 499, label: '$250+', bonusPct: 20 },
  { min: 500, max: 999, label: '$500+', bonusPct: 40 },
  { min: 1000, max: 4999, label: '$1K+', bonusPct: 60 },
  { min: 5000, max: 9999, label: '$5K+', bonusPct: 80 },
  { min: 10000, max: 24999, label: '$10K+', bonusPct: 100 },
  { min: 25000, max: Infinity, label: '$25K+', bonusPct: 150 },
]

const fiatValue = computed(() => amount.value * price.value)

function getBonusPct(usdValue: number): number {
  for (let i = bonusSpinTiers.length - 1; i >= 0; i--) {
    if (usdValue >= bonusSpinTiers[i].min) {
      return bonusSpinTiers[i].bonusPct
    }
  }
  return 0
}

const baseSpins = computed(() => Math.floor(fiatValue.value / 100))

const bonusPct = computed(() => getBonusPct(fiatValue.value))

const bonusSpins = computed(() => Math.floor(baseSpins.value * (bonusPct.value / 100)))

const totalSpins = computed(() => baseSpins.value + bonusSpins.value)

const currentWheel = computed(() => wheelTiers[selectedLock.value])

const presetAmounts = [100, 500, 1000, 5000, 10000, 50000]

const handleAmountInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const value = Number(input.value)
  if (value >= 0) amount.value = value
}

const quickExamples = [
  { stake: '$250', lock: '3mo' as const, spins: 3 },
  { stake: '$1,000', lock: '6mo' as const, spins: 16 },
  { stake: '$5,000', lock: '12mo' as const, spins: 90 },
  { stake: '$10,000', lock: '12mo' as const, spins: 200 },
  { stake: '$25,000', lock: '12mo' as const, spins: 625 },
]
</script>

<template>
  <div class="calculator-outer">
    <!-- Header -->
    <div class="flex flex-col gap-1 mb-8 text-center">
      <h2 class="text-lavender text-3xl sm:text-4xl tracking-[-1.6px] font-semibold leading-tight">
        Stake LINGO. Spin the Wheel.
      </h2>
      <h2 class="text-purple text-3xl sm:text-4xl tracking-[-1.6px] font-semibold leading-tight">
        Win Prizes.
      </h2>
    </div>

    <!-- === Section 1: Pick Your Wheel === -->
    <div class="section-card mb-4">
      <div class="flex items-center gap-2 mb-4">
        <span class="section-number">1</span>
        <h3 class="text-lavender text-lg font-semibold tracking-[-0.4px]">Pick Your Wheel</h3>
      </div>

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

    <!-- === Section 2: How Many Spins? (Calculator) === -->
    <div class="section-card mb-4">
      <div class="flex items-center gap-2 mb-4">
        <span class="section-number">2</span>
        <h3 class="text-lavender text-lg font-semibold tracking-[-0.4px]">How Many Spins?</h3>
      </div>

      <p class="text-purple-gray text-sm mb-4 leading-5">
        <span class="text-lavender font-semibold">1 spin per $100</span> staked value. Bigger stakes unlock <span class="text-amber-soft font-semibold">bonus %</span> extra spins!
      </p>

      <!-- Amount Input -->
      <div class="mb-3">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs text-purple-gray font-semibold tracking-[0.42px]">Stake Amount</span>
          <span class="text-xs text-purple-gray">
            ~<span class="text-soft-gray">${{ formatNumberToUS(fiatValue) }}</span> USD
          </span>
        </div>
        <div class="input-field">
          <InlineSvg
            :src="lingoIcon"
            class="size-7 flex-shrink-0"
            unique-ids="calc-lingo"
          />
          <input
            type="number"
            class="flex-1 text-lavender text-2xl sm:text-3xl tracking-[-1.2px] bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            :value="amount"
            @input="handleAmountInput"
          >
          <span class="text-purple-gray text-xs font-semibold">LINGO</span>
        </div>
      </div>

      <!-- Preset Chips -->
      <div class="flex flex-wrap gap-1.5 mb-5">
        <button
          v-for="val in presetAmounts"
          :key="val"
          class="preset-chip"
          :class="{ 'preset-chip--active': amount === val }"
          @click="amount = val"
        >
          {{ formatNumberToUS(val) }}
        </button>
      </div>

      <!-- Bonus Tiers -->
      <div class="bonus-tiers-row">
        <span class="text-xs text-purple-gray font-semibold mb-2 block">Bonus Spin Tiers</span>
        <div class="flex flex-wrap gap-1.5">
          <div
            v-for="tier in bonusSpinTiers"
            :key="tier.min"
            class="bonus-tier-chip"
            :class="{ 'bonus-tier-chip--active': fiatValue >= tier.min }"
          >
            <span class="text-xs font-semibold">{{ tier.label }}</span>
            <span class="text-[10px] text-amber-soft">+{{ tier.bonusPct }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- === Spin Results === -->
    <div class="results-card">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <!-- Wheel Tier -->
        <div class="flex flex-col items-center gap-1 min-w-[80px]">
          <span class="text-xs text-purple-gray font-semibold uppercase tracking-wider">Wheel</span>
          <div class="flex items-center gap-1.5">
            <div
              class="w-3 h-3 rounded-full"
              :style="{ background: currentWheel.color }"
            />
            <span
              class="text-xl font-bold tracking-[-0.5px]"
              :style="{ color: currentWheel.color }"
            >
              {{ currentWheel.name }}
            </span>
          </div>
        </div>

        <!-- Divider -->
        <div class="hidden sm:block w-px h-12 bg-[rgba(255,255,255,0.06)]" />

        <!-- Base Spins -->
        <div class="flex flex-col items-center gap-1 min-w-[70px]">
          <span class="text-xs text-purple-gray font-semibold uppercase tracking-wider">Base</span>
          <span class="text-lavender text-2xl font-bold tracking-[-1px]">{{ baseSpins }}</span>
        </div>

        <!-- Bonus -->
        <div class="flex flex-col items-center gap-1 min-w-[70px]">
          <span class="text-xs text-purple-gray font-semibold uppercase tracking-wider">Bonus ({{ bonusPct }}%)</span>
          <span class="text-amber-soft text-2xl font-bold tracking-[-1px]">+{{ bonusSpins }}</span>
        </div>

        <!-- Divider -->
        <div class="hidden sm:block w-px h-12 bg-[rgba(255,255,255,0.06)]" />

        <!-- Total -->
        <div class="flex flex-col items-center gap-1 total-spins-highlight">
          <span class="text-xs text-purple-gray font-semibold uppercase tracking-wider">Total Spins</span>
          <span class="text-lavender text-4xl font-bold tracking-[-2px]">{{ totalSpins }}</span>
        </div>
      </div>
    </div>

    <!-- === Section 3: Quick Examples === -->
    <div class="section-card mt-4">
      <div class="flex items-center gap-2 mb-4">
        <span class="section-number">3</span>
        <h3 class="text-lavender text-lg font-semibold tracking-[-0.4px]">Quick Examples</h3>
      </div>

      <!-- Table Header -->
      <div class="example-header">
        <span>Stake</span>
        <span>Lock</span>
        <span>Wheel</span>
        <span>Spins</span>
      </div>

      <!-- Table Rows -->
      <div
        v-for="(ex, i) in quickExamples"
        :key="i"
        class="example-row cursor-pointer"
        @click="selectedLock = ex.lock"
      >
        <span class="text-lavender font-semibold">{{ ex.stake }}</span>
        <span class="text-purple-gray">{{ lockOptions.find(l => l.id === ex.lock)?.label }}</span>
        <span
          class="font-semibold"
          :style="{ color: wheelTiers[ex.lock].color }"
        >
          {{ wheelTiers[ex.lock].name }}
        </span>
        <span class="text-lavender font-bold">{{ ex.spins }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calculator-outer {
  position: relative;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  border-radius: 24px;
  padding: 28px 24px;
  background: rgba(20, 20, 31, 0.88);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(88, 88, 245, 0.1);
  overflow: hidden;
}

.calculator-outer::before {
  content: "";
  position: absolute;
  top: -100px;
  right: -80px;
  width: 240px;
  height: 240px;
  background: rgba(88, 88, 245, 0.06);
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}

.calculator-outer::after {
  content: "";
  position: absolute;
  bottom: -80px;
  left: -60px;
  width: 200px;
  height: 200px;
  background: rgba(201, 92, 255, 0.05);
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
}

.section-card {
  background: rgba(12, 12, 20, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  padding: 20px;
}

.section-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: rgba(88, 88, 245, 0.15);
  border: 1px solid rgba(88, 88, 245, 0.3);
  color: #5858F5;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
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

/* Input */
.input-field {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(12, 12, 20, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 12px 14px;
  transition: border-color 0.2s ease;
}

.input-field:focus-within {
  border-color: rgba(88, 88, 245, 0.3);
}

.preset-chip {
  padding: 5px 12px;
  border-radius: 9999px;
  background: rgba(38, 38, 56, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.04);
  color: var(--color-purple-gray);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preset-chip:hover {
  background: rgba(88, 88, 245, 0.12);
  border-color: rgba(88, 88, 245, 0.2);
  color: var(--color-lavender);
}

.preset-chip--active {
  background: rgba(88, 88, 245, 0.18);
  border-color: rgba(88, 88, 245, 0.35);
  color: var(--color-lavender);
}

/* Bonus Tiers */
.bonus-tier-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 12px;
  border-radius: 10px;
  background: rgba(20, 20, 31, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.04);
  color: var(--color-purple-gray);
  transition: all 0.2s ease;
}

.bonus-tier-chip--active {
  background: rgba(255, 157, 92, 0.08);
  border-color: rgba(255, 157, 92, 0.2);
  color: var(--color-lavender);
}

/* Results Card */
.results-card {
  background: linear-gradient(135deg, rgba(88, 88, 245, 0.06) 0%, rgba(201, 92, 255, 0.04) 100%);
  border: 1px solid rgba(88, 88, 245, 0.15);
  border-radius: 18px;
  padding: 24px;
}

.total-spins-highlight {
  position: relative;
  padding: 8px 20px;
  border-radius: 14px;
  background: rgba(88, 88, 245, 0.08);
}

/* Quick Examples Table */
.example-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 0.7fr;
  gap: 8px;
  padding: 8px 12px;
  margin-bottom: 2px;
  font-size: 11px;
  font-weight: 700;
  color: var(--color-purple-gray);
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.example-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 0.7fr;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
  transition: background 0.15s ease;
}

.example-row:hover {
  background: rgba(88, 88, 245, 0.06);
}

.example-row:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}
</style>
