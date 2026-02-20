<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLingoPrice } from '@/composables/contracts/lingo-price'
import { useGetMe } from '@/composables/get-me'
import { useStakes } from '@/composables/contracts/stakes'
import { formatNumberToUS } from '@/composables/helpers'

const props = withDefaults(defineProps<{ demoMode?: boolean }>(), { demoMode: false })

const { price } = useLingoPrice()
const { isConnected } = useGetMe()
const { totalStakedLingo, totalPowerMiles } = useStakes()

// === Constants ===
const DEMO_LINGO = 100_000
const DEMO_PRICE = 0.025

// === Amount Input ===
const inputAmount = ref('')
const effectiveConnected = computed(() => props.demoMode || isConnected.value)

watch(effectiveConnected, (connected) => {
  if (connected && !inputAmount.value) {
    const amount = props.demoMode ? DEMO_LINGO : Math.floor(totalStakedLingo.value)
    if (amount > 0) inputAmount.value = amount.toLocaleString('en-US')
  }
}, { immediate: true })

const parsedAmount = computed(() => {
  const num = Number(inputAmount.value.replace(/,/g, ''))
  return isNaN(num) || num < 0 ? 0 : num
})

function formatInput() {
  if (parsedAmount.value > 0) {
    inputAmount.value = Math.floor(parsedAmount.value).toLocaleString('en-US')
  }
}

function setMax() {
  const max = props.demoMode ? DEMO_LINGO : Math.floor(totalStakedLingo.value)
  inputAmount.value = max.toLocaleString('en-US')
}

const effectivePrice = computed(() => props.demoMode ? DEMO_PRICE : (price.value || 0))
const usdAmount = computed(() => Math.round(parsedAmount.value * effectivePrice.value))

// === Lock Period ===
type LockId = 'flex' | '3mo' | '6mo' | '12mo'
const selectedLock = ref<LockId>('12mo')

const lockOptions = [
  { id: 'flex' as LockId, label: 'Flexible', tierName: null, tierColor: '#6D6D8F', bonusPct: 0, monthlyMult: 1, multiplierLabel: 'No bonus', isVip: false },
  { id: '3mo' as LockId, label: '3 Months', tierName: 'Silver', tierColor: '#8A9AC2', bonusPct: 20, monthlyMult: 1, multiplierLabel: '20% \u00b7 x1 monthly spins', isVip: false },
  { id: '6mo' as LockId, label: '6 Months', tierName: 'Gold', tierColor: '#FFBC70', bonusPct: 80, monthlyMult: 3, multiplierLabel: '80% \u00b7 x3 monthly spins', isVip: false },
  { id: '12mo' as LockId, label: '12 Months', tierName: 'Diamond', tierColor: '#F1E6FA', bonusPct: 180, monthlyMult: 5, multiplierLabel: '180% \u00b7 x5 monthly spins', isVip: true },
]

const currentLock = computed(() => lockOptions.find(o => o.id === selectedLock.value)!)

// === Welcome Wheel (one-time) ===
const baseSpins = computed(() => Math.floor(usdAmount.value / 100))
const bonusSpins = computed(() => Math.floor(baseSpins.value * (currentLock.value.bonusPct / 100)))
const welcomeSpins = computed(() => baseSpins.value + bonusSpins.value)
const welcomeValuePerSpin: Record<LockId, number> = { flex: 5, '3mo': 10, '6mo': 25, '12mo': 100 }
const welcomeEstValue = computed(() => welcomeSpins.value * welcomeValuePerSpin[selectedLock.value])

// === Monthly Staking Wheel ===
const monthlyBaseTiers = [
  { name: 'Bronze', color: '#EF8674', minStake: 250, dailySpins: 1, valuePerSpin: 5 },
  { name: 'Silver', color: '#8A9AC2', minStake: 2500, dailySpins: 2, valuePerSpin: 10 },
  { name: 'Gold', color: '#FFBC70', minStake: 10000, dailySpins: 3, valuePerSpin: 25 },
  { name: 'Diamond', color: '#A8D8FF', minStake: 50000, dailySpins: 5, valuePerSpin: 50 },
]

