<template>
  <div class="relative rounded-full h-[320px] sm:h-[404px] w-full">
    <!-- Prize image -->
    <Transition name="zoom-in">
      <SpinTimer
        v-if="showTimer"
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-100 select-none"
        :end-date-timestamp="endDateTimestamp"
        :progress="progress"
      />
    </Transition>
    <img
      v-if="showTimer"
      :src="timerBg"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-91 h-[296px] select-none"
    >
    <div
      v-else
      :style="{ backgroundImage: `url(${wheelBg})` }"
      class="absolute hidden md:block w-[960px] h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none bg-contain bg-center bg-no-repeat"
    />
    <WheelWithPrizes
      class="absolute size-[320px] sm:size-[404px] overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none z-90"
      :class="{ 'opacity-32': showTimer }"
      :target-section="targetSection"
      :spinning="spinning"
      @click="emit('click')"
      @finished="onReset"
    />
  </div>
</template>

<script lang="ts" setup>
import WheelWithPrizes from './WheelWithPrizes.vue'
import SpinTimer from '@/components/ui/timer/SpinTimer.vue'
import wheelBg from '@/assets/images/wheel/wheel-bg.png'
import timerBg from '@/assets/images/wheel/timer-bg.png'

defineProps<{
  spinning: boolean
  showTimer: boolean
  targetSection?: string
  endDateTimestamp: number
  progress: number
}>()

const emit = defineEmits<{
  (e: 'finished'): void
  (e: 'click'): void
  (e: 'reset'): void
}>()

function onReset() {
  emit('finished')
  emit('reset')
}
</script>

<style scoped>
.zoom-in-enter-active {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  transition-delay: 0.3s;
}

.zoom-in-leave-active {
  transition: transform 0.1s ease-in-out, opacity 0.1s ease-in-out;
  transition-delay: 0s;
}

.zoom-in-enter-from,
.zoom-in-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

.shadow-prize {
  width: 420px;
  height: 224px;
  border-radius: 420px;
  opacity: 0.96;
  background: #14141F;
  filter: blur(48px);
}
</style>
