<script setup lang="ts">
import { EButtonColor } from '@/types/shared/button'
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface Props {
    disabled?: boolean
    color: EButtonColor
    enableAnimations: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  color: EButtonColor.PURPLE,
  enableAnimations: true,
})

const colorMap: Record<EButtonColor, string> = {
  [EButtonColor.BLUE]: '#5858F5',
  [EButtonColor.ORANGE]: '#FF7847',
  [EButtonColor.GREEN]: '#5EB851',
  [EButtonColor.GRAY]: '#6D6D8F',
  [EButtonColor.PURPLE]: '#C95CFF',
  [EButtonColor.SILVER]: '#8A9AC2',
  [EButtonColor.GOLD]: '#FFBC70',
  [EButtonColor.DIAMOND]: '#F1E6FA',
}

const isSafari = ref(false)

const detectSafari = () => {
  const userAgent = navigator.userAgent.toLowerCase()
  isSafari.value = /safari/.test(userAgent) && !/chrome/.test(userAgent)
}

const mouseX = ref(60)
const mouseY = ref(16)

const containerRef = ref<HTMLDivElement>()

const stretchFactor = computed(() => {
  const normalizedX = mouseX.value / 100
  return 1 + Math.abs(normalizedX - 0.5) * 2
})

const rotationFactor = computed(() => {
  const angleX = (mouseX.value - 50) * -0.5
  const angleY = (mouseY.value - 50) * 0.5
  return (angleX + angleY) * 0.5
})

const bigEllipseX = computed(() => mouseX.value)
const bigEllipseY = computed(() => {
  const centerY = 50
  const maxOffset = 8
  const containerHeight = 40
  const maxOffsetPercent = (maxOffset / containerHeight) * 100

  const offset = (mouseY.value - centerY) * (maxOffsetPercent / 50)
  return centerY + Math.max(-maxOffsetPercent, Math.min(maxOffsetPercent, offset))
})

const updateMousePosition = (event: MouseEvent) => {
  if (!containerRef.value || !props.enableAnimations) return
  const rect = containerRef.value.getBoundingClientRect()
  const relativeX = ((event.clientX - rect.left) / rect.width) * 100
  const relativeY = ((event.clientY - rect.top) / rect.height) * 100

  mouseX.value = Math.max(0, Math.min(100, relativeX))
  mouseY.value = Math.max(0, Math.min(100, relativeY))
}

onMounted(() => {
  detectSafari()
  document.addEventListener('mousemove', updateMousePosition)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', updateMousePosition)
})
</script>

<template>
  <div
    v-if="!disabled"
    ref="containerRef"
    :style="{
      '--glow-color': colorMap[color],
    }"
    :class="[
      'glow-effect-container rounded-full overflow-hidden p-[1px]',
      { 'safari-fix': isSafari }
    ]"
  >
    <div
      class="glow-ellipse glow-ellipse-1"
      :class="{ 'safari-ellipse': isSafari }"
      :style="{
        left: `${bigEllipseX}%`,
        top: `${bigEllipseY}%`,
        transform: `translate(-50%, -50%) scaleX(${stretchFactor}) rotate(${rotationFactor}deg)`,
        transition: 'transform 0.2s ease-out'
      }"
    />

    <div
      class="glow-ellipse glow-ellipse-2"
      :class="{ 'safari-ellipse': isSafari }"
      :style="{
        left: `${mouseX}%`,
        top: `${mouseY}%`,
        transform: `translate(-50%, -50%) scaleX(${stretchFactor}) rotate(${rotationFactor}deg)`,
        transition: 'transform 0.3s ease-out'
      }"
    />

    <div
      class="glow-ellipse glow-ellipse-3"
      :class="{ 'safari-ellipse': isSafari }"
      :style="{
        left: `${mouseX}%`,
        top: `${mouseY}%`,
        transform: `translate(-50%, -50%) scaleX(${stretchFactor * 0.8}) rotate(${rotationFactor}deg)`,
        transition: 'transform 0.3s ease-out'
      }"
    />

    <div class="w-full h-full rounded-full overflow-hidden relative">
      <div
        class="w-20 h-16 rounded-full bg-dark3/38 absolute top-0 left-0 blur-[10px]"
        :class="{ 'safari-blur w-38!': isSafari }"
        :style="{
          left: `${bigEllipseX}%`,
          top: `${bigEllipseY}%`,
          transform: `translate(-50%, -50%)`
        }"
      />
    </div>
  </div>
</template>

<style scoped>
.glow-effect-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  will-change: transform;
}

.glow-effect-container.safari-fix {
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  perspective: 1000px;
  -webkit-perspective: 1000px;
}

.glow-ellipse {
  position: absolute;
  border-radius: 50%;
  mix-blend-mode: plus-lighter;
  pointer-events: none;
}

.glow-ellipse.safari-ellipse {
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  will-change: transform;
  -webkit-will-change: transform;
}

.glow-ellipse-1 {
  width: 64px;
  height: 32px;
  background: var(--glow-color);
  opacity: 0.95;
  filter: blur(10px);
  -webkit-filter: blur(10px);
}

.glow-ellipse-2 {
  width: 32px;
  height: 16px;
  background: #F1E6FA;
  opacity: 0.88;
  filter: blur(9px);
  -webkit-filter: blur(9px);
}

.glow-ellipse-3 {
  width: 8px;
  height: 8px;
  background: #F1E6FA;
  opacity: 0.98;
  filter: blur(10px);
  -webkit-filter: blur(10px);
}

.safari-blur {
  filter: none !important;
  -webkit-filter: none !important;
  box-shadow: 0 0 30px 2px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0 0 30px 2px rgba(0, 0, 0, 0.1);
}

@media screen and (-webkit-min-device-pixel-ratio: 0) {
  .glow-ellipse-1 {
    filter: blur(8px);
    -webkit-filter: blur(8px);
  }

  .glow-ellipse-2 {
    filter: blur(5px);
    -webkit-filter: blur(5px);
  }

  .glow-ellipse-3 {
    filter: blur(3px);
    -webkit-filter: blur(3px);
  }
}

@supports (-webkit-appearance: none) {
  .glow-effect-container {
    isolation: isolate;
  }

  .glow-ellipse {
    isolation: isolate;
  }
}
</style>
