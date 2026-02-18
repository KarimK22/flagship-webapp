<template>
  <div
    id="asteroid-container"
    class="w-full relative container"
    :class="{ 'text-center': !!prize }"
  >
    <div v-if="pendingActivity && content.image">
      <Transition
        name="bounce"
        mode="out-in"
      >
        <h1
          v-if="prize"
          class="typography-h1 whitespace-pre-line"
        >
          {{ title }}
        </h1>
        <h1
          v-else
          class="typography-h1 whitespace-pre-line text-center max-w-[404px]!"
        >
          {{ content.title }}
        </h1>
      </Transition>
    </div>
    <div v-else>
      <Transition
        name="bounce"
        mode="out-in"
      >
        <div v-if="title">
          <h1
            class="typography-h1 whitespace-pre-line"
            :class="{ 'text-center': !isConnected }"
          >
            {{ title }}
          </h1>
          <p
            v-if="!isConnected"
            class="text-center text-base font-bold leading-6 tracking-[-0.16px] text-purple-gray"
          >
            {{ t('home.asteroid.joinLingo') }} <i>{{ t('home.asteroid.automatically') }}</i>. {{ t('home.asteroid.swapPoints') }}
          </p>
        </div>
      </Transition>

      <div
        class="
          flex flex-col gap-6 text-purple-gray
          sm:items-start
          md:flex-row md:items-start md:justify-between md:gap-x-8
        "
      >
        <div
          class="
            flex flex-col gap-3
            items-start
            max-w-full
            md:max-w-[520px]
          "
        >
          <Transition mode="out-in">
            <p
              :key="subtitle"
            >
              {{ subtitle }}
            </p>
          </Transition>
          <button
            v-if="!prize && isConnected"
            class="h-10 px-6 cursor-pointer text-sm tracking-[0.42px] text-white rounded-full bg-[rgba(38,38,56,0.56)] shadow-[0px_-4px_16px_-2px_rgba(222,206,235,0.24)_inset] hover:bg-[rgba(38,38,56,0.72)]"
            @click="handleOpenHowItWorksModal"
          >
            {{ t('home.asteroid.howItWorks') }}
          </button>
        </div>

        <div
          v-if="isConnected && !prize"
          class="
            flex flex-col gap-3
            items-start
            sm:items-start
            md:items-end
            w-full
            md:w-auto
          "
        >
          <div
            class="
              flex flex-wrap items-center gap-2
              text-sm sm:text-base font-semibold text-purple-gray
            "
          >
            <span class="uppercase tracking-[.25rem]">{{ t('home.asteroid.cost') }}</span>

            <div class="shrink-0 text-[16px]">
              <!-- <InlineSvg :src="powerIcon" width="24" height="24" /> -->
              <img
                v-if="powerIcon"
                :src="powerIcon"
                class="size-6"
              >
            </div>

            <span>
              <span class="text-lavender">100</span>
              {{ t('home.asteroid.powerMiles') }}
            </span>
          </div>

          <button
            type="button"
            class="autosmash-pill w-full sm:w-[190px]"
            :class="autoSmashState.toLowerCase()"
            @click="onClickAutoSmash"
          >
            <img
              v-if="autoSmashState === 'UNLOCKED_ON'"
              :src="onBgShadow"
              class="autosmash-glow-shadow"
              aria-hidden
            >

            <div class="autosmash-inner">
              <img
                v-if="autoSmashState === 'UNLOCKED_ON'"
                :src="onBg"
                class="autosmash-bg"
                aria-hidden
              >
              <img
                v-else-if="autoSmashState === 'UNLOCKED_OFF'"
                :src="offBg"
                class="autosmash-bg"
                aria-hidden
              >

              <span class="autosmash-label">
                <template v-if="autoSmashState === 'LOCKED'">{{ t('home.asteroid.autoSmash.locked') }}</template>
                <template v-else-if="autoSmashState === 'UNLOCKED_ON'"> {{ t('home.asteroid.autoSmash.on') }}</template>
                <template v-else>{{ t('home.asteroid.autoSmash.off') }}</template>
              </span>

              <span class="autosmash-toggle">
                <span class="autosmash-knob">
                  <img
                    v-if="autoSmashState === 'LOCKED'"
                    :src="lockIcon"
                    class="autosmash-lock"
                  >
                </span>
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <div class="mb-4 flex items-center justify-center z-10">
      <StaticGacha
        v-if="pendingActivity && content.image"
        :prize="prize"
        :raffle="raffle"
        @finished="onReset"
      />
      <InteractiveAsteroid
        v-else
        :show-timer="showTimer"
        :disabled="asteroidDisabled"
        :smashed-amount="smashedAmount"
        :total-power-miles="totalPowerMiles"
        :end-date-timestamp="timestampToReach100PM"
        :progress="progressTo100PM"
        :prize="prize"
        :raffle="raffle"
        :show-text="!showMainCTA && isComponentMounted"
        :is-free-asteroid="isFreeAsteroid"
        :has-stakes="hasStakes"
        @smash="onSmash"
        @speed-up="onSpeedUp"
        @reset="onReset"
      />
    </div>

    <div class="relative z-10">
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-4">
        <GlowButton
          v-if="showMainCTA || pendingActivity && !prize"
          :color="EButtonColor.ORANGE"
          :text="content.CTA || buttonText"
          class="w-[220px]"
          style="height: 40px"
          @click="handleClickMainCTA"
        />
      </div>
    </div>
    <AfterFreeSmashModal
      :model-value="showAfterFreeSmashModal"
      @update:model-value="showAfterFreeSmashModal = false"
    />
    <UpsellModal />
    <BuyOrStakeLingo
      :model-value="showBuyLingoModal"
      @update:model-value="showBuyLingoModal = false"
    />
  </div>

  <AutoSmashPurchaseModal
    v-model="showAutoSmashPurchaseModal"
    :eligibility="autoSmash.eligibility.value"
    :loading="autoSmash.loading.value"
    :error="autoSmash.error.value"
    @confirm="confirmAutoSmash"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import powerIcon from '@/assets/images/game/power.png'
