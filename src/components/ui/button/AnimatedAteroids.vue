<template>
  <svg
    ref="svgRef"
    :width="width + 8"
    :height="height + 16"
    :viewBox="`0 0 ${width} ${height}`"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient
        :id="gradientId"
        :x1="gradientCoords.x1"
        :y1="gradientCoords.y1"
        :x2="gradientCoords.x2"
        :y2="gradientCoords.y2"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          offset="0%"
          style="stop-color:#ffffff;stop-opacity:0"
        />
        <stop
          offset="50%"
          style="stop-color:#ffffff;stop-opacity:0.3"
        />
        <stop
          offset="100%"
          style="stop-color:#ffffff;stop-opacity:1"
        />
      </linearGradient>
    </defs>
    <path
      id="path"
      ref="pathRef"
      :d="pathData"
      stroke-width="1"
      fill="none"
    />
    <circle
      ref="dotRef"
      r="0.75"
      fill="#fff"
      class="glow"
      style="position: absolute; transform-origin: center;"
    />
    <!-- Línea continua de estela -->
    <path
      ref="tailPathRef"
      :d="pathData"
      :stroke="`url(#${gradientId})`"
      stroke-width="0.5"
      fill="none"
      class="glow tail-line"
      :style="tailStyle"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

interface Props {
  width?: number
  height?: number
  initialPosition?: number // Position along the path (0-1)
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 400,
  height: 80,
  initialPosition: 0, // Start at the beginning by default
  duration: 8000,
})

// Generar ID único para el gradiente
const gradientId = ref(`tailGradient-${Math.random().toString(36).substr(2, 9)}`)

const pathRef = ref<SVGPathElement | null>(null)
const tailPathRef = ref<SVGPathElement | null>(null)
const dotRef = ref<SVGCircleElement | null>(null)
const svgRef = ref<SVGSVGElement | null>(null)
const totalLength = ref(0)
const currentProgress = ref(props.initialPosition) // Inicializar con initialPosition
let animId: number | null = null
let startTime: number | null = null
let lastFrameTime: number | null = null
const targetFPS = 60
const frameInterval = 1000 / targetFPS // ~16.67ms between frames

// Calculate path data dynamically based on width and height
const pathData = computed(() => {
  const w = props.width
  const h = props.height
  const radius = h / 3.5
  const paddingX = 12 // Padding from left/right edges
  const paddingY = 1 // Padding from top/bottom edges

  return `M${paddingX + radius} ${paddingY} H${w - paddingX - radius} A${radius} ${radius} 0 0 1 ${w - paddingX - radius} ${h - paddingY} H${paddingX + radius} A${radius} ${radius} 0 0 1 ${paddingX + radius} ${paddingY}`
})

// Calcular coordenadas del gradiente basadas en la posición actual
const gradientCoords = computed(() => {
  if (totalLength.value === 0) {
    return { x1: 0, y1: 0, x2: 20, y2: 0 }
  }

  const currentPosition = totalLength.value * currentProgress.value
  const path = pathRef.value

  if (!path) {
    return { x1: 0, y1: 0, x2: 20, y2: 0 }
  }

  // Obtener el punto actual
  const currentPoint = path.getPointAtLength(currentPosition)

  // Asegurar que las coordenadas sean válidas
  if (isNaN(currentPoint.x) || isNaN(currentPoint.y)) {
    return { x1: 0, y1: 0, x2: 20, y2: 0 }
  }

  // Calcular la dirección del movimiento
  const tailLength = 25 // Longitud fija de la estela
  let previousPosition = currentPosition - tailLength

  // Si estamos muy cerca del inicio, usar un punto cercano al inicio
  if (previousPosition < 0) {
    // Si estamos en el inicio exacto, usar un punto muy cercano
    if (currentPosition < tailLength) {
      previousPosition = currentPosition * 0.1
    } else {
      // Usar un punto anterior pero no tan lejos
      previousPosition = Math.max(0, currentPosition - tailLength * 0.5)
    }
  }

  const previousPoint = path.getPointAtLength(previousPosition)

  // Si no podemos obtener un punto anterior válido, usar dirección horizontal
  if (isNaN(previousPoint.x) || isNaN(previousPoint.y)) {
    return {
      x1: currentPoint.x - tailLength,
      y1: currentPoint.y,
      x2: currentPoint.x,
      y2: currentPoint.y,
    }
  }

  // Calcular el vector de dirección
  const dx = currentPoint.x - previousPoint.x
  const dy = currentPoint.y - previousPoint.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  // Si la distancia es muy pequeña, usar dirección horizontal
  if (distance < 0.1) {
    return {
      x1: currentPoint.x - tailLength,
      y1: currentPoint.y,
      x2: currentPoint.x,
      y2: currentPoint.y,
    }
  }

  // Normalizar el vector de dirección
  const normalizedDx = dx / distance
  const normalizedDy = dy / distance

  // Crear el gradiente en la dirección del movimiento
  return {
    x1: currentPoint.x - normalizedDx * tailLength,
    y1: currentPoint.y - normalizedDy * tailLength,
    x2: currentPoint.x,
    y2: currentPoint.y,
  }
})

// Estilo para la línea de estela
const tailStyle = computed(() => {
  if (totalLength.value === 0) return {}

  // Usar la variable reactiva para forzar actualización
  const currentPosition = totalLength.value * currentProgress.value

  // Mostrar solo el 5% final de la línea como estela, pero desde la posición actual
  const tailLength = totalLength.value * 0.1

  // Asegurar que no tengamos valores negativos
  const safeCurrentPosition = Math.max(0, currentPosition)
  const strokeDashoffset = Math.max(0, totalLength.value - safeCurrentPosition + tailLength)

  return {
    strokeDasharray: `${tailLength} ${totalLength.value - tailLength}`,
    strokeDashoffset: `${strokeDashoffset}`,
  }
})

function animate(timestamp: number) {
  // Throttle to 60fps
  if (lastFrameTime && timestamp - lastFrameTime < frameInterval) {
    animId = requestAnimationFrame(animate)
    return
  }

  lastFrameTime = timestamp

  if (!startTime) startTime = timestamp
  const elapsed = timestamp - startTime
  const progress = (elapsed % props.duration) / props.duration
  // Add initial position offset to the progress
  const adjustedProgress = (progress + props.initialPosition) % 1

  // Actualizar la variable reactiva para forzar la actualización del tailStyle
  currentProgress.value = adjustedProgress

  const position = totalLength.value * adjustedProgress

  const path = pathRef.value
  const point = path?.getPointAtLength(position)

  if (point && dotRef.value) {
    // Usar transform para mejor rendimiento
    dotRef.value.style.transform = `translate(${point.x}px, ${point.y}px)`
  }

  if (pathRef.value) {
    totalLength.value = pathRef.value.getTotalLength()
  }

  animId = requestAnimationFrame(animate)
}

function startAnimation() {
  if (!animId) requestAnimationFrame(animate)
}

onMounted(() => {
  // Esperar un frame para asegurar que el DOM esté listo
  requestAnimationFrame(() => {
    startAnimation()
  })
})

onBeforeUnmount(() => {
  if (animId) cancelAnimationFrame(animId)
})
</script>

<style scoped>
.glow {
    filter: drop-shadow(0 0 1px #ffffff);
}

.tail-line {
    filter: drop-shadow(0 0 1px #ffffff);
}
</style>
