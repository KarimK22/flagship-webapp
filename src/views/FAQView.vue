<template>
  <div class="lg:py-20 py-12">
    <InlineSvg
      v-if="fqaLeftCornerLights"
      :src="fqaLeftCornerLights"
      class="fixed z-0 -top-20 -left-20 w-screen h-screen pointer-events-none"
    />
    <InlineSvg
      v-if="fqaRightCornerLights"
      :src="fqaRightCornerLights"
      class="fixed z-0 -top-20 -right-20 w-screen h-screen pointer-events-none"
    />

    <div class="container">
      <h2 class="typography-h1 font-bold mb-12 text-light1">
        {{ t('faq.title') }}
      </h2>

      <AccordionRoot
        type="single"
        collapsible
        class="space-y-8"
      >
        <AccordionItem
          class="border-none"
          value="how-does-it-work"
        >
          <AccordionTrigger class="text-lavender text-3xl text-left leading-7 md:leading-1">
            {{ t('faq.howItWorks.title') }}
          </AccordionTrigger>

          <AccordionContent class="prose-light1">
            <p>{{ t('faq.howItWorks.description') }}</p>
            <p>{{ t('faq.howItWorks.eachSmashUnlocks') }}</p>
            <ul>
              <li>{{ t('faq.howItWorks.uniqueElements') }}</li>
              <li>{{ t('faq.howItWorks.collectAll5') }}</li>
              <li>{{ t('faq.howItWorks.everyElementGrants') }}</li>
            </ul>
            <p>{{ t('faq.howItWorks.noLossesJustRewards') }}</p>
            <p>{{ t('faq.howItWorks.buyRaffleTickets') }}</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          class="border-none"
          value="what-rewards-can-i-win"
        >
          <AccordionTrigger class="text-lavender text-3xl text-left leading-7 md:leading-1">
            {{ t('faq.whatRewards.title') }}
          </AccordionTrigger>

          <AccordionContent class="prose-light1">
            <p>{{ t('faq.whatRewards.unlockingElement6') }}</p>
            <ul>
              <li>{{ t('faq.whatRewards.superchargedStaking') }}</li>
              <li>{{ t('faq.whatRewards.airdropKingStatus') }}</li>
              <li>{{ t('faq.whatRewards.yearEndJackpot') }}</li>
            </ul>

            <p>{{ t('faq.whatRewards.additionalRewards') }}</p>
            <ul>
              <li>{{ t('faq.whatRewards.prizeRaffles') }}</li>
              <li>{{ t('faq.whatRewards.partnerAirdrops') }}</li>
              <li>{{ t('faq.whatRewards.nftBadges') }}</li>
              <li>{{ t('faq.whatRewards.exclusiveOffers') }}</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          class="border-none"
          value="how-does-staking-work"
        >
          <AccordionTrigger class="text-lavender text-3xl text-left leading-7 md:leading-1">
            {{ t('faq.staking.title') }}
          </AccordionTrigger>

          <AccordionContent class="prose-light1">
            <ul>
              <li>{{ t('faq.staking.savingsAccount') }}</li>
              <li>{{ t('faq.staking.stakeLingo') }}</li>
              <li>
                {{ t('faq.staking.chooseBetween') }}
                <ul>
                  <li>{{ t('faq.staking.flexibleStaking') }}</li>
                  <li>{{ t('faq.staking.fixedStaking') }}</li>
                </ul>
              </li>

              <li>
                {{ t('faq.staking.afterStakingPeriod') }}
                <ul>
                  <li>{{ t('faq.staking.extendStake') }}</li>
                  <li>{{ t('faq.staking.withdrawTokens') }}</li>
                </ul>
              </li>
              <li>{{ t('faq.staking.baseBlockchain') }}</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          class="border-none"
          value="how-are-power-miles-calculated"
        >
          <AccordionTrigger class="text-lavender text-3xl text-left leading-7 md:leading-1">
            {{ t('faq.powerMilesCalculation.title') }}
          </AccordionTrigger>

          <AccordionContent class="prose-light1">
            <p>{{ t('faq.powerMilesCalculation.moreLingoMoreMiles') }}</p>
            <p>{{ t('faq.powerMilesCalculation.accumulateHourly') }}</p>
            <p>{{ t('faq.powerMilesCalculation.balanceTiedToWallet') }}</p>
            <p>{{ t('faq.powerMilesCalculation.earningRates') }}</p>
            <ul>
              <li>{{ t('faq.powerMilesCalculation.flexibleStakingRate') }}</li>
              <li>{{ t('faq.powerMilesCalculation.fixedStakingRate') }}</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          class="border-none"
          value="how-does-supercharged-staking-work"
        >
          <AccordionTrigger class="text-lavender text-3xl text-left leading-7 md:leading-1">
            {{ t('faq.superchargedStaking.title') }}
          </AccordionTrigger>

          <AccordionContent class="prose-light1">
            <p v-html="t('faq.superchargedStaking.description')"></p>

            <p><strong>{{ t('faq.superchargedStaking.stakingOptions') }}</strong></p>
            <ul>
              <li><strong>{{ t('faq.superchargedStaking.flexibleStaking') }}</strong> → <strong>5% APY</strong></li>
              <li>
                <strong>{{ t('faq.superchargedStaking.lockedStaking') }}</strong>:
                <ul>
                  <li><strong>3 months</strong> → <strong>10% APY</strong></li>
                  <li><strong>6 months</strong> → <strong>20% APY</strong></li>
                  <li><strong>12 months</strong> → <strong>30% APY</strong></li>
                </ul>
              </li>
            </ul>

            <p><strong>{{ t('faq.superchargedStaking.claimingRewards') }}</strong></p>
            <ul>
              <li v-html="t('faq.superchargedStaking.claimEvery3Months')"></li>
              <li v-html="t('faq.superchargedStaking.claimAndStake')"></li>
              <li v-html="t('faq.superchargedStaking.earningsAccrueDaily')"></li>
            </ul>

            <p><strong>{{ t('faq.superchargedStaking.boostingEarnings') }}</strong></p>
            <p v-html="t('faq.superchargedStaking.multipleElement6')"></p>
            <ul>
              <li><strong>5</strong> → <strong>+5% boost</strong></li>
              <li><strong>10</strong> → <strong>+10% boost</strong></li>
              <li><strong>15</strong> → <strong>+15% boost</strong></li>
            </ul>

            <p><strong>{{ t('faq.superchargedStaking.unstakingRules') }}</strong></p>
            <ul>
              <li v-html="t('faq.superchargedStaking.unstakeLoseBooster')"></li>
              <li v-html="t('faq.superchargedStaking.element6Expires')"></li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          class="border-none"
          value="how-does-airdrop-king-status-work"
        >
          <AccordionTrigger class="text-lavender text-3xl text-left leading-7 md:leading-1">
            {{ t('faq.airdropKingStatus.title') }}
          </AccordionTrigger>

          <AccordionContent class="prose-light1">
            <p v-html="t('faq.airdropKingStatus.description')"></p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          class="border-none"
          value="how-are-raffle-winners-selected"
        >
          <AccordionTrigger class="text-lavender text-3xl text-left leading-7 md:leading-1">
            {{ t('faq.raffleWinners.title') }}
          </AccordionTrigger>

          <AccordionContent class="prose-light1">
            <p v-html="t('faq.raffleWinners.description')"></p>

            <p><strong>{{ t('faq.raffleWinners.howItWorks') }}</strong></p>

            <p><strong>1. {{ t('faq.raffleWinners.fileHashing') }}</strong></p>
            <p>{{ t('faq.raffleWinners.fileHashingDesc') }}</p>

            <p><strong>2. {{ t('faq.raffleWinners.seedGeneration') }}</strong></p>
            <p v-html="t('faq.raffleWinners.seedGenerationDesc')"></p>

            <p><strong>3. {{ t('faq.raffleWinners.onChainRecording') }}</strong></p>
            <p v-html="t('faq.raffleWinners.onChainRecordingDesc')"></p>

            <p><strong>4. {{ t('faq.raffleWinners.winnerSelection') }}</strong></p>
            <ul>
              <li v-html="t('faq.raffleWinners.verifiedSeed')"></li>
              <li v-html="t('faq.raffleWinners.pseudoRandomNumbers')"></li>
              <li v-html="t('faq.raffleWinners.verifiableReproducible')"></li>
            </ul>

            <p><strong>5. {{ t('faq.raffleWinners.finishedRaffleDetails') }}</strong></p>
            <ul>
              <li v-html="t('faq.raffleWinners.blockchainTransaction')"></li>
              <li v-html="t('faq.raffleWinners.fullTransparency')"></li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </AccordionRoot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AccordionContent, AccordionItem, AccordionRoot, AccordionTrigger } from '@/components/ui/accordion'
import fqaLeftCornerLights from '@/assets/images/faq/page-left-corner-lights.svg'
import fqaRightCornerLights from '@/assets/images/faq/page-right-corner-lights.svg'
import InlineSvg from 'vue-inline-svg'
import { onMounted } from 'vue'
import mixpanel from 'mixpanel-browser'
import { useTranslation } from '@/composables/use-i18n'

const { t } = useTranslation()

onMounted(() => {
  mixpanel.track('FAQ Page View')
})
</script>
