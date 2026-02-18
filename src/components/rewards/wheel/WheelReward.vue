<template>
  <div class="mt-12 flex flex-col gap-6 md:gap-8">
    <div class="flex flex-col sm:flex-row justify-between items-center gap-6">
      <div class="flex flex-col gap-2">
        <span class="text-lavender text-[32px] font-semibold leading-8 tracking-[-0.96px]">
          {{ $t('rewards.wheel.spinAndWinEveryMonth') }}
        </span>

        <Transition name="zoom-in">
          <span
            v-if="currentWheel"
            class="text-purple-gray text-xl font-normal leading-6 tracking-[-0.6px]"
          >
            {{ $t('rewards.wheel.description', { amount: currentWheel.lockAmountEligibility, months: lockDurationToMonths[currentWheel.lockDuration] }) }}
          </span>
        </Transition>
      </div>
      <div class="flex flex-row sm:flex-col justify-center items-center min-w-full gap-6 sm:min-w-[120px]">
        <span class="text-purple-gray text-xl font-normal leading-6 tracking-[-0.6px] text-right uppercase">
          {{ $t('rewards.wheel.yourSpins') }} <span
            class="text-lavender font-bold"
            :class="{ 'opacity-50': isLoadingWheelSpinCount }"
          >{{ availableSpins || 0 }}</span>
        </span>
        <GlowButton
          class="w-auto min-w-[120px] sm:w-full"
          :color="EButtonColor.BLUE"
          @click="goToStaking"
        >
          {{ $t('rewards.wheel.getMore') }}
        </GlowButton>
      </div>
    </div>
    <Transition
      class="h-[320px] sm:h-[404px]"
      name="zoom-in"
    >
      <WheelGacha
        v-if="currentWheel && !loading"
        :class="{ 'grayscale-100': !isEligible }"
        :target-section="targetSection"
        :spinning="spinning"
        :show-timer="showTimer"
        :end-date-timestamp="nextMonth.getTime() || 0"
        :progress="progress"
        @finished="onFinished"
        @reset="onReset"
        @click="handleClickMainCTA"
      />
    </Transition>
    <div class="flex justify-center items-center">
      <GlowButton
        v-if="isConnected"
        class="w-[120px]"
        :color="EButtonColor.ORANGE"
        :disabled="disabled"
        @click="handleClickMainCTA"
      >
        {{ $t('rewards.wheel.spinNow') }}
      </GlowButton>
      <GlowButton
        v-else
        class="w-[120px]"
        :color="EButtonColor.BLUE"
        @click="handleClickLogInSignUp"
      >
        {{ $t('rewards.wheel.logInSignUp') }}
      </GlowButton>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { useTranslation } from '@/composables/use-i18n'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useGetMe } from '@/composables/get-me'
import { useWalletConnect } from '@/composables/wallet/use-wallet-connect'
import WheelGacha from './WheelGacha.vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import { useWheel, useWheelSpin } from '@/composables/use-wheel'
import { useLingoPrice } from '@/composables/contracts/lingo-price'
import { LingoRouteName } from '@/router/routes'
import { useRouter } from 'vue-router'
import { lockDurationToMonths } from '@/const/mixpanel-maps'
import type { Spin } from '@/services/api'

const { isLoadingWheels, currentWheel } = useWheel()

const emit = defineEmits<{
  (e: 'on-spin-finished', spinPrize: Spin): void
}>()

// const { t } = useTranslation()
const { connect } = useWalletConnect()
const { isConnected } = useGetMe()

const { wheelSpin, isLoadingWheelSpin, wheelSpinCount, isLoadingWheelSpinCount, refetchWheelSpinCount, isEligible } = useWheelSpin()
const spinResult = ref()
const targetSection = ref<string>()
const spinning = ref(false)

const availableSpins = computed(() => {
  return Math.max(0, wheelSpinCount.value?.count || 0)
})

const disabled = computed(() => {
  return isLoadingWheelSpinCount.value || isLoadingWheels.value || availableSpins.value <= 0
})

const showTimer = computed(() => {
  if (isLoadingWheelSpinCount.value || !isConnected.value || !isEligible.value) {
    return false
  }
  return availableSpins.value <= 0
})

const loading = computed(() => {
  if (isConnected.value) {
    return isLoadingWheelSpinCount.value || isLoadingWheels.value
  }
  return isLoadingWheels.value
})

function getProgressToMonthStart() {
  const now = new Date()

  // Current month start (00:00 on day 1)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  monthStart.setHours(0, 0, 0, 0)

  // Next month start
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  nextMonthStart.setHours(0, 0, 0, 0)

  // Progress ratio
  const total = nextMonthStart.getTime() - monthStart.getTime()
  const elapsed = now.getTime() - monthStart.getTime()

  const progress = (elapsed / total) * 100
  return {
    progress: Math.min(progress, 100),
    nextMonthStart,
  }
}

async function handleClickMainCTA() {
  if (isLoadingWheelSpin.value || disabled.value) {
    return
  }

  if (!isConnected.value) {
    return handleClickLogInSignUp()
  }

  spinning.value = true
  const result = await wheelSpin.mutateAsync()
  spinResult.value = result
  targetSection.value = result.prize.id
}

async function handleClickLogInSignUp() {
  await connect()
}

function onFinished() {
  emit('on-spin-finished', spinResult.value!)
  refetchWheelSpinCount()
  spinning.value = false
}

function onReset() {
  spinResult.value = undefined
  targetSection.value = undefined
}

const router = useRouter()

const goToStaking = () => {
  router.push({ name: LingoRouteName.STAKING_NEW, query: { presetAmount: roundedStakeAmount.value, redirect: 'rewards' } })
}

const { price } = useLingoPrice()

const roundedStakeAmount = computed(() => {
  const amount = 5000 / price.value
  return Math.ceil(amount / 100) * 100
})

const progress = ref(getProgressToMonthStart().progress)
const nextMonth = ref(getProgressToMonthStart().nextMonthStart)

onMounted(() => {
  const interval = setInterval(() => {
    progress.value = getProgressToMonthStart().progress
    nextMonth.value = getProgressToMonthStart().nextMonthStart
  }, 60_000) // every 1 min

  onUnmounted(() => clearInterval(interval))
})
</script>

<style scoped>
.zoom-in-enter-active {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  transition-delay: 0.3s;
}

.zoom-in-leave-active {
  transition: transform 0.1s ease-in-out, opacity 0.1s ease-in-out;
  transition-delay: 0s;
}

.zoom-in-enter-from,
.zoom-in-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>