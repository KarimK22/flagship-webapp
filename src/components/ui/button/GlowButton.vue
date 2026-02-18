<template>
  <component
    :is="tag || 'button'"
    ref="buttonRef"
    type="button"
    :disabled="disabled"
    class="rounded-full outline-none h-10 relative"
    :class="{
      'cursor-pointer': !disabled,
    }"
    @pointerenter="handlePointerEnter"
    @pointerleave="handlePointerLeave"
  >
    <div class="relative rounded-full w-full h-full overflow-hidden">
      <div class="absolute rounded-full w-full h-full bg-[rgba(38,38,56,0.56)] shadow-[0px_-4px_16px_-2px_rgba(222,206,235,0.24)_inset]" />
      <div
        v-if="!disabled"
        class="w-full h-full absolute top-0 left-0 overflow-hidden rounded-full"
      >
        <GlowEffect
          :color="color"
          :enable-animations="isPointerInside"
        />
      </div>
      <div
        class="relative rounded-full w-full h-full z-10 translate-z-0"
        :style="props.style"
      >
        <div
          class="w-full h-full px-3 text-lavender font-semibold text-sm leading-6 tracking-[0.42px] overflow-hidden flex items-center justify-center"
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
    </div>

    <div
      v-if="!disabled"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-full h-full"
    >
      <AnimatedAteroids
        v-for="(i, index) in positions"
        :key="index + 'a'"
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        :initial-position="i"
        :width="pathWidth"
        :height="pathHeight"
      />
    </div>
  </component>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref, useTemplateRef } from 'vue'
import { useElementSize, useMediaQuery } from '@vueuse/core'
import { EButtonColor } from '@/types/shared/button'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import GlowEffect from '@/components/ui/button/GlowEffect.vue'
import AnimatedAteroids from '@/components/ui/button/AnimatedAteroids.vue'

const isMobile = useMediaQuery('(max-width: 768px)')
const positions = [0.1, 0.2, 0.6, 0.7]
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

const buttonRef = useTemplateRef<HTMLButtonElement>('buttonRef')
const { width, height } = useElementSize(buttonRef)
const isPointerInside = ref(false)

const handlePointerEnter = () => {
  if (isMobile.value) return
  isPointerInside.value = true
}

const handlePointerLeave = () => {
  isPointerInside.value = false
}

// Optimized path calculations with memoization
const pathWidth = computed(() => {
  const w = width.value || 0
  return w + 8
})
const pathHeight = computed(() => {
  const h = height.value || 0
  return h + 8
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
