<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Primitive, type PrimitiveProps } from 'radix-vue'
import { type ButtonVariants, buttonVariants } from '.'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'

interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  variant: 'default',
  size: 'default',
  class: '',
  loading: false,
  disabled: false,
})
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class, 'relative')"
    :disabled="loading || disabled"
  >
    <div
      class="flex items-center justify-center gap-2 min-h-[1.5rem] relative"
      :class="{ 'invisible': loading }"
    >
      <slot />
    </div>
    <div
      v-if="loading"
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <BaseSpinner class="w-4 h-4 origin-center flex items-center justify-center" />
    </div>
  </Primitive>
</template>
