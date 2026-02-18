<template>
  <RewardInfoWidget
    variant="orange"
    badge-color="#C95CFF"
    :badge-icon="elementIcon"
    :badge-text="t('components.elementsWidget.sixthElement', { count: elements?.[6] || 0 })"
    :value="earnedElements"
    :max-value="maxElements"
  >
    <template #button>
      <ElementsSheet v-model:open="isSheetOpen">
        <template #trigger>
          <GlowButton
            class="w-full"
            :color="EButtonColor.ORANGE"
            @click="mixpanel.track('Element Popup View')"
          >
            {{ t('components.elementsWidget.earnedElements') }}
          </GlowButton>
        </template>
      </ElementsSheet>
    </template>
  </RewardInfoWidget>
</template>
<script setup lang="ts">
import elementIcon from '@/assets/icons/element-icon.svg'
import { EButtonColor } from '@/types/shared/button.ts'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import ElementsSheet from '@/components/rewards/ElementsSheet.vue'
import { useElements } from '@/composables/elements.ts'
import { computed, ref } from 'vue'
import RewardInfoWidget from './RewardInfoWidget.vue'
import mixpanel from 'mixpanel-browser'
import { useTranslation } from '@/composables/use-i18n'

const { t } = useTranslation()
const isSheetOpen = ref(false)
const { elements } = useElements()

const maxElements = computed(() => {
  if (!elements.value) return 5
  return Object.keys(elements.value).length - 1
})

const earnedElements = computed(() => {
  if (!elements.value) return 0
  const elementsArray = Object.values(elements.value).slice(0, (Object.keys(elements.value).length - 1))
  return elementsArray.filter((element: number) => element > 0).length
})
</script>