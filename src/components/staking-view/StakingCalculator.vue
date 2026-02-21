<script setup lang="ts">
import { computed, h, ref, watch } from 'vue'
import InlineSvg from 'vue-inline-svg'
import { useLingoPrice } from '@/composables/contracts/lingo-price'
import { useGetMe } from '@/composables/get-me'
import { useStakes } from '@/composables/contracts/stakes'
import { useBalance } from '@/composables/contracts/balance'
import { formatNumberToUS } from '@/composables/helpers'
import BalanceBadge from '@/components/user-balance/BalanceBadge.vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'

import lingoIcon from '@/assets/images/game/points-processed.svg'
import dollarIcon from '@/assets/images/dollar-icon.svg'
import checkIcon from '@/assets/images/staking/check-period.svg'
import lockCardsBg from '@/assets/images/staking/lock-cards-bg.png'
import powerMilesIcon from '@/assets/images/game/power-miles-lg.svg'
import starIcon from '@/assets/icons/star.svg'
import stakeInfoBg from '@/assets/images/staking/stake-info-bg.png'
import holdingCardsBg from '@/assets/images/staking/holding-cards-bg.png'

const props = withDefaults(defineProps<{ demoMode?: boolean }>(), { demoMode: false })

const { price } = useLingoPrice()
const { isConnected } = useGetMe()
const { totalStakedLingo, totalPowerMiles } = useStakes()
const { tokenBalanceAsString: userBalance } = useBalance()

// === Constants ===
const DEMO_LINGO = 100_000
const DEMO_PRICE = 0.025

// === Amount Input ===
const inputAmount = ref('')
const effectiveConnected = computed(() => props.demoMode || isConnected.value)

watch(effectiveConnected, (connected) => {
  if (connected && !inputAmount.value) {
    const amount = props.demoMode ? DEMO_LINGO : Math.floor(totalStakedLingo.value)
    if (amount > 0) inputAmount.value = String(amount)
  }
}, { immediate: true })

const parsedAmount = computed(() => {
  const num = Number(inputAmount.value.replace(/,/g, ''))
  return isNaN(num) || num < 0 ? 0 : num
})

function setMax() {
  const max = props.demoMode ? DEMO_LINGO : userBalance.value
  inputAmount.value = String(max)
}

const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  inputAmount.value = input.value
}

const effectivePrice = computed(() => props.demoMode ? DEMO_PRICE : (price.value || 0))
const usdAmount = computed(() => Math.round(parsedAmount.value * effectivePrice.value))

const displayBalance = computed(() => {
  if (props.demoMode) return formatNumberToUS(DEMO_LINGO)
  return formatNumberToUS(userBalance.value)
})

// === Lock Period ===
type LockId = 'flex' | '3mo' | '6mo' | '12mo'
const selectedLock = ref<LockId>('12mo')

const lockOptions = [
  {
    id: 'flex' as LockId, label: 'Flexible', reward: 0,
    description: 'No bonus', badgeText: 'S', badgeColor: '#6D6D8F',
    bonusPct: 0, monthlyMult: 1, isVip: false,
  },
  {
    id: '3mo' as LockId, label: '3 Months', reward: 20,
    description: 'More rewards', badgeText: 'M', badgeColor: '#5858F5',
    bonusPct: 20, monthlyMult: 1, isVip: false,
  },
  {
    id: '6mo' as LockId, label: '6 Months', reward: 80,
    description: 'More rewards', badgeText: 'L', badgeColor: '#5858F5',
    bonusPct: 80, monthlyMult: 3, isVip: false,
  },
  {
    id: '12mo' as LockId, label: '12 Months', reward: 180,
    description: 'More rewards', badgeText: 'VIP', badgeColor: '#FF9D5C',
    bonusPct: 180, monthlyMult: 5, isVip: true,
  },
]

const currentLock = computed(() => lockOptions.find(o => o.id === selectedLock.value)!)

