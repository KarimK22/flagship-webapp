<script setup lang="ts">
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import { BaseTable, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import RowWithTimer from '@/components/staking-view/RowWithTimer.vue'
import type { HoldingTableRow } from '@/types/staking'

withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    rows: HoldingTableRow[]
  }>(),
  {
    modelValue: false,
    title: '',
    rows: () => [],
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    :title="undefined"
    class="w-[900px] max-w-full xs:max-w-none"
    @update:model-value="(value) => emit('update:modelValue', value)"
  >
    <template #header>
      <h2 class="text-lavender text-2xl sm:text-3xl tracking-[-0.6px]">
        {{ title }}
      </h2>
    </template>
    <div class="max-h-[75vh] overflow-y-auto overflow-x-hidden">
      <div class="overflow-x-auto">
        <BaseTable class="border-separate border-spacing-y-1 min-w-[720px]">
          <TableHeader>
            <TableRow class="hover:bg-transparent p-4">
              <TableHead class="w-[120px]">
                <span> {{ $t('staking.lockPeriod') }} </span>
              </TableHead>
              <TableHead class="w-[100px]">
                <span> {{ $t('common.amount') }} </span>
              </TableHead>
              <TableHead class="text-nowrap">
                <span> {{ $t('common.claimableIn') }} </span>
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
              v-for="(holding, key) in rows"
              :key="key"
              class="hover:bg-transparent p-4 rounded-2xl shadow-[inset_0px_0px_48px_-16px_#1C1C29]"
            >
              <RowWithTimer
                :holding="holding"
                show-claimable
              />
            </TableRow>
          </TableBody>
        </BaseTable>
      </div>
    </div>
  </BaseModal>
</template>
