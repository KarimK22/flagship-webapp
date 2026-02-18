<template>
  <div class="flex items-center gap-8">
    <!-- Ticket amount input -->
    <div class="flex items-center gap-4 flex-1">
      <BaseInput
        v-model="localAmount"
        variant="dark"
        type="number"
        :min="1"
        :max="maxTickets > 0 ? maxTickets : undefined"
        class="w-full"
        :placeholder="$t('components.raffleEnterInput.amount')"
      >
        <template #suffix>
          <span class="text-purple-gray z-10 isolate">
            {{ $t('components.raffleEnterInput.tickets') }}
          </span>
        </template>
      </BaseInput>
    </div>

    <!-- Predefined values -->
    <div class="flex items-center gap-0.5">
      <BaseButton
        v-for="value in predefinedValues"
        :key="value"
        variant="dark"
        size="icon"
        :class="[
          localAmount === maxTickets ? 'bg-dark3/[0.56%] text-lavender shadow-[inset_0px_-4px_16px_-2px_rgba(222,206,235,0.24)]' : ''
        ]"
        @click="selectAmount(value)"
      >
        {{ value }}
      </BaseButton>
      <BaseButton
        variant="dark"
        size="icon"
        :class="[
          localAmount === maxTickets ? 'bg-dark3/[0.56%] text-lavender shadow-[inset_0px_-4px_16px_-2px_rgba(222,206,235,0.24)]' : ''
        ]"
        @click="selectAmount(maxTickets)"
      >
        {{ $t('components.raffleEnterInput.max') }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { BaseInput } from '@/components/ui/input'
import { BaseButton } from '@/components/ui/button'

const props = withDefaults(defineProps<{
    modelValue: number
    maxTickets?: number
}>(), {
  maxTickets: 100,
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void
}>()

const predefinedValues = [5, 10, 20]
const localAmount = ref<number>(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  localAmount.value = newValue
})

watch(localAmount, (newValue) => {
  const numericValue = Number(newValue)
  if (isNaN(numericValue) || numericValue < 1 || newValue === null) {
    localAmount.value = 1
    emit('update:modelValue', 1)
    return
  }

  emit('update:modelValue', numericValue)
})

function selectAmount (value: number) {
  localAmount.value = value
  emit('update:modelValue', value)
}
</script>

<style scoped>
/* Add any additional styling if needed */
</style>