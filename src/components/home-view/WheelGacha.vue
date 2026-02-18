<template>
  <div class="relative">
    <div class="relative rounded-full size-[320px] sm:size-[404px]">
      <!-- Prize light bg -->
      <img
        v-if="showPrize"
        :src="prizeLight"
        class="block absolute pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full scale-[4.1] transform-origin-center select-none"
      >

      <!-- Prize image -->
      <Transition name="zoom-in">
        <div
          v-if="showPrize"
          class="flex items-center justify-center absolute pointer-events-none select-none z-10 h-full w-full"
          :class="{ 'min-w-[317px] md:min-w-[400px]': prizeToShow.code === '3' }"
        >
          <Transition name="zoom-in">
            <TimerBlock
              v-if="lastSpinDate && showTimer && variant !== HomeVariants.wheelNotifyMe"
              :end-date="lastSpinDate"
              class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              @finished="emit('reset')"
            />
          </Transition>

          <img
            v-if="prizeToShow.code === '3' && !showClaimed"
            :src="prizeToShow.image"
            class="size-[317px] md:size-[387px]"
          >
          <img
            v-else
            :src="prizeToShow.image"
            class="w-[86%] md:w-[317px] pt-[40px] md:pt-[52px]"
          >
        </div>
        <WheelWithPrizes
          v-else
          :target-section="targetSection"
          :spinning="spinning"
          @click="emit('click')"
          @finished="onReset"
        />
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import prizeLight from '@/assets/images/game/wheel-prize-light.png'
import WheelWithPrizes from './WheelWithPrizes.vue'
import type { StaticPrize } from '@/composables/dynamic-home'
import TimerBlock from '@/components/home-view/TimerBlock.vue'
import type { DateTime } from 'luxon'
import { HomeVariants, useDynamicHome } from '@/composables/dynamic-home'

const { variant } = useDynamicHome()

defineProps<{
    prizeToShow: StaticPrize
    spinning: boolean
    showPrize: boolean
    lastSpinDate?: DateTime
    showTimer: boolean
    showClaimed: boolean
    targetSection: number
}>()
const emit = defineEmits<{
    (e: 'finished'): void
    (e: 'reset'): void
    (e: 'click'): void
}>()

function onReset() {
  emit('finished')
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
