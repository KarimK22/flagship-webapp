<template>
  <div class="flex gap-1">
    <div
      class="gradient-bg flex flex-col items-center justify-center"
      :class="{
        'gradient-bg-sosika': theme === 'blue',
      }"
    >
      <span class="text-[40px] leading-8 tracking-[-2px]">{{ parseValue(diff.minutes) }}</span>
      <span class="text-sm text-[#9A9AB8] tracking-[-0.42px] leading-4 font-semibold">{{ t('common.min') }}</span>
    </div>
    <div
      class="gradient-bg flex flex-col items-center justify-center"
      :class="{
        'gradient-bg-sosika': theme === 'blue',
      }"
    >
      <span class="text-[40px] leading-8 tracking-[-2px]">{{ parseValue(diff.seconds) }}</span>
      <span class="text-sm text-[#9A9AB8] tracking-[-0.42px] leading-4 font-semibold">{{ t('common.sec') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useCountdown } from '@/composables/countdown'
import { DateTime } from 'luxon'
import { useTranslation } from '@/composables/use-i18n'

const { t } = useTranslation()

const props = withDefaults(defineProps<{
  endDate: DateTime
  theme?: string
  timeGap?: number
}>(), {
  timeGap: 10,
  theme: '',
})
const emit = defineEmits<{
  (e: 'finished'): void
}>()
const { diff, endDateRef, parseValue } = useCountdown()

watch(diff, (val) => {
  if (val.minutes === 0 && val.seconds === 0) {
    emit('finished')
  }
})

watch(() => props.endDate, (date) => {
  if (date) {
    endDateRef.value = date.toISO()
  }
}, { immediate: true })
</script>

<style scoped>
.gradient-bg {
  height: 64px;
  width: 80px;
  overflow: hidden;
  border-radius: 12px;
  position: relative;
  background: radial-gradient(ellipse 188px 40px at center top,
      rgba(212, 197, 235, 0.56) 0%,
      rgba(212, 197, 235, 0) 70%),
    radial-gradient(ellipse 256px 32px at center 20px,
      rgba(38, 38, 56, 0.45) 0%,
      rgba(38, 38, 56, 0) 80%);
  /* Add some blur effect if needed */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 11px;
    transform: translate(-50%, -50%);
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    background: #0b0b13c0;
    overflow: hidden;
    mix-blend-mode: plus-lighter;
  }
}

.gradient-bg-sosika {
    background: radial-gradient(ellipse 188px 40px at center top,
          rgba(88, 88, 245, 0.56) 0%,
          rgba(212, 197, 235, 0) 70%),
        radial-gradient(ellipse 256px 32px at center 20px,
          rgba(38, 38, 56, 0.45) 0%,
          rgba(38, 38, 56, 0) 80%);
}
</style>
