<template>
  <div>
    <img
      :src="wheelLight"
      class="block absolute pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full scale-[4.1] transform-origin-center select-none"
    >
    <div
      class="w-full md:w-[404px] h-full mb-10 z-10 relative"
    >
      <img
        ref="wheelRef"
        :src="wheel"
        :class="[
          'w-full h-full object-contain cursor-pointer',
          { 'spinning': spinning }
        ]"
        :style="wheelStyle"
        @click="emit('click')"
      >
      <img
        :src="indicator"
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[56px] md:size-[79px] object-contain"
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type CSSProperties, ref, watch } from 'vue'
import wheel from '@/assets/images/game/wheel/wheel.png'
import indicator from '@/assets/images/game/wheel/indicator.png'
import wheelLight from '@/assets/images/game/wheel-light.png'
import { useConfetti } from '@/composables/confetti'

const props = defineProps<{
  targetSection: number
  spinning: boolean
}>()
const emit = defineEmits<{
    (e: 'click'): void
    (e: 'finished'): void
}>()
const { shoot } = useConfetti()
const wheelRef = ref<HTMLImageElement>()
const finalRotation = ref<number>(0)
const wheelStyle = ref<CSSProperties>({})

// Wheel configuration
const _WHEEL_SECTIONS = 8
const SECTION_GAP = 4 // degrees
const ROTATIONS_COUNT = 6
const SPIN_DURATION = 4600

// Calculate final rotation based on target section (1-8)
function calculateFinalRotation(targetSection: number): number {
  // Each section is 360/WHEEL_SECTIONS degrees, plus gap
  const sectionAngle = (360 / _WHEEL_SECTIONS) + SECTION_GAP - SECTION_GAP

  // Calculate the start angle of the target section
  const sectionStartAngle = (targetSection - 1) * sectionAngle

  // Generate a random angle within the section range
  const randomOffset = Math.random() * (360 / _WHEEL_SECTIONS - SECTION_GAP)
  const targetAngle = sectionStartAngle + randomOffset

  // Add multiple full rotations for natural spin effect
  const fullRotations = ROTATIONS_COUNT * 360 // 6 full rotations
  return fullRotations + targetAngle
}

watch(() => props.spinning, (newVal) => {
  if (newVal) {
    wheelStyle.value = {}
    const targetSection = props.targetSection || 5
    const rotation = calculateFinalRotation(targetSection)
    finalRotation.value = rotation
    wheelStyle.value = {
      '--final-rotation': `${rotation}deg`,
      '--spin-duration': `${SPIN_DURATION - 100}ms`,
      '--spin-timing': 'cubic-bezier(0.1, 0.6, 0.05, 1)',
    }
  } else if (finalRotation.value > 0) {
    // Keep the wheel at the final position after animation
    wheelStyle.value =  {
      transform: `rotate(${finalRotation.value}deg)`,
    }
  }
})

watch(() => props.spinning, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      shoot()
      setTimeout(() => {
        emit('finished')
      }, 200)
    }, SPIN_DURATION)
  }
})
</script>

<style scoped>
.spinning {
    animation: spin-natural var(--spin-duration, 3s) var(--spin-timing, cubic-bezier(0.15, 0.6, 0.05, 1)) forwards;
}

@keyframes spin-natural {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(var(--final-rotation, 1800deg));
    }
}

</style>
