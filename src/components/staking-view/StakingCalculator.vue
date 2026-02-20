<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLingoPrice } from '@/composables/contracts/lingo-price'
import { useGetMe } from '@/composables/get-me'
import { useStakes } from '@/composables/contracts/stakes'
import { useWalletConnect } from '@/composables/wallet/use-wallet-connect'
import { formatNumberToUS, redirectToService } from '@/composables/helpers'

const { price } = useLingoPrice()
const { isConnected, accountAddress } = useGetMe()
const { totalStakedLingo } = useStakes()
const { connect } = useWalletConnect()

const selectedLock = ref<'3mo' | '6mo' | '12mo'>('12mo')
const showWheelDetails = ref(false)

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

// USD value derived from user's actual staked LINGO
const usdAmount = computed(() => {
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

const currentWheel = computed(() => wheelTiers[selectedLock.value])

const quickExamples = [
  { stake: '$250', stakeNum: 250, lock: '3mo' as const, spins: 3 },
  { stake: '$1,000', stakeNum: 1000, lock: '6mo' as const, spins: 16 },
  { stake: '$5,000', stakeNum: 5000, lock: '12mo' as const, spins: 90 },
  { stake: '$10,000', stakeNum: 10000, lock: '12mo' as const, spins: 200 },
  { stake: '$25,000', stakeNum: 25000, lock: '12mo' as const, spins: 625 },
]

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

// === Welcome Wheel detail tables ===
const welcomeWheelTiers = [
  { tier: 'Silver', lock: '3 Months', color: '#8A9AC2', valuePerSpin: '$10', prizes: 'Gift cards, merch' },
  { tier: 'Gold', lock: '6 Months', color: '#FFBC70', valuePerSpin: '$25', prizes: 'Tech gadgets, travel vouchers' },
  { tier: 'Diamond', lock: '12 Months', color: '#F1E6FA', valuePerSpin: '$100', prizes: 'Luxury watches, supercars, LINGO jackpots' },
]

// === Lock Multipliers ===
const lockMultipliers = [
  { lock: '3 Months', multiplier: '1x', wheel: 'Silver', color: '#8A9AC2' },
  { lock: '6 Months', multiplier: '2x', wheel: 'Gold', color: '#FFBC70' },
  { lock: '12 Months', multiplier: '3x', wheel: 'Diamond', color: '#F1E6FA' },
]

// === Loss aversion banner ===
const showLossAversion = computed(() => selectedLock.value !== '12mo')
const diamondPowerMiles = computed(() => usdAmount.value * wheelTiers['12mo'].multiplier)
const powerMiles = computed(() => usdAmount.value * currentWheel.value.multiplier)
const lossAmount = computed(() => {
  const diff = diamondPowerMiles.value - powerMiles.value
  return (diff * 0.11).toFixed(2)
})

const switchToDiamond = () => {
  selectedLock.value = '12mo'
}

// === Buy LINGO ===
const buyLingo = () => {
  if (!accountAddress.value) return
  redirectToService('https://buy.kryptonim.com/redirect-form', {
    currency: 'USD',
    convertedCurrency: 'LINGO',
    convertedAmount: 100,
    blockchain: 'Base',
    address: accountAddress.value,
    theme: 'dark',
    successUrl: `${window.location.href}`,
  })
}

// === Highlight matching Quick Examples row ===
const matchingExampleIndex = computed(() => {
  let bestIdx = -1
  let bestDist = Infinity
  for (let i = 0; i < quickExamples.length; i++) {
    const ex = quickExamples[i]
    if (ex.lock !== selectedLock.value) continue
    const dist = Math.abs(ex.stakeNum - usdAmount.value)
    if (dist < bestDist) {
      bestDist = dist
      bestIdx = i
    }
  }
  if (bestIdx === -1) {
    for (let i = 0; i < quickExamples.length; i++) {
      const dist = Math.abs(quickExamples[i].stakeNum - usdAmount.value)
      if (dist < bestDist) {
        bestDist = dist
        bestIdx = i
      }
    }
  }
  return bestIdx
})
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

    <!-- Not connected: Connect Wallet CTA -->
    <div
      v-if="!isConnected"
      class="connect-wallet-card mb-4"
    >
      <div class="flex flex-col items-center gap-3 py-6">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" class="text-purple-gray opacity-60">
          <path d="M19 7h-1V6a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-8a3 3 0 0 0-3-3ZM5 5h10a1 1 0 0 1 1 1v1H5a1 1 0 0 1 0-2Zm15 12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8.83A3 3 0 0 0 5 9h14a1 1 0 0 1 1 1v2h-3a2 2 0 0 0 0 4h3v1Zm0-3h-3v-2h3v2Z" fill="currentColor" />
        </svg>
        <span class="text-lavender text-lg font-semibold tracking-[-0.4px]">
          Connect wallet to see your rewards
        </span>
        <span class="text-purple-gray text-sm">
          Your staking position will determine your spins and prizes
        </span>
        <button
          class="connect-wallet-btn mt-2"
          @click="connect()"
        >
          Connect Wallet
        </button>
      </div>
    </div>

    <!-- Connected: Staked amount display + Buy LINGO -->
    <div
      v-else
      class="stake-display mb-4"
    >
      <div class="flex items-center justify-between">
        <div class="flex flex-col gap-0.5">
          <span class="text-xs text-purple-gray font-semibold tracking-[0.42px]">Your Staked Value</span>
          <div class="flex items-baseline gap-2">
            <span class="text-lavender text-2xl sm:text-3xl font-bold tracking-[-1.2px]">
              ${{ formatNumberToUS(usdAmount) }}
            </span>
            <span class="text-purple-gray text-sm">
              ~{{ formatNumberToUS(Math.floor(totalStakedLingo)) }} LINGO
            </span>
          </div>
        </div>
        <button
          class="buy-lingo-btn"
          @click="buyLingo"
        >
          Buy LINGO
        </button>
      </div>
    </div>

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

    <!-- Connected-only: Reward Cards, details, summary -->
    <template v-if="isConnected">
      <!-- Reward Cards -->
      <div class="reward-cards-row mb-2">
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

      <!-- Collapsible: Show Wheel Details -->
      <div class="mb-4">
        <button
          class="details-toggle"
          @click="showWheelDetails = !showWheelDetails"
        >
          <svg
            class="details-toggle-icon"
            :class="{ 'details-toggle-icon--open': showWheelDetails }"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          {{ showWheelDetails ? 'Hide wheel details' : 'Show wheel details' }}
        </button>

        <Transition name="details-expand">
          <div
            v-if="showWheelDetails"
            class="details-panel"
          >
            <!-- Welcome Wheel Tier Table -->
            <div class="detail-table-section">
              <h4 class="detail-table-title">Welcome Wheel Tiers</h4>
              <div class="detail-table-header detail-table-grid--welcome">
                <span>Tier</span>
                <span>Lock</span>
                <span>$/Spin</span>
                <span>Prize Examples</span>
              </div>
              <div
                v-for="row in welcomeWheelTiers"
                :key="row.tier"
                class="detail-table-row detail-table-grid--welcome"
              >
                <span class="font-semibold" :style="{ color: row.color }">{{ row.tier }}</span>
                <span class="text-purple-gray">{{ row.lock }}</span>
                <span class="text-lavender font-semibold">{{ row.valuePerSpin }}</span>
                <span class="text-purple-gray text-xs leading-tight">{{ row.prizes }}</span>
              </div>
            </div>

            <!-- Monthly Staking Wheel Tier Table -->
            <div class="detail-table-section">
              <h4 class="detail-table-title">Monthly Staking Wheel Tiers</h4>
              <div class="detail-table-header detail-table-grid--monthly">
                <span>Tier</span>
                <span>Stake Min</span>
                <span>Spins/Mo</span>
                <span>$/Spin</span>
              </div>
              <div
                v-for="row in monthlyStakingTiers"
                :key="row.name"
                class="detail-table-row detail-table-grid--monthly"
                :class="{ 'detail-table-row--active': currentMonthlyTier?.name === row.name }"
              >
                <span class="font-semibold" :style="{ color: row.color }">{{ row.name }}</span>
                <span class="text-purple-gray">${{ formatNumberToUS(row.minStake) }}+</span>
                <span class="text-lavender font-semibold">{{ row.dailySpins * 30 }}</span>
                <span class="text-lavender">${{ row.valuePerSpin }}</span>
              </div>
            </div>

            <!-- Bonus Spins Table -->
            <div class="detail-table-section">
              <h4 class="detail-table-title">Bonus Spins</h4>
              <div class="detail-table-header detail-table-grid--bonus">
                <span>Stake Amount</span>
                <span>Bonus</span>
              </div>
              <div
                v-for="tier in bonusSpinTiers"
                :key="tier.min"
                class="detail-table-row detail-table-grid--bonus"
                :class="{ 'detail-table-row--active': usdAmount >= tier.min && (tier.max === Infinity || usdAmount <= tier.max) }"
              >
                <span class="text-lavender font-semibold">{{ tier.label }}</span>
                <span class="text-amber-soft font-semibold">+{{ tier.bonusPct }}%</span>
              </div>
            </div>

            <!-- Lock Multipliers Table -->
            <div class="detail-table-section">
              <h4 class="detail-table-title">Lock Multipliers</h4>
              <div class="detail-table-header detail-table-grid--lock">
                <span>Lock Period</span>
                <span>Multiplier</span>
                <span>Wheel</span>
              </div>
              <div
                v-for="row in lockMultipliers"
                :key="row.lock"
                class="detail-table-row detail-table-grid--lock"
                :class="{ 'detail-table-row--active': row.lock === lockOptions.find(l => l.id === selectedLock)?.label }"
              >
                <span class="text-purple-gray">{{ row.lock }}</span>
                <span class="text-lavender font-bold">{{ row.multiplier }}</span>
                <span class="font-semibold" :style="{ color: row.color }">{{ row.wheel }}</span>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Loss Aversion Banner -->
      <div
        v-if="showLossAversion && usdAmount > 0"
        class="loss-aversion-banner"
      >
        <span>
          You're leaving ~${{ lossAmount }} on the table —
          <a
            class="loss-aversion-link"
            @click.prevent="switchToDiamond"
          >Switch to Diamond &rarr;</a>
        </span>
      </div>

      <!-- Sticky Summary Bar -->
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
    </template>

    <!-- Quick Examples -->
    <div class="section-card mt-4">
      <h3 class="text-lavender text-sm font-semibold tracking-[0.42px] mb-3">Quick Examples</h3>

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
        :class="{ 'example-row--matched': i === matchingExampleIndex }"
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

/* Connect Wallet Card */
.connect-wallet-card {
  background: rgba(12, 12, 20, 0.5);
  border: 1px solid rgba(88, 88, 245, 0.12);
  border-radius: 16px;
  padding: 8px 20px;
  text-align: center;
}

.connect-wallet-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 28px;
  border-radius: 12px;
  background: linear-gradient(135deg, #5858F5 0%, #7B5BF5 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.2px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.connect-wallet-btn:hover {
  background: linear-gradient(135deg, #6868FF 0%, #8B6BFF 100%);
  box-shadow: 0 0 20px rgba(88, 88, 245, 0.25);
}

/* Staked Amount Display */
.stake-display {
  background: rgba(12, 12, 20, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  padding: 16px 20px;
}

.buy-lingo-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 20px;
  border-radius: 10px;
  background: linear-gradient(135deg, #5858F5 0%, #7B5BF5 100%);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.2px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.buy-lingo-btn:hover {
  background: linear-gradient(135deg, #6868FF 0%, #8B6BFF 100%);
  box-shadow: 0 0 16px rgba(88, 88, 245, 0.2);
}

/* === Reward Cards (Two side-by-side) === */
.reward-cards-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 12px;
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

/* === Collapsible Details Toggle === */
.details-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 10px 0;
  font-size: 13px;
  font-weight: 600;
  color: #7878ff;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.details-toggle:hover {
  color: #9898ff;
}

.details-toggle-icon {
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.details-toggle-icon--open {
  transform: rotate(180deg);
}

/* === Details Panel === */
.details-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 4px;
}

.details-expand-enter-active,
.details-expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.details-expand-enter-from,
.details-expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-8px);
}

.details-expand-enter-to,
.details-expand-leave-from {
  opacity: 1;
  max-height: 1200px;
  transform: translateY(0);
}

/* === Detail Tables === */
.detail-table-section {
  background: rgba(12, 12, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 14px;
}

.detail-table-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-purple-gray);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 10px;
}

.detail-table-header {
  display: grid;
  gap: 8px;
  padding: 6px 10px;
  margin-bottom: 2px;
  font-size: 10px;
  font-weight: 700;
  color: var(--color-purple-gray);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  opacity: 0.7;
}

.detail-table-row {
  display: grid;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 13px;
  transition: background 0.15s ease;
}

.detail-table-row:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
}

