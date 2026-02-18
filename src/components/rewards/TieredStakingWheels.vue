<template>
  <div class="mt-12 flex flex-col gap-6 md:gap-8">
    <!-- HEADER -->
    <div class="flex flex-col sm:flex-row justify-between items-start gap-6">
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <span class="text-lavender text-[32px] leading-8 tracking-[-0.96px]">
            {{ t('rewards.tieredStaking.title') }}
          </span>
          <HelpButton
            context=""
            class="cursor-pointer inline-block !size-8 bg-transparent"
            :help-type="EHelpType.TIERED_WHEEL_INFO"
          >
            <InlineSvg
              :src="helpIconSolid"
              class="size-8"
              unique-ids
            />
          </HelpButton>
        </div>

        <span class="text-purple-gray text-xl font-normal leading-6 tracking-[-0.6px]">
          <i18n-t
            v-if="nextTier"
            keypath="rewards.tieredStaking.subtitle"
            tag="span"
          >
            <template #current>
              <span class="text-lavender">{{ formatUsd(currentStakedValue) }}</span>
            </template>
            <template #remaining>{{ formatUsd(stakeToNextTier) }}</template>
            <template #tier>{{ nextTierLabel }}</template>
          </i18n-t>
          <i18n-t
            v-else
            keypath="rewards.tieredStaking.subtitleUnlocked"
            tag="span"
          >
            <template #current>
              <span class="text-lavender">{{ formatUsd(currentStakedValue) }}</span>
            </template>
            <template #tier>{{ currentTierLabel }}</template>
          </i18n-t>
        </span>
      </div>

      <div class="flex flex-row sm:flex-col items-start sm:items-end min-w-full sm:min-w-[140px] max-sm:justify-center">
        <GlowButton
          class="w-auto min-w-[120px] sm:w-full"
          :color="EButtonColor.BLUE"
          @click="goToStaking"
        >
          {{ t('rewards.tieredStaking.stakeNow') }}
        </GlowButton>
      </div>
    </div>

    <!-- UNLOCK INFO -->
    <div
      v-if="sortedWheels.length"
      class="flex flex-col gap-3"
    >
      <TieredStakingProgressBar
        :tiers="sortedWheels"
        :current-value="currentStakedValue"
      />
    </div>

    <div class="flex items-center gap-2 text-purple-gray">
      <img
        :src="currentTierIcon"
        class="w-5 h-5"
      >
      <span class="text-sm">
        <span class="text-lavender font-semibold capitalize">{{ currentTierLabel }}</span>
        <i18n-t
          keypath="rewards.tieredStaking.wheelSpins"
          tag="span"
        >
          <template #spins>
            <span class="text-lavender font-semibold"> {{ remainingSpins }} </span>
          </template>
        </i18n-t>
      </span>
    </div>

    <!-- WHEEL -->
    <div class="relative left-1/2 right-1/2 -mx-[50vw] w-screen flex justify-center">
      <Transition
        class="h-[320px] sm:h-[404px]"
        name="zoom-in"
      >
        <TieredStakingWheelGacha
          v-if="currentWheel"
          :class="{ 'grayscale-100': !canSpin }"
          :prizes="currentWheel.prizes"
          :target-section="targetSection"
          :spinning="spinning"
          :tier="currentTier"
          @finished="onFinished"
          @reset="onReset"
          @click="handleClickMainCTA"
        />
      </Transition>
    </div>

    <!-- CTA BUTTON -->
    <div class="flex justify-center items-center mt-4">
      <GlowButton
        v-if="isConnected"
        class="w-[160px]"
        :color="EButtonColor.ORANGE"
        :disabled="isSpinDisabled"
        @click="handleClickMainCTA"
      >
        <span v-if="isLoadingSpin">{{ t('rewards.tieredStaking.spinning') }}</span>
        <span v-else>{{ t('rewards.tieredStaking.spinNow') }}</span>
      </GlowButton>

      <GlowButton
        v-else
        class="w-[160px]"
        :color="EButtonColor.BLUE"
        @click="handleClickLogInSignUp"
      >
        {{ t('rewards.wheel.logInSignUp') }}
      </GlowButton>
    </div>

    <div class="tiered-rarities flex flex-col items-center mt-8">
      <TooltipWrapper>
        <span class="text-lavender text-lg mb-4">
          {{ t('rewards.tieredStaking.expectedValue') }} {{ expectedValue }}
        </span>
        <template #content>
          <TooltipContent
            :title="t('rewards.tieredStaking.expectedValueTitle')"
            :description="t('rewards.tieredStaking.expectedValueDescription')"
          />
        </template>
      </TooltipWrapper>

      <div class="rarities-cards [&_.text-lavender.text-lg]:hidden">
        <TradingGachaRarities :tier="raritiesTier" />
      </div>
    </div>

    <RewardsHistoryList
      :items="wonSpinsList"
      :is-loading="isLoadingHistory"
      :is-loading-more="loadingMore"
      :all-shown="!hasMore"
      :items-clickable="true"
      image-class="!bg-cover"
      :empty-text="isConnected ? t('rewards.wheel.noSpinsYet') : t('rewards.wheel.loginToSeeYourSpins')"
      :title="t('rewards.stakingWheel.historyTitle')"
      class="container mt-16"
      @activity-click="handleWonSpinClick"
      @show-more="loadMore"
    />

    <TradingGachaPrizeModal
      v-if="spinResult"
      v-model="showWonModal"
      :won-prize="modalPrize"
      :voucher-code="spinResult.voucherCode ?? undefined"
      :prize-title="prizeTitle(spinResult)"
      :prize-image="prizeImage(spinResult)"
      source="tiered"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { DateTime } from 'luxon'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useTranslation } from '@/composables/use-i18n'
