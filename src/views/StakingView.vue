<script setup lang="ts">
import StakingCalculator from '@/components/staking-view/StakingCalculator.vue'
import mixpanel from 'mixpanel-browser'
import { computed, onMounted, ref } from 'vue'
import { useGetMe } from '@/composables/get-me'
import { useStakes } from '@/composables/contracts/stakes'
import { useWalletConnect } from '@/composables/wallet/use-wallet-connect'
import { formatNumberToUS, formatNumber } from '@/composables/helpers'
import lingoIcon from '@/assets/images/lingo-icon.svg'
import powerIcon from '@/assets/images/bolt.svg'
import InlineSVG from 'vue-inline-svg'
import IconWrapper from '@/components/icon-wrapper/IconWrapper.vue'

const { isConnected } = useGetMe()
const { totalPowerMiles, totalStakedLingo } = useStakes()
const { connect } = useWalletConnect()

const demoMode = ref(false)
const showAsConnected = computed(() => isConnected.value || demoMode.value)

const DEMO_POWER_MILES = 4_825
const DEMO_HOLDING_TOTAL = 100_000

const displayPowerMiles = computed(() => {
  if (demoMode.value) return formatNumberToUS(DEMO_POWER_MILES)
  return isConnected.value ? formatNumberToUS(totalPowerMiles.value) : '0'
})
const displayHoldingTotal = computed(() => {
  if (demoMode.value) return formatNumber(DEMO_HOLDING_TOTAL, 2)
  return isConnected.value ? formatNumber(totalStakedLingo.value, 2) : '0'
})

onMounted(() => {
  mixpanel.track('Staking Page View')
})
</script>

<template>
  <div class="py-10 px-4 md:px-6 flex flex-col items-center">
    <!-- Stats Row: Power Miles · Holding Total -->
    <div class="w-full max-w-[720px] mb-8">
      <div class="flex justify-between items-start gap-4">
        <!-- Power Miles -->
        <div class="flex gap-2 items-start">
          <IconWrapper
            variant="orange"
            position="left"
            :with-borders="false"
          >
            <InlineSVG
              :src="powerIcon"
              class="size-10"
            />
          </IconWrapper>
          <div class="flex flex-col">
            <h1
              class="text-4xl md:text-5.5xl leading-tightest tracking-tighter transition-colors duration-300"
              :class="showAsConnected ? 'text-lavender' : 'text-purple-gray/40'"
            >
              {{ displayPowerMiles }}
            </h1>
            <span class="text-purple-gray text-sm sm:text-xl leading-loose tracking-tighter-x1 font-normal whitespace-nowrap">
              Power Miles
            </span>
          </div>
        </div>

        <!-- Holding Total -->
        <div class="flex flex-row-reverse gap-2 items-start">
          <IconWrapper
            variant="purple"
            position="right"
            :with-borders="false"
          >
            <InlineSVG
              :src="lingoIcon"
              class="size-10"
            />
          </IconWrapper>
          <div class="flex flex-col items-end">
            <h1
              class="text-4xl md:text-5.5xl leading-tightest tracking-tighter transition-colors duration-300"
              :class="showAsConnected ? 'text-lavender' : 'text-purple-gray/40'"
            >
              {{ displayHoldingTotal }}
            </h1>
            <span class="text-purple-gray text-sm sm:text-xl leading-loose tracking-tighter-x1 font-normal whitespace-nowrap">
              Holding Total
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Calculator section with conditional overlay -->
    <div class="w-full max-w-[720px] relative">
      <!-- Demo banner -->
      <Transition
        enter-active-class="transition-all duration-300"
        leave-active-class="transition-all duration-200"
        enter-from-class="opacity-0 -translate-y-2"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="demoMode"
          class="demo-banner mb-3"
        >
          <span class="demo-badge">Demo</span>
          <span class="text-purple-gray text-xs flex-1">Preview with sample data</span>
          <button
            class="demo-exit-btn"
            @click="demoMode = false"
          >
            Exit
          </button>
        </div>
      </Transition>

      <!-- Calculator content (always visible) -->
      <div
        class="calculator-outer transition-[filter] duration-300"
        :class="{ 'blur-[3px] pointer-events-none select-none': !showAsConnected }"
      >
        <StakingCalculator :demo-mode="demoMode" />
      </div>

      <!-- Wallet overlay (only when disconnected and not in demo) -->
      <Transition
        enter-active-class="transition-opacity duration-300"
        leave-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div
          v-if="!showAsConnected"
          class="absolute inset-0 z-10 flex items-center justify-center rounded-3xl"
        >
          <div class="overlay-bg absolute inset-0 rounded-3xl" />
          <div class="relative flex flex-col items-center gap-3 text-center px-6">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" class="text-lavender/60">
              <path d="M19 7h-1V6a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-8a3 3 0 0 0-3-3ZM5 5h10a1 1 0 0 1 1 1v1H5a1 1 0 0 1 0-2Zm15 12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8.83A3 3 0 0 0 5 9h14a1 1 0 0 1 1 1v2h-3a2 2 0 0 0 0 4h3v1Zm0-3h-3v-2h3v2Z" fill="currentColor" />
            </svg>
            <button
              class="connect-btn"
              @click="connect()"
            >
              Connect wallet to unlock
            </button>
            <div class="flex items-center gap-3 mt-1">
              <span class="text-purple-gray/70 text-sm">or</span>
              <button
                class="preview-btn"
                @click="demoMode = true"
              >
                Preview Demo
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.calculator-outer {
  position: relative;
  width: 100%;
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

.overlay-bg {
  background: rgba(12, 12, 20, 0.45);
  backdrop-filter: blur(1px);
}

.connect-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 32px;
  border-radius: 14px;
  background: linear-gradient(135deg, #5858F5 0%, #7B5BF5 100%);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.2px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 20px rgba(88, 88, 245, 0.3);
}

.connect-btn:hover {
  background: linear-gradient(135deg, #6868FF 0%, #8B6BFF 100%);
  box-shadow: 0 4px 28px rgba(88, 88, 245, 0.45);
  transform: translateY(-1px);
}

.preview-btn {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-purple-gray);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preview-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.18);
  color: var(--color-lavender);
}

.demo-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 12px;
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.demo-badge {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
}

.demo-exit-btn {
  padding: 4px 12px;
  border-radius: 8px;
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.25);
  color: #fbbf24;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.demo-exit-btn:hover {
  background: rgba(245, 158, 11, 0.2);
}
</style>
