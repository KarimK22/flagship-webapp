<template>
  <RewardsCarousel
    class="mb-12"
    type="rewards"
  />
  <RewardsHistoryList
    :items="items"
    :is-loading="isLoading"
    :is-loading-more="loadingMore"
    :all-shown="!hasMore"
    :empty-text="t('components.rewardsWrapper.emptyText')"
    :title="t('components.rewardsWrapper.title')"
    class="container mt-[98px]"
    @show-more="handleShowMore"
  />
</template>
<script setup lang="ts">
import { useTranslation } from '@/composables/use-i18n'
import RewardsCarousel from '@/components/RewardsCarousel.vue'
import RewardsHistoryList from '@/components/rewards/RewardsHistoryList.vue'
import { ACTIVITY_TYPE } from '@/types/shared/activity.ts'
import { useActivitiesHistory } from '@/composables/contracts/activities-history.ts'
import { computed } from 'vue'

const { t } = useTranslation()

const filteredActivityTypes = [ACTIVITY_TYPE.SMASH_ASTEROID, ACTIVITY_TYPE.WIN_RAFFLE_PRIZE]
const { activities, isLoading, loadMore, loadingMore, hasMore } = useActivitiesHistory({
  types: filteredActivityTypes,
  initialDisplayCount: 3,
  displayIncrement: 3,
})

const items = computed(() => {
  return activities.value.map((activity) => ({
    title: activity.timeObject.formattedDate,
    referenceImageSrc: activity.referenceImageSrc,
    description: activity.description,
  }))
})

const handleShowMore = () => {
  loadMore()
}
</script>

<style scoped>

</style>