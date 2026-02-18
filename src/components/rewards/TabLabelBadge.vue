<template>
  <span class="relative inline-flex items-center justify-center">
    <span
      v-if="badgeText"
      class="absolute -top-3 left-1/2 w-[28px] rounded-full py-0.5 text-center font-semibold uppercase leading-none text-white whitespace-nowrap"
      :class="badgeClass"
      :style="{ fontSize: badgeFontSize, letterSpacing: badgeLetterSpacing }"
    >
      {{ badgeText }}
    </span>
    <span>{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  badgeText?: string
  badgeClass?: string
}>()

const badgeText = computed(() => props.badgeText?.trim() ?? '')
const badgeClass = computed(() => props.badgeClass ?? 'bg-[#FF7847]')

const badgeLength = computed(() => badgeText.value.length)
const badgeFontSize = computed(() => {
  if (badgeLength.value <= 3) return '9px'
  if (badgeLength.value <= 5) return '7px'
  return '6px'
})
const badgeLetterSpacing = computed(() => {
  if (badgeLength.value <= 3) return '0.06em'
  if (badgeLength.value <= 5) return '0.04em'
  return '0.02em'
})
</script>
