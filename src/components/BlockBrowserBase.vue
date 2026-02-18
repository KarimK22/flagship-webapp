<template>
  <BaseModal
    :model-value="modelValue"
    class="py-8 pt-10 gap-0 !rounded-2xl w-[96vw] md:w-[452px] !max-w-[none] max-h-[96vh] md:max-h-[90%] h-auto [aria-label='Close']:hidden"
    :show-close-button="false"
    @update:model-value="updateModelValue"
  >
    <!-- Content (with higher z-index) -->
    <template #header>
      <div class="pr-10">
        <h1
          class="text-lavender text-left text-4xl md:text-[48px] leading-8 md:leading-10 font-medium tracking-[-2.4px]"
        >
          <slot name="header" />
        </h1>
      </div>
    </template>
    <span
      class="text-purple-gray text-xl leading-6 font-normal tracking-[-0.6px] z-10"
    >
      <slot name="description" />
    </span>
    <template
      v-if="$slots.footer"
      #footer
    >
      <div class="p-0 w-full flex justify-center mt-8">
        <slot name="footer" />
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import type { VNode } from 'vue'

defineProps<{
  modelValue: boolean
}>()

defineSlots<{
  header: () => VNode
  description: () => VNode
  footer?: () => VNode
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const updateModelValue = (val: boolean) => {
  emit('update:modelValue', val)
}
</script>
