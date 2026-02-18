<template>
  <BlockBrowserBase
    :model-value="
      isEmbedded && auth !== 'email' && !isWheel
    "
  >
    <template #header>
      <span v-html="t('common.requestOpenInBrowser.title')"></span>
    </template>
    <template #description>
      {{ t('common.requestOpenInBrowser.description') }}
    </template>
    <template #footer>
      <div
        class="rounded-full bg-[rgba(38,38,56,0.56)] shadow-[0px_-4px_16px_-2px_rgba(222,206,235,0.24)_inset] text-lavender text-sm leading-6 tracking-[0.42px] w-full max-w-[356px] h-[38.582px] flex items-center justify-center cursor-pointer z-10"
        role="button"
        @click="copyUrl"
      >
        <span v-if="!copied">{{ t('common.requestOpenInBrowser.copyUrl') }}</span>
        <span v-else>{{ t('common.requestOpenInBrowser.copied') }}</span>
      </div>
    </template>
  </BlockBrowserBase>
</template>

<script setup lang="ts">
import mixpanel from 'mixpanel-browser'
import { ref } from 'vue'
import BlockBrowserBase from './BlockBrowserBase.vue'
import { usePlatform } from '@/composables/platform'
import { auth } from '@/composables/reown'
import { useDynamicHome } from '@/composables/dynamic-home'
import { useTranslation } from '@/composables/use-i18n'

const { t } = useTranslation()
const { isEmbedded } = usePlatform()
const { isWheel } = useDynamicHome()

const baseUrl = window.location.href
const copied = ref(false)

const copyUrl = () => {
  mixpanel.track('Copy URL clicked')
  copied.value = true
  navigator.clipboard.writeText(baseUrl)
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>
