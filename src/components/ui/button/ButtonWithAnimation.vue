<template>
  <component
    :is="tag || 'button'"
    ref="buttonRef"
    type="button"
    :disabled="disabled"
    class="group rounded-full overflow-hidden outline-none"
    :class="{
      'cursor-pointer p-1': !disabled,
      'p-[3px]': disabled,
    }"
  >
    <div
      class="relative w-full rounded-full blur-[0]"
      :class="{
        'shadow-[inset_0px_-24px_16px_-16px_rgba(222,206,235,0.08)] bg-dark3/56 ': !disabled,
      }"
    >
      <div
        class="relative p-[1px] rounded-full w-full h-full overflow-hidden"
        :class="{
          'border border-dark3 opacity-50 shadow-[0px_0px_56px_-16px_rgba(28,28,41,0.40)_inset] !cursor-not-allowed ': disabled,
        }"
        :style="props.style"
      >
        <div
          v-if="!disabled"
          :style="activeGradientStyle"
        />

        <div
          class="rounded-full w-full h-full py-1.5 px-3! backdrop-blur-xl text-lavender font-semibold text-[14px] leading-[22px] tracking-[0.03rem] overflow-hidden flex items-center justify-center gap-x-2"
          :class="{ invisible: loading, '!text-purple-gray': disabled }"
        >
          <slot>{{ text }}</slot>
        </div>

        <div
          v-if="loading"
          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <BaseSpinner class="w-4 h-4 origin-center flex items-center justify-center" />
        </div>
      </div>

      <!-- SVG mask definition -->
      <svg
        v-if="!disabled"
        width="0"
        height="0"
      >
        <defs>
          <mask :id="strokeMaskID">
            <path
              :d="maskPathsData"
              stroke="white"
              stroke-width="2"
              fill="none"
            />
          </mask>
        </defs>
      </svg>

      <div
        ref="pathContainerRef"
        class="absolute -top-1 -left-1 w-[calc(100%+8px)] h-[calc(100%+8px)] pointer-events-none"
        :style="{ mask: `url(#${strokeMaskID})` }"
      >
        <template
          v-for="path in dotPathsData"
          :key="path"
        >
          <span
            :class="`animated-dot`"
            :style="{ 'offset-path': `path('${path}')` }"
          >
            <span
              class="trace-path"
              :style="{ width: `${pathWidth / 4}px` }"
            />
          </span>
        </template>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import type { ComputedRef, HTMLAttributes } from 'vue'
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { useElementSize } from '@vueuse/core'
import { addColorOpacity } from '@/lib/utils'
import { EButtonColor } from '@/types/shared/button'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'

const props = withDefaults(
  defineProps<{
		tag?: 'button' | 'a'
		text?: string
		color?: EButtonColor
		loading?: boolean
		style?: HTMLAttributes['style']
		disabled?: boolean
	}>(),
  {
    tag: 'button',
    text: '',
    color: EButtonColor.ORANGE,
    loading: false,
    style: undefined,
    disabled: false,
  },
)

const DEFAULT_GRADIENT_POSITION = { top: '0px', left: '80%' }
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

const buttonRef = useTemplateRef<HTMLButtonElement>('buttonRef')
const pathContainerRef = ref<HTMLDivElement>()
const gradientPosition = ref({ ...DEFAULT_GRADIENT_POSITION })

const { width, height } = useElementSize(buttonRef)
// TODO: Add 8px to the width and height to account for the border and padding
const pathWidth = computed(() => width.value + 8)
const pathHeight = computed(() => height.value + 8)

