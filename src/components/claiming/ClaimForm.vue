<template>
  <Transition name="fade">
    <ProgressModal
      v-model="showProgressModalRef"
      :transaction-type="transactionType"
    />
  </Transition>
  <Transition name="fade">
    <ResultModal
      v-model="showResultModalRef"
      :transaction-type="transactionType"
      @retry-transaction="handleOnConfirm"
    />
  </Transition>
  <div class="flex flex-col">
    <CardLayoutBackground>
      <Transition
        name="slide-fade"
        mode="out-in"
      >
        <ConfirmClaim
          v-if="isConfirm || isClaimTokens"
          :power-miles-per-day="powerMilesPerDay"
          :power-miles-rewards="powerMilesRewards"
          :selected-period="selectedPeriod"
          :amount="String(amount)"
          :handle-on-confirm="handleOnConfirm"
          :transaction-type="transactionType"
        />
        <div
          v-else
          class="flex flex-col rounded-2xl overflow-hidden"
        >
          <div class="flex flex-col gap-4 w-full p-4 z-1">
            <div class="text-sm text-purple-gray font-semibold">
              {{ t('otherComponents.claimForm.selectLockPeriod') }}
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
                    text="?"
                    :help-type="EHelpType.HOW_POWER_MILES_WORK"
                  />{{ t('otherComponents.claimForm.youWillReceive') }}
                  <BalanceBadge
                    color="#FF9D5C"
                    class="h-6 capitalize"
                  >{{
                    LockDurationToDescription[selectedPeriod] || t('otherComponents.claimForm.for1Month')
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
                      unique-ids
                      class="size-10"
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
                      {{ t('otherComponents.claimForm.powerMiles') }}
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
                    text="?"
                    :help-type="EHelpType.WHAT_REWARDS_CAN_I_WIN"
                  />
                  {{ t('otherComponents.claimForm.enoughToUnlock') }}
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
                    >{{ t('otherComponents.claimForm.rewards') }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-full flex justify-center">
              <GlowButton
                class="flex items-center w-[224px] gap-2"
                :color="EButtonColor.BLUE"
                @click="() => {
                  isConfirm = true
                  emit('confirm')
                }"
              >
                <span>{{ t('otherComponents.claimForm.stakeLingo') }}</span>
              </GlowButton>
            </div>
          </div>
        </div>
      </Transition>
    </CardLayoutBackground>
  </div>
</template>
<script setup lang="ts">
import LockPeriods from '@/components/staking-view/stake-flow/LockPeriods.vue'
import powerIcon from '@/assets/images/game/power.svg'
import lockRewardsBg from '@/assets/images/staking/lock-rewards-bg.png'
import InlineSvg from 'vue-inline-svg'
import { EHelpType, LOCK_DURATION_ID, TRANSACTION_TYPE } from '@/types/staking'
import { computed, ref, watch } from 'vue'
import { useConfig } from '@/composables/config'
import {
  LockDurationToDays,
  LockDurationToDescription,
} from '@/types/lock-config'
import { formatNumberToUS } from '@/composables/helpers'
import CardLayoutBackground from '@/components/textures/CardLayoutBackground.vue'
import { useStakes } from '@/composables/contracts/stakes'
import { useBalance } from '@/composables/contracts/balance'
import ResultModal from '@/components/staking-view/stake-flow/ResultModal.vue'
import ProgressModal from '@/components/staking-view/stake-flow/ProgressModal.vue'
import { status } from '@/composables/contracts/status'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import BalanceBadge from '@/components/user-balance/BalanceBadge.vue'
import IconWrapper from '@/components/icon-wrapper/IconWrapper.vue'
import ConfirmClaim from '@/components/claiming/ConfirmClaim.vue'
import { useClaiming } from '@/composables/contracts/claiming.ts'
import HelpButton from '../help-modal/HelpButton.vue'
import mixpanel from 'mixpanel-browser'
import { lockDurationEventsContexts } from '@/const/mixpanel-maps'
import { useApy } from '@/composables/use-apy'
import { useI18n } from 'vue-i18n'

const props = withDefaults(defineProps<{
  title: string
  confirmTitle: string
  transactionType: TRANSACTION_TYPE
  claimId?: string
  isAPY?: boolean
}>(), {
  isAPY: false,
  claimId: undefined,
  transactionType: TRANSACTION_TYPE.CLAIM_AND_STAKE,
})

const emit = defineEmits<{
  (e: 'confirm'): void
}>()

const { t } = useI18n()

const isClaimTokens = computed(() => {
  return [TRANSACTION_TYPE.CLAIM_TOKENS, TRANSACTION_TYPE.CLAIM_APY].includes(props.transactionType)
})

const { lockConfig } = useConfig()
const { oneLingoBaseDailyPower } = useStakes()
const { retryFailedClaim, claimApyEarnings, data: apyData, failedClaims } = useApy()

const smashPowerMilesCost = 100
const selectedPeriod = ref<LOCK_DURATION_ID>(LOCK_DURATION_ID.TWELVE_MONTHS)
const isConfirm = ref<boolean>(false)
const { totalClaimableBalance, refetchClaimableBalance } = useBalance()
const amount = ref<number>(0)

watch(failedClaims, (newFailedClaims) => {
  status.waitForTransaction.global = {
    success: false,
    error: false,
    loading: false,
  }

  if (props.isAPY) {
    if (props.claimId) {
      const claim = newFailedClaims.find((claim) => claim.id === props.claimId)
      amount.value = Number(claim?.amount || 0)
    } else {
      amount.value = apyData.value?.amountEarnedSinceLastClaim
    }
  } else {
    amount.value = totalClaimableBalance.value
  }
}, { immediate: true })

function calculatePowerPerDay(coins: number, lockDuration: LOCK_DURATION_ID) {
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
  const lingoToStake = amount.value
  return calculatePowerPerDay(lingoToStake, selectedPeriod.value)
})

const powerMilesRewards = computed(() => {
  const lockDuration = LockDurationToDays[selectedPeriod.value] || 30
  return powerMilesPerDay.value * lockDuration
})

const smashCount = computed(() => {
  return Math.floor(powerMilesRewards.value / smashPowerMilesCost)
})
const { claimAll, claimAndStakeAll } = useClaiming()
const withStateHandler = async (fn: () => Promise<boolean | void> | undefined) => {
  if (!fn) {
    return
  }

  const result = await fn()
  if (result) {
    const includeStake = [TRANSACTION_TYPE.CLAIM_AND_STAKE, TRANSACTION_TYPE.CLAIM_AND_STAKE_APY].includes(props.transactionType)
    const details = includeStake ? {
      amount: amount.value,
      option: props.transactionType,
      lock_period: lockDurationEventsContexts[selectedPeriod.value],
    } : {
      amount: amount.value,
      option: props.transactionType,
    }
    mixpanel.track('Claim Done', details)
    await refetchClaimableBalance()
    amount.value = 0
  }
}

function handleClaimTokens() {
  if (!amount.value) {
    console.error('No claimable balance')
    return
  }

  return claimAll()
}
function handleClaimAndStake() {
  if (!amount.value || !selectedPeriod.value) {
    console.error('No claimable balance or selected period')
    return
  }
  return claimAndStakeAll(selectedPeriod.value)
}

const handleClaimApy = async () => {
  if (props.claimId) {
    await retryFailedClaim(false)
  } else {
    await claimApyEarnings(false)
  }
  return true
}

const handleClaimAndStakeApy = async () => {
  try {
    if (props.claimId) {
      await retryFailedClaim(true, selectedPeriod.value)
    } else {
      await claimApyEarnings(true, selectedPeriod.value)
    }
    return true
  } catch (error) {
    console.error(error)
    status[props.transactionType].global = {
      error: true,
      loading: false,
      success: false,
    }
    status.waitForTransaction.global = {
      error: true,
      loading: false,
      success: false,
    }
    showResultModalRef.value = true
    return false
  }
}

const handleOnConfirm = async () => {
  let action: () => Promise<boolean | void> | undefined
  let properties = {}
  switch (props.transactionType) {
  case TRANSACTION_TYPE.CLAIM_APY:
  case TRANSACTION_TYPE.CLAIM_TOKENS:
    action = props.isAPY ? handleClaimApy : handleClaimTokens
    properties = {
      amount: amount.value,
      option: props.transactionType,
    }
    break
  case TRANSACTION_TYPE.CLAIM_AND_STAKE:
  case TRANSACTION_TYPE.CLAIM_AND_STAKE_APY:
    action = props.isAPY ? handleClaimAndStakeApy : handleClaimAndStake
    properties = {
      amount: amount.value,
      option: props.transactionType,
      lock_period: lockDurationEventsContexts[selectedPeriod.value],
    }
    break
  }

  try {
    mixpanel.track('Claim Confirmed', properties)
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
const showProgressModalRef = ref<boolean>(false)
const showResultModalRef = ref<boolean>(false)

watch(showProgressModal, (value) => {
  showProgressModalRef.value = value
})
watch(showResultModal, (value) => {
  showResultModalRef.value = value
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