import InteractiveAsteroid from '@/components/home-view/InteractiveAsteroid.vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import { utmCampaign } from '@/composables/auth'
import { useStakes } from '@/composables/contracts/stakes'
import { LingoRouteName } from '@/router/routes.ts'
import { GACHA_ASTEROID_PRIZE_TYPE, type GachaAsteroidPrize } from '@/types/shared/gacha-game'
import { useRaffles } from '@/composables/raffles'
import type { Raffle } from '@/services/api'
import api from '@/services/api'
import mixpanel from 'mixpanel-browser'
import { CampaignParamValue } from '@/lib/campaign-param-handler'
import { useEmailModal } from '@/composables/use-email-modal'
import AfterFreeSmashModal from '@/components/upsell/AfterFreeSmashModal.vue'
import { useElements } from '@/composables/elements.ts'
import { useActivitiesHistory } from '@/composables/contracts/activities-history.ts'
import { ACTIVITY_TYPE } from '@/types/shared/activity.ts'
import { showInfoModal } from '@/composables/ls-modals'
import { useGetMe } from '@/composables/get-me'
import { useWalletConnect } from '@/composables/wallet/use-wallet-connect'
import UpsellModal from '@/components/upsell/UpsellModal.vue'
import { useDynamicHome } from '@/composables/dynamic-home'
import StaticGacha from '@/components/home-view/StaticGacha.vue'
import { useUpsellModals } from '@/composables/upsell-modals'
import { DateTime } from 'luxon'
import { useI18n } from 'vue-i18n'
import BuyOrStakeLingo from '../upsell/BuyOrStakeLingo.vue'
import { useBalance } from '@/composables/contracts/balance'
import { useQueryClient } from '@tanstack/vue-query'
import { useAutoSmash } from '@/composables/contracts/auto-smash'
import AutoSmashPurchaseModal from '@/components/home-view/AutoSmashPurchaseModal.vue'
import onBg from '@/assets/images/autosmash/on-bg.png'
import offBg from '@/assets/images/autosmash/off-bg.png'
import lockIcon from '@/assets/images/autosmash/lock.png'
import onBgShadow from '@/assets/images/autosmash/on-bg-shadow.png'

