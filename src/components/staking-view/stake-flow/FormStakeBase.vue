<script setup lang="ts">
import PriceInput from '@/components/staking-view/stake-flow/PriceInput.vue'
import LockPeriods from '@/components/staking-view/stake-flow/LockPeriods.vue'
import powerIcon from '@/assets/images/game/power.svg'
import lockRewardsBg from '@/assets/images/staking/lock-rewards-bg.png'
import InlineSvg from 'vue-inline-svg'
import { EHelpType, LOCK_DURATION_ID, TRANSACTION_TYPE } from '@/types/staking'
import { computed, onMounted, ref, watch } from 'vue'
import { useConfig } from '@/composables/config'
import {
  LockDurationToDays,
  LockDurationToDescription,
} from '@/types/lock-config'
import { formatNumberToUS, redirectToService } from '@/composables/helpers'
import ConfirmStake from '@/components/staking-view/stake-flow/ConfirmStake.vue'
import CardLayoutBackground from '@/components/textures/CardLayoutBackground.vue'
import { useStakes } from '@/composables/contracts/stakes'
import { useStaking } from '@/composables/contracts/staking'
import { useBalance } from '@/composables/contracts/balance'
import ResultModal from '@/components/staking-view/stake-flow/ResultModal.vue'
import ProgressModal from '@/components/staking-view/stake-flow/ProgressModal.vue'
import NoLingoModal from '@/components/staking-view/stake-flow/NoLingoModal.vue'
import { status } from '@/composables/contracts/status'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import type { Stake } from '@/services/api'
import BalanceBadge from '@/components/user-balance/BalanceBadge.vue'
import IconWrapper from '@/components/icon-wrapper/IconWrapper.vue'
import HelpButton from '@/components/help-modal/HelpButton.vue'
import {
  lockDurationEventsContexts,
  stakeEventsContexts,
  wizardEventContexts,
} from '@/const/mixpanel-maps'
import mixpanel from 'mixpanel-browser'
import { formatEther, parseEther } from 'viem'
import { useGetMe } from '@/composables/get-me'
import { useI18n } from 'vue-i18n'
import { useFirstStakeModal } from '@/composables/use-first-stake-modal'
import api from '@/services/api'

const { stake: doStake, renewStake, unstake } = useStaking()
const props = withDefaults(
  defineProps<{
    stake?: Stake
    title: string
    confirmTitle: string
    transactionType: TRANSACTION_TYPE
  }>(),
  {
    stake: undefined,
  },
)

const { accountAddress } = useGetMe()

const { t, locale } = useI18n()

const isClaimTokens = computed(() => {
  return props.transactionType === TRANSACTION_TYPE.UNSTAKE
})

const { lockConfig } = useConfig()
const { oneLingoBaseDailyPower, refetchMyStakes, hasStakes } = useStakes()
const { setCurrentAccountValue } = useFirstStakeModal()

const { refetchTokenBalance, tokenBalanceAsString: userBalance, tokenBalance } = useBalance()
const smashPowerMilesCost = 100
const showNoLingoModal = ref<boolean>(false)
const selectedPeriod = ref<LOCK_DURATION_ID>(LOCK_DURATION_ID.TWELVE_MONTHS)
const amount = ref<string>('0')
const isConfirm = ref<boolean>(false)
const amountInput = ref<HTMLElement>()

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const presetAmount = urlParams.get('presetAmount')
  if (presetAmount) {
    amount.value = String(presetAmount)
  }
  if (!amountInput.value) {
    amountInput.value = document.getElementById('amount-input')!
  }

  /* TRANSACTION_TYPE.STAKE event is already tracked in multiple views */
  if (props.transactionType !== TRANSACTION_TYPE.STAKE) {
    mixpanel.track(`${stakeEventsContexts[props.transactionType]} Started`)
  }

  /* clear the waitForTransaction status */
  status.waitForTransaction.global = {
    success: false,
    error: false,
    loading: false,
  }
})

// Show modal when user has no LINGO and is trying to stake
const noLingoModalShown = ref(false)
watch(tokenBalance, (balance) => {
  if (
    props.transactionType === TRANSACTION_TYPE.STAKE
    && balance === 0
    && accountAddress.value
    && !noLingoModalShown.value
  ) {
    showNoLingoModal.value = true
    noLingoModalShown.value = true
  }
}, { immediate: true })

