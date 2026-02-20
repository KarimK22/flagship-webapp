<script setup lang="ts">
import HeroBackground from '@/components/textures/HeroBackground.vue'
import StakingLevel from '@/components/staking-view/StakingLevel.vue'
import HoldingCards from '@/components/staking-view/HoldingCards.vue'
import HoldingActivities from '@/components/staking-view/HoldingActivities.vue'
import PowerActivities from '@/components/staking-view/PowerActivities.vue'
import StakingTokens from '@/components/staking-view/StakingTokens.vue'
import HoldingsTable from '@/components/staking-view/HoldingsTable.vue'
import APYDetails from '@/components/staking-view/APYDetails.vue'
import BuyLingoBanner from '@/components/staking-view/BuyLingoBanner.vue'
import StakingCalculator from '@/components/staking-view/StakingCalculator.vue'
import mixpanel from 'mixpanel-browser'
import { computed, onMounted } from 'vue'
import { useGetMe } from '@/composables/get-me'
import { useBalance } from '@/composables/contracts/balance'
import BaseBanner from '@/components/rewards/BaseBanner.vue'
import { useApy } from '@/composables/use-apy'
import { EButtonColor } from '@/types/shared/button'
import router from '@/router'
import { LingoRouteName } from '@/router/routes'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { failedClaims } = useApy()
const { isConnected } = useGetMe()
const { tokenBalance } = useBalance()

const showBuyBanner = computed(() => isConnected.value && tokenBalance.value === 0)

const goToClaimWizard = () => {
  const claimId = failedClaims.value[0].id
  router.push({
    name: LingoRouteName.CLAIM_WIZARD,
    query: {
      apy: 'true',
      claimId,
    },
  })
}

onMounted(() => {
  mixpanel.track('Staking Page View')
})
</script>

<template>
  <div class="py-10 px-4 md:px-6 flex flex-col relative overflow-hidden md:overflow-visible">
    <div
      class="container overflow-hidden mb-0 opacity-0 h-0 transition-all duration-300 ease-in-out w-full"
      :class="{ 'mb-2 sm:mb-6 opacity-100 sm:h-[72px] h-auto': isConnected && failedClaims.length > 0 }"
    >
      <BaseBanner
        :title="t('views.stakingView.warningTitle')"
        title-class="text-lg! md:text-xl! tracking-[-0.6px]! leading-tight"
        :cta-button="t('views.stakingView.retry')"
        :show-close-button="false"
        :colors="['#FF7847', '#C95CFF', '#C95CFF', '#FF7847', '#FF7847', '#FF7847', '#FF7847']"
        :button-color="EButtonColor.ORANGE"
        @cta-button-click="goToClaimWizard"
      />
    </div>
    <!-- !top-[calc(40% - 5px)] = !top-[218.672px] -->
    <HeroBackground class="!w-screen !top-[218.672px]" />
    <!-- Orbs -->
    <StakingTokens />
    <!-- Hero levels -->
    <StakingLevel />
  </div>
  <div class="flex flex-col px-6 pb-12">
    <!-- Buy LINGO banner for users with zero balance -->
    <Transition
      enter-active-class="transition-all duration-500 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <BuyLingoBanner
        v-if="showBuyBanner"
        class="mb-6"
      />
    </Transition>

    <APYDetails />

    <!-- Staking wheel spin calculator -->
    <div class="py-8">
      <StakingCalculator />
    </div>

    <HoldingCards />

    <!-- active holdings -->
    <HoldingsTable />

    <!-- power miles usage history -->
    <PowerActivities />

    <!-- holding history -->
    <HoldingActivities />
  </div>
</template>
