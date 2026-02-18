<template>
  <div class="w-[200px] h-[150px] md:w-[228px] md:h-[176px] bg-[rgba(28,28,41,0.64)] rounded-4xl flex justify-center items-center backdrop-blur-sm md:backdrop-blur-md">
    <div class="flex flex-col md:gap-4 gap-2 items-center">
      <span class="text-lavender text-[24px] md:text-[32px] leading-6 md:leading-8 tracking-[-1.28px]">
        {{ $t('components.timerBlock.validFor') }}
      </span>
      <CountersBox
        :end-date="endDate"
        theme=""
        @finished="emit('finished')"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import CountersBox from '@/components/upsell/CountersBox.vue'
import { DateTime } from 'luxon'

defineProps<{
  endDate: DateTime
}>()

const emit = defineEmits<{
  (e: 'finished'): void
}>()
</script>

<style scoped>
</style>