const { t } = useI18n()
const emit = defineEmits<{
  (e: 'smash-asteroid-started'): void
}>()

const allowFirstSmash = ref(false)
const showBuyLingoModal = ref(false)
const router = useRouter()
const { connect } = useWalletConnect()
const { isConnected } = useGetMe()
const { content, resetVariant, pendingActivity } = useDynamicHome()
const { raffles } = useRaffles()
const { tokenBalance } = useBalance()
const { hasStakes, totalPowerMiles, timestampToReach100PM, progressTo100PM, refetchMyStakes } = useStakes()
const { showEmailModal } = useEmailModal()
const showAfterFreeSmashModal = ref(false)
const { showFreePowerMilesPromoModal, freePowerMilesPromoVariant, freePowerMilesPromoEndDate } = useUpsellModals()
const lastResult = ref<{
  success: true;
  prize: GachaAsteroidPrize;
  isEligibleForStakeGrant: boolean;
}>()
const lastSmashDateTime = ref<DateTime>()
const isComponentMounted = ref(false)

// AUTO-SMASH
const autoSmash = useAutoSmash()
const showAutoSmashPurchaseModal = ref(false)
const autoSmashConfirming = ref(false)
const autoSmashState = computed(() => autoSmash.state.value)

const isFreeAsteroid = computed(() => {
  const isFreeAsteroidCampaign = [CampaignParamValue.KOL_FREE_ASTEROID_APRIL_2025, CampaignParamValue.DROPEE_CAMPAIGN_MAY_2025].includes(utmCampaign.value)
  return Boolean(isFreeAsteroidCampaign || allowFirstSmash.value)
})
const buttonText = computed(() => {
  if (isFreeAsteroid.value && !isConnected.value) {
    return t('home.asteroid.smashFirstAsteroid')
  }
  return t('home.asteroid.getStarted')
})
const isUserAbleToSmashFreeAsteroid = computed(() => {

  return isConnected.value
})
const showMainCTA = computed(() => {
  return !isUserAbleToSmashFreeAsteroid.value && !prize.value && isComponentMounted.value
})

const TOTAL_SMASH_AMOUNT = 4
const smashedAmount = ref(0)
const prize = ref<GachaAsteroidPrize | null>(null)
const isPrizeLoading = ref(false)

const showTimer = computed(
  () => hasStakes.value && isUserAbleToSmashFreeAsteroid.value && totalPowerMiles.value < 100 && smashedAmount.value === 0 && !prize.value,
)
const asteroidDisabled = computed(() => {
  if (isConnected.value || !allowFirstSmash.value) {
    return (!isUserAbleToSmashFreeAsteroid.value || showTimer.value)
  }
  return smashedAmount.value >= 3
})
const raffle = computed<Raffle | undefined>(() =>
  raffles.value?.find((r) => r.id === (prize.value as GachaAsteroidPrize & { raffleId: string })?.raffleId),
)

const title = computed(() => {
  let content = t('home.asteroid.title')
  switch (true) {
  case !!prize.value && prize.value?.type === GACHA_ASTEROID_PRIZE_TYPE.ELEMENT: {
    mixpanel.track('Asteroid Smashed', prize.value)
    const additionalContent = raffle.value ? t('home.asteroid.andRaffleTicket', { title: raffle.value?.title }) : ''
    const elementContent = t('home.asteroid.congratsElement', {
      elementId: prize.value?.elementId,
      raffleTicket: additionalContent,
    })
    content = elementContent
    break
  }
  case !!prize.value: {
    mixpanel.track('Asteroid Smashed', prize.value)
    const notElementContent = t('home.asteroid.congratsPowerMiles', { amount: prize.value?.amount })
    content = notElementContent
    break
  }
  }
  return content
})

