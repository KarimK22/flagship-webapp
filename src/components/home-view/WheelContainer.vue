<template>
  <div
    id="wheel-container"
    class="container min-h-[480px] flex flex-col justify-center items-center gap-4"
  >
    <div
      class="min-h-32 z-10 flex flex-col justify-center items-center transition-[min-height] duration-300"
      :class="{ 'min-h-[216px]': isWheel && showTimer }"
    >
      <Transition
        name="bounce"
        mode="out-in"
      >
        <div
          v-if="showClaimed"
          class="max-w-[720px]! text-center whitespace-pre-line grid gap-4"
        >
          <h1
            class="text-[40px] md:text-[56px] leading-8 md:leading-10 tracking-[-2.24px] text-lavender"
          >
            {{ prize.claimedText }}
          </h1>
          <span class="text-[24px] md:text-[32px] leading-6 md:leading-8 tracking-[-1.28px] text-purple-gray">
            {{ t('components.wheelContainer.goodLuck') }}
          </span>
          <div
            v-if="showClaimed"
            class="flex flex-col justify-center items-center gap-2"
          >
            <GlowButton
              :color="EButtonColor.ORANGE"
              :loading="loadingClaim"
              :text="mainCTAText"
              class="w-[220px] z-10 backdrop-blur-sm"
              style="height: 40px"
              @click.prevent.stop="handleClickMainCTA"
            />
          </div>
        </div>
        <div
          v-else-if="showTimer || showPrize"
          class="max-w-[720px]! flex flex-col justify-center items-center text-center whitespace-pre-line gap-4"
        >
          <h1
            class="text-[40px] md:text-[56px] leading-8 md:leading-10 tracking-[-2.24px] text-lavender"
          >
            {{ prize.actionText }}
          </h1>
          <span
            class="text-[24px] md:text-[32px] pt-3 leading-6 md:leading-8 tracking-[-1.28px] text-purple-gray"
            :class="{ 'font-semibold pt-0!': isWheel }"
            v-html="prize.subText?.replace('_distribution_', distribution).replace('_claimed_', totalClaimed)"
          />
          <div class="flex flex-col justify-center items-center gap-2">
            <GlowButton
              :color="EButtonColor.ORANGE"
              :loading="loadingClaim"
              :text="mainCTAText"
              class="w-[220px] z-10 backdrop-blur-sm"
              style="height: 40px"
              @click.prevent.stop="handleClickMainCTA"
            />
            <span class="text-lavender font-semibold text-base leading-6 tracking-[-0.16px]">
              🔒 {{ t('home.dataDisclaimer') }}
            </span>
          </div>
        </div>
        <h1
          v-else-if="showPrize"
          class="text-[40px] md:text-[56px] max-w-[400px]! text-center leading-8 md:leading-10 tracking-[-2.24px] text-lavender whitespace-pre-line"
        >
          {{ t('components.wheelContainer.youWon') }} {{ prize.name }}!
        </h1>
        <div
          v-else
          class="max-w-[400px]! text-center whitespace-pre-line"
        >
          <h1
            class="text-[40px] md:text-[56px] leading-8 md:leading-10 tracking-[-2.24px] text-lavender"
          >
            {{ content?.title }}
          </h1>
          <span
            class="text-[24px] md:text-[32px] leading-6 md:leading-8 tracking-[-1.92px] text-purple-gray"
            v-html="t('components.wheelContainer.onlyOneSpin')"
          />
        </div>
      </Transition>
    </div>

    <div class="relative">
      <div class="mb-4 flex items-center justify-center z-10">
        <WheelGacha
          :target-section="staticPrize.wheelSection || 0"
          :prize-to-show="prize"
          :spinning="spinning"
          :show-prize="showPrize"
          :last-spin-date="lastSpinDate"
          :show-timer="showTimer"
          :show-claimed="showClaimed"
          @finished="onFinished"
          @reset="onReset"
          @click="handleClickMainCTA"
        />
      </div>
    </div>

    <Transition name="fade">
      <GlowButton
        v-if="isWheel"
        :color="EButtonColor.ORANGE"
        :loading="loadingClaim"
        :text="mainCTAText"
        class="w-[220px] z-10 -mt-7 md:-mt-10 backdrop-blur-sm"
        :class="{ 'hidden': showTimer || showPrize }"
        style="height: 40px"
        @click.prevent.stop="handleClickMainCTA"
      />
      <GlowButton
        v-else
        :color="EButtonColor.ORANGE"
        :loading="loadingClaim"
        :text="mainCTAText"
        class="w-[220px] z-10 -mt-7 md:-mt-10 backdrop-blur-sm"
        style="height: 40px"
        @click.prevent.stop="handleClickMainCTA"
      />
    </Transition>
    <AfterFreeSmashModal
      :model-value="showAfterFreeSmashModal"
      @update:model-value="showAfterFreeSmashModal = false"
      @on-click-stake="onStakeButtonClick"
    />
    <UpsellModal />
    <ErrorMessageModal
      :model-value="showErrorMessageModal"
      :error-message="errorMessage"
      @close="() => {
        showErrorMessageModal = false
        loadingClaim = false
      }"
      @retry="handleClaim"
    />
    <LiveActivityBubbles v-if="!spinning" />
    <LearnMoreWheel
      :model-value="showLearnMoreWheel"
      @update:model-value="showLearnMoreWheel = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useTranslation } from '@/composables/use-i18n'
