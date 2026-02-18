<script setup lang="ts">
import ActivityList from '@/components/ActivityList.vue'
import IconWrapper from '@/components/icon-wrapper/IconWrapper.vue'
import { useActivitiesHistory } from '@/composables/contracts/activities-history'
import { ACTIVITY_TYPE } from '@/types/shared/activity'
import { computed, ref } from 'vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import lingoIcon from '@/assets/images/lingo-icon.svg'
import InlineSVG from 'vue-inline-svg'
import { useTranslation } from '@/composables/use-i18n'

const { t } = useTranslation()

const filteredActivityTypes = [ACTIVITY_TYPE.STAKE, ACTIVITY_TYPE.UNSTAKE]
const { activities, isLoading, loadMore, hasMore, loadingMore } = useActivitiesHistory({
  types: filteredActivityTypes,
  initialDisplayCount: 3,
  displayIncrement: 3,
})

const activityListRef = ref<InstanceType<typeof ActivityList>>()
const holdingActivities = computed(() => {
  return activities.value.map((activity) => ({
    title: activity.timeObject.formattedDate,
    description: activity.description,
  }))
})

const handleLoadMore = () => {
  loadMore()
  setTimeout(() => {
    activityListRef.value?.scrollToLastActivity()
  }, 1_00)
}
</script>

<template>
  <div class="flex flex-col md:flex-row gap-8 md:gap-12 mt-24">
    <div class="flex flex-col gap-3 w-full min-w-0 md:w-[26.5rem] md:min-w-[280px]">
      <IconWrapper
        variant="purple"
        position="left"
        with-borders
      >
        <InlineSVG
          :src="lingoIcon"
          class="size-10"
        />
      </IconWrapper>
      <h1 class="text-lavender text-5.5xl leading-tightest tracking-tighter max-w-[100%]">
        {{ t('staking.holdingHistory') }}
      </h1>
      <div
        :hidden="!holdingActivities.length || !hasMore"
        class="hidden md:flex justify-start mt-32 h-full items-end"
      >
        <GlowButton
          :color="EButtonColor.BLUE"
          :loading="loadingMore || isLoading"
          class="w-[129px]"
          @click="handleLoadMore"
        >
          {{ t('staking.showMore') }}
        </GlowButton>
      </div>
    </div>
    <div class="min-w-0">
      <ActivityList
        ref="activityListRef"
        :activities="holdingActivities"
        :empty-text="t('staking.holdingActivitiesEmpty')"
        variant="purple"
        :loading="loadingMore || isLoading"
      />
      <div
        :hidden="!holdingActivities.length || !hasMore"
        class="flex md:hidden justify-center mt-4"
      >
        <GlowButton
          :color="EButtonColor.BLUE"
          :loading="loadingMore || isLoading"
          class="w-[129px]"
          @click="handleLoadMore"
        >
          {{ t('staking.showMore') }}
        </GlowButton>
      </div>
    </div>
  </div>
</template>
