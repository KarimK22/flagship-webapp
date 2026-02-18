<template>
  <div class="relative w-full h-15 flex items-center justify-center">
    <InlineSvg
      :src="timeBox"
      class="absolute top-0 left-0"
    />
    <div class="flex w-[286px] h-full justify-evenly items-center gap-1 absolute top-0 left-0">
      <div class="flex flex-col items-center justify-center w-1/4">
        <span class="text-lavender text-[32px] font-normal leading-6 tracking-[-2.56px]">{{ parseValue(diff.days) }}</span>
        <span class="text-[#9A9AB8] text-sm font-normal leading-4 tracking-[0.42px]">{{ t('common.Days') }}</span>
      </div>
      <div class="flex flex-col items-center justify-center w-1/4">
        <span class="text-lavender text-[32px] font-normal leading-6 tracking-[-2.56px]">{{ parseValue(diff.hours) }}</span>
        <span class="text-[#9A9AB8] text-sm font-normal leading-4 tracking-[0.42px]">{{ t('common.Hours') }}</span>
      </div>
      <div class="flex flex-col items-center justify-center w-1/4">
        <span class="text-lavender text-[32px] font-normal leading-6 tracking-[-2.56px]">{{ parseValue(diff.minutes) }}</span>
        <span class="text-[#9A9AB8] text-sm font-normal leading-4 tracking-[0.42px]">{{ t('common.min') }}</span>
      </div>
      <div class="flex flex-col items-center justify-center w-1/4">
        <span class="text-lavender text-[32px] font-normal leading-6 tracking-[-2.56px]">{{ parseValue(diff.seconds) }}</span>
        <span class="text-[#9A9AB8] text-sm font-normal leading-4 tracking-[0.42px]">{{ t('common.sec') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import timeBox from '@/assets/images/home/time-box.svg'
import { useCountdown } from '@/composables/countdown'
import { watch } from 'vue'
import { useTranslation } from '@/composables/use-i18n'

const { t } = useTranslation()
const { endDateRef, diff, parseValue } = useCountdown()

const props = defineProps<{
  raffleEndDate: string
}>()

watch(() => props.raffleEndDate, (newVal) => {
  endDateRef.value = newVal
}, { immediate: true })
</script>