const currentMonthlyBase = computed(() => {
  let matched = monthlyBaseTiers[0]
  for (const tier of monthlyBaseTiers) {
    if (usdAmount.value >= tier.minStake) matched = tier
  }
  return usdAmount.value >= monthlyBaseTiers[0].minStake ? matched : null
})

const monthlySpins = computed(() => {
  if (!currentMonthlyBase.value) return 0
  return currentMonthlyBase.value.dailySpins * 30 * currentLock.value.monthlyMult
})

const monthlyEstValue = computed(() => {
  if (!currentMonthlyBase.value) return 0
  return monthlySpins.value * currentMonthlyBase.value.valuePerSpin
})

// === Secondary Stats ===
const displayPowerMiles = computed(() => {
  if (props.demoMode) return formatNumberToUS(510_999)
  return formatNumberToUS(Math.round(totalPowerMiles.value))
})

const displayStakedValue = computed(() => '$' + formatNumberToUS(usdAmount.value))

// === UI State ===
const showWheelDetails = ref(false)

// === Loss Aversion ===
const showLossAversion = computed(() => selectedLock.value !== '12mo' && usdAmount.value > 0)

const vipWelcomeSpins = computed(() => {
  const vipBonus = Math.floor(baseSpins.value * (180 / 100))
  return baseSpins.value + vipBonus
})
const missedWelcomeSpins = computed(() => vipWelcomeSpins.value - welcomeSpins.value)

// === Wheel Detail Prizes ===
const tierPrizes: Partial<Record<LockId, string>> = {
  '3mo': 'Gift Cards & Merch',
  '6mo': 'Tech & Travel',
  '12mo': 'Luxury Watches, Supercars, LINGO Jackpots',
}
</script>

