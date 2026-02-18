<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { ref, watch } from 'vue'
import { cn } from '@/lib/utils'
import { inputVariants, type InputVariants } from '@/components/ui/input/index.ts'

const props = withDefaults(defineProps<{
  modelValue: string | number
  class?: HTMLAttributes['class']
  variant?: InputVariants['variant']
  label?: string
    required?: boolean
}>(), {
  modelValue: '',
  class: '',
  variant: 'default',
  label: '',
  required: false,
})

// Make sure attributes are not inherited by the root element
defineOptions({
  inheritAttrs: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const localValue = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue
})

function updateValue(event: Event) {
  const target = event.target as HTMLInputElement
  localValue.value = target.value
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div
    class="flex flex-col gap-2 relative"
    :class="cn(props.class)"
  >
    <div
      v-if="label.length || required"
      class="flex items-center justify-between text-base font-semibold tracking-[0.16px] text-lavender"
    >
      <label v-if="label.length">{{ props.label }}</label>
      <span
        v-if="required"
        class="ml-auto"
      >*</span>
    </div>
    <div class="relative">
      <input
        :value="localValue"
        :class="cn(
          inputVariants({ variant }),
          { 'pr-[4.5rem]': $slots.suffix },
          'hide-number-arrows'
        )"
        :required="required"
        v-bind="$attrs"
        @input="updateValue"
      >
      <div
        v-if="$slots.suffix"
        class="absolute inset-y-0 right-3 flex items-center pointer-events-none"
      >
        <slot name="suffix" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hide number input arrows */
.hide-number-arrows::-webkit-outer-spin-button,
.hide-number-arrows::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
.hide-number-arrows {
  -moz-appearance: textfield;
}
</style>
