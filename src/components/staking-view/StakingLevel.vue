<script setup lang="ts">
import LevelMedal from '@/components/staking-view/LevelMedal.vue'
import { useStakes } from '@/composables/contracts/stakes'
import { computed } from 'vue'
import GlowText from '../glow-text/GlowText.vue'
import { lingoRoutePath } from '@/router/routes'
import { useRouter } from 'vue-router'
import GlowButton from '../ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import HelpButton from '../help-modal/HelpButton.vue'
import { EHelpType } from '@/types/staking'
import helpIcon from '@/assets/images/medals/details-icon.svg'
import InlineSvg from 'vue-inline-svg'
import mixpanel from 'mixpanel-browser'
import { useGetMe } from '@/composables/get-me'
import { useWalletConnect } from '@/composables/wallet/use-wallet-connect'
import { useUserLevel } from '@/composables/user-level'
import { useTranslation } from '@/composables/use-i18n'

const { hasStakes, loadingMyStakes } = useStakes()
const { connect } = useWalletConnect()
const { currentLevel, isLoading: isLoadingUserLevel } = useUserLevel()
const router = useRouter()
const { t } = useTranslation()

const isLoading = computed(() => loadingMyStakes.value || isLoadingUserLevel.value)

const { accountAddress } = useGetMe()

const messageToShow = computed(() => {
  if (!accountAddress.value) return t('staking.level.loginToSee')
  if (!hasStakes.value && currentLevel.value && currentLevel.value.value <= 0) return t('staking.level.stakeToEarn')
  if (currentLevel.value && currentLevel.value.value < 1) return t('staking.level.earnPowerMiles')
  return ''
})

const showStakeButton = computed(() => {
  return !hasStakes.value
})

const showGetMorePowerButton = computed(() => {
  return hasStakes.value
})

const stakeNow = () => {
  mixpanel.track('Staking Started', {
    entryPoint: 'stakingPage',
  })
  router.push(lingoRoutePath.StakingNew)
}
</script>

<template>
  <div class="flex flex-col gap-2 justify-center items-center min-h-[400px]">
    <div
      v-if="messageToShow"
      class="flex flex-col h-52"
    >
      <GlowText
        class="text-[40px] leading-8 tracking-[-2px] max-w-[400px] !font-normal"
        :text="messageToShow"
        variant="mixed"
      />
    </div>

    <div
      v-if="!isLoading && currentLevel.value > 0"
      class="flex flex-col gap-2 items-center min-h-[352px]"
    >
      <LevelMedal :level="currentLevel" />

      <h1 class="text-lavender text-5.5xl leading-tightest tracking-tighter mt-4 relative">
        {{ currentLevel.name }}
        <HelpButton
          context=""
          class="absolute top-0 -right-7 cursor-pointer"
          :help-type="EHelpType.MY_LEVEL_INFO"
          :current-level="currentLevel.value"
        >
          <InlineSvg
            :src="helpIcon"
            class="size-6"
          />
        </HelpButton>
      </h1>

      <span class="text-[var(--color-blue-gray)] text-sm leading-6 tracking-tighter-x0 font-semibold">
        {{ t('staking.level.betterThan') }}
        <span class="text-lavender bg-sosiska p-0.5 rounded-[5rem] px-1 text-sm inline-block"> {{ currentLevel.top }} </span>
        {{ t('staking.level.ofAllUsers') }}
      </span>
    </div>

    <!-- stake button -->
    <div class="flex justify-center items-center gap-2 min-w-[280px]">
      <GlowButton
        v-if="!accountAddress"
        :color="EButtonColor.BLUE"
        class="flex items-center w-full gap-2"
        @click.stop.prevent="connect"
      >
        <span class="tracking-[-0.42px]">{{ t('staking.level.logIn') }}</span>
      </GlowButton>
      <GlowButton
        v-else-if="showGetMorePowerButton"
        :color="EButtonColor.BLUE"
        class="flex items-center w-[158px] gap-2"
        @click="stakeNow"
      >
        <span class="tracking-[-0.42px]">{{ t('staking.level.getMorePower') }}</span>
      </GlowButton>
      <GlowButton
        v-else-if="showStakeButton"
        :color="EButtonColor.BLUE"
        class="flex items-center w-full gap-2"
        @click="stakeNow"
      >
        <span class="tracking-[-0.42px]">{{ t('staking.level.stakeNow') }}</span>
      </GlowButton>
    </div>
  </div>
</template>