<template>
  <div class="calc">
    <!-- 1. Amount Input -->
    <div class="calc-section">
      <div class="amount-header">
        <span class="section-label">Amount</span>
        <span class="usd-equiv">&approx; {{ displayStakedValue }}</span>
      </div>
      <div class="amount-wrap">
        <input
          v-model="inputAmount"
          type="text"
          inputmode="numeric"
          placeholder="0"
          class="amount-input"
          @blur="formatInput"
        />
        <span class="amount-token">LINGO</span>
        <button class="max-btn" @click="setMax">
          Max
        </button>
      </div>
    </div>

    <!-- 2. Lock Period Selector -->
    <div class="calc-section">
      <span class="section-label">Lock Period</span>
      <div class="lock-grid">
        <button
          v-for="opt in lockOptions"
          :key="opt.id"
          class="lock-card"
          :class="{
            'lock-card--active': selectedLock === opt.id,
            'lock-card--vip-active': opt.isVip && selectedLock === opt.id,
          }"
          @click="selectedLock = opt.id"
        >
          <div
            v-if="selectedLock === opt.id"
            class="lock-check"
          >
            <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <span class="lock-label">{{ opt.label }}</span>
          <span
            v-if="opt.tierName"
            class="lock-tier"
            :style="{ color: opt.tierColor }"
          >
            {{ opt.tierName }}
          </span>
          <span class="lock-multiplier">{{ opt.multiplierLabel }}</span>
          <span
            v-if="opt.isVip"
            class="lock-vip"
            :class="{ 'lock-vip--lit': selectedLock === opt.id }"
          >
            VIP
          </span>
        </button>
      </div>
    </div>

    <!-- 3. Reward Cards (Primary) -->
    <div class="calc-section reward-row">
      <div class="reward-card reward-card--welcome">
        <span class="reward-tag reward-tag--welcome">One-time</span>
        <span class="reward-label">Welcome Wheel</span>
        <div class="reward-hero">
          <span class="reward-number">{{ formatNumberToUS(welcomeSpins) }}</span>
          <span class="reward-unit">Spins</span>
        </div>
        <span class="reward-meta">
          {{ currentLock.tierName || 'Base' }} tier &middot; ~${{ formatNumberToUS(welcomeEstValue) }} est. value
        </span>
      </div>

      <div class="reward-card reward-card--staking">
        <span class="reward-tag reward-tag--staking">Monthly</span>
        <span class="reward-label">Staking Wheel</span>
        <div class="reward-hero">
          <span class="reward-number">{{ formatNumberToUS(monthlySpins) }}</span>
          <span class="reward-unit">Spins/mo</span>
        </div>
        <span class="reward-meta">
          {{ currentMonthlyBase?.name || '\u2014' }} tier &middot; ~${{ formatNumberToUS(monthlyEstValue) }}/mo
        </span>
      </div>
    </div>

    <!-- 4. Secondary Stats Row -->
    <div class="calc-section stats-row">
      <div class="stat">
        <span class="stat-label">Power Miles</span>
        <span class="stat-value">{{ displayPowerMiles }}</span>
      </div>
      <div class="stat-divider" />
      <div class="stat">
        <span class="stat-label">Staked Value</span>
        <span class="stat-value">{{ displayStakedValue }}</span>
      </div>
    </div>

    <!-- 5. Loss Aversion Banner -->
    <Transition
      enter-active-class="transition-all duration-300"
      leave-active-class="transition-all duration-200"
      enter-from-class="opacity-0 translate-y-1"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="showLossAversion"
        class="loss-banner"
      >
        <svg class="loss-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fbbf24" />
        </svg>
        <span class="loss-text">
          Switch to <strong>12 Months VIP</strong> for
          <strong>{{ formatNumberToUS(missedWelcomeSpins) }} more spins</strong>
          + x5 monthly spins
        </span>
      </div>
    </Transition>

    <!-- 6. Wheel Details Toggle -->
    <button class="details-toggle" @click="showWheelDetails = !showWheelDetails">
      <span>{{ showWheelDetails ? 'Hide' : 'Show' }} wheel details</span>
      <svg
        class="details-chevron"
        :class="{ 'details-chevron--open': showWheelDetails }"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>

    <!-- Wheel Details Panel -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 -translate-y-2"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="showWheelDetails"
        class="details-panel"
      >
        <div
          v-for="opt in lockOptions.filter(o => o.tierName)"
          :key="opt.id"
          class="detail-row"
        >
          <div class="detail-dot" :style="{ background: opt.tierColor, boxShadow: `0 0 8px ${opt.tierColor}` }" />
          <div class="detail-info">
            <span class="detail-name" :style="{ color: opt.tierColor }">{{ opt.tierName }}</span>
            <span class="detail-period">{{ opt.label }}</span>
          </div>
          <span class="detail-prizes">{{ tierPrizes[opt.id] }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.calc {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* === Section spacing === */
.calc-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-purple-gray);
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

/* === Amount Input === */
.amount-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.usd-equiv {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-purple-gray);
}

.amount-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(12, 12, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: border-color 0.2s ease;
}

.amount-wrap:focus-within {
  border-color: rgba(88, 88, 245, 0.3);
}

.amount-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 22px;
  font-weight: 700;
  color: var(--color-lavender);
  letter-spacing: -0.5px;
  min-width: 0;
  font-family: inherit;
}

.amount-input::placeholder {
  color: rgba(109, 109, 143, 0.4);
}

.amount-token {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-purple-gray);
  letter-spacing: 0.4px;
  white-space: nowrap;
}

.max-btn {
  padding: 6px 14px;
  border-radius: 8px;
  background: rgba(88, 88, 245, 0.12);
  border: 1px solid rgba(88, 88, 245, 0.2);
  color: #7878ff;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.max-btn:hover {
  background: rgba(88, 88, 245, 0.2);
  border-color: rgba(88, 88, 245, 0.35);
}

/* === Lock Period Grid === */
.lock-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

