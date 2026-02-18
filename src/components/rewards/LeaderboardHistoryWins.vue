<template>
  <div class="flex flex-col max-md:items-center md:flex-row gap-8 md:gap-12">
    <!-- LEFT COLUMN -->
    <div
      class="flex flex-col gap-3 md:min-w-[266px]"
      :class="items.length ? 'justify-between' : 'md:justify-center'"
    >
      <h1
        class="text-lavender text-5.5xl leading-tightest tracking-tighter"
        :class="{ 'mt-4': items.length > 0 }"
      >
        {{ title }}
      </h1>

      <!-- DESKTOP SHOW MORE -->
      <div
        v-if="canShowMore"
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

    <!-- RIGHT COLUMN -->
    <div
      ref="activityListRef"
      class="w-full"
    >
      <ActivityList
        :activities="items"
        :empty-text="emptyText"
        :image-class="imageClass"
        :variant="variant"
        :is-loading="isLoading"
        :is-loading-more="isLoadingMore"
        :items-clickable="itemsClickable"
        :class="{ 'flex items-center': items.length === 0 }"
        @activity-click="emit('activityClick', $event)"
        @action-button-click="emit('actionButtonClick', $event)"
      />

      <!-- MOBILE SHOW MORE -->
      <div
        v-if="canShowMore"
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
import { computed, ref } from 'vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button.ts'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = withDefaults(defineProps<{
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
  allShown: true,
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

const canShowMore = computed(() => {
  return props.items.length > 0 && !props.allShown
})

function scrollToLastActivity() {
  if (!activityListRef.value) return

  const lastItem = activityListRef.value.querySelector(
    '.flex.gap-4:last-child',
  )

  lastItem?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}

function handleShowMore() {
  emit('showMore')
  setTimeout(scrollToLastActivity, 50)
}
</script>