<template>
  <div>
    <RewardsCarousel
      class="mb-12"
      type="airdrops"
    />
    <RewardsHistoryList
      :items="airdropAllocations"
      :is-loading="false"
      :is-loading-more="false"
      :all-shown="elegibleAirdrops.length === airdropAllocations.length"
      :items-clickable="true"
      :empty-text="t('components.airdropsWrapper.allocationsEmpty')"
      :title="t('components.airdropsWrapper.yourAirdropsAllocations')"
      class="container mt-[98px] [&_.ref-image]:bg-top!"
      @show-more="handleShowMore"
      @activity-click="handleClickMyAirdrops"
      @action-button-click="handleClickMyAirdrops"
    />
    <RewardsHistoryList
      :items="items"
      :is-loading="false"
      :is-loading-more="false"
      :all-shown="finishedAirdrops.length === items.length"
      :items-clickable="true"
      :empty-text="t('components.airdropsWrapper.finishedAirdropsEmpty')"
      :title="t('components.airdropsWrapper.airdropHistory')"
      class="container mt-[98px] [&_.ref-image]:bg-top!"
      @show-more="handleShowMore"
      @activity-click="handleAirdropClick"
    />
  </div>
</template>
<script setup lang="ts">
import { useTranslation } from '@/composables/use-i18n'
import RewardsCarousel from '@/components/RewardsCarousel.vue'
import RewardsHistoryList from '@/components/rewards/RewardsHistoryList.vue'
import { computed, ref } from 'vue'
import { type Airdrop } from '@/const/airdrops.ts'
import { DateTime } from 'luxon'
import { useAirdrops } from '@/composables/airdrops.ts'

const { t } = useTranslation()

const displayLimit = ref(3)
const { finishedAirdrops, handleAirdropClick, handleClickMyAirdrops, elegibleAirdrops } = useAirdrops()

const airdropDescription = (airdrop: Airdrop ) => {
  return `${airdrop.wallets.length} ${airdrop.wallets.length === 1 ? t('components.airdropsWrapper.userEligible') : t('components.airdropsWrapper.usersEligible')} ${t('components.airdropsWrapper.toReceive')} ${airdrop.prizeAmount} ${airdrop.name}.`
}

const items = computed(() => {
  return finishedAirdrops.value.slice(0, displayLimit.value)
    .map((airdrop) => ({
      //X users have received a total of 2,000,000 Redacted Coin tokens
      title: airdrop.endDate ? DateTime.fromISO(airdrop.endDate)
        .toFormat('d LLL yyyy · h:mma')
        .toLowerCase(): t('components.airdropsWrapper.comingSoon'),
      description: airdropDescription(airdrop),
      referenceImageSrc: airdrop.imageUrl,
    }))
})

const getSecondaryDescription = (airdrop: Airdrop) => {
  const now = DateTime.now()
  const endDate = DateTime.fromISO(airdrop.endDate!)
  switch (true) {
  case !airdrop.endDate:
    return ''
  case airdrop.endDate && now > endDate && airdrop.readyToClaim:
    return t('components.airdropsWrapper.readyToClaim')
  case airdrop.endDate && now < endDate:
    return t('components.airdropsWrapper.registrationOpen')
  default:
    return t('components.airdropsWrapper.pendingAllocation')
  }
}

const getButtonProps = (airdrop: Airdrop) => {
  const canClaim = airdrop.readyToClaim
  if (!airdrop.endDate) {
    return {}
  }
  if (airdrop.claimed) {
    return {
      buttonLabel: t('components.airdropsWrapper.details'),
    }
  }
  return {
    buttonLabel: canClaim ? t('components.airdropsWrapper.claim') : undefined,
    buttonAnimated: canClaim,
  }
}

const airdropAllocations = computed(() => {
  return elegibleAirdrops.value.slice(0, displayLimit.value)
    .map((airdrop) => ({
      title: airdrop.endDate ? DateTime.fromISO(airdrop.endDate)
        .toFormat('d LLL yyyy · h:mma')
        .toLowerCase() : t('components.airdropsWrapper.registrationOpen'),
      description: airdrop.name,
      referenceImageSrc: airdrop.imageUrl,
      secondaryDescription: getSecondaryDescription(airdrop),
      ...getButtonProps(airdrop),
    }))
})

const handleShowMore = () => {
  displayLimit.value += 3
}
</script>