// We need unique id for each button to avoid conflicts
const strokeMaskID = computed(() => `strokeMask-${Math.random().toString(36).substring(2, 15)}`)
const buttonColor = computed(() => colorMap[props.color])
const maskPathsData = computed(
  () => `M ${pathHeight.value / 2},0 L ${pathWidth.value - pathHeight.value / 2},0
	A ${pathHeight.value / 2},${pathHeight.value / 2} 0 0 1 ${pathWidth.value - pathHeight.value / 2},${pathHeight.value}
	L ${pathHeight.value / 2},${pathHeight.value}
	A ${pathHeight.value / 2},${pathHeight.value / 2} 0 0 1 ${pathHeight.value / 2},0 Z`,
)
const dotPathsData = computed(() => [
  // Starts from North (top middle)
  `M ${pathWidth.value / 2},0 C ${pathWidth.value},0 ${pathWidth.value},0 ${pathWidth.value},${pathHeight.value / 2} C ${pathWidth.value},${
    pathHeight.value
  } ${pathWidth.value},${pathHeight.value} ${pathWidth.value / 2},${pathHeight.value} C 0,${pathHeight.value} 0,${pathHeight.value} 0,${
    pathHeight.value / 2
  } C 0,0 0,0 ${pathWidth.value / 2},0`,

  // Starts from East (right middle)
  `M ${pathWidth.value},${pathHeight.value / 2} C ${pathWidth.value},${pathHeight.value} ${pathWidth.value},${pathHeight.value} ${
    pathWidth.value / 2
  },${pathHeight.value} C 0,${pathHeight.value} 0,${pathHeight.value} 0,${pathHeight.value / 2} C 0,0 0,0 ${pathWidth.value / 2},0 C ${
    pathWidth.value
  },0 ${pathWidth.value},0 ${pathWidth.value},${pathHeight.value / 2}`,

  // Starts from South (bottom middle)
  `M ${pathWidth.value / 2},${pathHeight.value} C 0,${pathHeight.value} 0,${pathHeight.value} 0,${pathHeight.value / 2} C 0,0 0,0 ${
    pathWidth.value / 2
  },0 C ${pathWidth.value},0 ${pathWidth.value},0 ${pathWidth.value},${pathHeight.value / 2} C ${pathWidth.value},${pathHeight.value} ${
    pathWidth.value
  },${pathHeight.value} ${pathWidth.value / 2},${pathHeight.value}`,

  // Starts from West (left middle)
  `M 0,${pathHeight.value / 2} C 0,0 0,0 ${pathWidth.value / 2},0 C ${pathWidth.value},0 ${pathWidth.value},0 ${pathWidth.value},${
    pathHeight.value / 2
  } C ${pathWidth.value},${pathHeight.value} ${pathWidth.value},${pathHeight.value} ${pathWidth.value / 2},${pathHeight.value} C 0,${
    pathHeight.value
  } 0,${pathHeight.value} 0,${pathHeight.value / 2}`,
])
const activeGradientStyle: ComputedRef<HTMLAttributes['style']> = computed(() => ({
  position: 'absolute',
  width: (pathContainerRef.value?.clientWidth || 0) * 3,
  top: gradientPosition.value.top,
  left: gradientPosition.value.left,
  transform: 'translate(-50%, -50%)',
  transformOrigin: 'center',
  transition: 'all 0.1s ease',
  minWidth: '220px',
  height: '220px',
  borderRadius: '50%',
  filter: 'blur(8px)',
  background: `radial-gradient(
      circle at center,
      #fff 0%,
      rgba(255, 255, 255, 0.60) 10%,
      ${addColorOpacity(buttonColor.value, 0.4)} 21%,
      ${addColorOpacity(buttonColor.value, 0.5)} 29%,
      ${addColorOpacity(buttonColor.value, 0.3)} 38%,
      rgba(38, 38, 56, 0.9) 46%,
      ${addColorOpacity('#6D6D8F', 0.1)} 70%,
      transparent 100%
    )`,
  backdropFilter: 'blur(10px)',
}))

const updateGradientPosition = (event: MouseEvent) => {
  if (!buttonRef.value) return

  const rect = buttonRef.value.getBoundingClientRect()

  // Check if cursor is inside the button
  if (event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) {
    // Calculate relative position inside the button
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    gradientPosition.value = {
      top: `${y}px`,
      left: `${x}px`,
    }
  }
}

onMounted(() => {
  window.addEventListener('mousemove', updateGradientPosition)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateGradientPosition)
})
</script>

<style scoped lang="scss">
.trace-path {
	pointer-events: none;
	mix-blend-mode: screen;
}
.animated-dot {
	position: absolute;
	top: 0;
	left: 0;
	width: 2px;
	height: 2px;
	background: white;
	border-radius: 50%;
	box-shadow: 2px 2px 5px rgba(255, 255, 255, 0.5);
	animation: moveDot 12s ease-in-out infinite;

	.trace-path {
		display: block;
		position: absolute;
		top: 50%;
		right: -100%;
		transform: translate(0, -50%);

		width: 30px;
		height: 20px;
		border-radius: 50%;
		// background: radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);

		background: linear-gradient(to right, transparent, rgba(255, 255, 255, 1));
	}
}

@keyframes moveDot {
	0% {
		offset-distance: 0%;
	}
	100% {
		offset-distance: 100%;
	}
}
</style>
