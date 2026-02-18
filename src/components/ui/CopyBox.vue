<template>
  <div
    class="flex gap-x-2 items-center cursor-pointer"
    @click="copyLink"
  >
    <div class="flex items-center justify-center size-10 rounded-full bg-light1/[0.02%] cursor-pointer backdrop-blur-[2px] shadow-[inset_0px_-28px_24px_-16px_rgba(222,206,235,0.08)]">
      <InlineSvg
        :src="copyIcon"
        class="size-5 text-light1"
      />
    </div>
    <div class="text-xl leading-8 text-light1 -tracking-[0.6px]">
      {{ text }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { useClipboard } from '@/composables/clipboard.ts'
import { computed, ref } from 'vue'
import { cleanUpUrl } from '@/composables/url'
import copyIcon from '@/assets/icons/copy.svg'

const props = withDefaults(defineProps<{
  text: string
  copyValue?: string
  image?: string
  cleanUrl?: boolean
  copyLabel?: string
}>(), {
  image: '',
  cleanUrl: true,
  copyLabel: 'copy',
  copyValue: undefined,
})

const emit = defineEmits(['onCopy'])

const text = computed(() => props.cleanUrl ? cleanUpUrl(props.text) : props.text)

const { copyToClipboard } = useClipboard()
const copySuccessful = ref(false)
const copyLink = () => {
  emit('onCopy')
  if (props.copyValue) {
    copyToClipboard(props.copyValue)
  } else {
    copyToClipboard(text.value)
  }
  copySuccessful.value = true
  setTimeout(() => {
    copySuccessful.value = false
  }, 3000)
}
</script>
<style scoped>

</style>