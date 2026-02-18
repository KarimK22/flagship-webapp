<script setup lang="ts">
import { BaseTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import EmptyTable from '@/components/staking-view/EmptyTable.vue'
import HoldingsDetailsModal from '@/components/staking-view/HoldingsDetailsModal.vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import { computed, ref, shallowRef, watch } from 'vue'
import { useStakingTableData } from '@/composables/contracts/staking-table-data'
import { formatNumber, formatNumberToUS } from '@/composables/helpers'
import type { HoldingTableGroup } from '@/types/staking'
import { LOCK_DURATION_ID } from '@/types/staking'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { tableData, groupedTableData } = useStakingTableData()

const activeGroup = shallowRef<HoldingTableGroup | null>(null)
const isDetailsOpen = ref(false)

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

const detailsTitle = computed(() => {
  if (!activeGroup.value) return ''
  return t('staking.table.detailsTitle', {
    lockDuration: lockDurationLabel(activeGroup.value.lockDurationId),
  })
})

const openDetails = (group: HoldingTableGroup) => {
  activeGroup.value = group
  isDetailsOpen.value = true
}

watch(isDetailsOpen, (value) => {
  if (!value) activeGroup.value = null
})
</script>

<template>
  <div class="flex flex-col gap-2 mt-2">
    <EmptyTable v-if="!tableData.length" />
    <BaseTable
      v-else
      class="border-separate border-spacing-y-1"
    >
      <TableHeader>
        <TableRow class="hover:bg-transparent p-4">
          <TableHead class="w-[120px]">
            <span> {{ $t('staking.lockPeriod') }} </span>
          </TableHead>
          <TableHead class="w-[100px]">
            <span> {{ $t('common.amount') }} </span>
          </TableHead>
          <TableHead>
            <span> {{ $t('common.generated') }} </span>
          </TableHead>
          <TableHead>
            <span> {{ $t('common.rate') }} </span>
          </TableHead>
          <TableHead class="text-right" />
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="(group, key) in groupedTableData"
          :key="key"
          class="hover:bg-transparent p-4 rounded-2xl shadow-[inset_0px_0px_48px_-16px_#1C1C29]"
        >
          <TableCell class="min-w-[120px]">
            <div class="flex flex-col gap-1">
              <span class="text-purple text-xl leading-6">{{ lockDurationLabel(group.lockDurationId) }}</span>
            </div>
          </TableCell>
          <TableCell class="min-w-[130px]">
            <div class="flex flex-col gap-1">
              <span class="text-purple text-xl leading-6">{{ formatNumber(group.totalAmount, 2) }} LINGO</span>
              <span class="text-blue-gray text-sm leading-6 font-semibold">${{ formatNumberToUS(group.totalAmountInFiat) }}</span>
            </div>
          </TableCell>
          <TableCell class="min-w-[130px]">
            <div class="flex flex-col gap-1">
              <span class="text-purple text-xl leading-6">{{ formatNumberToUS(group.totalPower) }}</span>
              <span class="text-blue-gray text-sm leading-6 font-semibold text-nowrap">{{ t('staking.table.powerMiles') }}</span>
            </div>
          </TableCell>
          <TableCell class="min-w-[128px]">
            <div class="flex flex-col gap-1">
              <span class="text-purple text-xl leading-6 whitespace-nowrap">
                {{ formatNumberToUS(group.totalDailyPower) }}
                <span class="bg-[#262638] text-purple px-2 rounded-[5rem] text-sm leading-6 inline-block"> {{ t('staking.table.perDay') }} </span>
              </span>
              <span class="text-blue-gray text-sm leading-6 font-semibold text-nowrap inline-block">{{ t('staking.table.powerMiles') }}</span>
            </div>
          </TableCell>
          <TableCell class="min-w-[130px]">
            <div class="flex justify-end">
              <GlowButton
                :color="EButtonColor.BLUE"
                class="h-10 text-[11px] sm:text-sm tracking-[0.42px] whitespace-nowrap"
                @click="openDetails(group)"
              >
                {{ t('staking.table.showDetails') }}
              </GlowButton>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </BaseTable>
  </div>

  <HoldingsDetailsModal
    v-if="activeGroup"
    v-model="isDetailsOpen"
    :title="detailsTitle"
    :rows="activeGroup.rows"
  />
</template>

<style scoped>
span {
	letter-spacing: -0.6px;
}
span.text-blue-gray {
	letter-spacing: -0.28px;
}
</style>
