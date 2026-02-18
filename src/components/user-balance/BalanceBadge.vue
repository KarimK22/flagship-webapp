<template>
  <div
    class="rounded-[24px] p-[1px] relative flex flex-nowrap overflow-hidden blur-[0]"
    :style="{ background: gradient, backdropFilter: 'blur(8px)' }"
  >
    <div class="absolute top-0 left-0 z-10">
      <slot name="icon" />
      <InlineSvg
        v-if="icon && !$slots.icon"
        :src="icon"
      />
    </div>

    <div
      class="pr-2 py-0 rounded-[20px] backdrop-blur-sm h-[22px] text-[14px] leading-[22px] font-semibold text-lavender tracking-[0.03rem]"
      :class="icon || $slots.icon ? 'pl-8' : 'pl-2'"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import InlineSvg from 'vue-inline-svg'
import { addColorOpacity } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
		icon?: string
		color: string
		isGradientToTransparent?: boolean
	}>(),
  {
    icon: undefined,
    color: '#5858F5',
    isGradientToTransparent: false,
  },
)

const gradient = computed(() =>
  props.isGradientToTransparent
    ? `radial-gradient(
      circle at top -4px right 10px,
      #fff 0%,
      rgba(255, 255, 255, 0.60) 10%,
      ${addColorOpacity(props.color, 0.4)} 21%,
      ${addColorOpacity(props.color, 0.45)} 29%,
      ${addColorOpacity(props.color, 0.3)} 46%,
      rgba(38, 38, 56, 0.9) 60%,
      ${addColorOpacity('#6D6D8F', 0.1)} 70%,
      transparent 100%
    )`
    : `radial-gradient(
      circle at top -4px right 10px,
      #fff 0%,
      rgba(255, 255, 255, 0.60) 2%,
      ${addColorOpacity(props.color, 0.4)} 40%,
      ${addColorOpacity(props.color, 0.5)} 100%
    )`,
)
</script>
