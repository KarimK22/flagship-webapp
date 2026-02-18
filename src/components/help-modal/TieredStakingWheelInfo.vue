<template>
  <div class="flex flex-col gap-4 w-[90vw] md:w-[388px]">
    <h1 class="text-lavender text-5xl leading-10 font-medium tracking-[-2.4px] whitespace-pre-line">
      {{ t('modals.helpModal.tieredWheelInfo.title') }}
    </h1>

    <div class="flex flex-col gap-4">
      <p class="text-purple-gray text-base md:text-[20px] leading-6 tracking-[-0.6px] whitespace-pre-line">
        {{ t('modals.helpModal.tieredWheelInfo.description') }}
      </p>

      <div
        v-if="lockMultiplierRows.length"
        class="flex flex-col gap-2"
      >
        <p class="text-lavender text-base md:text-[20px] leading-6 tracking-[-0.6px]">
          {{ t('modals.helpModal.tieredWheelInfo.lockMultipliersTitle') }}
        </p>
        <p class="text-purple-gray text-base md:text-[20px] leading-6 tracking-[-0.6px] whitespace-pre-line">
          {{ lockMultiplierRowsText }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { LOCK_DURATION_ID } from '@/types/staking'
import { useTieredStakingWheels } from '@/composables/use-tiered-staking-wheels'

const { t } = useI18n()
const { lockMultipliers } = useTieredStakingWheels()

const lockMultiplierRows = computed(() => {
  const multipliers = lockMultipliers.value ?? {}
  const order = [
    LOCK_DURATION_ID.NO_LOCK,
    LOCK_DURATION_ID.THREE_MONTHS,
    LOCK_DURATION_ID.SIX_MONTHS,
    LOCK_DURATION_ID.TWELVE_MONTHS,
  ]

  return order
    .filter(duration => multipliers[duration] !== undefined)
    .map(duration => ({
      label: t(`modals.helpModal.tieredWheelInfo.lockDurations.${duration}`),
      value: multipliers[duration] ?? 0,
    }))
})

const lockMultiplierRowsText = computed(() => {
  return lockMultiplierRows.value
    .map(row => `${row.label}: x${formatMultiplier(row.value)}`)
    .join('\n')
})

const formatMultiplier = (value: number) => {
  const rounded = Math.round(value * 100) / 100
  return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(2)
}
</script>