import { computed, ref, watch } from 'vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import { useGetMe } from '@/composables/get-me'
import { useWalletConnect } from '@/composables/wallet/use-wallet-connect'
import { type StaticPrize, StaticPrizes, useDynamicHome } from '@/composables/dynamic-home'
import WheelGacha from './WheelGacha.vue'
import { DateTime } from 'luxon'
import UpsellModal from '@/components/upsell/UpsellModal.vue'
import AfterFreeSmashModal from '@/components/upsell/AfterFreeSmashModal.vue'
import { useRaffles } from '@/composables/raffles'
import api from '@/services/api'
import ErrorMessageModal from './ErrorMessageModal.vue'
import mixpanel from 'mixpanel-browser'
import { useLocalStorage } from '@vueuse/core'
import LiveActivityBubbles from '../LiveActivityBubbles.vue'
import LearnMoreWheel from '../upsell/LearnMoreWheel.vue'

const { t } = useTranslation()
const { connect } = useWalletConnect()
const { isConnected } = useGetMe()
const { content, staticPrize, pendingClaim, code, persistentPrizeData, staticPrizesMap, showLearnMoreWheel, isWheel } = useDynamicHome()
const { sortedActiveRaffles, refetchMyRafflesStatus } = useRaffles()
const spinning = ref(false)
const showTimer = ref(false)
const showClaimed = ref(false)
const showActivityBubbles = ref(true)
const showAfterFreeSmashModal = ref(false)
const errorMessage = ref('')
const showErrorMessageModal = ref(false)
const prize = computed(() => persistentPrizeData.value?.prize || {} as StaticPrize)
const showPrize = computed(() => prize.value?.code ? true : false)
const lastSpinDate = computed(() => persistentPrizeData.value?.timestamp ? DateTime.fromMillis(persistentPrizeData.value.timestamp) : undefined)
const loadingClaim = ref(false)
const rafflesToInclude = computed(() => {
  if (sortedActiveRaffles.value) {
    return sortedActiveRaffles.value.filter((r) => {
      const isFree = r.ticketPrice === 0
      const requireBadge = Boolean(r.metadata.requires?.badgeId)
      const requireUserData = Boolean(r.metadata.participationQuestions?.length)
      return !isFree && !requireBadge && !requireUserData
    })
  }
  return []
})
const distribution = useLocalStorage('distribution', '12')
const totalClaimed = useLocalStorage('totalClaimed', '13,243')