import { useGetMe } from '@/composables/get-me'
import { useWalletConnect } from '@/composables/wallet/use-wallet-connect'
import { useTieredStakingWheels, useTieredStakingWheelSpinsHistory } from '@/composables/use-tiered-staking-wheels'
import { encodeImageUrl } from '@/composables/helpers'
import { EButtonColor } from '@/types/shared/button'
import { EHelpType } from '@/types/staking'
import { LingoRouteName } from '@/router/routes'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import InlineSvg from 'vue-inline-svg'

import GlowButton from '@/components/ui/button/GlowButton.vue'
import RewardsHistoryList from '@/components/rewards/RewardsHistoryList.vue'
import TradingGachaRarities from '@/components/rewards/wheel/TradingGachaRarities.vue'
import TradingGachaPrizeModal from '@/components/rewards/wheel/TradingGachaPrizeModal.vue'
import TieredStakingWheelGacha from '@/components/rewards/wheel/TieredStakingWheelGacha.vue'
import TieredStakingProgressBar from '@/components/rewards/wheel/TieredStakingProgressBar.vue'
import TooltipContent from '@/components/TooltipContent.vue'
import TooltipWrapper from '@/components/TooltipWrapper.vue'
import HelpButton from '@/components/help-modal/HelpButton.vue'

import bronzeIcon from '@/assets/images/wheel/bronze-tier.png'
import silverIcon from '@/assets/images/wheel/silver-tier.png'
import goldIcon from '@/assets/images/wheel/gold-tier.png'
import diamondIcon from '@/assets/images/wheel/diamond-logo-sm.png'
import helpIconSolid from '@/assets/images/medals/details-icon.svg'
import type { TieredStakingWheel, TieredStakingWheelSpin } from '@/services/api'

type Tier = 'bronze' | 'silver' | 'gold' | 'diamond'

const { t } = useTranslation()
const { isConnected, accountAddress } = useGetMe()
const { connect } = useWalletConnect()
const queryClient = useQueryClient()
const router = useRouter()

const { wheels, currentWheel, remainingSpins, isEligible } = useTieredStakingWheels()

const {
  spins,
  isLoadingHistory,
  loadingMore,
  hasMore,
  fetchHistory,
  loadMore,
} = useTieredStakingWheelSpinsHistory()

const sortedWheels = computed<TieredStakingWheel[]>(() => {
  return [...(wheels.value.wheels ?? [])].sort(
    (a, b) => a.lockAmountEligibility - b.lockAmountEligibility,
  )
})

const currentUserEligibility = computed(() => {
  return sortedWheels.value.find(w => Boolean(w.userEligibility))?.userEligibility ?? null
})

const currentStakedValue = computed(() => {
  return currentUserEligibility.value?.currentStakedValueUsd ?? 0
})

const nextTier = computed(() => {
  return sortedWheels.value.find(
    w => w.userEligibility?.meetsStakingRequirement !== true,
  )
})

const stakeToNextTier = computed(() => {
  if (!nextTier.value) return 0
  return Math.max(0, nextTier.value.lockAmountEligibility - currentStakedValue.value)
})

const tierFromWheel = (wheel: TieredStakingWheel | null): Tier => {
  if (!wheel) return 'bronze'
  const title = (wheel.title ?? '').toLowerCase()
  if (title.includes('diamond')) return 'diamond'
  if (title.includes('gold')) return 'gold'
  if (title.includes('silver')) return 'silver'
  if (title.includes('bronze')) return 'bronze'
  const index = sortedWheels.value.findIndex(w => w.id === wheel.id)
  return ['bronze', 'silver', 'gold', 'diamond'][Math.max(index, 0)] as Tier
}

const currentTier = computed<Tier>(() => tierFromWheel(currentWheel.value))

const displayTierWheel = computed<TieredStakingWheel | null>(() => {
  if (!sortedWheels.value.length) return currentWheel.value
  const unlocked = sortedWheels.value.filter(
    w => w.userEligibility?.meetsStakingRequirement === true,
  )
  return unlocked.length ? unlocked[unlocked.length - 1] : sortedWheels.value[0]
})

const displayTier = computed<Tier>(() => tierFromWheel(displayTierWheel.value))

