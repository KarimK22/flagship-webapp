<script setup lang="ts">
import IconWrapper, { type IconWrapperProps } from '@/components/icon-wrapper/IconWrapper.vue'
import { computed, type Slots, useSlots } from 'vue'

withDefaults(defineProps<IconWrapperProps>(), {
  variant: 'orange',
  position: 'left',
  withBorders: false,
})

const slots: Slots = useSlots()

const hasIconSlot = computed(() => !!slots.icon)
</script>

<template>
  <div
    class="flex flex-col justify-between gap-2 p-4 w-full inset-shadow-[0px_0px_48px_-16px_#1C1C29] bg-[#14141F] overflow-hidden rounded-2xl h-auto sm:h-28"
  >
    <slot name="header" />
    <div class="flex items-start gap-2 h-28 w-full z-1 flex-col sm:flex-row sm:items-end">
      <div class="flex items-center gap-2">
        <IconWrapper
          :variant="variant"
          :position="position"
          :with-borders="withBorders"
          :class="{ 'h-10': !hasIconSlot }"
        >
          <slot name="icon" />
        </IconWrapper>
        <span class="text-lavender text-5xl leading-10 tracking-[-4.32px] whitespace-nowrap">
          <slot name="main-text" />
        </span>
      </div>
      <div class="flex flex-col justify-end gap-1">
        <slot name="sub-text" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
