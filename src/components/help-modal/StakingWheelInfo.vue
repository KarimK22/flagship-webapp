<template>
  <div
    class="flex flex-col gap-4 w-[90vw] md:w-[520px] max-h-[70vh] overflow-y-auto pr-1"
  >
    <h1 class="text-lavender text-2xl md:text-3xl leading-9 font-medium tracking-[-1.2px] whitespace-pre-line">
      {{ t('rewards.stakingWheel.tooltip.title') }}
    </h1>

    <div class="flex flex-col gap-5 text-purple-gray text-sm md:text-base leading-5 md:leading-6">
      <div>
        <p class="text-lavender font-semibold tracking-[-0.16px]">
          {{ t('rewards.stakingWheel.tooltip.sections.pickWheel.title') }}
        </p>
        <div
          class="mt-2 grid grid-cols-[92px_90px_1fr] gap-x-3 gap-y-1 text-xs md:text-sm"
        >
          <template
            v-for="item in pickWheelItems"
            :key="item.label"
          >
            <span class="font-medium text-lavender whitespace-nowrap">{{ item.label }}</span>
            <span class="whitespace-nowrap">{{ item.detail }}</span>
            <span class="text-right">{{ item.prizes }}</span>
          </template>
        </div>
      </div>

      <div>
        <p class="text-lavender font-semibold tracking-[-0.16px]">
          {{ t('rewards.stakingWheel.tooltip.sections.spins.title') }}
        </p>
        <p class="mt-1 text-xs md:text-sm">
          {{ t('rewards.stakingWheel.tooltip.sections.spins.rule') }}
        </p>
        <p class="mt-2 text-xs md:text-sm">
          {{ t('rewards.stakingWheel.tooltip.sections.spins.bonusTitle') }}
        </p>
        <div class="mt-2 grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 text-xs md:text-sm">
          <template
            v-for="row in spinsBonusRows"
            :key="row.range"
          >
            <span>{{ row.range }}</span>
            <span class="text-right">{{ row.bonus }}</span>
          </template>
        </div>
      </div>

      <div>
        <p class="text-lavender font-semibold tracking-[-0.16px]">
          {{ t('rewards.stakingWheel.tooltip.sections.examples.title') }}
        </p>
        <div
          class="mt-2 grid grid-cols-[96px_90px_1fr_48px] gap-x-3 gap-y-1 text-[11px] md:text-xs"
        >
          <span class="font-semibold text-lavender">{{ examplesHeaders.stake }}</span>
          <span class="font-semibold text-lavender">{{ examplesHeaders.lock }}</span>
          <span class="font-semibold text-lavender">{{ examplesHeaders.wheel }}</span>
          <span class="font-semibold text-right text-lavender">{{ examplesHeaders.spins }}</span>
          <template
            v-for="row in examplesRows"
            :key="row.stake + row.wheel"
          >
            <span class="whitespace-nowrap">{{ row.stake }}</span>
            <span class="whitespace-nowrap">{{ row.lock }}</span>
            <span>{{ row.wheel }}</span>
            <span class="text-right">{{ row.spins }}</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

type PickWheelItem = { label: string; detail: string; prizes: string }
type SpinsBonusRow = { range: string; bonus: string }
type ExamplesHeaders = { stake: string; lock: string; wheel: string; spins: string }
type ExamplesRow = { stake: string; lock: string; wheel: string; spins: string }

const { t, tm } = useI18n()

const pickWheelItems = computed(
  () => tm('rewards.stakingWheel.tooltip.sections.pickWheel.items') as PickWheelItem[],
)
const spinsBonusRows = computed(
  () => tm('rewards.stakingWheel.tooltip.sections.spins.bonus') as SpinsBonusRow[],
)
const examplesHeaders = computed(
  () => tm('rewards.stakingWheel.tooltip.sections.examples.headers') as ExamplesHeaders,
)
const examplesRows = computed(
  () => tm('rewards.stakingWheel.tooltip.sections.examples.rows') as ExamplesRow[],
)
</script>
