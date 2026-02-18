<template>
  <div class="flex flex-col max-md:items-center md:flex-row gap-8 md:gap-12">
    <div
      class="flex flex-col gap-3 md:min-w-[266px]"
      :class=" items.length ? 'justify-between' : 'md:justify-center'"
    >
      <h1
        class="text-lavender text-5.5xl leading-tightest tracking-tighter"
        :class="{'mt-4': items.length > 0}"
      >
        {{ title }}
      </h1>
      <div
        :hidden="!items.length || allShown"
        class="hidden md:flex justify-start md:mt-32"
      >
        <GlowButton
          :color="EButtonColor.BLUE"
          :loading="isLoadingMore || isLoading"
          @click="handleShowMore"
        >
          {{ t('rewards.history.showMore') }}
        </GlowButton>
      </div>
    </div>
    <div
      ref="activityListRef"
      class="w-full"
    >
      <ActivityList
        :activities="items"
        :empty-text="emptyText"
        :image-class="imageClass"
        :variant="variant"
        :class="{'flex items-center max-h-[100px]': items.length === 0 }"
        :is-loading="isLoading"
        :is-loading-more="isLoadingMore"
        :items-clickable="itemsClickable"
        @activity-click="emit('activityClick', $event)"
        @action-button-click="emit('actionButtonClick', $event)"
      />
      <div
        :hidden="!items.length || allShown"
        class="flex md:hidden justify-start mt-4"
      >
        <GlowButton
          :color="EButtonColor.BLUE"
          :loading="isLoadingMore || isLoading"
          @click="handleShowMore"
        >
          {{ t('rewards.history.showMore') }}
        </GlowButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ActivityItem } from '@/composables/contracts/activities-history.ts'
import ActivityList from '@/components/ActivityList.vue'
import { ref } from 'vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button.ts'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
withDefaults(defineProps<{
    items: ActivityItem[]
    title: string
    emptyText: string
    isLoading?: boolean
    isLoadingMore?: boolean
    allShown?: boolean
    itemsClickable?: boolean
		imageClass?: string
	variant?: 'orange' | 'purple'
}>(), {
  isLoading: false,
  isLoadingMore: false,
  allShown: false,
  itemsClickable: false,
  imageClass: '',
  variant: 'purple',
})

const emit = defineEmits<{
    (e: 'activityClick', index: number): void
    (e: 'actionButtonClick', index: number): void
    (e: 'showMore'): void
}>()

const activityListRef = ref<HTMLElement>()

function scrollToLastActivity() {
  if (activityListRef.value) {
    const lastItem = activityListRef.value.querySelector('.flex.gap-4:last-child')
    if (lastItem) {
      lastItem.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}

function handleShowMore() {
  emit('showMore')
  // Small delay to allow for the new items to be added to the DOM
  setTimeout(() => scrollToLastActivity(), 50)
}
</script>