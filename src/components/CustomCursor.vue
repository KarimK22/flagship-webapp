<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'

const { width, height } = useWindowSize()
const cursorX = ref(width.value / 2)
const cursorY = ref(height.value / 2)

const updateCursorPosition = (e: MouseEvent) => {
  cursorX.value = e.clientX
  cursorY.value = e.clientY
}

onMounted(() => {
  window.addEventListener('mousemove', updateCursorPosition)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateCursorPosition)
})
</script>

<template>
  <div
    class="fixed top-0 left-0 pointer-events-none z-[9999] -ml-[10px] -mt-[10px]"
    :style="{
      transform: `translate(${cursorX}px, ${cursorY}px)`,
    }"
  >
    <!-- Your cursor content here -->
    <slot />
  </div>
</template>