watch(() => props.stake, (stake) => {
  if (stake?.id) {
    amount.value = String(stake.amount)
    selectedPeriod.value = isClaimTokens.value
      ? stake.lockDurationId
      : LOCK_DURATION_ID.TWELVE_MONTHS
  }
}, { immediate: true })

function calculatePowerPerDay(coins: number, lockDuration: LOCK_DURATION_ID) {
  if (isClaimTokens.value && props.stake?.dailyPower) {
    return props.stake.dailyPower
  }

  if (!lockConfig.value) {
    throw new Error('Lock config not available')
  }

  const lockData = lockConfig.value.lockDurations[lockDuration]
  if (!lockData) {
    throw new Error(`Invalid lock duration: ${lockDuration}`)
  }
  const boost = 1 + lockData.boost
  const factor = oneLingoBaseDailyPower.value
  return coins * factor * boost
}

const powerMilesPerDay = computed(() => {
  const lingoToStake = Number(amount.value)
  const powerPerDay = calculatePowerPerDay(lingoToStake, selectedPeriod.value)
  return powerPerDay
})

const powerMilesRewards = computed(() => {
  const lockDuration = LockDurationToDays[selectedPeriod.value] || 30
  const powerMilesRewards = powerMilesPerDay.value * lockDuration
  return powerMilesRewards
})

const smashCount = computed(() => {
  return Math.floor(powerMilesRewards.value / smashPowerMilesCost)
})

const handleShowConfirm = () => {
  /* TODO: check if the amount is valid, user has enough balance */
  const isValid = Number(amount.value) > 0
  if (!isValid) {
    amountInput.value?.focus()
    return
  }
  mixpanel.track(
    `${stakeEventsContexts[props.transactionType]} Lock Duration Selected`,
    {
      lockDuration: lockDurationEventsContexts[selectedPeriod.value],
    },
  )
  isConfirm.value = true
}

const withStateHandler = async (fn: () => Promise<boolean> | undefined) => {
  if (!fn) {
    return
  }

  const result = await fn()
  if (result) {
    if (props.transactionType === TRANSACTION_TYPE.UNSTAKE) {
      mixpanel.track(`${stakeEventsContexts[props.transactionType]} Done`, {
        amount: props.stake!.amount,
      })
    } else {
      mixpanel.track(`${stakeEventsContexts[props.transactionType]} Done`, {
        amount: amount.value,
        lockDuration: lockDurationEventsContexts[selectedPeriod.value],
      })
    }

    if (!hasStakes.value) {
      setCurrentAccountValue(true)
    }
    await refetchTokenBalance()
    await refetchMyStakes()
    amount.value = '0'
  }
}

function handleStake() {
  if (!amount.value || !selectedPeriod.value) {
    return
  }

  return doStake(amount.value, selectedPeriod.value)
}

async function handleUpgrade(): Promise<boolean> {
  if (!amount.value || !selectedPeriod.value || !props.stake?.unlockBlock) {
    return false
  }

  const unlockBlock = String(props.stake.unlockBlock)
  try {
    await api.startStakingUpgrade({ amount: String(amount.value) })
  } catch (error) {
    console.warn('Failed to notify staking upgrade start', error)
  }
  return await renewStake(props.stake.amount, selectedPeriod.value, unlockBlock)
}

function handleClaimTokens() {
  if (!amount.value || !props.stake?.unlockBlock) {
    return
  }

  const unlockBlock = String(props.stake.unlockBlock)
  return unstake(props.stake.amount, unlockBlock)
}

const handleOnConfirm = async () => {
  let action: () => Promise<boolean> | undefined
  switch (props.transactionType) {
  case TRANSACTION_TYPE.STAKE:
    action = handleStake
    break
  case TRANSACTION_TYPE.RENEW:
    action = handleUpgrade
    break
  case TRANSACTION_TYPE.UNSTAKE:
    action = handleClaimTokens
    break
  }

  try {
    if (props.transactionType === TRANSACTION_TYPE.UNSTAKE) {
      mixpanel.track(
        `${stakeEventsContexts[props.transactionType]} Confirmed`,
        {
          amount: amount.value,
        },
      )
    } else {
      const lockDuration = LockDurationToDays[selectedPeriod.value]
      mixpanel.track(
        `${stakeEventsContexts[props.transactionType]} Confirmed`,
        {
          amount: amount.value,
          lockDuration,
        },
      )
    }

    await withStateHandler(() => action())
  } catch (error) {
    console.error(error)
  }
}

