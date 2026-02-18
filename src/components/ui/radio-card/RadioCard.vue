<script setup lang="ts">
import { computed } from 'vue'
import InlineSvg from 'vue-inline-svg'
import checkmarkIcon from '@/assets/icons/checkmark.svg'
import starIcon from '@/assets/icons/star.svg'
import BalanceBadge from '@/components/user-balance/BalanceBadge.vue'

interface Props {
  title: string
  description?: string[]
  value: string
  modelValue: string | null
  class?: string
	badgeText?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const classes = computed(() => {
  return [
    'flex-1 p-4 bg-[rgba(20,20,31,1)] backdrop-blur-[4px] shadow-[inset_0px_-4px_16px_-2px_rgba(222,206,235,0.16)] cursor-pointer relative min-h-[336px] flex flex-col justify-between rounded-2xl select-none',
    props.class,
  ]
})
</script>

<template>
  <div
    :class="classes"
    @click="emit('update:modelValue', value)"
  >
    <!--		Radio mark-->
    <InlineSvg
      :src="checkmarkIcon"
      width="40"
      height="40"
      class="absolute right-4 top-4 transition-all duration-300 ease-in-out opacity-0"
      :class="{ 'opacity-100 scale-100': modelValue === value }"
    />
    <div
      v-if="modelValue !== value"
      class="absolute right-4 top-4 size-10 rounded-full border border-purple-gray/48 shadow-[0px_0px_56px_-16px_rgba(28,28,41,0.40)_inset] transition-all duration-800 ease-in-out opacity-100 scale-100"
    />

    <!--		Content-->
    <div class="text-base leading-5 font-semibold -tracking-[0.64px] text-light1 transition-opacity duration-300 mt-4 mb-8">
      <h3 class="inline-block font-normal max-w-[115px] text-lavender text-[56px] leading-10 tracking-[-2.24px]">
        {{ title }}
      </h3>
      <BalanceBadge
        v-if="badgeText"
        color="#FF7847"
        class="bg-[#FF7847]/12 w-auto inline-flex bottom-1.5"
      >
        <span>{{ badgeText }}</span>
      </BalanceBadge>
    </div>
    <ul
      v-if="description?.length"
      class="text-light1 text-xl leading-6 tracking-[-0.6px] mt-auto mb-6"
    >
      <li
        v-for="(line, index) in description"
        :key="index"
        class="flex items-start gap-2 mb-4 last:mb-0"
      >
        <InlineSvg
          :src="starIcon"
          width="24"
          height="24"
        />
        <span>{{ line }}</span>
      </li>
    </ul>
  </div>
</template>