// Badge render functions (matching LockPeriods.vue pattern)
const badgeClass = 'inline-block min-w-[24px] align-middle'
const badges: Record<LockId, () => ReturnType<typeof h>> = {
  flex: () => h(BalanceBadge, { color: '#6D6D8F', class: badgeClass }, { default: () => 'S' }),
  '3mo': () => h(BalanceBadge, { color: '#5858F5', class: badgeClass }, { default: () => 'M' }),
  '6mo': () => h(BalanceBadge, { color: '#5858F5', class: badgeClass }, { default: () => 'L' }),
  '12mo': () => h(BalanceBadge, { color: '#FF9D5C', class: badgeClass }, { default: () => 'VIP' }),
}

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

// Tier label based on lock period (not USD amount)
const lockTierName: Record<LockId, string> = {
  flex: 'Bronze',
  '3mo': 'Silver',
  '6mo': 'Gold',
  '12mo': 'Diamond',
}
const currentTierName = computed(() => lockTierName[selectedLock.value])

// === Secondary Stats ===
const displayPowerMiles = computed(() => {
  if (isEmpty.value) return '\u2014'
  if (props.demoMode) return formatNumberToUS(510_999)
  return formatNumberToUS(Math.round(totalPowerMiles.value))
})

// === Empty / Disconnected State ===
const isEmpty = computed(() => !effectiveConnected.value || parsedAmount.value === 0)
const showConnectPrompt = computed(() => !effectiveConnected.value)

// === UI State ===
const showWheelDetails = ref(false)

// === Loss Aversion ===
const showLossAversion = computed(() => selectedLock.value !== '12mo' && usdAmount.value > 0)

// Calculate $ left on the table vs 12-month Diamond
const diamondMonthlyEstValue = computed(() => {
  if (!currentMonthlyBase.value) return 0
  const diamondLock = lockOptions.find(o => o.id === '12mo')!
  const spins = currentMonthlyBase.value.dailySpins * 30 * diamondLock.monthlyMult
  return spins * currentMonthlyBase.value.valuePerSpin
})
const missedMonthlyValue = computed(() => diamondMonthlyEstValue.value - monthlyEstValue.value)

// === Wheel Detail Prizes ===
const tierPrizes: Partial<Record<LockId, string>> = {
  '3mo': 'Gift Cards & Merch',
  '6mo': 'Tech & Travel',
  '12mo': 'Luxury Watches, Supercars, LINGO Jackpots',
}
</script>

