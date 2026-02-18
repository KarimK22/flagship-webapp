<template>
  <div class="mt-12 flex flex-col gap-6 md:gap-8">
    <!-- HEADER -->
    <div class="container flex flex-col sm:flex-row justify-between items-center gap-6">
      <div class="flex flex-col gap-2">
        <span class="text-lavender text-[32px] font-semibold leading-8 tracking-[-0.96px]">
          {{ t('rewards.tradingGacha.title') }}
        </span>

        <Transition name="zoom-in">
          <span
            v-if="currentGacha"
            class="text-purple-gray text-xl font-normal leading-6 tracking-[-0.6px]"
          >
            {{ t('rewards.tradingGacha.subtitle', { amount: currentGacha.tradeVolumeEligibility }) }}
          </span>
        </Transition>
      </div>

      <!-- Pulls count -->
      <div class="flex flex-row sm:flex-col justify-center items-center min-w-full gap-6 sm:min-w-[120px]">
        <span class="text-purple-gray text-xl font-normal leading-6 tracking-[-0.6px] text-right uppercase">
          {{ t('rewards.tradingGacha.yourPulls') }}
          <span
            class="text-lavender font-bold"
            :class="{ 'opacity-50': isLoadingPullCount }"
          >
            {{ pullsCountNumber || 0 }}
          </span>
        </span>
        <GlowButton
          class="w-auto min-w-[120px] sm:w-full"
          :color="EButtonColor.BLUE"
          @click="goToUniswap"
        >
          {{ $t('rewards.wheel.getMore') }}
        </GlowButton>

        <div class="text-purple-gray text-xl font-normal leading-6 tracking-[-0.6px] text-right">
          <TooltipWrapper>
            {{ t('rewards.tradingGacha.yourTradingVolume') }}
            <span
              class="text-lavender font-bold"
              :class="{ 'opacity-50': isLoadingPullCount }"
            >
              ${{ totalTradedVolume.toLocaleString('en-us') || 0 }}
            </span>
            <template #content>
              <TooltipContent
                :title="t('rewards.tradingGacha.yourTradingVolume')"
                :description="t('rewards.tradingGacha.yourTradingVolumeDescription')"
              />
            </template>
          </TooltipWrapper>
        </div>
      </div>
    </div>

    <!-- UNLOCK INFO -->
    <div
      v-if="currentGacha"
      class="container flex flex-col gap-3"
    >
      <TradingGachaProgressBar
        v-if="currentGacha"
        :tiers="allGachas"
        :current-spins="spinsDone"
      />
    </div>

    <!-- WHEEL -->
    <Transition class="h-[320px] sm:h-[404px]" name="zoom-in">
      <TradingGachaWheel
        v-if="currentGacha"
        :class="{ 'grayscale-100': !currentGacha?.tieredWheelEligibility.isEligible }"
        :target-section="targetSection"
        :spinning="spinning"
        :show-timer="false"
        :end-date-timestamp="0"
        :progress="0"
        :tier="wheelTier"
        @finished="onFinished"
        @reset="onReset"
        @click="handleClickMainCTA"
      />
    </Transition>

    <!-- CTA BUTTON -->
    <div class="flex justify-center items-center mt-4">
      <GlowButton
        v-if="isConnected"
        class="w-[160px]"
        :color="EButtonColor.ORANGE"
        :disabled="disabled"
        @click="handleClickMainCTA"
      >
        <span v-if="isLoadingPull">{{ t('rewards.tradingGacha.pulling') }}…</span>
        <span v-else>{{ t('rewards.tradingGacha.pullCta') }}</span>
      </GlowButton>

      <GlowButton
        v-else
        class="w-[160px]"
        :color="EButtonColor.BLUE"
        @click="handleClickLogInSignUp"
      >
        {{ t('rewards.tradingGacha.logInSignUp') }}
      </GlowButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTranslation } from '@/composables/use-i18n'
import { useGetMe } from '@/composables/get-me'
import { useWalletConnect } from '@/composables/wallet/use-wallet-connect'
import { useQueryClient } from '@tanstack/vue-query'

import TradingGachaWheel from '@/components/rewards/wheel/TradingGachaWheel.vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import TooltipWrapper from '../../TooltipWrapper.vue'
import TooltipContent from '../../TooltipContent.vue'
import TradingGachaProgressBar from '@/components/rewards/wheel/TradingGachaProgressBar.vue'

import {
  type TradingGachaPullWithImage,
  useTradingGacha,
  useTradingGachaPulls,
} from '@/composables/use-wheel-pulls'

const emit = defineEmits<{
  (e: 'on-pull-finished', pull: TradingGachaPullWithImage): void
}>()

const { t } = useTranslation()
const { isConnected } = useGetMe()
const { connect } = useWalletConnect()
const queryClient = useQueryClient()

const {
  currentGacha,
  allGachas,
} = useTradingGacha()

const {
  pullMutation,
  isLoadingPull,
  pullsCountNumber,
  isLoadingPullCount,
  totalTradedVolume,
} = useTradingGachaPulls()

const spinning = ref(false)
const targetSection = ref<string>()
const latest = ref<TradingGachaPullWithImage | null>(null)

const disabled = computed(() => {
  const eligible = Boolean(currentGacha.value?.tieredWheelEligibility?.isEligible)
  const pullsLeft = Number(pullsCountNumber.value ?? 0)

  return (
    spinning.value ||
    isLoadingPull.value ||
    isLoadingPullCount.value ||
    !eligible ||
    pullsLeft <= 0
  )
})

const goToUniswap = () => {
  window.open('https://app.uniswap.org/swap?chain=base&inputCurrency=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&outputCurrency=0xfb42da273158b0f642f59f2ba7cc1d5457481677&value=20000&field=output', '_blank')
}

async function handleClickMainCTA() {
  if (!isConnected.value) return handleClickLogInSignUp()
  if (disabled.value) return

  spinning.value = true
  const result = await pullMutation.mutateAsync()
  latest.value = result
  targetSection.value = result.prize.id
}

async function handleClickLogInSignUp() {
  await connect()
}

async function onFinished() {
  if (!latest.value) {
    spinning.value = false
    return
  }

  emit('on-pull-finished', latest.value)
  spinning.value = false

  queryClient.invalidateQueries({ queryKey: ['tradingGachaPullCount'] })
  queryClient.invalidateQueries({ queryKey: ['tradingGachas'] })
  queryClient.invalidateQueries({ queryKey: ['ptScores'] })

}

function onReset() {
  latest.value = null
  targetSection.value = undefined
}

const spinsDone = computed(() => {
  return currentGacha.value?.tieredWheelEligibility.userPullsCount ?? 0
})

const wheelTier = computed<'bronze' | 'silver' | 'gold'>(() => {
  if (!allGachas.value.length) return 'bronze'

  const sorted = [...allGachas.value].sort(
    (a, b) => a.pullsCountEligibility - b.pullsCountEligibility,
  )

  const silver = sorted[1]
  const gold   = sorted[2]

  if (spinsDone.value >= gold.pullsCountEligibility) return 'gold'
  if (spinsDone.value >= silver.pullsCountEligibility) return 'silver'
  return 'bronze'
})
</script>