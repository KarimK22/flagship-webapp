<template>
  <div>
    <div class="w-full md:w-[404px] h-full z-10 relative">
      <div
        ref="wheelRef"
        :class="[
          'w-full h-full object-contain cursor-pointer',
          { spinning }
        ]"
        :style="wheelStyle"
        @click="emit('click')"
      >
        <div class="wheel w-full h-full">
          <div
            v-for="(prize, i) in wheelSections"
            :key="prize.id ?? i"
            class="section"
            :style="{
              '--n': wheelSections.length,
              '--i': i,
              '--src': `url('${encodeImageUrl(prize.imageOnWheel || prize.image || '')}')`
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, type CSSProperties, ref, watch, watchEffect } from 'vue'
import { useConfetti } from '@/composables/confetti'
import { encodeImageUrl } from '@/composables/helpers'
import type { StakingWheelPrize } from '@/composables/use-staking-wheels'

const props = defineProps<{
  prizes: StakingWheelPrize[]
  targetSection?: string
  spinning: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
  (e: 'finished'): void
  (e: 'reset'): void
}>()

const { shoot } = useConfetti()

const wheelRef = ref<HTMLDivElement>()
const finalRotation = ref<number>(0)
const wheelStyle = ref<CSSProperties>({})
const wheelSections = ref<StakingWheelPrize[]>([])

watchEffect(() => {
  wheelSections.value =
    (props.prizes ?? [])
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
})

const _WHEEL_SECTIONS = computed(() => wheelSections.value.length || 8)
const SECTION_GAP = 4
const ROTATIONS_COUNT = 6
const SPIN_DURATION = 4600

function calculateFinalRotation(targetSection: number) {
  const sectionAngle = 360 / _WHEEL_SECTIONS.value
  const sectionStartAngle = (targetSection - 1) * sectionAngle
  const randomOffset = Math.random() * (sectionAngle - SECTION_GAP)
  return ROTATIONS_COUNT * 360 + (sectionStartAngle + randomOffset)
}

const targetSectionIndex = computed(() => {
  if (!props.targetSection) return 0
  if (!wheelSections.value.length) return 0

  const reversed = wheelSections.value.slice().reverse()
  const stopAt = reversed.findIndex((p) => p.id === props.targetSection)
  return stopAt >= 0 ? stopAt + 1 : 0
})

watchEffect(() => {
  if (props.spinning && targetSectionIndex.value > 0) {
    wheelStyle.value = {}
    const rotation = calculateFinalRotation(targetSectionIndex.value)
    finalRotation.value = rotation

    wheelStyle.value = {
      '--final-rotation': `${rotation}deg`,
      '--spin-duration': `${SPIN_DURATION - 100}ms`,
      '--spin-timing': 'cubic-bezier(0.1, 0.6, 0.05, 1)',
    }
  } else if (!props.spinning && finalRotation.value > 0) {
    wheelStyle.value = { transform: `rotate(${finalRotation.value}deg)` }
  }
})

watch(
  () => props.spinning,
  (isSpinning) => {
    if (!isSpinning) return

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
  },
)
</script>

<style scoped>
.spinning {
  animation: spin-natural var(--spin-duration, 3s) var(--spin-timing, cubic-bezier(0.15, 0.6, 0.05, 1)) forwards;
}

@keyframes spin-natural {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(var(--final-rotation, 1800deg)); }
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