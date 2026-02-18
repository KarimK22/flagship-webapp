<template>
  <div class="flex flex-col gap-8">
    <RewardsCarousel
      type="experiences"
      :is-loading="loadingExperiences || loadingMyExperiencesStatus"
      :empty-text="t('components.experiencesWrapper.comingSoon')"
    />
    <RewardsHistoryList
      :items="userItems"
      :is-loading="loadingExperiences"
      :is-loading-more="loadingExperiences"
      :all-shown="userClaimedExperiences.length === userItems.length"
      :items-clickable="true"
      image-class="!bg-cover"
      :empty-text="emptyTextUserExperiences"
      :title="t('components.experiencesWrapper.yourExperiences')"
      class="container mt-[98px]"
      @activity-click="handleUserExperienceClick"
      @show-more="displayUserLimit += 3"
    />
    <RewardsHistoryList
      :items="finishedExperiencesItems"
      :is-loading="loadingExperiences"
      :is-loading-more="loadingExperiences"
      :all-shown="finishedExperiences.length === finishedExperiencesItems.length"
      :items-clickable="true"
      image-class="!bg-cover"
      :empty-text="t('components.experiencesWrapper.finishedExperiencesEmpty')"
      :title="t('components.experiencesWrapper.finishedExperiences')"
      class="container mt-[98px]"
      @activity-click="handleActivityClick"
      @show-more="displayFinishedLimit += 3"
    />

    <ExperiencesFinishedModal
      v-if="clickedExperience"
      v-model="showExperiencesFinishedModal"
      :experience="clickedExperience"
      :experience-claimed="!!myExperiencesStatus[clickedExperience.id]"
    />
    <ExperienceClaimModal
      v-if="clickedUserExperience"
      v-model="showExperiencesModal"
      :experience="clickedUserExperience"
      :experience-claimed="true"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTranslation } from '@/composables/use-i18n'
import { useExperiences } from '@/composables/experiences.ts'
import RewardsCarousel from '@/components/RewardsCarousel.vue'
import RewardsHistoryList from '@/components/rewards/RewardsHistoryList.vue'
import { DateTime } from 'luxon'
import mixpanel from 'mixpanel-browser'
import type { ExclusiveEvent } from '@/services/api.ts'
import ExperiencesFinishedModal from '@/components/rewards/experiences/ExperiencesFinishedModal.vue'
import ExperienceClaimModal from '@/components/rewards/experiences/ExperienceClaimModal.vue'
import { useGetMe } from '@/composables/get-me'

const { t } = useTranslation()

const displayUserLimit = ref(3)
const displayFinishedLimit = ref(3)
const {
  finishedExperiences,
  loadingExperiences,
  loadingMyExperiencesStatus,
  myExperiencesStatus,
  userClaimedExperiences,
} = useExperiences()

const { accountAddress } = useGetMe()

const showExperiencesFinishedModal = ref(false)
const showExperiencesModal = ref(false)

const finishedExperiencesItems = computed(() => {
  return finishedExperiences.value.slice(0, displayFinishedLimit.value).map((experience) => ({
    title: DateTime.fromISO(experience.endDate)
      .toFormat('d LLL yyyy · h:mma')
      .toLowerCase(),
    description: `${experience.claimed} users claimed ${experience.name}`,
    referenceImageSrc: experience.imageUrl,
  }))
})
const userItems = computed(() => {
  const items = userClaimedExperiences.value
  return items.sort((a, b) => {
    return (
      DateTime.fromISO(b.claimedDate).toMillis() - DateTime.fromISO(a.claimedDate).toMillis()
    )
  })
    .slice(0, displayUserLimit.value).map((experience) => ({
      title: DateTime.fromISO(experience.claimedDate)
        .toFormat('d LLL yyyy · h:mma')
        .toLowerCase(),
      description: `${experience.name}`,
      referenceImageSrc: experience.imageUrl,
    }))
})
const clickedExperience = ref<ExclusiveEvent | null>(null)
const clickedUserExperience = ref<ExclusiveEvent | null>(null)

const emptyTextUserExperiences = computed(() => {
  return accountAddress.value ? t('components.experiencesWrapper.yourExperiencesEmpty') : t('components.experiencesWrapper.loginToSeeExperiences')
})

const handleActivityClick = (index: number) => {
  mixpanel.track('Finished Experience Popup View')

  clickedExperience.value = finishedExperiences.value[index]
  showExperiencesFinishedModal.value = true
}
const handleUserExperienceClick = (index: number) => {
  mixpanel.track('My Experience Popup View')

  clickedUserExperience.value = userClaimedExperiences.value[index]
  showExperiencesModal.value = true
}
</script>

<style scoped>

</style>