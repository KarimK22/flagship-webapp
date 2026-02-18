<script setup lang="ts">
import { ref } from 'vue'
import CustomCursor from './CustomCursor.vue'

defineProps<{
	disabled?: boolean
}>()

const showCustomCursor = ref(false)
const wrapperRef = ref<HTMLElement | null>(null)

const checkIfOverElement = (e: MouseEvent) => {
  const element = document.elementFromPoint(e.clientX, e.clientY)
  const theFirstChildElement = wrapperRef.value?.children[0]

  // Check if the cursor is over the wrapped element or its children
  const isOverElement = element && theFirstChildElement?.contains(element)
  showCustomCursor.value = isOverElement ?? false
}

const onMouseLeave = () => {
  showCustomCursor.value = false
}
</script>

<template>
  <div class="relative">
    <!-- Show custom cursor when hovering -->
    <CustomCursor
      v-if="showCustomCursor && !disabled"
      class="max-lg:hidden"
    >
      <template #default>
        <slot name="cursor" />
      </template>
    </CustomCursor>

    <!-- Wrap the triggering element -->
    <div
      ref="wrapperRef"
      class="rounded-full"
      :class="{ 'lg:cursor-none': !disabled }"
      :style="{
        maskRepeat: 'no-repeat',
      }"
      @mousemove="checkIfOverElement"
      @mouseleave="onMouseLeave"
    >
      <slot :is-hovering="showCustomCursor" />
    </div>
  </div>
</template>
