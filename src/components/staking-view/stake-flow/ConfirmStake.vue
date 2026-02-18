<script setup lang="ts">
import powerIcon from '@/assets/images/game/power.svg'
import warningIcon from '@/assets/icons/warning-icon.svg'
import whaleBadgeIcon from '@/assets/images/badges/Whale.png'
import enjoyerBadgeIcon from '@/assets/images/badges/Enjoyer.png'
import element6Icon from '@/assets/images/game/elements/element_6.png'
import PriceInput from './PriceInput.vue'
import InlineSvg from 'vue-inline-svg'
import { computed, ref, watch } from 'vue'
import { LOCK_DURATION_ID, TRANSACTION_TYPE } from '@/types/staking'
import { LockDurationToDays } from '@/types/lock-config'
import { DateTime } from 'luxon'
import { formatNumberToUS } from '@/composables/helpers'
import CardInfo from '@/components/staking-view/stake-flow/CardInfo.vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import { LingoRouteName } from '@/router/routes'
import { useRoute, useRouter } from 'vue-router'
import BalanceBadge from '@/components/user-balance/BalanceBadge.vue'
import { status } from '@/composables/contracts/status'
import { useI18n } from 'vue-i18n'
import { useStakes } from '@/composables/contracts/stakes'
import CardInfoRow from './CardInfoRow.vue'
import { useElements } from '@/composables/elements'
import { useMyBadges } from '@/composables/my-badges'
import { BADGE_ID } from '@/types/shared/badge'

const { t } = useI18n()

const router = useRouter()
const route = useRoute()
const stakeId = route.params.id
const stakes = useStakes()
const { elements } = useElements()
const { myBadges } = useMyBadges()

const hasElementSix = computed(() => {
  if (!elements.value) return false
  return elements.value[6] > 1
})

const element6Count = computed(() => {
  if (!elements.value) return 0
  return elements.value[6] - 1
})

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
    transactionType: TRANSACTION_TYPE.STAKE,
  },
)