const subtitle = computed(() => {
  switch (true) {
  case !!prize.value:
    return ''
  case isUserAbleToSmashFreeAsteroid.value:
    return t('home.asteroid.extraPowerOrReward')
  default:
    return ''
  }
})

function handleClickMainCTA() {
  if (isFreeAsteroid.value && smashedAmount.value <= 2) {
    onSmash()
    return
  }
  if (isConnected.value && !hasStakes.value) {
    if (tokenBalance.value > 0) {
      mixpanel.track('Staking Started', {
        entryPoint: 'playPageStart',
      })
      router.push({ name: LingoRouteName.STAKING_NEW })

    } else {
      showBuyLingoModal.value = true
    }
    return
  }

  connect()
}

function onReset() {
  const enabledSmash = totalPowerMiles.value >= 100 || hasStakes.value
  if (!enabledSmash) {
    showBuyLingoModal.value = true
  }
  if (pendingActivity.value) {
    resetVariant()
  }
  if (isFreeAsteroid.value && isConnected.value) {
    utmCampaign.value = null
    showAfterFreeSmashModal.value = true
    allowFirstSmash.value = false
  } else if (!lastResult.value?.isEligibleForStakeGrant) {
    showEmailModal()
  } else {
    handleShowFreePowerMilesPromoModal()
  }
  smashedAmount.value = 0
  prize.value = null
}

function onSpeedUp() {
  mixpanel.track('Staking Started', {
    entryPoint: 'playPageBoost',
  })
  router.push({ name: LingoRouteName.STAKING_NEW })
}
const { refetchElements } = useElements()
const { refetch: refetchSmashActivities } = useActivitiesHistory({
  types: [ACTIVITY_TYPE.SMASH_ASTEROID],
  initialDisplayCount: 3,
  displayIncrement: 3,
})

const queryClient = useQueryClient()