const nameMap: Record<string, string> = {
  '1': 'iphone',
  '2': 'rolex',
}
const rafflesMap = computed(() => {
  return Object.entries(nameMap).reduce((acc, [key, value]) => {
    const raffle = rafflesToInclude.value.find((r) => r.title.toLowerCase().includes(value))
    if (raffle) {
      acc[key] = raffle.id
    }
    return acc
  }, {} as Record<string, string>)
})

let timer: NodeJS.Timeout | null = null
watch(persistentPrizeData, (current) => {
  if (current?.prize.claimed) {
    showClaimed.value = true
    showTimer.value = false
    if (timer) {
      clearTimeout(timer)
    }
  } else if (current?.timestamp) {
    timer = setTimeout(() => {
      showTimer.value = true
      showActivityBubbles.value = true
    }, 2500)
    setTimeout(() => {
      distribution.value = '11'
      totalClaimed.value = '13,244'
    }, 5500)
  }
}, { immediate: true })

const mainCTAText = computed(() => {
  if (showClaimed.value) {
    return t('components.wheelContainer.whatsNext')
  }
  if (showPrize.value) {
    return isConnected.value ? t('components.wheelContainer.claim') : staticPrize.value.CTA
  }
  return content.value?.CTA
})

async function handleClickMainCTA() {
  if (loadingClaim.value) {
    return
  }
  if (showClaimed.value) {
    showAfterFreeSmashModal.value = true
    return
  }
  if (showPrize.value) {
    pendingClaim.value = true
    await awaitForLogin()
    mixpanel.track('Asteroid Smashed')
    handleClaim()
    return
  }
  onReset()
  showActivityBubbles.value = false
  spinning.value = true
  mixpanel.track('Free Asteroid Smash Started')
}

function onStakeButtonClick() {
  setTimeout(() => {
    onReset()
  }, 1000)
}

async function buyRaffleTicket(raffleId: string, retry = 0) {
  try {
    const result = await api.buyRaffleTickets({
      raffleId,
      count: 1,
      userData: {},
    })
    if (result.success) {
      await refetchMyRafflesStatus()
    } else {
      errorMessage.value = result.error
      showErrorMessageModal.value = true
      return false
    }
  } catch (_error) {
    if (retry < 3) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return buyRaffleTicket(raffleId, retry + 1)
    }
    errorMessage.value = 'discord'
    showErrorMessageModal.value = true
    return false
  }
  return true
}

async function handleClaim() {
  errorMessage.value = ''
  showErrorMessageModal.value = false
  loadingClaim.value = true

  let prizeData = {
    ...persistentPrizeData.value!.prize,
    claimed: true,
  }
  let raffleId = rafflesMap.value[prizeData.code]
  if (!persistentPrizeData.value?.prize.claimed && prizeData.code === '3') {
    // random key
    const randomKey = Object.keys(rafflesMap.value)[Math.floor(Math.random() * Object.keys(rafflesMap.value).length)]
    raffleId = rafflesMap.value[randomKey]
    prizeData = {
      ...staticPrizesMap[nameMap[randomKey] as StaticPrizes],
      claimed: true,
    }
  }
  const success = await buyRaffleTicket(raffleId!)
  if (!success) {
    return
  }
  if (timer) {
    clearTimeout(timer)
  }
  persistentPrizeData.value!.prize = prizeData
  showClaimed.value = true
  showTimer.value = false
  pendingClaim.value = false
  loadingClaim.value = false
}

function onFinished() {
  spinning.value = false
  persistentPrizeData.value = {
    prize: staticPrize.value,
    timestamp: DateTime.now().plus({ minutes: 5 }).toMillis(),
    code: code.value,
  }
}

function onReset() {
  spinning.value = false
  showTimer.value = false
  persistentPrizeData.value = null
}

const awaitForLogin = async () => {
  if (!isConnected.value) {
    timer = setTimeout(() => {
      showTimer.value = true
      showActivityBubbles.value = true
    }, 3000)
    await connect('EmailLogin')
  }
  while (!isConnected.value) {
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
}

</script>