const showResultModal = computed(() => {
  const { global: currentGlobalStatus } = status[props.transactionType]
  const { global: waitForTransactionGlobalStatus } = status.waitForTransaction

  const isSuccessOrError = (status: { success: boolean; error: boolean }) =>
    status?.success || status?.error

  return Boolean(
    isSuccessOrError(currentGlobalStatus) ||
      isSuccessOrError(waitForTransactionGlobalStatus),
  )
})

const showProgressModal = computed(() => {
  const { global: currentGlobalStatus } = status[props.transactionType]
  const { global: waitForTransactionGlobalStatus } = status.waitForTransaction

  const isLoading = (status: { loading: boolean }) => status?.loading

  return Boolean(
    isLoading(currentGlobalStatus) || isLoading(waitForTransactionGlobalStatus),
  )
})

const showBuyLingoButton = computed(() => {
  const isStake = props.transactionType === TRANSACTION_TYPE.STAKE
  const userBalanceEther = parseEther(userBalance.value)
  const amountEther = parseEther(String(amount.value))
  return (userBalanceEther <= 0 || userBalanceEther < amountEther) && isStake
})

const showProgressModalRef = ref<boolean>(false)
const showResultModalRef = ref<boolean>(false)

watch(showProgressModal, (value) => {
  showProgressModalRef.value = value
})
watch(showResultModal, (value) => {
  showResultModalRef.value = value
})

const buyLingo = () => {
  if (!accountAddress.value) {
    return
  }

  /* NOTE: Should we use Bigint instead of number? */
  const userBalanceEther = parseEther(userBalance.value)
  const amountEther = parseEther(String(amount.value))
  const amountToBuyInEther = formatEther(amountEther - userBalanceEther)
  const amountToBuy = Math.max(Number(amountToBuyInEther), 1) * 1.02
  mixpanel.track('Buy Lingo', {
    entryPoint: 'stakingPage',
    amount: amountToBuy,
  })
  redirectToService('https://buy.kryptonim.com/redirect-form', {
    currency: 'USD',
    convertedCurrency: 'LINGO',
    convertedAmount: amountToBuy,
    blockchain: 'Base',
    address: accountAddress.value,
    theme: 'dark',
    successUrl: `${window.location.href}`,
  })
}
</script>