const awaitForLogin = async () => {
  // pendingLogin.value = true
  if (!isConnected.value) {
    await connect()
  }
  while (!isConnected.value) {
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
  // pendingLogin.value = false
}

const handleShowFreePowerMilesPromoModal = () => {
  if (lastResult.value?.isEligibleForStakeGrant) {
    setTimeout(() => {
      freePowerMilesPromoVariant.value = 'basic'
      showFreePowerMilesPromoModal.value = true
      freePowerMilesPromoEndDate.value = lastSmashDateTime.value
    }, 1000)
  }
}

async function getGachaResult() {
  await awaitForLogin()
  if (isPrizeLoading.value) return
  try {
    isPrizeLoading.value = true
    lastSmashDateTime.value = DateTime.now().plus({ minutes: 10 })
    const result = await api.smashAsteroid()
    if (!result?.success) {
      onReset()
      return
    }
    if (result?.prize) {
      prize.value = result.prize
    }
    lastResult.value = result
    await refetchMyStakes()
    await refetchElements()
    await refetchSmashActivities()
    await queryClient.invalidateQueries({ queryKey: ['gacha-elements'] }) // Invalidate global cache
  } catch (error) {
    console.error('Failed to smash asteroid:', error)
  } finally {
    isPrizeLoading.value = false
  }
}

async function onSmash() {
  const enabledSmash = totalPowerMiles.value >= 100 || hasStakes.value
  if (!enabledSmash) {
    showBuyLingoModal.value = true
    return
  }
  if (smashedAmount.value === 0) {
    emit('smash-asteroid-started')
    mixpanel.track(isFreeAsteroid.value ? 'Free Asteroid Smash Started' : 'Smash Asteroid Started')
  }
  if (pendingActivity.value && content.value.image) {
    await getGachaResult()
    return
  }
  if (smashedAmount.value === 2) {
    await awaitForLogin()
  }
  if (isPrizeLoading.value) return
  try {
    isPrizeLoading.value = true

    if (smashedAmount.value < 2) {
      smashedAmount.value = (smashedAmount.value + 1) % TOTAL_SMASH_AMOUNT
      return
    }

    lastSmashDateTime.value = DateTime.now().plus({ minutes: 10 })
    const result = await api.smashAsteroid()

    if (!result?.success) {
      onReset()
      return
    }
    lastResult.value = result

    smashedAmount.value = (smashedAmount.value + 1) % TOTAL_SMASH_AMOUNT
    if (result?.prize) {
      prize.value = result.prize
    }
    await refetchMyStakes()
    await refetchElements()
    await refetchSmashActivities()
    await queryClient.invalidateQueries({ queryKey: ['gacha-elements'] }) // Invalidate global cache
  } catch (error) {
    console.error('Failed to smash asteroid:', error)
  } finally {
    isPrizeLoading.value = false
  }
}

async function onClickAutoSmash() {
  if (autoSmash.state.value === 'LOCKED') {
    await autoSmash.checkEligibility()
    showAutoSmashPurchaseModal.value = true
    return
  }

  await autoSmash.toggleAutoSmash()
}

async function confirmAutoSmash() {
  if (autoSmashConfirming.value) return

  autoSmashConfirming.value = true

  try {
    const ok = await autoSmash.unlockAutoSmash()

    if (ok) {
      showAutoSmashPurchaseModal.value = false
    }
  } finally {
    autoSmashConfirming.value = false
  }
}

function handleOpenHowItWorksModal() {
  mixpanel.track('How It Works Popup View')
  showInfoModal.value = true
}

onMounted(async () => {
  isComponentMounted.value = true
  autoSmash.fetchStatus()

  const params = new URLSearchParams(window.location.search)
  const isFreeAsteroidParam = params.get('fs_init')
  if (isFreeAsteroidParam === 'true') {
    allowFirstSmash.value = true
  }
})

watch(isConnected, (isConnected, wasConnected) => {
  if (!isConnected && wasConnected) {
    onReset()
  }
})
</script>

<style>
.autosmash-pill {
  position: relative;
  width: 190px;
  height: 41px;
  padding: 0;
  border-radius: 999px;
  border: none;
  background: none;
  cursor: pointer;
}

.autosmash-glow-shadow {
  position: absolute;
  inset: -5px;
  object-fit: contain;
  z-index: 0;
  pointer-events: none;
}

.autosmash-inner {
  position: relative;
  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 100%;
  padding: 6px 8px 6px 18px;

  border-radius: 999px;
  background: rgba(38, 38, 56, 0.56);
  border: 1px solid rgba(222, 206, 235, 0.14);

  box-shadow: inset 0 -16px 24px -16px rgba(222,206,235,0.18);
  overflow: hidden;
}

.autosmash-bg {
  position: absolute;
  inset: 0;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  pointer-events: none;
}

.autosmash-label {
  position: relative;
  z-index: 2;
  font-weight: 600;
  font-size: 14px;
  color: #dedceb;
  white-space: nowrap;
  margin-right: 4px;
}

.autosmash-toggle {
  position: relative;
  z-index: 2;
  width: 64px;
  height: 32px;
  border-radius: 999px;
  background: #262638;
  box-shadow: inset 0 -10px 14px -10px rgba(222,206,235,0.22);
}

.autosmash-knob {
  position: absolute;
  top: 0;
  left: 0;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: #262638;
  box-shadow:
    inset 0 0 24px -4px rgba(222,206,235,0.88),
    0 2px 8px rgba(0,0,0,0.4);
  transition: transform 0.25s ease;
}

.autosmash-pill.unlocked_on .autosmash-knob {
  transform: translateX(32px);
}

.autosmash-lock {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 12px;
  height: 17px;
  pointer-events: none;
}

.autosmash-pill.locked .autosmash-knob {
  box-shadow:
    inset 0 0 12px -4px rgba(222,206,235,0.5),
    0 1px 4px rgba(0,0,0,0.35);
}
</style>