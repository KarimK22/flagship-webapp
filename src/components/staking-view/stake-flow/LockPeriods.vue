<script setup lang="ts">
import bgImage from '@/assets/images/staking/lock-cards-bg.png'
import bgNarrowImage from '@/assets/images/staking/lock-periods-narrow-bg.png'
import StakeOption from '@/components/staking-view/stake-flow/StakeOption.vue'
import { computed, h } from 'vue'
import BalanceBadge from '@/components/user-balance/BalanceBadge.vue'
import { LOCK_DURATION_ID, TRANSACTION_TYPE } from '@/types/staking'
import { useConfig } from '@/composables/config'
import StakeNarrowOption from '@/components/staking-view/stake-flow/StakeNarrowOption.vue'
import type { Raffle } from '@/services/api.ts'

const { lockConfig } = useConfig()
const props = withDefaults(defineProps<{
	transactionType: TRANSACTION_TYPE
	narrow?: boolean
	extraTickets?: Raffle['metadata']['extraTickets']
}>(), {
  narrow: false,
  extraTickets: undefined,
})
const selectedPeriod = defineModel<LOCK_DURATION_ID>({ required: true })

const handlePeriodClick = (period: LOCK_DURATION_ID) => {
  selectedPeriod.value = period
}

const badgeClass = 'inline-block min-w-[24px] align-middle'

const lockPeriods = computed(() => {
  return {
    [LOCK_DURATION_ID.NO_LOCK]: {
      label: 'common.flexible',
      reward: lockConfig.value.lockDurations[LOCK_DURATION_ID.NO_LOCK].boost * 100,
      extraTickets: props.extraTickets?.onStake?.ticketsCountByDuration?.[LOCK_DURATION_ID.NO_LOCK],
      description: 'common.small',
      badge: () =>
        h(
          BalanceBadge,
          { color: '#6D6D8F', class: badgeClass },
          {
            default: () => 'S',
          },
        ),
    },
    [LOCK_DURATION_ID.THREE_MONTHS]: {
      label: 'common.3Months',
      reward: lockConfig.value.lockDurations[LOCK_DURATION_ID.THREE_MONTHS].boost * 100,
      extraTickets: props.extraTickets?.onStake?.ticketsCountByDuration?.[LOCK_DURATION_ID.THREE_MONTHS],
      description: 'common.moreRewards',
      badge: () =>
        h(
          BalanceBadge,
          { color: '#5858F5', class: badgeClass },
          {
            default: () => 'M',
          },
        ),
    },
    [LOCK_DURATION_ID.SIX_MONTHS]: {
      label: 'common.6Months',
      reward: lockConfig.value.lockDurations[LOCK_DURATION_ID.SIX_MONTHS].boost * 100,
      extraTickets: props.extraTickets?.onStake?.ticketsCountByDuration?.[LOCK_DURATION_ID.SIX_MONTHS],
      description: 'common.moreRewards',
      badge: () =>
        h(
          BalanceBadge,
          { color: '#5858F5', class: badgeClass },
          {
            default: () => 'L',
          },
        ),
    },
    [LOCK_DURATION_ID.TWELVE_MONTHS]: {
      label: 'common.12Months',
      reward: lockConfig.value.lockDurations[LOCK_DURATION_ID.TWELVE_MONTHS].boost * 100,
      extraTickets: props.extraTickets?.onStake?.ticketsCountByDuration?.[LOCK_DURATION_ID.TWELVE_MONTHS],
      description: 'common.moreRewards',
      badge: () =>
        h(
          BalanceBadge,
          { color: '#FF9D5C', class: badgeClass },
          {
            default: () => 'VIP',
          },
        ),
    },
  }
})
</script>