<template>
  <div class="absolute">
    <ProgressModal
      v-model="showProgressModalRef"
      :transaction-type="transactionType"
    />
    <ResultModal
      v-model="showResultModalRef"
      :transaction-type="transactionType"
      @retry-transaction="handleOnConfirm"
    />
    <NoLingoModal
      v-model="showNoLingoModal"
      @buy-lingo="buyLingo"
    />
  </div>
  <div class="flex flex-col">
    <h1
      class="text-4xl sm:text-5.5xl tracking-[-2.24px] md:leading-22 sm:leading-[unset] mb-2 sm:mb-0 text-lavender"
      :class="{ 'md:leading-14!': locale !== 'en' }"
    >
      {{ isConfirm ? confirmTitle : title }}
    </h1>
    <CardLayoutBackground class="mt-8">
      <Transition
        mode="out-in"
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-x-6"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-[-24px]"
      >
        <ConfirmStake
          v-if="isConfirm || isClaimTokens"
          :power-miles-per-day="powerMilesPerDay"
          :power-miles-rewards="powerMilesRewards"
          :selected-period="selectedPeriod"
          :amount="amount"
          :handle-on-confirm="handleOnConfirm"
          :transaction-type="transactionType"
        />
        <div
          v-else
          class="flex flex-col rounded-2xl overflow-hidden"
        >
          <PriceInput
            v-model="amount"
            :disabled="transactionType === TRANSACTION_TYPE.RENEW"
          />
          <div class="flex flex-col gap-4 w-full p-4 z-1">
            <div class="text-sm text-purple-gray font-semibold">
              {{ t('staking.stakingFlow.formStakeBase.lockPeriod') }}
            </div>
            <LockPeriods
              v-model="selectedPeriod"
              :transaction-type="transactionType"
            />
            <div
              class="flex flex-wrap flex-col md:flex-row justify-between overflow-hidden gap-2 w-full min-h-[128px] rounded-2xl bg-cover bg-left p-1 bg-[#1c1c29e0] inset-shadow-[0px_0px_48px_-16px_#1C1C29]"
            >
              <div
                class="flex flex-col justify-between gap-4 p-3 md:min-w-[392px]"
              >
                <span
                  class="flex gap-2 text-[14px] sm:text-[16px] text-lavender font-semibold"
                >
                  <HelpButton
                    :context="wizardEventContexts[transactionType]"
                    text="?"
                    :help-type="EHelpType.HOW_POWER_MILES_WORK"
                  />{{ t('staking.stakingFlow.formStakeBase.youWillReceive') }}
                  <BalanceBadge
                    color="#FF9D5C"
                    class="h-6 capitalize"
                  >{{
                    LockDurationToDescription[selectedPeriod] || t('staking.stakingFlow.formStakeBase.for1Month')
                  }}</BalanceBadge>
                </span>
                <div class="flex gap-2">
                  <IconWrapper
                    class="!z-0"
                    variant="orange"
                    :with-borders="false"
                  >
                    <InlineSvg
                      :src="powerIcon"
                      class="size-10"
                      unique-ids="power-icon-size-10"
                    />
                  </IconWrapper>
                  <span
                    class="text-lavender text-5xl leading-10 tracking-[-4.32px]"
                  >
                    {{ formatNumberToUS(powerMilesRewards) }}
                  </span>
                  <div class="flex flex-col justify-end gap-1">
                    <span
                      class="text-purple-gray text-[20px] tracking-[-0.6px] leading-[22px]"
                    >
                      {{ t('staking.stakingFlow.formStakeBase.powerMiles') }}
                    </span>
                  </div>
                </div>
              </div>
              <div
                :style="`background-image: url(${lockRewardsBg})`"
                class="flex flex-col justify-between gap-2 h-[120px] w-full md:min-w-[280px] md:flex-1 rounded-2xl bg-[#14141F] bg-contain bg-right bg-no-repeat p-4"
              >
                <span
                  class="flex gap-2 text-[16px] text-lavender font-semibold tracking-[0.16px]"
                >
                  <HelpButton
                    :context="wizardEventContexts[transactionType]"
                    text="?"
                    :help-type="EHelpType.WHAT_REWARDS_CAN_I_WIN"
                  />
                  {{ t('staking.stakingFlow.formStakeBase.enoughToUnlock') }}
                </span>
                <div class="flex gap-2">
                  <span
                    class="text-lavender text-5xl leading-10 tracking-[-3.84px]"
                  >
                    {{ smashCount }}
                  </span>
                  <div class="flex flex-col justify-end gap-1">
                    <span />
                    <span
                      class="text-purple-gray text-[20px] tracking-[-0.6px] leading-[22px]"
                    >{{ t('staking.stakingFlow.formStakeBase.rewards') }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-full flex justify-center">
              <GlowButton
                v-if="showBuyLingoButton"
                class="flex items-center w-[224px] gap-2"
                :color="EButtonColor.BLUE"
                @click="buyLingo"
              >
                <span>{{ t('staking.stakingFlow.formStakeBase.buyLingo') }}</span>
              </GlowButton>
              <GlowButton
                v-else
                class="flex items-center w-[224px] gap-2"
                :color="EButtonColor.BLUE"
                @click="handleShowConfirm"
              >
                <span>{{ t('staking.stakingFlow.formStakeBase.stakeLingo') }}</span>
              </GlowButton>
            </div>
          </div>
        </div>
      </Transition>
    </CardLayoutBackground>
  </div>
</template>

<style scoped>
.transition {
  transition-property: all;
}

.duration-150 {
  transition-duration: 150ms;
}

.duration-200 {
  transition-duration: 200ms;
}

.duration-300 {
  transition-duration: 300ms;
}

.ease-in {
  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
}

.ease-out {
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}

.scale-95 {
  transform: scale(0.95);
}

.scale-100 {
  transform: scale(1);
}
</style>
