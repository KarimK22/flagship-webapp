<template>
  <div class="flex flex-col rounded-2xl p-4 gap-2 overflow-hidden">
    <PriceInput
      v-model="amount"
      is-static
    />
    <div
      v-if="!isClaimTokens"
      class="flex flex-col md:flex-row gap-1"
    >
      <CardInfo
        variant="purple"
        position="left"
        :with-borders="false"
      >
        <template #header>
          <span class="flex justify-between gap-2 text-[16px] text-lavender font-semibold">
            {{ $t('components.confirmClaim.lockPeriod') }}
            <span
              v-if="selectedPeriod !== LOCK_DURATION_ID.NO_LOCK"
              class="text-purple-gray text-[20px] font-normal tracking-[-0.6px]"
            >
              {{ lockEndDate }}
            </span>
          </span>
        </template>
        <template #icon />
        <template #main-text>
          {{ selectedPeriod === LOCK_DURATION_ID.NO_LOCK ? $t('components.confirmClaim.flexible') : lockMonths }}
        </template>
        <template #sub-text>
          <span class="text-purple-gray text-[20px] tracking-[-0.6px] leading-[22px] capitalize" />
        </template>
      </CardInfo>
      <CardInfo
        variant="orange"
        position="left"
        :with-borders="false"
        :class="{ '[&>*]:justify-center': isClaimTokens }"
      >
        <template #header>
          <span class="flex gap-2 text-[16px] text-lavender font-semibold">
            {{ $t('components.confirmClaim.youWillReceive') }}
            <BalanceBadge
              color="#5858F5"
              class="h-6 text-lavender align-middle inline-block"
            >{{ $t('components.confirmClaim.perDay') }}</BalanceBadge>
          </span>
        </template>
        <template #icon>
          <InlineSvg
            :src="powerIcon"
            unique-ids
            class="size-10"
          />
        </template>
        <template #main-text>
          {{ rewardAsText }}
        </template>
        <template #sub-text>
          <span class="text-purple-gray sm:text-[20px] tracking-[-0.6px] leading-[22px]">
            {{ $t('components.confirmClaim.powerMiles') }}
            <BalanceBadge
              v-if="isClaimTokens"
              color="#5858F5"
              class="h-6 text-lavender align-middle inline-block"
            >{{ $t('components.confirmClaim.perDay') }}</BalanceBadge>
          </span>
        </template>
      </CardInfo>
    </div>
    <div
      v-else
      class="flex flex-col justify-center items-center gap-2 w-full"
    >
      <p class="text-lavender text-[32px] font-normal leading-8 tracking-[-1.28px] break-words text-center mt-10">
        {{ $t('components.confirmClaim.missingRewards') }}
      </p>
      <div v-if="rewardsNumber >= 1">
        <span class="text-purple-gray text-base font-semibold leading-4 tracking-[0.16px]">
          {{ $t('components.confirmClaim.canGetUpTo') }} <span class="text-center text-[40px] font-normal leading-8 tracking-[-2.8px] text-white relative">
            <span class="absolute inset-0 blur-[20px] opacity-60 bg-white rounded-full" />
            <span class="relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">{{ rewardsNumber }}</span>
          </span> {{ $t('components.confirmClaim.rewards') }}
        </span>
        <BalanceBadge
          color="#5858F5"
          class="bg-sosiska/12 h-6 text-lavender align-middle inline-block"
        >
          {{ $t('components.confirmClaim.perMonth') }}
        </BalanceBadge>
      </div>
    </div>
    <div class="w-full flex flex-col min-[420px]:flex-row justify-center items-center mt-12">
      <GlowButton
        v-if="isClaimTokens"
        class="flex items-center w-[224px] gap-2"
        :color="EButtonColor.ORANGE"
        :disabled="isLoading"
        @click="getRewards"
      >
        <span>{{ $t('components.confirmClaim.getRewards') }}</span>
      </GlowButton>
      <GlowButton
        class="flex items-center w-[224px] gap-2"
        :color="EButtonColor.BLUE"
        :disabled="isLoading"
        :class="{
          '!w-[158px]': isClaimTokens,
        }"
        @click="handleOnConfirm"
      >
        <span>{{ isClaimTokens ? $t('components.confirmClaim.claim') : $t('components.confirmClaim.confirm') }}</span>
      </GlowButton>
    </div>
  </div>
