<script setup lang="ts">
import BaseButton from '@/components/ui/button/BaseButton.vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import { TableCell } from '@/components/ui/table'
import { formatNumber, formatNumberToUS } from '@/composables/helpers'
import { onMounted, onUnmounted, ref } from 'vue'
import { LingoRouteName } from '@/router/routes'
import { useRouter } from 'vue-router'
import type { HoldingTableRow } from '@/types/staking'
import { LOCK_DURATION_ID } from '@/types/staking'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const props = withDefaults(defineProps<{
	holding: HoldingTableRow
	showClaimable?: boolean
}>(), {
  showClaimable: false,
})

const isPast = ref(false)
const days = ref('')
const hours = ref('')
const minutes = ref('')
let interval: NodeJS.Timeout

onMounted(() => {
  interval = setInterval(() => {
    isPast.value = props.holding.remainingTime.isPast
    days.value = props.holding.remainingTime.remainingDays
    hours.value = props.holding.remainingTime.remainingHours
    minutes.value = props.holding.remainingTime.remainingMinutes
  }, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})

const handleUpgrade = (stakeId: string) => {
  router.push({
    name: LingoRouteName.STAKING_UPGRADE,
    params: {
      id: stakeId,
    },
  })
}

const handleClaim = (stakeId: string) => {
  router.push({
    name: LingoRouteName.STAKING_CLAIM,
    params: {
      id: stakeId,
    },
  })
}

const lockDurationLabel = (lockDurationId: LOCK_DURATION_ID) => {
  switch (lockDurationId) {
  case LOCK_DURATION_ID.NO_LOCK:
    return t('common.flexible')
  case LOCK_DURATION_ID.THREE_MONTHS:
    return t('common.3Months')
  case LOCK_DURATION_ID.SIX_MONTHS:
    return t('common.6Months')
  case LOCK_DURATION_ID.TWELVE_MONTHS:
    return t('common.12Months')
  default:
    return ''
  }
}
</script>

<template>
  <TableCell class="min-w-[120px]">
    <div class="flex flex-col gap-1">
      <span class="text-purple text-xl leading-6">{{ lockDurationLabel(holding.lockDurationId) }}</span>
    </div>
  </TableCell>
  <TableCell class="min-w-[130px]">
    <div class="flex flex-col gap-1">
      <span class="text-purple text-xl leading-6">{{ formatNumber(Number(holding.amount), 2) }} {{ holding.token }}</span>
      <span class="text-blue-gray text-sm leading-6 font-semibold">${{ holding.amountInFiat }}</span>
    </div>
  </TableCell>
  <TableCell
    v-if="showClaimable"
    class="min-w-[70px]"
  >
    <div
      v-if="isPast"
      class="flex flex-col gap-1"
    >
      <span class="text-purple text-xl leading-6"> {{ t('staking.table.now') }} </span>
      <span class="text-blue-gray text-sm leading-6 font-semibold"> - - </span>
    </div>
    <div
      v-else
      class="flex flex-col gap-1"
    >
      <span class="text-purple text-xl leading-6">{{ days }}</span>
      <span class="text-blue-gray text-sm leading-6 font-semibold">
        {{ hours }}
        {{ minutes }}
      </span>
    </div>
  </TableCell>
  <TableCell class="min-w-[130px]">
    <div class="flex flex-col gap-1">
      <span class="text-purple text-xl leading-6">{{ formatNumberToUS(holding.power) }}</span>
      <span class="text-blue-gray text-sm leading-6 font-semibold text-nowrap">{{ t('staking.table.powerMiles') }}</span>
    </div>
  </TableCell>
  <TableCell class="min-w-[128px]">
    <div class="flex flex-col gap-1">
      <span class="text-purple text-xl leading-6 whitespace-nowrap">{{ formatNumberToUS(holding.dailyPower) }}
        <span class="bg-[#262638] text-purple px-2 rounded-[5rem] text-sm leading-6 inline-block"> {{ t('staking.table.perDay') }} </span></span>
      <span class="text-blue-gray text-sm leading-6 font-semibold text-nowrap inline-block">{{ t('staking.table.powerMiles') }}</span>
    </div>
  </TableCell>
  <TableCell class="min-w-[130px]">
    <div class="flex gap-1 justify-end">
      <!-- TODO: Add disabled button when isPast is true -->
      <GlowButton
        v-if="isPast"
        :color="EButtonColor.BLUE"
        class="flex items-center gap-2"
        @click="handleUpgrade(holding.id)"
      >
        {{ t('staking.table.upgrade') }}
      </GlowButton>
      <BaseButton
        v-else
        variant="classic"
        size="classic"
        class="h-10 text-sm text-lavender border border-[#262638] tracking-[0.42px] disabled:text-purple-gray"
        :disabled="true"
      >
        {{ t('staking.table.upgrade') }}
      </BaseButton>
      <BaseButton
        variant="classic"
        size="classic"
        class="h-10 text-sm text-lavender border border-[#262638] tracking-[0.42px] disabled:text-purple-gray"
        :disabled="!isPast"
        @click="handleClaim(holding.id)"
      >
        {{ t('staking.table.claim') }}
      </BaseButton>
    </div>
  </TableCell>
</template>

<style scoped></style>
