<script setup lang="ts">
import { computed, h, ref, watch } from 'vue'
import InlineSvg from 'vue-inline-svg'
import { useLingoPrice } from '@/composables/contracts/lingo-price'
import { useGetMe } from '@/composables/get-me'
import { useStakes } from '@/composables/contracts/stakes'
import { useBalance } from '@/composables/contracts/balance'
import { formatNumberToUS } from '@/composables/helpers'
import BalanceBadge from '@/components/user-balance/BalanceBadge.vue'

import lingoIcon from '@/assets/images/game/points-processed.svg'
import dollarIcon from '@/assets/images/dollar-icon.svg'
import boltIcon from '@/assets/images/bolt.svg'
import checkIcon from '@/assets/images/staking/check-period.svg'
import bgImage from '@/assets/images/staking/lock-cards-bg.png'
import giftBoxImg from '@/assets/images/gift-box.png'

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

// === Secondary Stats ===
const displayPowerMiles = computed(() => {
  if (props.demoMode) return formatNumberToUS(510_999)
  return formatNumberToUS(Math.round(totalPowerMiles.value))
})

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

    <!-- 2. Lock Period Cards (matching LockPeriods/StakeOption design) -->
    <div class="lock-section">
      <span class="text-sm text-purple-gray tracking-[0.42px] font-semibold">Lock Period</span>
      <div class="lock-grid">
        <div
          v-for="(opt, index) in lockOptions"
          :key="opt.id"
          role="button"
          class="lock-card cursor-pointer relative tracking-normal flex flex-col justify-between gap-2 rounded-2xl p-4 bg-[#0C0C14]"
          :style="`background-image: url(${bgImage});`"
          :class="[`lock-card-pos-${index}`]"
          @click="selectedLock = opt.id"
        >
          <!-- Check icon (from check-period.svg) -->
          <InlineSvg
            :src="checkIcon"
            class="size-8 absolute bottom-1 right-1 transition-opacity duration-300"
            :class="{ 'opacity-100': selectedLock === opt.id, 'opacity-0': selectedLock !== opt.id }"
            :unique-ids="`check-${opt.id}`"
          />

          <!-- Label + Badge -->
          <span class="text-lavender font-semibold">
            {{ opt.label }}
            <component :is="badges[opt.id]" />
          </span>

          <!-- Big percentage number -->
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

          <!-- Selected border glow -->
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
      <div class="reward-card">
        <div class="reward-card-icon">
          <img :src="giftBoxImg" alt="" class="size-8">
        </div>
        <span class="reward-tag reward-tag--welcome">One-time</span>
        <span class="text-[11px] font-semibold text-purple-gray uppercase tracking-[0.7px]">Welcome Wheel</span>
        <div class="reward-hero">
          <span class="reward-number">{{ formatNumberToUS(welcomeSpins) }}</span>
          <span class="reward-unit">Spins</span>
        </div>
        <span class="text-[11px] text-purple-gray font-medium text-center leading-[1.4]">
          ~${{ formatNumberToUS(welcomeEstValue) }} est. value
        </span>
      </div>

      <!-- Staking Wheel -->
      <div class="reward-card">
        <div class="reward-card-icon">
          <!-- Inline wheel/cycle SVG -->
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 2v4m0 12v4M2 12h4m12 0h4m-2.83-7.17l-2.83 2.83M9.66 14.34l-2.83 2.83m11.34 0l-2.83-2.83M9.66 9.66L6.83 6.83" stroke="#C95CFF" stroke-width="2" stroke-linecap="round" />
            <circle cx="12" cy="12" r="3" fill="#C95CFF" opacity="0.5" />
          </svg>
        </div>
        <span class="reward-tag reward-tag--staking">Monthly</span>
        <span class="text-[11px] font-semibold text-purple-gray uppercase tracking-[0.7px]">Staking Wheel</span>
        <div class="reward-hero">
          <span class="reward-number">{{ formatNumberToUS(monthlySpins) }}</span>
          <span class="reward-unit">Spins/mo</span>
        </div>
        <span class="text-[11px] text-purple-gray font-medium text-center leading-[1.4]">
          {{ currentMonthlyBase?.name || '\u2014' }} tier &middot; ~${{ formatNumberToUS(monthlyEstValue) }}/mo
        </span>
      </div>
    </div>

    <!-- 4. Power Miles Row -->
    <div class="stats-row">
      <div class="stat">
        <InlineSvg
          :src="boltIcon"
          class="size-5"
          unique-ids="calc-bolt"
        />
        <span class="text-[10px] font-semibold text-purple-gray uppercase tracking-[0.6px]">Power Miles</span>
        <span class="text-base font-bold text-lavender tracking-[-0.3px]">{{ displayPowerMiles }}</span>
      </div>
      <div class="stat-divider" />
      <div class="stat">
        <InlineSvg
          :src="dollarIcon"
          class="size-5"
          unique-ids="calc-dollar-stat"
        />
        <span class="text-[10px] font-semibold text-purple-gray uppercase tracking-[0.6px]">Staked Value</span>
        <span class="text-base font-bold text-lavender tracking-[-0.3px]">${{ formatNumberToUS(usdAmount) }}</span>
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
        <InlineSvg
          :src="boltIcon"
          class="size-5 flex-shrink-0"
          unique-ids="calc-bolt-loss"
        />
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

/* === Amount Input Section (PriceInput style) === */
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
  .lock-grid {
    flex-wrap: wrap;
  }
  .lock-card {
    min-width: calc(50% - 1px);
  }
}

/* Flare effect (from StakeOption.vue) */
.flare {
  width: 100%;
  position: absolute;
  filter: blur(0px);
  color: #fff;
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

/* Selected border glow (from StakeOption.vue) */
.selected-border {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  border-radius: 18px;
  background: linear-gradient(#0b0b1300, #0b0b13) padding-box, linear-gradient(to top, #5858F5, transparent 76%) border-box;
  border: 1px solid transparent;
  z-index: -1;
  opacity: 0;
  transition: all 0.3s;
}

.selected-border-active {
  opacity: 1;
  top: -2px;
  left: -2px;
  width: calc(100% + 4px);
  height: calc(100% + 4px);
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
  padding: 28px 14px 20px;
  border-radius: 16px;
  background: rgba(12, 12, 20, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: border-color 0.3s ease;
}

.reward-card:hover {
  border-color: rgba(88, 88, 245, 0.2);
}

.reward-card-icon {
  margin-bottom: 4px;
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

/* === Stats Row === */
.stats-row {
  display: flex;
  align-items: center;
  justify-content: center;
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

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 80px;
}
</style>