.detail-table-row--active {
  background: rgba(88, 88, 245, 0.06);
  border-left: 2px solid #5858F5;
}

/* Grid variants for each table */
.detail-table-grid--welcome {
  grid-template-columns: 0.8fr 0.8fr 0.6fr 1.5fr;
}

.detail-table-grid--monthly {
  grid-template-columns: 0.8fr 1fr 0.7fr 0.6fr;
}

.detail-table-grid--bonus {
  grid-template-columns: 1fr 0.6fr;
}

.detail-table-grid--lock {
  grid-template-columns: 1fr 0.8fr 0.8fr;
}

/* Loss Aversion Banner */
.loss-aversion-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 12px;
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
}

.loss-aversion-banner::before {
  content: "\26A0";
  flex-shrink: 0;
  font-size: 16px;
}

.loss-aversion-link {
  color: #fbbf24;
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.loss-aversion-link:hover {
  color: #fde68a;
}

/* Results Card — Sticky */
.results-card {
  position: sticky;
  bottom: 0;
  z-index: 50;
  background: linear-gradient(135deg, rgba(88, 88, 245, 0.06) 0%, rgba(201, 92, 255, 0.04) 100%);
  border: 1px solid rgba(88, 88, 245, 0.15);
  border-radius: 18px;
  padding: 24px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
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

.example-row--matched {
  border-left: 3px solid #FFBC70;
  background: rgba(255, 188, 112, 0.06);
  box-shadow: inset 0 0 20px rgba(255, 188, 112, 0.04), 0 0 12px rgba(255, 188, 112, 0.03);
}

.example-row--matched:hover {
  background: rgba(255, 188, 112, 0.1);
}

.example-row:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}
</style>