<template>
  <div class="calc">
    <!-- 1. Amount Input (PriceInput style) -->
    <div class="amount-section">
      <div class="flex justify-between w-full text-sm text-purple-gray tracking-[0.42px] font-semibold">
        <div>
          Amount <InlineSvg
            :src="dollarIcon"
            class="size-6 inline"
            unique-ids="calc-dollar"
          />
          <span class="text-lavender">${{ formatNumberToUS(usdAmount) }} USD</span>
        </div>
        <div>
          Available - <span class="text-lavender">{{ displayBalance }}</span>
        </div>
      </div>
      <div class="flex justify-between w-full">
        <div class="relative flex items-center gap-2 w-full leading-0 h-10 text-5.5xl overflow-clip">
          <InlineSvg
            :src="lingoIcon"
            class="size-10 flex-shrink-0"
            unique-ids="calc-lingo"
          />
          <input
            id="calc-amount-input"
            type="number"
            class="h-min text-lavender tracking-[-2.8px] bg-transparent outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            :value="inputAmount"
            @input="handleInput"
          >
        </div>
        <div class="flex items-center">
          <button
            class="text-sm text-white border border-purple-gray rounded-full px-6 py-2 h-10 bg-transparent cursor-pointer hover:border-lavender transition-colors"
            @click="setMax"
          >
            Max
          </button>
        </div>
      </div>
    </div>

    <!-- 2. Lock Period Cards -->
    <div class="lock-section">
      <span class="text-sm text-purple-gray tracking-[0.42px] font-semibold">Lock Period</span>
      <div class="lock-grid">
        <div
          v-for="(opt, index) in lockOptions"
          :key="opt.id"
          role="button"
          class="lock-card cursor-pointer relative tracking-normal flex flex-col justify-between gap-2 rounded-2xl p-4 bg-[#0C0C14]"
          :style="`background-image: url(${lockCardsBg});`"
          :class="[`lock-card-pos-${index}`]"
          @click="selectedLock = opt.id"
        >
          <InlineSvg
            :src="checkIcon"
            class="size-8 absolute bottom-1 right-1 transition-opacity duration-300"
            :class="{ 'opacity-100': selectedLock === opt.id, 'opacity-0': selectedLock !== opt.id }"
            :unique-ids="`check-${opt.id}`"
          />
          <span class="text-lavender font-semibold">
            {{ opt.label }}
            <component :is="badges[opt.id]" />
          </span>
          <div class="relative">
            <h1
              v-if="opt.reward"
              class="text-purple text-5.5xl leading-14 tracking-[-3.36px]"
            >
              {{ opt.reward }}<i class="text-[32px] font-bold not-italic">%</i>
            </h1>
            <h1
              v-if="opt.reward"
              class="flare text-purple text-5.5xl leading-14 tracking-[-3.36px]"
              :class="{ 'flare-active': selectedLock === opt.id }"
            >
              {{ opt.reward }}<i class="text-[32px] font-bold not-italic">%</i>
            </h1>
            <span class="text-purple-gray font-semibold text-sm tracking-[0.14px]">{{ opt.description }}</span>
          </div>
          <div
            class="selected-border"
            :class="{ 'selected-border-active': selectedLock === opt.id }"
          />
        </div>
      </div>
    </div>

    <!-- 3. Reward Cards -->
    <div class="reward-row">
      <!-- Welcome Wheel -->
      <div
        class="reward-card reward-card--welcome"
        :style="`background-image: url(${holdingCardsBg});`"
      >
        <span class="reward-tag reward-tag--welcome">One-time</span>
        <span class="reward-label">Welcome Wheel</span>
        <div class="reward-hero">
          <span class="reward-number">{{ isEmpty ? '\u2014' : formatNumberToUS(welcomeSpins) }}</span>
          <span class="reward-unit">Spins</span>
        </div>
        <span class="reward-meta">
          {{ isEmpty ? '\u2014' : `~$${formatNumberToUS(welcomeEstValue)} est. value` }}
        </span>
      </div>

      <!-- Staking Wheel -->
      <div
        class="reward-card reward-card--staking"
        :style="`background-image: url(${holdingCardsBg});`"
      >
        <span class="reward-tag reward-tag--staking">Monthly</span>
        <InlineSvg
          :src="starIcon"
          class="reward-card-icon size-7"
          unique-ids="calc-star-staking"
        />
        <span class="reward-label">Staking Wheel</span>
        <div class="reward-hero">
          <span class="reward-number">{{ isEmpty ? '\u2014' : formatNumberToUS(monthlySpins) }}</span>
          <span class="reward-unit">Spins/mo</span>
        </div>
        <span class="reward-meta">
          {{ isEmpty ? '\u2014' : `${currentTierName} tier \u00B7 ~$${formatNumberToUS(monthlyEstValue)}/mo` }}
        </span>
      </div>
    </div>

    <!-- Loss Aversion Banner -->
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
        <span class="loss-text">
          &#9888; You're leaving ~<strong>${{ formatNumberToUS(missedMonthlyValue) }}</strong> on the table &mdash;
          <strong class="loss-cta" @click="selectedLock = '12mo'">Switch to 12 Months &rarr;</strong>
        </span>
      </div>
    </Transition>

    <!-- 4. Stats Row -->
    <div class="stats-row">
      <img
        :src="stakeInfoBg"
        alt=""
        class="stats-row-bg"
      >
      <div class="stat">
        <InlineSvg
          :src="powerMilesIcon"
          class="size-7"
          unique-ids="calc-power-lg"
        />
        <span class="stat-label">Power Miles</span>
        <h2 class="stat-number stat-number--miles">
          {{ displayPowerMiles }}
        </h2>
      </div>
      <div class="stat-divider" />
      <div class="stat">
        <InlineSvg
          :src="dollarIcon"
          class="size-7"
          unique-ids="calc-dollar-stat"
        />
        <span class="stat-label">Staked Value</span>
        <h2 class="stat-number stat-number--value">
          {{ isEmpty ? '\u2014' : `$${formatNumberToUS(usdAmount)}` }}
        </h2>
      </div>
    </div>

    <!-- Connect wallet prompt -->
    <div
      v-if="showConnectPrompt"
      class="connect-prompt"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      <span>Connect wallet to see your actual rewards</span>
    </div>

    <!-- 5. Stake Button -->
    <div class="w-full flex justify-center">
      <GlowButton
        class="flex items-center w-[224px] gap-2"
        :color="EButtonColor.BLUE"
      >
        <span>Stake LINGO</span>
      </GlowButton>
    </div>

    <!-- 7. Wheel Details Toggle -->
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
          v-for="opt in lockOptions.filter(o => o.id !== 'flex')"
          :key="opt.id"
          class="detail-row"
        >
          <component :is="badges[opt.id]" />
          <div class="detail-info">
            <span class="text-[13px] font-bold text-lavender">{{ opt.label }}</span>
            <span class="text-[10px] text-purple-gray font-medium">{{ opt.reward }}% bonus</span>
          </div>
          <span class="text-[11px] text-purple-gray leading-[1.4] ml-auto text-right">{{ tierPrizes[opt.id] }}</span>
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