@media (max-width: 560px) {
  .lock-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.lock-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 16px 8px 14px;
  border-radius: 14px;
  background: rgba(20, 20, 31, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  overflow: hidden;
}

.lock-card:hover {
  background: rgba(30, 30, 48, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
}

.lock-card--active {
  background: rgba(88, 88, 245, 0.08);
  border-color: rgba(88, 88, 245, 0.35);
  box-shadow: 0 0 16px rgba(88, 88, 245, 0.1);
}

.lock-card--vip-active {
  background: rgba(241, 230, 250, 0.05);
  border-color: rgba(241, 230, 250, 0.35);
  box-shadow:
    0 0 20px rgba(241, 230, 250, 0.12),
    0 0 40px rgba(201, 92, 255, 0.08),
    inset 0 0 20px rgba(241, 230, 250, 0.03);
  transform: scale(1.03);
}

.lock-check {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(88, 88, 245, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.lock-card--vip-active .lock-check {
  background: linear-gradient(135deg, #c95cff, #f1e6fa);
}

.lock-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-lavender);
  letter-spacing: -0.2px;
}

.lock-tier {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.3px;
}

.lock-multiplier {
  font-size: 10px;
  font-weight: 500;
  color: var(--color-purple-gray);
  line-height: 1.3;
  margin-top: 2px;
}

.lock-vip {
  margin-top: 4px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.2px;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(241, 230, 250, 0.08);
  color: rgba(241, 230, 250, 0.4);
  transition: all 0.3s ease;
}

.lock-vip--lit {
  background: linear-gradient(135deg, rgba(201, 92, 255, 0.2), rgba(241, 230, 250, 0.15));
  color: #f1e6fa;
  box-shadow: 0 0 12px rgba(201, 92, 255, 0.2);
}

/* === Reward Cards === */
.reward-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.reward-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 24px 14px 20px;
  border-radius: 16px;
  background: rgba(12, 12, 20, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: border-color 0.3s ease;
}

.reward-card--welcome {
  border-color: rgba(88, 88, 245, 0.18);
}

.reward-card--welcome:hover {
  border-color: rgba(88, 88, 245, 0.3);
}

.reward-card--staking {
  border-color: rgba(201, 92, 255, 0.18);
}

.reward-card--staking:hover {
  border-color: rgba(201, 92, 255, 0.3);
}

.reward-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  padding: 2px 7px;
  border-radius: 6px;
}

.reward-tag--welcome {
  background: rgba(88, 88, 245, 0.12);
  color: #7878ff;
}

.reward-tag--staking {
  background: rgba(201, 92, 255, 0.12);
  color: #d490ff;
}

.reward-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-purple-gray);
  text-transform: uppercase;
  letter-spacing: 0.7px;
}

.reward-hero {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin: 6px 0 4px;
}

.reward-number {
  font-size: 36px;
  font-weight: 800;
  color: var(--color-lavender);
  letter-spacing: -1.5px;
  line-height: 1;
}

.reward-unit {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-purple-gray);
}

.reward-meta {
  font-size: 11px;
  color: var(--color-purple-gray);
  font-weight: 500;
  text-align: center;
  line-height: 1.4;
}

/* === Secondary Stats Row === */
.stats-row {
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 14px 20px;
  border-radius: 12px;
  background: rgba(12, 12, 20, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.03);
}

.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--color-purple-gray);
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-lavender);
  letter-spacing: -0.3px;
}

.stat-divider {
  width: 1px;
  height: 28px;
  background: rgba(255, 255, 255, 0.06);
  margin: 0 16px;
  flex-shrink: 0;
}

/* === Loss Aversion Banner === */
.loss-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  background: rgba(251, 191, 36, 0.06);
  border: 1px solid rgba(251, 191, 36, 0.15);
}

.loss-icon {
  flex-shrink: 0;
}

.loss-text {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-purple-gray);
  line-height: 1.5;
}

.loss-text strong {
  color: #fbbf24;
  font-weight: 700;
}

/* === Wheel Details Toggle === */
.details-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 10px;
  background: transparent;
  border: none;
  color: var(--color-purple-gray);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;
  font-family: inherit;
}

.details-toggle:hover {
  color: var(--color-lavender);
}

.details-chevron {
  transition: transform 0.3s ease;
}

.details-chevron--open {
  transform: rotate(180deg);
}

/* === Wheel Details Panel === */
.details-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border-radius: 14px;
  background: rgba(12, 12, 20, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
}

.detail-row:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.detail-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 80px;
}

.detail-name {
  font-size: 13px;
  font-weight: 700;
}

.detail-period {
  font-size: 10px;
  color: var(--color-purple-gray);
  font-weight: 500;
}

.detail-prizes {
  font-size: 11px;
  color: var(--color-purple-gray);
  line-height: 1.4;
  margin-left: auto;
  text-align: right;
}
</style>
