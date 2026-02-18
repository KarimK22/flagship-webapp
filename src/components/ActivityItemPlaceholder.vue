<template>
  <div
    v-for="(activity, key) in activities"
    :key="key"
    class="flex gap-4 animate-blink"
    :style="{ animationDelay: `${activity.timer}ms` }"
  >
    <div
      class="card w-24 h-24 rounded-2xl"
    />
    <div class="flex flex-col gap-2 justify-center">
      <span class="w-20 h-4 bg-[#1C1C29] rounded-full" />
      <span class="w-40 h-6 bg-[#1C1C29] rounded-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  length: number
}>()

const activities = computed(() => {
  return Array.from({ length: props.length }, (_, index) => ({
    timer: (index) * 500,
  }))
})
</script>

<style scoped>
.card {
  background-color: #14141F;
  background-image: repeating-linear-gradient(-45deg,
      hsla(240, 22%, 10%, 0.8) 0px,
      hsla(240, 22%, 10%, 0.8) 15px,
      #1F202D 15px,
      #1F202D 30px);
}

@keyframes blink {
  0% {
    opacity: 0.2;
  }
  40% {
    opacity: 0.6;
  }
  60% {
    opacity: 1;
  }
  80% {
    opacity: 0.6;
  }
  100% {
    opacity: 0.2;
  }
}

.animate-blink {
  animation: blink 2s infinite;
}
</style>
