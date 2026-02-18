<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { RouteLocationNormalized } from 'vue-router'

const route = useRoute()
const key = computed(() => route.path)

const savedScrollPosition = ref(0)

const beforeLeave = (el: Element) => {
  // Skip transition if only query parameters changed
  const currentRoute = route as RouteLocationNormalized & { from?: RouteLocationNormalized }
  if (currentRoute.from && route.path === currentRoute.from.path) {
    return
  }

  // Store the current scroll position
  savedScrollPosition.value = window.scrollY

  // Set initial state for exit
  if (el instanceof HTMLElement) {
    el.style.height = window.innerHeight + 'px'
    el.style.overflow = 'hidden'
  }
}

const enter = (el: Element) => {
  // Skip transition if only query parameters changed
  const currentRoute = route as RouteLocationNormalized & { from?: RouteLocationNormalized }
  if (currentRoute.from && route.path === currentRoute.from.path) {
    return
  }

  // Set initial state for enter
  if (el instanceof HTMLElement) {
    el.style.height = window.innerHeight + 'px'
    el.style.overflow = 'hidden'
  }

  // Scroll to top for new page
  window.scrollTo(0, 0)
}

const afterEnter = (el: Element) => {
  // Reset styles after transition
  if (el instanceof HTMLElement) {
    el.style.height = 'auto'
    el.style.overflow = 'visible'
  }
}
</script>

<template>
  <transition
    name="page"
    mode="out-in"
    @before-leave="beforeLeave"
    @enter="enter"
    @after-enter="afterEnter"
  >
    <slot :key="key" />
  </transition>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>