/* === Amount Input Section === */
.amount-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  z-index: 1;
}

/* === Lock Period Grid === */
.lock-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.lock-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}

.lock-card {
  flex: 1;
  min-width: 100px;
  height: 184px;
  background-size: 1005px 548px;
  background-repeat: no-repeat;
}

.lock-card::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  opacity: 0.56;
  background: var(--dark-1, #14141f);
  box-shadow: 0px 0px 48px -16px #1c1c29 inset;
  pointer-events: none;
  mix-blend-mode: screen;
  overflow: hidden;
}

.lock-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  border: 1px solid #ffffff0d;
  mix-blend-mode: screen;
  overflow: hidden;
  pointer-events: none;
}

.lock-card-pos-0 { background-position: -160px center; }
.lock-card-pos-1 { background-position: -320px center; }
.lock-card-pos-2 { background-position: -480px center; }
.lock-card-pos-3 { background-position: -640px center; }

@media (max-width: 560px) {
  .lock-card {
    min-width: calc(50% - 1px);
  }
}

/* Flare effect */
.flare {
  width: 100%;
  position: absolute;
  filter: blur(0px);
  overflow: hidden;
  top: 0px;
  left: 0px;
  opacity: 0;
  background: linear-gradient(to bottom, #d0c2eb 10%, transparent 60%);
  background-clip: text;
  color: transparent;
  transition: all 0.3s;
  mix-blend-mode: plus-lighter;
  pointer-events: none;
}

.flare-active {
  opacity: 1;
  left: 2px;
  filter: blur(4px);
}

/* Selected border glow */
.selected-border {
  position: absolute;
  top: -2px;
  left: -2px;
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  border-radius: 18px;
  background: linear-gradient(#0b0b1300, #0b0b13) padding-box, linear-gradient(to top, #5858F5, #5858F580) border-box;
  border: 2px solid transparent;
  z-index: -1;
  opacity: 0;
  transition: all 0.3s;
  box-shadow: 0 0 0 0 rgba(88, 88, 245, 0);
}

.selected-border-active {
  opacity: 1;
  box-shadow: 0 0 16px 0 rgba(88, 88, 245, 0.35), 0 0 40px -4px rgba(88, 88, 245, 0.15);
}

/* === Reward Cards === */
.reward-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
}

.reward-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 12px 14px 16px;
  border-radius: 16px;
  background-color: #0D0D1A;
  background-size: 200% 100%;
  background-repeat: no-repeat;
  overflow: hidden;
  isolation: isolate;
}