<template>
  <div
    v-if="narrow"
    class="flex flex-row flex-nowrap gap-[2px] h-auto"
  >
    <StakeNarrowOption
      :style="`background-image: url(${bgNarrowImage});`"
      class="bg-image-flexible-narrow max-[400px]:w-1/3 w-[128px] h-[296px] bg-no-repeat flex-auto grow-1 md:flex-none"
      :label="$t(lockPeriods[LOCK_DURATION_ID.THREE_MONTHS].label)"
      :is-selected="selectedPeriod === LOCK_DURATION_ID.THREE_MONTHS"
      :extra-tickets="lockPeriods[LOCK_DURATION_ID.THREE_MONTHS].extraTickets"
      @click="() => handlePeriodClick(LOCK_DURATION_ID.THREE_MONTHS)"
    />
    <StakeNarrowOption
      :style="`background-image: url(${bgNarrowImage});`"
      class="bg-image-flexible-narrow max-[400px]:w-1/3 w-[128px] h-[336px] bg-no-repeat flex-auto grow-2 md:flex-none"
      :label="$t(lockPeriods[LOCK_DURATION_ID.SIX_MONTHS].label)"
      :is-selected="selectedPeriod === LOCK_DURATION_ID.SIX_MONTHS"
      :extra-tickets="lockPeriods[LOCK_DURATION_ID.SIX_MONTHS].extraTickets"
      @click="() => handlePeriodClick(LOCK_DURATION_ID.SIX_MONTHS)"
    />
    <StakeNarrowOption
      :style="`background-image: url(${bgNarrowImage});`"
      class="bg-image-flexible-narrow max-[400px]:w-1/3 w-[128px] h-[376px] bg-no-repeat flex-auto grow-3 md:flex-1"
      :label="$t(lockPeriods[LOCK_DURATION_ID.TWELVE_MONTHS].label)"
      :is-selected="selectedPeriod === LOCK_DURATION_ID.TWELVE_MONTHS"
      :extra-tickets="lockPeriods[LOCK_DURATION_ID.TWELVE_MONTHS].extraTickets"
      @click="() => handlePeriodClick(LOCK_DURATION_ID.TWELVE_MONTHS)"
    />
  </div>
  <div
    v-else
    class="flex flex-wrap-reverse md:flex-row md:flex-nowrap gap-2 md:gap-[2px] h-auto"
  >
    <StakeOption
      v-if="transactionType !== TRANSACTION_TYPE.RENEW"
      :style="`background-image: url(${bgImage});`"
      class="bg-image-flexible w-[108px] h-[184px] bg-no-repeat"
      :label="$t(lockPeriods[LOCK_DURATION_ID.NO_LOCK].label)"
      :reward="lockPeriods[LOCK_DURATION_ID.NO_LOCK].reward"
      :description="$t(lockPeriods[LOCK_DURATION_ID.NO_LOCK].description)"
      :is-selected="selectedPeriod === LOCK_DURATION_ID.NO_LOCK"
      :badge="lockPeriods[LOCK_DURATION_ID.NO_LOCK].badge"
      @click="() => handlePeriodClick(LOCK_DURATION_ID.NO_LOCK)"
    />
    <StakeOption
      :style="`background-image: url(${bgImage});`"
      class="bg-image-flexible w-[156px] h-[184px] bg-no-repeat flex-auto grow-1 md:flex-none"
      :label="$t(lockPeriods[LOCK_DURATION_ID.THREE_MONTHS].label)"
      :reward="lockPeriods[LOCK_DURATION_ID.THREE_MONTHS].reward"
      :description="$t(lockPeriods[LOCK_DURATION_ID.THREE_MONTHS].description)"
      :is-selected="selectedPeriod === LOCK_DURATION_ID.THREE_MONTHS"
      :badge="lockPeriods[LOCK_DURATION_ID.THREE_MONTHS].badge"
      @click="() => handlePeriodClick(LOCK_DURATION_ID.THREE_MONTHS)"
    />
    <StakeOption
      :style="`background-image: url(${bgImage});`"
      class="bg-image-flexible w-[156px] h-[184px] bg-no-repeat flex-auto grow-2 md:flex-none"
      :label="$t(lockPeriods[LOCK_DURATION_ID.SIX_MONTHS].label)"
      :reward="lockPeriods[LOCK_DURATION_ID.SIX_MONTHS].reward"
      :description="$t(lockPeriods[LOCK_DURATION_ID.SIX_MONTHS].description)"
      :is-selected="selectedPeriod === LOCK_DURATION_ID.SIX_MONTHS"
      :badge="lockPeriods[LOCK_DURATION_ID.SIX_MONTHS].badge"
      @click="() => handlePeriodClick(LOCK_DURATION_ID.SIX_MONTHS)"
    />
    <StakeOption
      :style="`background-image: url(${bgImage});`"
      class="bg-image-flexible w-auto h-[184px] bg-no-repeat flex-auto grow-3 md:flex-1"
      :label="$t(lockPeriods[LOCK_DURATION_ID.TWELVE_MONTHS].label)"
      :reward="lockPeriods[LOCK_DURATION_ID.TWELVE_MONTHS].reward"
      :description="$t(lockPeriods[LOCK_DURATION_ID.TWELVE_MONTHS].description)"
      :is-selected="selectedPeriod === LOCK_DURATION_ID.TWELVE_MONTHS"
      :badge="lockPeriods[LOCK_DURATION_ID.TWELVE_MONTHS].badge"
      @click="() => handlePeriodClick(LOCK_DURATION_ID.TWELVE_MONTHS)"
    />
  </div>
</template>

<style scoped>
.bg-image-flexible {
	&::after {
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
		pointer-events: none;
	}
	&::before {
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
	background-size: 1005px 548px;
	&:nth-child(1) {
		background-position: -160px center;
	}
	&:nth-child(2) {
		background-position: -320px center;
	}
	&:nth-child(3) {
		background-position: -480px center;
	}
	&:nth-child(4) {
		background-position: -640px center;
	}
}
.bg-image-flexible-narrow {
	&::after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 32px;
		opacity: 0.56;
		background: var(--dark-1, #14141f);
		box-shadow: 0px 0px 48px -16px #1c1c29 inset;
		pointer-events: none;
		mix-blend-mode: screen;
		overflow: hidden;
		pointer-events: none;
	}
	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 32px;
		border: 1px solid #ffffff0d;
		mix-blend-mode: screen;
		overflow: hidden;
		pointer-events: none;
	}
	background-size: 388px 376px;
	&:nth-child(1) {
		background-position: top left;
	}
	&:nth-child(2) {
		background-position: top center;
	}
	&:nth-child(3) {
		background-position: top right;
	}
}
</style>