const currentTierLabel = computed(() => {
  if (displayTier.value === 'diamond') return 'Diamond'
  if (displayTier.value === 'gold') return 'Gold'
  if (displayTier.value === 'silver') return 'Silver'
  return 'Bronze'
})

const nextTierLabel = computed(() => {
  if (!nextTier.value) return currentTierLabel.value
  return tierFromWheel(nextTier.value).replace(/^./, c => c.toUpperCase())
})

const currentTierIcon = computed(() => {
  if (displayTier.value === 'diamond') return diamondIcon
  if (displayTier.value === 'gold') return goldIcon
  if (displayTier.value === 'silver') return silverIcon
  return bronzeIcon
})

const expectedValue = computed(() => {
  const byTier: Record<Tier, string> = {
    bronze: '$1.5',
    silver: '$3',
    gold: '$5.5',
    diamond: '$12',
  }
  return byTier[displayTier.value]
})

const raritiesTier = computed<'silver' | 'gold' | 'diamond'>(() => {
  if (displayTier.value === 'diamond') return 'diamond'
  if (displayTier.value === 'gold') return 'gold'
  return 'silver'
})

const wheelId = computed(() => currentWheel.value?.id)
const canSpin = computed(() => {
  return isConnected.value && Boolean(isEligible.value) && remainingSpins.value > 0
})

const spinResult = ref<TieredStakingWheelSpin | null>(null)
const showWonModal = ref(false)
const spinning = ref(false)
const targetSection = ref<string>()

const spinMutation = useMutation({
  mutationKey: ['tieredStakingWheelSpin', wheelId, accountAddress],
  mutationFn: async (): Promise<TieredStakingWheelSpin> => {
    if (!wheelId.value) {
      throw new Error('No wheelId available for tiered staking wheel spin')
    }
    return await api.spinTieredStakingWheel({ wheelId: wheelId.value })
  },
})

const isLoadingSpin = computed(() => spinMutation.isPending.value)

async function handleClickMainCTA() {
  if (!isConnected.value) return handleClickLogInSignUp()
  if (isSpinDisabled.value) return

  spinning.value = true
  try {
    const result = await spinMutation.mutateAsync()
    spinResult.value = result
    targetSection.value = result.prize.id
  } catch (_error) {
    spinning.value = false
  }
}

async function handleClickLogInSignUp() {
  await connect()
}

function onFinished() {
  if (!spinResult.value) {
    spinning.value = false
    return
  }

  showWonModal.value = true
  spinning.value = false

  queryClient.invalidateQueries({ queryKey: ['tieredStakingWheels'] })
  queryClient.invalidateQueries({ queryKey: ['tieredStakingWheelSpinsHistory'] })
  requestHistoryRefresh(spinResult.value.id)
}

function onReset() {
  targetSection.value = undefined
  spinning.value = false
}

const isSpinDisabled = computed(() => {
  return Boolean(
    spinning.value ||
    isLoadingSpin.value ||
    !canSpin.value,
  )
})

const prizeTitle = (spin: TieredStakingWheelSpin) => {
  return t('components.rafflesWrapper.youWon') + ' ' + (spin.prize?.name ?? t('rewards.tradingGacha.unknownPrize'))
}

const prizeImage = (spin: TieredStakingWheelSpin) => {
  return encodeImageUrl(spin.prize.image || '')
}

const modalPrize = computed(() => {
  if (!spinResult.value) return undefined
  return {
    id: spinResult.value.id,
    imageUrl: prizeImage(spinResult.value),
    prize: {
      type: spinResult.value.prize.type,
      name: spinResult.value.prize.name,
    },
  }
})

const formatUsd = (value: number) => {
  return `$${Math.round(value).toLocaleString('en-US')}`
}

const goToStaking = () => {
  router.push({ name: LingoRouteName.STAKING_NEW })
}

const lastRefetchedSpinId = ref<string | null>(null)

const requestHistoryRefresh = (spinId?: string | null) => {
  if (!spinId) return
  if (lastRefetchedSpinId.value === spinId) return
  lastRefetchedSpinId.value = spinId
  setTimeout(() => {
    fetchHistory()
  }, 600)
}

const wonSpinsList = computed(() => {
  return spins.value.map((spin) => ({
    title: DateTime.fromISO(spin.timestamp)
      .toFormat('d LLL yyyy · h:mma')
      .toLowerCase(),
    referenceImageSrc: prizeImage(spin),
    description: prizeTitle(spin),
    buttonLabel: t('components.rafflesWrapper.details'),
    buttonAnimated: false,
  }))
})

const handleWonSpinClick = (index: number) => {
  const spin = spins.value[index]
  if (!spin) return

  spinResult.value = spin
  setTimeout(() => {
    showWonModal.value = true
  }, 200)
}

onMounted(() => {
  fetchHistory()
})

watch(isConnected, (connected) => {
  fetchHistory()
  if (!connected) spinResult.value = null
})
</script>

<style scoped></style>