.reward-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: rgba(10, 10, 18, 0.45);
  pointer-events: none;
}

.reward-card--welcome {
  background-position: 0% center;
  border: 1px solid rgba(88, 88, 245, 0.25);
  box-shadow: 0 0 20px -4px rgba(88, 88, 245, 0.15), inset 0 0 20px -8px rgba(88, 88, 245, 0.06);
}

.reward-card--staking {
  background-position: 100% center;
  border: 1px solid rgba(201, 92, 255, 0.25);
  box-shadow: 0 0 20px -4px rgba(201, 92, 255, 0.15), inset 0 0 20px -8px rgba(201, 92, 255, 0.06);
}

.reward-card-icon {
  z-index: 1;
  margin-bottom: 2px;
}

.reward-tag {
  align-self: flex-end;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  padding: 2px 7px;
  border-radius: 6px;
  z-index: 1;
  margin-bottom: 4px;
}

.reward-tag--welcome {
  background: rgba(88, 88, 245, 0.18);
  color: #7878ff;
}

.reward-tag--staking {
  background: rgba(201, 92, 255, 0.18);
  color: #d490ff;
}

.reward-label {
  font-family: 'Afacad', sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);
  text-transform: uppercase;
  letter-spacing: 1.6px;
  z-index: 1;
}

.reward-hero {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin: 8px 0 6px;
  z-index: 1;
}

.reward-number {
  font-family: 'Afacad', sans-serif;
  font-size: 64px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -2.5px;
  line-height: 1;
}

.reward-card--welcome .reward-number {
  text-shadow: 0 0 20px rgba(255, 190, 80, 0.45), 0 0 40px rgba(255, 160, 40, 0.2);
}

.reward-card--staking .reward-number {
  text-shadow: 0 0 20px rgba(120, 100, 255, 0.5), 0 0 40px rgba(88, 88, 245, 0.25);
}

.reward-unit {
  font-family: 'Afacad', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-purple-gray);
}

.reward-meta {
  font-family: 'Afacad', sans-serif;
  font-size: 13px;
  color: var(--color-purple-gray);
  font-weight: 500;
  text-align: center;
  line-height: 1.4;
  z-index: 1;
}

/* === Stats Row === */
.stats-row {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  background: #0C0C14;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: inset 0 0 40px -10px rgba(255, 255, 255, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.stats-row-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  mix-blend-mode: screen;
  opacity: 0.5;
}

.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  z-index: 1;
}

.stat-label {
  font-family: 'Afacad', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 1.2px;
}

.stat-number {
  font-family: 'Afacad', sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -1.5px;
  line-height: 1.1;
}

.stat-number--miles {
  text-shadow: 0 0 16px rgba(255, 190, 80, 0.4), 0 0 32px rgba(255, 160, 40, 0.15);
}

.stat-number--value {
  text-shadow: 0 0 16px rgba(80, 220, 120, 0.4), 0 0 32px rgba(60, 200, 100, 0.15);
}

.stat-divider {
  width: 1px;
  height: 48px;
  background: rgba(255, 255, 255, 0.08);
  margin: 0 16px;
  flex-shrink: 0;
  z-index: 1;
}

/* === Connect Wallet Prompt === */
.connect-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-purple-gray);
  margin-top: -16px;
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

.loss-cta {
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
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

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 80px;
}
</style>
