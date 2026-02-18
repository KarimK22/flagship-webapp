<template>
  <div class="flex items-center justify-center">
    <svg
      :viewBox="computedViewBox"
      height="100"
      xmlns="http://www.w3.org/2000/svg"
      role="text"
    >
      <g
        v-for="(blur, index) in blurLayers"
        :key="`g-${index}-${uniqueId}`"
        :style="`mix-blend-mode:plus-lighter; filter:url(#blur-filter-${index}-${uniqueId})`"
        :opacity="blur.opacity"
      >
        <text
          :x="computedPosition.x"
          :y="computedVerticalAlign.y"
          :text-anchor="computedPosition.textAnchor"
          :dominant-baseline="computedVerticalAlign.dominantBaseline"
          :font-size="fontSize + 'px'"
          font-family="'Afacad', sans-serif"
          font-style="normal"
          :font-weight="fontWeight"
          :letter-spacing="letterSpacing + 'px'"
          fill="none"
          :stroke="index > 0 ? `url(#stroke-gradient-${uniqueId})` : `url(#stroke-gradient-2-${uniqueId})`"
          stroke-width="1.5"
        >
          {{ text }}
        </text>
      </g>
      <text
        :x="computedPosition.x"
        :y="computedVerticalAlign.y"
        :text-anchor="computedPosition.textAnchor"
        :dominant-baseline="computedVerticalAlign.dominantBaseline"
        :font-size="fontSize + 'px'"
        font-family="'Afacad', sans-serif"
        font-style="normal"
        :font-weight="fontWeight"
        :letter-spacing="letterSpacing + 'px'"
        :fill="textColor"
      >
        {{ text }}
      </text>
      <g style="mix-blend-mode:plus-lighter">
        <text
          :x="computedPosition.x"
          :y="computedVerticalAlign.y"
          :text-anchor="computedPosition.textAnchor"
          :dominant-baseline="computedVerticalAlign.dominantBaseline"
          :font-size="fontSize + 'px'"
          font-family="'Afacad', sans-serif"
          font-style="normal"
          :font-weight="fontWeight"
          :letter-spacing="letterSpacing + 'px'"
          :fill="`url(#text-gradient-${uniqueId})`"
        >
          {{ text }}
        </text>
      </g>
      <defs>
        <!-- Improve the ID to be unique for each filter -->
        <filter
          v-for="(blur, index) in blurLayers"
          :id="`blur-filter-${index}-${uniqueId}`"
          :key="`blur-filter-${index}-${uniqueId}`"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feGaussianBlur
            :stdDeviation="blur.value"
            result="blur-effect"
          />
        </filter>
        <linearGradient
          :id="`text-gradient-${uniqueId}`"
          :x1="computedFilterMap[`text-gradient-${uniqueId}`].x1"
          :y1="computedFilterMap[`text-gradient-${uniqueId}`].y1"
          :x2="computedFilterMap[`text-gradient-${uniqueId}`].x2"
          :y2="computedFilterMap[`text-gradient-${uniqueId}`].y2"
          gradientUnits="objectBoundingBox"
        >
          <stop
            :offset="computedFilterMap[`text-gradient-${uniqueId}`].stopOffset1"
            :stop-color="computedFilterMap[`text-gradient-${uniqueId}`].stopColor1"
            :stop-opacity="computedFilterMap[`text-gradient-${uniqueId}`].stopOpacity1"
          />
          <stop
            offset="1"
            :stop-color="lightColor"
          />
        </linearGradient>

        <linearGradient
          :id="`stroke-gradient-${uniqueId}`"
          :x1="computedFilterMap[`stroke-gradient-${uniqueId}`].x1"
          :y1="computedFilterMap[`stroke-gradient-${uniqueId}`].y1"
          :x2="computedFilterMap[`stroke-gradient-${uniqueId}`].x2"
          :y2="computedFilterMap[`stroke-gradient-${uniqueId}`].y2"
          gradientUnits="objectBoundingBox"
        >
          <stop
            :offset="computedFilterMap[`stroke-gradient-${uniqueId}`].stopOffset1"
            :stop-color="computedFilterMap[`stroke-gradient-${uniqueId}`].stopColor1"
            :stop-opacity="computedFilterMap[`stroke-gradient-${uniqueId}`].stopOpacity1"
          />
          <stop
            offset="1"
            :stop-color="lightColor"
          />
        </linearGradient>

        <linearGradient
          :id="`stroke-gradient-2-${uniqueId}`"
          :x1="computedFilterMap[`stroke-gradient-2-${uniqueId}`].x1"
          :y1="computedFilterMap[`stroke-gradient-2-${uniqueId}`].y1"
          :x2="computedFilterMap[`stroke-gradient-2-${uniqueId}`].x2"
          :y2="computedFilterMap[`stroke-gradient-2-${uniqueId}`].y2"
          gradientUnits="objectBoundingBox"
        >
          <stop
            :offset="computedFilterMap[`stroke-gradient-2-${uniqueId}`].stopOffset1"
            :stop-color="computedFilterMap[`stroke-gradient-2-${uniqueId}`].stopColor1"
            :stop-opacity="computedFilterMap[`stroke-gradient-2-${uniqueId}`].stopOpacity1"
          />
          <stop
            offset="1"
            :stop-color="lightColor"
          />
        </linearGradient>

      </defs>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