</template>
<script setup lang="ts">
import PriceInput from '@/components/staking-view/stake-flow/PriceInput.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { LOCK_DURATION_ID, TRANSACTION_TYPE } from '@/types/staking'
import { LockDurationToDays } from '@/types/lock-config'
import powerIcon from '@/assets/images/game/power.svg'
import { DateTime } from 'luxon'
import { formatNumberToUS } from '@/composables/helpers'
import CardInfo from '@/components/staking-view/stake-flow/CardInfo.vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import { LingoRouteName } from '@/router/routes'
import { useRouter } from 'vue-router'
import BalanceBadge from '@/components/user-balance/BalanceBadge.vue'
import { status } from '@/composables/contracts/status'
import { useBalance } from '@/composables/contracts/balance.ts'
import mixpanel from 'mixpanel-browser'
import InlineSvg from 'vue-inline-svg'
import { lockDurationEventsContexts, stakeEventsContexts } from '@/const/mixpanel-maps'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

const props = withDefaults(
  defineProps<{
		powerMilesPerDay: number
		powerMilesRewards: number
		selectedPeriod: LOCK_DURATION_ID
		amount: string
		handleOnConfirm: () => void
		transactionType?: TRANSACTION_TYPE
	}>(),
  {
    powerMilesPerDay: 0,
    powerMilesRewards: 0,
    selectedPeriod: LOCK_DURATION_ID.NO_LOCK,
    amount: '0',
    transactionType: TRANSACTION_TYPE.CLAIM_AND_STAKE,
  },
)

onMounted(() => {
  const isClaimAndStake = [TRANSACTION_TYPE.CLAIM_AND_STAKE, TRANSACTION_TYPE.CLAIM_AND_STAKE_APY].includes(props.transactionType)
  const properties = isClaimAndStake ? {
    amount: amount.value,
    option: props.transactionType,
    lock_period: lockDurationEventsContexts[props.selectedPeriod],
  } : {
    amount: amount.value,
    option: props.transactionType,
  }

  mixpanel.track(`${stakeEventsContexts[props.transactionType]} Option Selected`, properties)
})

const isClaimTokens = computed(() => {
  return [TRANSACTION_TYPE.CLAIM_TOKENS, TRANSACTION_TYPE.CLAIM_APY].includes(props.transactionType)
})

const isLoading = computed(() => {
  return status[props.transactionType].global?.loading
})

const amount = ref(props.amount)

watch(
  () => props.amount,
  (newValue) => {
    amount.value = newValue
  },
  {
    immediate: true,
  },
)

const lockEndDate = computed(() => {
  const lockEndDate = DateTime.now().plus({ days: LockDurationToDays[props.selectedPeriod] })
  const until = lockEndDate.toFormat('MMM d, yyyy')
  return `(${t('components.confirmClaim.until')} ${until})`
})

const lockMonths = computed(() => {
  const lockMonths = Math.round(LockDurationToDays[props.selectedPeriod] / 30)
  return `${lockMonths} ${t('components.confirmClaim.months')}`
})

const rewardAsText = computed(() => {
  return `${isClaimTokens.value ? '-' : '+'} ${formatNumberToUS(props.powerMilesPerDay)}`
})

const { totalClaimableBalance } = useBalance()
const rewardsNumber = computed(() => {
  const base = 0.05
  const asteroidPrice = 100
  return Math.floor(totalClaimableBalance.value * base * (1 + 1.8) * 30 / asteroidPrice)
})

function getRewards() {
  const params = new URLSearchParams(window.location.search)
  const apy = params.get('apy')
  const claimId = params.get('claimId')
  router.push({
    name: LingoRouteName.CLAIM_WIZARD,
    query: apy ? {
      apy,
      claimId,
    } : undefined,
  })
}
</script>

<style scoped></style>
