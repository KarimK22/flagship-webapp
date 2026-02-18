<script setup lang="ts">
import bg from '@/assets/images/staking/apy-cards-bg.png'
import emptyBg from '@/assets/images/staking/apy-cards-empty-bg.png'
import HelpButton from '@/components/help-modal/HelpButton.vue'
import { EHelpType } from '@/types/staking'
import helpIcon from '@/assets/images/medals/info-icon-transparent.svg'
import helpIconSolid from '@/assets/images/medals/details-icon.svg'
import lingoIcon from '@/assets/images/staking/lingo-icon-light.svg'
import InlineSvg from 'vue-inline-svg'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import { useApy } from '@/composables/use-apy'
import { formatNumberToUS } from '@/composables/helpers'
import { LingoRouteName } from '@/router/routes'
import { useRouter } from 'vue-router'
import { useGetMe } from '@/composables/get-me'
import { useTranslation } from '@/composables/use-i18n'

const router = useRouter()
const { t } = useTranslation()

const {
  data,
  hasElementSix,
  averageApy,
  canClaim,
  remainingDaysToClaim,
} = useApy()

const { isConnected } = useGetMe()

const handleClaim = () => {
  // go to claim wizard
  router.push({
    name: LingoRouteName.CLAIM_WIZARD,
    query: {
      apy: 'true',
    },
  })
}
</script>

<template>
  <div
    class="pb-6"
    :class="{ 'pt-10': !isConnected }"
  >
    <div class="py-10 flex items-end gap-2">
      <h1
        class="whitespace-pre-line text-lavender text-4xl md:text-5.5xl leading-tightest tracking-tighter pr-10 sm:pr-0"
      >
        {{ t('staking.apyDetails.earningsDetails') }}
      </h1>
      <HelpButton
        context=""
        class="cursor-pointer inline-block !size-8 bg-transparent"
        :help-type="EHelpType.APY_PLAN_AND_EARN_NONSTOP"
      >
        <InlineSvg
          :src="helpIconSolid"
          class="size-8"
          unique-ids
        />
      </HelpButton>
    </div>
    <div
      v-if="hasElementSix"
      class="flex gap-[5px] w-full flex-wrap justify-center md:justify-start md:flex-nowrap"
    >
      <div
        :style="{ backgroundImage: `url(${bg})` }"
        class="flex flex-col gap-2 overflow-hidden rounded-2xl p-4 h-36 relative justify-between w-[237px] min-w-[237px] bg-cover bg-left"
      >
        <InlineSvg
          :src="lingoIcon"
          class="absolute top-0 left-0 !z-1"
          unique-ids
        />

        <h2 class="whitespace-pre-line font-semibold text-lavender leading-4 tracking-wide pl-13">
          {{ t('staking.apyDetails.totalLingoEarned') }}
        </h2>
        <h1 class="text-lavender text-5xl tracking-[-2.4px] leading-14">
          {{ formatNumberToUS(data.totalEarnings) }}
        </h1>
      </div>
      <div
        :style="{ backgroundImage: `url(${bg})` }"
        class="flex flex-col gap-2 overflow-hidden rounded-2xl p-4 h-36 relative justify-between w-[237px] min-w-[237px] bg-cover bg-center"
      >
        <div class="absolute top-2 right-2 h-[40px]">
          <GlowButton
            v-if="canClaim"
            class="text-lavender"
            :color="EButtonColor.BLUE"
            @click="handleClaim"
          >
            <span class="text-sm tracking-[0.42px] whitespace-pre-line">{{ t('staking.apyDetails.claim') }}</span>
          </GlowButton>
          <span
            v-else-if="remainingDaysToClaim >= 0"
            class="text-sm max-w-[110px] text-purple-gray leading-3 text-center font-semibold h-10 flex items-center justify-center bg-[#262638] rounded-full px-4"
          >
            {{ t('staking.apyDetails.claimInDays', { days: remainingDaysToClaim }) }}
          </span>
        </div>
        <h2 class="whitespace-pre-line w-[110px] font-semibold text-lavender leading-4 tracking-wide">
          {{ t('staking.apyDetails.sinceLastClaim') }}
        </h2>
        <h1 class="text-lavender text-5xl tracking-[-2.4px] leading-14">
          {{ formatNumberToUS(data.amountEarnedSinceLastClaim) }}
        </h1>
      </div>
      <div
        :style="{ backgroundImage: `url(${bg})` }"
        class="flex flex-col gap-2 overflow-hidden rounded-2xl p-4 h-36 relative justify-between w-[237px] min-w-[237px] bg-cover bg-right"
      >
        <HelpButton
          context=""
          class="bg-transparent w-auto absolute top-2 right-2 h-[40px]"
          :help-type="EHelpType.APY_BOOST_YOUR_APY"
          is-button
        >
          <span class="text-sm tracking-[0.42px]">{{ t('staking.apyDetails.getMore') }}</span>
        </HelpButton>
        <h2
          class="whitespace-pre-line font-semibold text-lavender leading-4 tracking-wide relative"
        >
          {{ t('staking.apyDetails.currentAverageAPY') }}
          <HelpButton
            context=""
            class="cursor-pointer inline-block! bg-transparent h-6"
            :help-type="EHelpType.APY_WHAT_IS_APY"
          >
            <InlineSvg
              :src="helpIcon"
              class="size-6"
              unique-ids
            />
          </HelpButton>
        </h2>
        <h1 class="text-lavender text-5xl tracking-[-2.4px] leading-14">
          {{ averageApy }}%
        </h1>
      </div>
    </div>
    <div
      v-else
      class="flex gap-2 w-full justify-center items-center"
    >
      <div
        :style="{ backgroundImage: `url(${emptyBg})` }"
        class="flex gap-4 sm:gap-8 overflow-hidden rounded-2xl p-4 relative justify-center w-full min-w-[237px] h-36 bg-cover bg-center"
      >
        <img
          src="@/assets/images/game/elements/element_6.png"
          class="w-25 h-30"
        >

        <div class="flex flex-col gap-2 justify-center">
          <h1
            class="text-lavender text-2xl sm:text-[32px] tracking-[-1.28px] leading-6 sm:leading-[32px]"
          >
            {{ t('staking.apyDetails.unlockElement6') }}
          </h1>
          <h2 class="text-purple text-xl leading-5 -tracking-[0.6px]">
            {{ t('staking.apyDetails.earnUpToAPY') }}
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>
