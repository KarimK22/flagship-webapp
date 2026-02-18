<template>
  <div class="fixed md:top-20 top-15 md:right-4 z-50">
    <TransitionGroup
      name="bubble-fade"
      tag="div"
      class="flex flex-col md:gap-2 gap-1"
    >
      <div
        v-for="(activity, index) in activities.slice(0, isSmallScreen ? 2 : 3)"
        :key="activity.id"
        class="min-w-[320px] bg-[rgba(38,38,56,0.72)] rounded-xl py-3 px-4 shadow-[0px_-4px_16px_0px_rgba(222,206,235,0.08)_inset] backdrop-blur-sm max-w-xs"
        :class="getBubbleClass(index)"
      >
        <span class="text-lavender font-semibold text-sm leading-4 inline-block tracking-[-0.28px]">{{ activity.user }} just won {{ activity.prize }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useLiveActivities } from '@/composables/use-live-activities'
import { useMediaQuery } from '@vueuse/core'

const { activities, startMocking, stopMocking } =
  useLiveActivities()
const isSmallScreen = useMediaQuery('(max-width: 768px)')

const getBubbleClass = (index: number) => {
  const opacityClass = {
    0: 'bg-[rgba(38,38,56,0.72)]',
    1: 'bg-[rgba(38,38,56,0.56)]',
    2: 'bg-[rgba(38,38,56,0.40)]',
  }[index]

  return `${opacityClass}`
}

onMounted(() => {
  startMocking()
})

onUnmounted(() => {
  stopMocking()
})

</script>

<style scoped>
.bubble-fade-enter-active,
.bubble-fade-leave-active {
  transition: all 0.3s ease;
}

.bubble-fade-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

.bubble-fade-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

.bubble-fade-move {
  transition: all 0.3s ease;
}
</style>
