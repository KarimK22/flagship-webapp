<script setup lang="ts">
import ActivityList from '@/components/ActivityList.vue'
import IconWrapper from '@/components/icon-wrapper/IconWrapper.vue'
import { useActivitiesHistory } from '@/composables/contracts/activities-history'
import { ACTIVITY_TYPE } from '@/types/shared/activity'
import { computed, ref } from 'vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import powerIcon from '@/assets/images/bolt.svg'
import InlineSVG from 'vue-inline-svg'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const filteredActivityTypes = [ACTIVITY_TYPE.PURCHASE_RAFFLE_TICKET, ACTIVITY_TYPE.SMASH_ASTEROID]
const { activities, isLoading, loadMore, hasMore, loadingMore } = useActivitiesHistory({
  types: filteredActivityTypes,
  initialDisplayCount: 3,
  displayIncrement: 3,
})

const activityListRef = ref<InstanceType<typeof ActivityList>>()
const parsedPowerUsageHistory = computed(() =>
  activities.value.map((activity) => {
    /* Preset the isStakeView to true */
    activity.isStakeView = true
    return {
      title: activity.timeObject.formattedDate,
      description: activity.description,
      referenceImageSrc: activity.referenceImageSrc,
    }
  }),
)

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
        variant="orange"
        position="left"
        with-borders
      >
        <InlineSVG
          :src="powerIcon"
          class="size-10"
        />
      </IconWrapper>
      <h1 class="whitespace-pre-line text-lavender text-5.5xl leading-tightest tracking-tighter max-w-[100%]">
        {{ t('staking.activities.powerMilesUsageHistory') }}
      </h1>
      <div
        :hidden="!activities.length || !hasMore"
        class="hidden md:flex justify-start mt-32 h-full items-end"
      >
        <GlowButton
          :color="EButtonColor.ORANGE"
          :loading="loadingMore || isLoading"
          class="w-[129px]"
          @click="handleLoadMore"
        >
          {{ t('staking.activities.showMore') }}
        </GlowButton>
      </div>
    </div>
    <div class="min-w-0">
      <ActivityList
        ref="activityListRef"
        :activities="parsedPowerUsageHistory"
        :empty-text="t('staking.activities.emptyText')"
        :is-loading="isLoading"
      />
      <div
        :hidden="!activities.length || !hasMore"
        class="flex md:hidden justify-center mt-4"
      >
        <GlowButton
          :color="EButtonColor.ORANGE"
          :loading="loadingMore || isLoading"
          class="w-[129px]"
          @click="handleLoadMore"
        >
          {{ t('staking.activities.showMore') }}
        </GlowButton>
      </div>
    </div>
  </div>
</template>
