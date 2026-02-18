<template>
  <div class="relative size-[144px] rounded-full">
    <InlineSvg
      v-if="timerMaskBehind"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block max-w-fit h-auto pointer-events-none"
      :src="timerMaskBehind"
    />

    <svg
      :progress="progress"
      class="absolute -inset-[2px] z-10 h-[calc(100%+4px)] w-[calc(100%+4px)] scale-[1_-1]"
      viewBox="0 0 150 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="144"
      height="144"
    >
      <path
        d="M147 75C147 114.765 114.765 147 75 147C35.2355 147 3 114.765 3 75C3 35.2355 35.2355 3 75 3C114.765 3 147 35.2355 147 75"
        stroke="url(#blue_border_linear)"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashoffset"
        stroke-width="6"
        stroke-linecap="round"
        transform="rotate(90 75 75)"
        filter="url(#glow)"
      />

      <path
        d="M147 75C147 114.765 114.765 147 75 147C35.2355 147 3 114.765 3 75C3 35.2355 35.2355 3 75 3C114.765 3 147 35.2355 147 75"
        stroke="white"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashoffset"
        stroke-width="2"
        stroke-linecap="round"
        transform="rotate(90 75 75)"
        opacity="0.5"
      />

      <defs>
        <filter id="glow">
          <feGaussianBlur
            stdDeviation="2"
            result="coloredBlur"
          />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient
          id="blue_border_linear"
          x1="3"
          y1="75"
          x2="147"
          y2="75"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#3333FF" />
          <stop
            offset="1"
            stop-color="#5858F5"
          />
        </linearGradient>
      </defs>
    </svg>

    <div
      class="absolute inset-0 w-full h-full rounded-full bg-background/56 border-2 border-background backdrop-blur-[4px] drop-shadow-[-30px_30px_40px_hsl(240_89%_65%)]"
    >
      <div class="h-full w-full flex flex-col gap-1 items-center justify-center">
        <span class="text-purple-gray text-sm font-semibold tracking-[0.56px] leading-6">{{ label || t('components.baseTimer.smashIn') }}</span>

        <span
          class="text-[40px] leading-8 bg-[radial-gradient(ellipse_at_-8px_-8px,white,#D4C5EB_40%)] tracking-[-2.8px] text-transparent bg-clip-text px-5 mix-blend-plus-lighter"
          style="text-shadow: 0px 0px 4px rgba(250, 250, 250, 0.5)"
        >
          {{ timeRemaining }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InlineSvg from 'vue-inline-svg'
import timerMaskBehind from '@/assets/images/game/timer/mask-behind.svg'
import { useTimer } from '@/composables/use-timer'
import { computed } from 'vue'
import { useTranslation } from '@/composables/use-i18n'

const { t } = useTranslation()

const props = withDefaults(defineProps<{
	endDateTimestamp: number
	progress: number
	label?: string
}>(), {
  label: '',
})

const { timeRemaining, circumference, strokeDashoffset } = useTimer({ endDateTimestamp: props.endDateTimestamp, progress: computed(() => props.progress) })
</script>