interface BlurLayer {
  value: number
  opacity: number
}

const uniqueId = useId()

const props = withDefaults(defineProps<{
  text: string
  fontSize?: number
  letterSpacing?: number
  blurLayers?: BlurLayer[]
  strokeRightValue?: number
  textColor?: string
  fontWeight?: number
  align?: 'left' | 'right' | 'center'
  viewBox?: string
  variant?: 'top-light' | 'top-light-cover' | 'regular'
  verticalAlign?: 'top' | 'middle' | 'bottom'
  lightColor?: string
}>(), {
  text: '',
  fontSize: 48,
  letterSpacing: -2.4,
  strokeRightValue: 0.8,
  textColor: '#0C0C14',
  fontWeight: 700,
  align: 'center',
  viewBox: '',
  variant: 'regular',
  verticalAlign: 'middle',
  lightColor: '#D4C5EB',
  blurLayers: () => [
    {
      value: 0.5,
      opacity: 1,
    },
    {
      value: 0.5,
      opacity: 1,
    },
    {
      value: 12,
      opacity: 0.4,
    },
    {
      value: 8,
      opacity: 0.64,
    },
    {
      value: 3,
      opacity: 0.8,
    },
  ],
})

const computedVerticalAlign = computed(() => {
  switch (props.verticalAlign) {
  case 'top':
    return {
      y: '0',
      dominantBaseline: 'text-before-edge',
    }
  case 'bottom':
    return {
      y: '100%',
      dominantBaseline: 'text-after-edge',
    }
  default:
    return {
      y: '50%',
      dominantBaseline: 'middle',
    }
  }
})

const computedPosition = computed(() => {
  switch (props.align) {
  case 'left':
    return {
      x: '0',
      textAnchor: 'start',
    }
  case 'right':
    return {
      x: '100%',
      textAnchor: 'end',
    }
  default:
    return {
      x: '50%',
      textAnchor: 'middle',
    }
  }
})

const computedWidth = computed(() => {
  return props.text.length * props.fontSize * 0.6
})

const computedViewBox = computed(() => {
  return props.viewBox || `0 0 ${computedWidth.value} 100`
})

type FilterMap = Record<`${string}`, { x1: string; y1: string; x2: string; y2: string; stopOpacity1: string, stopOffset1?: string, stopColor1: string }>
const computedFilterMap = computed<FilterMap>(() => {
  switch (props.variant) {
  case 'top-light-cover':
    return {
      [`stroke-gradient-2-${uniqueId}`]: {
        x1: '0',
        y1: '1',
        x2: '0',
        y2: '0.4',
        stopOpacity1: '1',
        stopOffset1: '0',
        stopColor1: 'transparent',
      },
      [`stroke-gradient-${uniqueId}`]: {
        x1: '0',
        y1: '1',
        x2: '0',
        y2: '0.4',
        stopOpacity1: '1',
        stopOffset1: '0',
        stopColor1: 'transparent',
      },
      [`text-gradient-${uniqueId}`]: {
        x1: '0.6',
        y1: '0.9',
        x2: '1',
        y2: '0.4',
        stopOpacity1: '0',
        stopOffset1: '0',
        stopColor1: 'transparent',
      },
    }
  case 'top-light':
    return {
      [`stroke-gradient-2-${uniqueId}`]: {
        x1: '0.5',
        y1: '0.9',
        x2: '1',
        y2: '0.4',
        stopOpacity1: '1',
        stopOffset1: '0',
        stopColor1: 'transparent',
      },
      [`stroke-gradient-${uniqueId}`]: {
        x1: '0.5',
        y1: '0.9',
        x2: '1',
        y2: '0.4',
        stopOpacity1: '1',
        stopOffset1: '0',
        stopColor1: 'transparent',
      },
      [`text-gradient-${uniqueId}`]: {
        x1: '0.6',
        y1: '1',
        x2: '1',
        y2: '0.4',
        stopOpacity1: '0',
        stopOffset1: '0',
        stopColor1: 'transparent',
      },
    }
  default:
    return {
      [`stroke-gradient-2-${uniqueId}`]: {
        x1: '0',
        y1: '0',
        x2: '1',
        y2: '0',
        stopOpacity1: '0.04',
        stopOffset1: '0',
        stopColor1: '#6D6D8F',
      },
      [`stroke-gradient-${uniqueId}`]: {
        x1: '0',
        y1: '0',
        x2: '1',
        y2: '0',
        stopOpacity1: '0',
        stopOffset1: '0',
        stopColor1: '#6D6D8F',
      },
      [`text-gradient-${uniqueId}`]: {
        x1: '0.3',
        y1: '0',
        x2: '1.1',
        y2: '0',
        stopOpacity1: '0',
        stopOffset1: '0',
        stopColor1: '#6D6D8F',
      },
    }
  }
})
</script>
