<script setup lang="ts">
import InlineSvg from 'vue-inline-svg'
import filter from '@/assets/icons/filter.svg'
import { ref } from 'vue'
import { useEventListener } from '@vueuse/core'

const elementRef = ref<HTMLDivElement>()
const showTextOnClick = ref(false)
const textOnClickWidth = ref(0)
const textOnHoverWidth = ref(0)

withDefaults(
  defineProps<{
        src: string
        textOnClick?: string
        textOnHover?: string
        transparent?: boolean
    }>(),
  {
    textOnClick: '',
    textOnHover: '',
    transparent: false,
  },
)

const emit = defineEmits<{
    (e: 'click'): void
}>()

let timer: NodeJS.Timeout | null = null
const handleClick = () => {
  emit('click')
  if (timer) {
    clearTimeout(timer)
  }
  showTextOnClick.value = true
  timer = setTimeout(() => {
    showTextOnClick.value = false
  }, 1000)
}

useEventListener(elementRef, 'click', handleClick)

useEventListener(elementRef, 'mouseenter', () => {
  textOnHoverWidth.value = elementRef.value?.querySelector('#text-on-hover')?.getBoundingClientRect().width ?? 0
  textOnClickWidth.value = elementRef.value?.querySelector('#text-on-click')?.getBoundingClientRect().width ?? 0
})
</script>

<template>
  <div>
    <InlineSvg
      class="pointer-events-none"
      :src="filter"
    />
    <div
      ref="elementRef"
      :style="`--text-width: ${showTextOnClick ? textOnClickWidth : textOnHoverWidth}px;`"
      class="icon-button-wrapper relative w-10 rounded-full overflow-hidden flex items-center justify-center bg-[rgba(12,12,20,0.8)] h-10 backdrop:blur-[4px] pr-4"
      :class="{ 'bg-transparent': transparent }"
    >
      <div class="flex items-center justify-center min-w-10 min-h-10">
        <InlineSvg
          :src="src"
          class="cursor-pointer"
          unique-ids
          @click="emit('click')"
        />
      </div>
      <span
        id="text-on-click"
        :class="{ 'opacity-100 left-10': showTextOnClick }"
        class="text-white text-sm text-nowrap opacity-0 absolute left-0 transition-all duration-300 overflow-hidden"
      >
        {{ textOnClick }}
      </span>
      <span
        id="text-on-hover"
        :class="{ 'opacity-100 left-10': !showTextOnClick }"
        class="text-white text-sm text-nowrap opacity-0 absolute left-0 transition-all duration-300 overflow-hidden"
      >
        {{ textOnHover }}
      </span>
    </div>
  </div>
</template>

<style>
.icon-button-wrapper {
    cursor: pointer;
    filter: url(#bg-icon-filter);
    display: flex;
    align-items: center;
    justify-content: start;
    transition: all 0.3s ease-in-out;
    overflow: hidden;
}

.icon-button-wrapper:hover {
    width: calc(var(--text-width) + 40px + 16px);
}

.icon-button-wrapper:not(:hover) span {
    opacity: 0;
}

.icon-button-wrapper:not(:hover):not(:focus-within) {
    transition: width 0.3s ease 0.1s;
}
</style>
