<template>
  <div>
    <div
      class="w-full md:w-[404px] h-full z-10 relative"
    >
      <div
        ref="wheelRef"
        :src="wheel"
        :class="[
          'w-full h-full object-contain cursor-pointer',
          { 'spinning': spinning }
        ]"
        :style="wheelStyle"
        @click="emit('click')"
      >
        <div
          v-if="currentWheel"
          class="wheel w-full h-full"
        >
          <div
            v-for="(prize, i) in wheelSections"
            :key="i"
            class="section"
            :style="{
              '--n': wheelSections.length,
              '--i': i,
              '--src': `url('${prize.imageOnWheel}')`
            }"
          />
        </div>
      </div>

      <img
        :src="indicator"
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[56px] md:size-[79px] object-contain"
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, type CSSProperties, ref, watch, watchEffect } from 'vue'
import wheel from '@/assets/images/game/wheel/wheel.png'
import indicator from '@/assets/images/game/wheel/indicator.png'
import { useConfetti } from '@/composables/confetti'
import { useWheel } from '@/composables/use-wheel'
import type { SpinPrize } from '@/services/api'

const props = defineProps<{
  targetSection?: string
  spinning: boolean
}>()
const emit = defineEmits<{
    (e: 'click'): void
    (e: 'finished'): void
    (e: 'reset'): void
}>()
const { shoot } = useConfetti()
const { currentWheel } = useWheel()
const wheelRef = ref<HTMLImageElement>()
const finalRotation = ref<number>(0)
const wheelStyle = ref<CSSProperties>({})
const wheelSections = ref<SpinPrize[]>([])

watchEffect(() => {
  wheelSections.value = currentWheel.value?.prizes.slice().sort((a, b) => a.order - b.order) || []
})

// Wheel configuration
const _WHEEL_SECTIONS = computed(() => {
  return wheelSections.value?.length || 8
})
const SECTION_GAP = 4 // degrees
const ROTATIONS_COUNT = 6
const SPIN_DURATION = 4600

// Calculate final rotation based on target section (1-8)
function calculateFinalRotation(targetSection: number): number {
  // Each section is 360/WHEEL_SECTIONS degrees, plus gap
  const sectionAngle = (360 / _WHEEL_SECTIONS.value) + SECTION_GAP - SECTION_GAP

  // Calculate the start angle of the target section
  const sectionStartAngle = (targetSection - 1) * sectionAngle

  // Generate a random angle within the section range
  const randomOffset = Math.random() * (360 / _WHEEL_SECTIONS.value - SECTION_GAP)
  const targetAngle = sectionStartAngle + randomOffset

  // Add multiple full rotations for natural spin effect
  const fullRotations = ROTATIONS_COUNT * 360 // 6 full rotations
  return fullRotations + targetAngle
}

const targetSection = computed(() => {
  const arrCopy = wheelSections.value.slice().reverse()
  const stopAt = arrCopy.findIndex((prize) => prize.id === props.targetSection)
  return stopAt + 1
})

watchEffect(() => {
  if (props.spinning) {
    wheelStyle.value = {}
    const rotation = calculateFinalRotation(targetSection.value)
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
        setTimeout(() => {
          wheelStyle.value = {}
          emit('reset')
        }, 1000)
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

.wheel {
  aspect-ratio: 1 / 1;
  position: relative;
  border-radius: 50%;
  overflow: hidden;
}

.section {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  transform: rotate(calc(var(--i) * 360deg / var(--n)));
}

.section::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--src) no-repeat;
  background-size: auto 160px;
  background-position-x: 160px;
  background-position-y: 0;
  -webkit-mask: conic-gradient(#000 0 calc(360deg / var(--n)), transparent 0);
  mask: conic-gradient(#000 0 calc(360deg / var(--n)), transparent 0);
}

@media (min-width: 640px) {
  .section::before {
    background-size: auto 202px;
    background-position-x: 202px;
  }
}

.wheel::after {
  content: "";
  position: absolute;
  inset: 42%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.04);
}

</style>
