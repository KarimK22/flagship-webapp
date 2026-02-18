<template>
  <TooltipProvider disabled>
    <TooltipRoot v-model:open="copySuccessful">
      <TooltipTrigger as-child>
        <div
          class="inline-flex gap-x-2 items-center cursor-pointer group"
          v-bind="$attrs"
          @click.left="copyLink"
        >
          <span>{{ text }}</span>

          <Copy
            class="group-hover:text-white"
            :size="12"
          />
        </div>
      </TooltipTrigger>

      <TooltipContent
        align="center"
        side="right"
      >
        <p class="text-white pl-2">
          {{ copyLabel }}
        </p>
      </TooltipContent>
    </TooltipRoot>
  </TooltipProvider>
</template>
<script setup lang="ts">
import { TooltipContent, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'
import { Copy } from 'lucide-vue-next'
import { useClipboard } from '@/composables/clipboard.ts'
import { computed, ref } from 'vue'
import { cleanUpUrl } from '@/composables/url'

const props = withDefaults(
  defineProps<{
    text?: string | null
    copyValue?: string | null
    image?: string
    cleanUrl?: boolean
    copyLabel?: string
  }>(),
  {
    text: '',
    image: '',
    cleanUrl: true,
    copyLabel: 'Copied!',
    copyValue: '',
  },
)

const emit = defineEmits(['onCopy'])

const text = computed(() => (props.cleanUrl ? cleanUpUrl(props.text || '') : props.text || ''))

const { copyToClipboard } = useClipboard()
const copySuccessful = ref(false)
const copyLink = () => {
  emit('onCopy')

  if (props.copyValue) {
    copyToClipboard(props.copyValue)
  } else {
    copyToClipboard(text.value || '')
  }

  copySuccessful.value = true
  setTimeout(() => {
    copySuccessful.value = false
  }, 3000)
}
</script>
