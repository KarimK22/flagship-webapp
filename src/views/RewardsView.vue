<template>
  <div class="pb-8 pt-4 sm:pt-[58px]">
    <NotificationsBar />

    <div class="container flex max-md:flex-col items-center md:items-end justify-between">
      <h1 class="md:max-w-[256px] text-lavender text-[56px] font-normal leading-10 tracking-[-2.24px] mb-9">
        {{ t('views.rewardsView.title') }}
      </h1>
      <div class="flex gap-1">
        <BadgesWidget v-if="isConnected" />
      </div>
    </div>
    <div class="mb-20">
      <BaseTabs
        class="w-full bg-transparent"
        :model-value="activeTab"
        @update:model-value="handleTabChange"
      >
        <TabsList class="w-full">
          <div class="container">
            <div class="inline-block border-b border-b-purple-gray/40 space-x-8 relative">
              <div
                class="tabs-indicator"
                :style="indicatorStyle"
              />
              <TabsTrigger
                v-for="tab in tabs"
                :key="tab.value"
                ref="tabRefs"
                :value="tab.value"
                :class="{ 'active text-lavender': activeTab === tab.value }"
                @click="updateActiveTab(tab.value)"
              >
                <TabLabelBadge
                  v-if="tab.badgeText"
                  :label="tab.label"
                  :badge-text="tab.badgeText"
                />
                <span v-else>{{ tab.label }}</span>
              </TabsTrigger>
            </div>
          </div>
        </TabsList>

        <div class="tabs-content">
          <div v-if="activeTab === 'wheels'">
            <WheelsOverview />
          </div>
          <div v-if="activeTab === 'tasks'">
            <TasksWrapper />
          </div>
          <div v-if="activeTab === 'raffle'">
            <RafflesWrapper />
          </div>
          <div v-if="activeTab === 'airdrop'">
            <AirdropsWrapper />
          </div>
          <div v-if="activeTab === 'experiences'">
            <ExperiencesWrapper />
          </div>
        </div>
      </BaseTabs>
    </div>
    <RaffleWonModal
      :model-value="showUnclaimedRaffleModal"
      :raffle="unclaimedRaffle!"
      :prize-submitted-data="unclaimedRaffle?.prizeSubmittedData"
      :won-prize="unclaimedRaffle?.wonPrizeV2"
      :prize-title="prizeTitle"
      :prize-image="prizeImage"
      @update:model-value="hideWonRaffleModal"
    />
    <AirdropCardModal />
    <AirdropsFinishedModal />
    <AirdropClaimCardModal />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { type LocationQueryRaw, useRoute, useRouter } from 'vue-router'
import { BaseTabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import RafflesWrapper from '@/components/rewards/RafflesWrapper.vue'
import AirdropsWrapper from '@/components/rewards/airdrops/AirdropsWrapper.vue'
import BadgesWidget from '@/components/rewards/badges/BadgesWidget.vue'
import mixpanel from 'mixpanel-browser'
import { rewardsEventsTabs } from '@/const/mixpanel-maps'
import ExperiencesWrapper from '@/components/rewards/experiences/ExperiencesWrapper.vue'
import RaffleWonModal from '@/components/rewards/raffles/raffles-won/RaffleWonModal.vue'
import AirdropCardModal from '@/components/rewards/airdrops/AirdropCardModal.vue'
import AirdropsFinishedModal from '@/components/rewards/airdrops/AirdropsFinishedModal.vue'
import AirdropClaimCardModal from '@/components/rewards/airdrops/AirdropClaimCardModal.vue'
import { useGetMe } from '@/composables/get-me'
import NotificationsBar from '@/components/NotificationsBar.vue'
import { useUnclaimedRaffles } from '@/composables/unclaimed-raffles'
import { useI18n } from 'vue-i18n'
import TasksWrapper from '@/components/rewards/tasks/TasksWrapper.vue'
import TabLabelBadge from '@/components/rewards/TabLabelBadge.vue'
import WheelsOverview from '@/components/rewards/WheelsOverview.vue'

type TabValue =
  | 'raffle'
  | 'airdrop'
  | 'experiences'
  | 'tasks'
  | 'wheels'

const validTabs: TabValue[] = [
  'raffle',
  'airdrop',
  'experiences',
  'tasks',
  'wheels',
]

const tabs = computed(() => {
  return [
    { value: 'wheels' as const, label: t('views.rewardsView.wheels'), badgeText: t('common.new') },
    { value: 'raffle' as const, label: t('views.rewardsView.raffles') },
    { value: 'tasks' as const, label: t('views.rewardsView.tasks'), badgeText: t('common.new') },
    { value: 'airdrop' as const, label: t('views.rewardsView.airdrops') },
    { value: 'experiences' as const, label: t('views.rewardsView.experiences') },
  ]
})

const route = useRoute()
const router = useRouter()
const { showUnclaimedRaffleModal, unclaimedRaffle, hideWonRaffleModal, prizeTitle, prizeImage } = useUnclaimedRaffles()
const { isConnected } = useGetMe()
const { t } = useI18n()

const activeTab = ref<TabValue>('raffle')
const tabRefs = ref<HTMLElement[]>([])
const activeTabIndex = computed(() => tabs.value.findIndex(tab => tab.value === activeTab.value))

const indicatorStyle = computed(() => {
  if (tabRefs.value.length === 0 || activeTabIndex.value === -1) return {}

  const activeTabElement = tabRefs.value[activeTabIndex.value]
  if (!activeTabElement) return {}

  return {
    width: `${activeTabElement.offsetWidth}px`,
    transform: `translateX(${activeTabElement.offsetLeft}px)`,
  }
})

const updateActiveTab = (tab: TabValue) => {
  activeTab.value = tab
}

const handleTabChange = (value: string | number) => {
  const newValue = String(value)
  if (validTabs.includes(newValue as TabValue)) {
    activeTab.value = newValue as TabValue
  }
}

watch(activeTab, (newTab) => {
  mixpanel.track(`${rewardsEventsTabs[newTab]} Tab View`)
  nextTick(() => {
    const nextQuery: LocationQueryRaw = {
      ...route.query,
      tab: newTab,
    }

    if (newTab !== 'wheels') {
      delete nextQuery.wheel
    }

    router.replace({
      query: nextQuery,
    })
  })
})

onMounted(() => {
  const tabParam = route.query.tab as TabValue
  if (tabParam && validTabs.includes(tabParam as TabValue)) {
    activeTab.value = tabParam as TabValue
  } else {
    activeTab.value = 'raffle'
    router.replace({
      query: {
        ...route.query,
        tab: activeTab.value,
      },
    })
  }
})
</script>

<style scoped>
:deep(.tabs-trigger) {
  background-color: transparent;
  color: white;
  padding: 0.5rem 1rem;
  position: relative;
  z-index: 1;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  will-change: transform;
}

:deep(.tabs-trigger[data-state="active"]) {
  color: var(--color-lavender);
}

.tabs-indicator {
  position: absolute;
  bottom: -1px;
  left: 0;
  height: 2px;
  background-color: var(--color-lavender, #9D8DF1);
  transition: transform 0.3s ease, width 0.3s ease;
  z-index: 2;
  transform: translateZ(0);
  will-change: transform, width;
}

.tabs-content {
  transform: translateZ(0);
  will-change: transform;
  backface-visibility: hidden;
}
</style>
