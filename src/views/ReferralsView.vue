<script setup lang="ts">
import HeaderContentLayout from '@/components/referral-view/HeaderContentLayout.vue'
import ReferralStats from '@/components/referral-view/ReferralStats.vue'
import CardLayoutBackground from '@/components/textures/CardLayoutBackground.vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'

import linkGradientIcon from '@/assets/icons/gradient-link.svg'
import xGradientIcon from '@/assets/icons/gradient-x.svg'
import telegramGradientIcon from '@/assets/icons/gradient-telegram.svg'

import { useGetMyReferrals } from '@/composables/get-my-referrals'
import { EButtonColor } from '@/types/shared/button'
import { computed, onMounted, ref } from 'vue'
import IconButtonWrapper from '@/components/IconButtonWrapper.vue'
import mixpanel from 'mixpanel-browser'
import { useGetMe } from '@/composables/get-me'
import { useWalletConnect } from '@/composables/wallet/use-wallet-connect'
import { useTranslation } from '@/composables/use-i18n'
import RaffleReferralProgress from '@/components/referral-view/RaffleReferralProgress.vue'
import { useRaffleReferralProgress } from '@/composables/raffle-referral-progress'

const { isConnected } = useGetMe()
const { connect } = useWalletConnect()
const { data } = useGetMyReferrals()
const { t } = useTranslation()
const { referralProgress: _referralProgress } = useRaffleReferralProgress()

// TODO: Remove mock data — temporary preview for development
const referralProgress = ref({
  referredCount: 3,
  milestones: [
    { count: 1, tickets: 5, achieved: true },
    { count: 5, tickets: 30, achieved: false },
    { count: 10, tickets: 100, achieved: false },
  ],
  nextMilestone: { count: 5, tickets: 30, achieved: false },
})

const referralLink = computed(() => {
  const origin = window.location.origin
  return `${origin}/?ref=${data.value.referralCode}`
})

const getText = () => {
  const texts = t('referrals.shareTexts')
  return texts[Math.floor(Math.random() * texts.length)]
}

const copyReferralLink = () => {
  mixpanel.track('Referral Link Copied')
  navigator.clipboard.writeText(referralLink.value)
}

const shareOnX = () => {
  mixpanel.track('Referral Link Share on X Started')
  window.open(`https://x.com/intent/post?text=${getText()}&url=${referralLink.value}`, '_blank')
}

const shareOnTelegram = () => {
  mixpanel.track('Referral Link Share on Telegram Started')
  window.open(`https://t.me/share/url?url=${referralLink.value}&text=${getText()}`, '_blank')
}

onMounted(() => {
  mixpanel.track('Referrals Page View')
})

</script>

<template>
  <div class="px-6 pt-8 mb-6 md:mb-28 md:pt-22 container">
    <div class="flex flex-col">
      <h1 class="text-4xl sm:text-5.5xl tracking-[-2.24px] leading-10 sm:leading-[unset] mb-2 sm:mb-0 text-lavender">
        {{ t('referrals.title') }}
      </h1>
      <CardLayoutBackground class="mt-8 md:min-h-80">
        <HeaderContentLayout>
          <div
            v-if="!isConnected"
            class="flex flex-col gap-2 items-center justify-center h-full z-10"
          >
            <span class="text-xl text-lavender tracking-tighter-x1">{{ t('referrals.loginToStart') }}</span>
            <GlowButton
              :color="EButtonColor.BLUE"
              class="w-[228px]"
              @click.stop.prevent="connect"
            >
              <span>{{ t('referrals.logIn') }}</span>
            </GlowButton>
          </div>
          <div
            v-else
            class="flex flex-col justify-between h-full pt-4 z-10"
          >
            <span class="text-xl text-lavender tracking-tighter-x1">
              {{ t('referrals.referFriends', { percentage: 5 }) }}
            </span>
            <div class="flex flex-col">
              <div class="flex flex-col md:flex-row gap-8">
                <div class="flex flex-col gap-2">
                  <span class="text-sm text-purple-gray font-semibold tracking-[0.42px] leading-6">{{ t('referrals.yourReferralLink') }}</span>
                  <span class="text-xl text-lavender tracking-tighter-x1 font-semibold italic leading-6 h-6 text-ellipsis overflow-hidden w-full">
                    {{ referralLink }}
                  </span>
                </div>
                <div class="flex gap-2 h-full items-center">
                  <IconButtonWrapper
                    :src="linkGradientIcon"
                    :text-on-hover="t('referrals.copyLink')"
                    :text-on-click="t('referrals.copied')"
                    @click="copyReferralLink"
                  />
                  <IconButtonWrapper
                    :src="xGradientIcon"
                    :text-on-hover="t('referrals.shareOnX')"
                    :text-on-click="t('referrals.sharedOnX')"
                    @click="shareOnX"
                  />
                  <IconButtonWrapper
                    :src="telegramGradientIcon"
                    :text-on-hover="t('referrals.shareOnTelegram')"
                    :text-on-click="t('referrals.sharedOnTelegram')"
                    @click="shareOnTelegram"
                  />
                </div>
              </div>
              <span class="text-sm text-purple-gray font-semibold tracking-[0.42px] leading-6">
                {{ t('referrals.stakeToEarn') }}
              </span>
            </div>
          </div>
        </HeaderContentLayout>
        <div class="flex flex-col gap-4 w-full p-4 z-1">
          <div class="text-sm text-purple-gray font-semibold">
            {{ t('referrals.yourReferral') }}
          </div>
          <ReferralStats :data="data.referral" />
        </div>
        <div
          v-if="referralProgress"
          class="w-full p-4 z-1"
        >
          <RaffleReferralProgress :progress="referralProgress" />
        </div>
      </CardLayoutBackground>
    </div>
  </div>
</template>