const isClaimTokens = computed(() => {
  return props.transactionType === TRANSACTION_TYPE.UNSTAKE
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
)

const lockEndDate = computed(() => {
  const lockEndDate = DateTime.now().plus({ days: LockDurationToDays[props.selectedPeriod] })
  const until = lockEndDate.toFormat('MMM d, yyyy')
  return until
})

const lockMonths = computed(() => {
  const lockMonths = Math.round(LockDurationToDays[props.selectedPeriod] / 30)
  return `${lockMonths} months`
})

const rewardAsText = computed(() => {
  return `${isClaimTokens.value ? '-' : '+'}${formatNumberToUS(props.powerMilesPerDay * 30)}`
})

const all6MonthStakes = computed(() => {
  return stakes.myStakesList.value.filter((stake) => [LOCK_DURATION_ID.SIX_MONTHS, LOCK_DURATION_ID.TWELVE_MONTHS].includes(stake.lockDurationId))
})

const totalWithoutCurrentStake = computed(
  () =>
    all6MonthStakes.value.filter((stake) => stake.id !== stakeId).reduce(
      (acc, stake) => acc + (Number(stake.lingoPrice) * Number(stake.amount)),
      0,
    ),
)

const couldLostWhaleBadge = computed(() => {
  const hasWhaleBadge = myBadges.value.badges.some((badge) => badge.id === BADGE_ID.WHALE)
  if (hasWhaleBadge) {
    return totalWithoutCurrentStake.value < 5000
  }
  return false
})

const couldLostEnjoyerBadge = computed(() => {
  const hasEnjoyerBadge = myBadges.value.badges.some((badge) => badge.id === BADGE_ID.ENJOYER)
  if (hasEnjoyerBadge) {
    return totalWithoutCurrentStake.value < 500
  }
  return false
})

const goToUpgrade = () => {
  router.push({
    name: LingoRouteName.STAKING_UPGRADE,
    params: {
      id: stakeId,
    },
  })
}
</script>

<template>
  <div class="flex flex-col rounded-2xl p-4 gap-2 overflow-hidden">
    <PriceInput
      v-model="amount"
      is-static
    />
    <div class="flex flex-col md:flex-row gap-1">
      <CardInfo
        v-if="!isClaimTokens"
        variant="purple"
        position="left"
        :with-borders="false"
      >
        <template #header>
          <span class="flex justify-between gap-2 text-[16px] text-lavender font-semibold">
            {{ t('staking.stakingFlow.confirmStake.lockPeriod') }}
            <span
              v-if="selectedPeriod !== LOCK_DURATION_ID.NO_LOCK"
              class="text-purple-gray text-[20px] font-normal tracking-[-0.6px]"
            >
              ({{ $t('staking.holdings.until', { date: lockEndDate }) }})
            </span>
          </span>
        </template>
        <template #icon />
        <template #main-text>
          {{ selectedPeriod === LOCK_DURATION_ID.NO_LOCK ? t('staking.stakingFlow.confirmStake.flexible') : lockMonths }}
        </template>
        <template #sub-text>
          <span class="text-purple-gray text-[20px] tracking-[-0.6px] leading-[22px] capitalize" />
        </template>
      </CardInfo>

      <CardInfoRow
        v-if="isClaimTokens"
      >
        <template #header>
          <span
            class="flex gap-2 text-center justify-center text-[16px] text-lavender font-semibold break-words"
          >
            <InlineSvg
              :src="warningIcon"
              class="size-4 my-auto"
              unique-ids="warning-icon-size-4"
            /> {{ $t('components.claimInfoModal.titleWarning') }}
          </span>
        </template>
        <template #main-content>
          <div class="flex relative overflow-hidden flex-col justify-center items-center gap-2 h-24 py-2 px-4 rounded-2xl bg-[rgba(38,_38,_56,_0.64)]">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 size-10 bg-gray-600 blur-[12px]" />
            <InlineSvg
              :src="powerIcon"
              class="size-10 grayscale-100"
              unique-ids="power-icon-size-10"
            />
            <span class="text-lavender text-sm leading-6 font-bold tracking-normal">
              {{ rewardAsText }} <span class="text-purple-gray">{{ $t('components.claimInfoModal.ratePerMonth') }}</span>
            </span>
          </div>
          <div
            v-if="hasElementSix"
            class="flex relative overflow-hidden flex-col justify-center items-center gap-0 h-24 py-2 px-4 rounded-2xl bg-[rgba(38,_38,_56,_0.64)]"
          >
            <div class="absolute top-0 left-1/2 -translate-x-1/2 size-10 bg-gray-600 blur-[12px]" />
            <img
              :src="element6Icon"
              class="h-12 grayscale-100"
              unique-ids="power-icon-size-10"
            >
            <span class="text-lavender text-sm leading-6 font-bold tracking-normal">
              -{{ element6Count }} <span class="text-purple-gray">{{ $t('components.claimInfoModal.element6') }}</span>
            </span>
          </div>
          <div
            v-if="couldLostWhaleBadge"
            class="flex relative overflow-hidden flex-col justify-center items-center gap-2 h-24 py-2 px-4 rounded-2xl bg-[rgba(38,_38,_56,_0.64)]"
          >
            <div class="absolute top-0 left-1/2 -translate-x-1/2 size-10 bg-gray-600 blur-[12px]" />
            <img
              :src="whaleBadgeIcon"
              class="size-10 grayscale-100"
              unique-ids="power-icon-size-10"
            >
            <span class="text-lavender text-sm leading-6 font-bold tracking-normal">
              <span class="text-purple-gray">{{ $t('components.claimInfoModal.whaleBadge') }}</span>
            </span>
          </div>
          <div
            v-if="couldLostEnjoyerBadge"
            class="flex relative overflow-hidden flex-col justify-center items-center gap-2 h-24 py-2 px-4 rounded-2xl bg-[rgba(38,_38,_56,_0.64)]"
          >
            <div class="absolute top-0 left-1/2 -translate-x-1/2 size-10 bg-gray-600 blur-[12px]" />
            <img
              :src="enjoyerBadgeIcon"
              class="size-10 grayscale-100"
              unique-ids="power-icon-size-10"
            >
            <span class="text-lavender text-sm leading-6 font-bold tracking-normal">
              <span class="text-purple-gray">{{ $t('components.claimInfoModal.enjoyerBadge') }}</span>
            </span>
          </div>
          <div
            v-if="couldLostWhaleBadge"
            class="flex relative overflow-hidden flex-col justify-center items-center gap-2 h-24 py-2 px-4 rounded-2xl bg-[rgba(38,_38,_56,_0.64)]"
          >
            <div class="absolute top-0 left-1/2 -translate-x-1/2 size-10 bg-gray-600 blur-[12px]" />
            <InlineSvg
              :src="powerIcon"
              class="size-10 grayscale-100"
              unique-ids="power-icon-size-10"
            />
            <span class="text-lavender text-sm leading-6 font-bold tracking-normal">
              10% <span class="text-purple-gray">{{ $t('components.claimInfoModal.powerBoost') }}</span>
            </span>
          </div>
        </template>
      </CardInfoRow>
      <CardInfo
        v-else
        variant="orange"
        position="left"
        :with-borders="false"
        class="sm:h-32!"
      >
        <template #header>
          <span
            class="flex gap-2 text-[16px] text-lavender font-semibold"
          >
            {{ t('staking.stakingFlow.confirmStake.youWillReceive') }}
            <BalanceBadge
              color="#5858F5"
              class="h-6 text-lavender align-middle inline-block"
            >{{ t('staking.stakingFlow.confirmStake.perDay') }}</BalanceBadge>
          </span>
        </template>
        <template #icon>
          <InlineSvg
            :src="powerIcon"
            class="size-10"
            unique-ids="power-icon-size-10"
          />
        </template>
        <template
          #main-text
        >
          <span>
            {{ rewardAsText }}
          </span>
        </template>
        <template
          #sub-text
        >
          <span class="text-purple-gray sm:text-[20px] tracking-[-0.6px] leading-[22px]">
            {{ t('staking.stakingFlow.confirmStake.powerMiles') }}
          </span>
        </template>
      </CardInfo>
    </div>
    <div class="w-full flex flex-col gap-2 min-[420px]:flex-row justify-center items-center">
      <GlowButton
        v-if="isClaimTokens"
        class="flex items-center w-[224px] gap-2"
        :color="EButtonColor.ORANGE"
        :disabled="isLoading"
        @click="goToUpgrade"
      >
        <span>{{ t('staking.stakingFlow.confirmStake.upgradeToGetMore') }}</span>
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
        <span>{{ isClaimTokens ? t('staking.stakingFlow.confirmStake.claim') : t('staking.stakingFlow.confirmStake.confirm') }}</span>
      </GlowButton>
    </div>
  </div>
</template>

<style scoped></style>
