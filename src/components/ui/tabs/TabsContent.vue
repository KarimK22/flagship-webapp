<script setup lang="ts">
import { cn } from '@/lib/utils'
import { TabsContent, type TabsContentProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<TabsContentProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <TabsContent
    :class="cn(
      'mt-2 ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'data-[state=inactive]:animate-out data-[state=active]:animate-in',
      'data-[state=inactive]:fade-out data-[state=active]:fade-in',
      'data-[state=active]:duration-300 data-[state=inactive]:duration-300',
      props.class
    )"
    v-bind="delegatedProps"
  >
    <slot />
  </TabsContent>
</template>

<style>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.animate-in {
  animation-duration: 300ms;
  animation-timing-function: ease-out;
}

.animate-out {
  animation-duration: 300ms;
  animation-timing-function: ease-in;
}

.fade-in {
  animation: fade-in 300ms ease-out;
}

.fade-out {
  animation: fade-out 300ms ease-in;
}
</style>
