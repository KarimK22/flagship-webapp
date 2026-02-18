<template>
  <div class="mt-12 flex flex-col gap-6 md:gap-8">
    <!-- HEADER -->
    <div class="flex flex-col sm:flex-row justify-between items-center gap-6">
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <span class="text-lavender text-[32px] font-semibold leading-8 tracking-[-0.96px]">
            {{ $t('rewards.stakingWheel.title') }}
          </span>
          <HelpButton
            context=""
            class="cursor-pointer inline-block !size-8 bg-transparent"
            :help-type="EHelpType.WHEEL_INFO"
          >
            <InlineSvg
              :src="helpIconSolid"
              class="size-8"
              unique-ids
            />
          </HelpButton>
        </div>

        <span class="text-purple-gray text-xl font-normal leading-6 tracking-[-0.6px]">
          {{ $t('rewards.stakingWheel.subtitle') }}
        </span>
      </div>

      <GlowButton
        class="w-auto min-w-[120px]"
        :color="EButtonColor.BLUE"
        @click="goToStaking"
      >
        {{ $t('rewards.wheel.getMore') }}
      </GlowButton>
    </div>

    <!-- SELECTOR -->
    <div class="container flex justify-center">
      <div
        class="
          flex gap-3
          flex-wrap md:flex-nowrap
          justify-center
        "
      >
        <GlowButton
          v-for="t in tiers"
          :key="t"
          class="
            staking-tier-btn
            w-[150px] h-[34px]
            sm:w-[170px] sm:h-[36px]
            md:w-[235px] md:h-[40px]
          "
          :class="[
            selectedTier === t ? 'is-selected opacity-100' : 'is-not-selected opacity-50',
          ]"
          :color="tierColor(t)"
          :style="{ backgroundColor: tierBgFill(t) }"
          @click="selectedTier = t"
        >
          <div class="flex items-center justify-center gap-2 w-full">
            <span class="text-xs sm:text-sm font-medium">
              {{ labelForTier(t) }}
            </span>

            <span
              class="
                text-[10px] sm:text-xs
                px-2 py-0 sm:py-0.5
                rounded-full
                bg-black/30
                text-lavender
              "
              :style="{
                borderColor: tierBorderColor(t),
                borderWidth: '1px',
                borderStyle: 'solid'
              }"
            >
              {{ tierSpins(t) }}
            </span>
          </div>
        </GlowButton>
      </div>
    </div>

    <div class="container flex items-center gap-2 text-purple-gray">
      <img
        :src="logoForTier(selectedTier)"
        class="w-5 h-5 object-contain"
      >
      <span class="text-sm">
        <span class="capitalize">{{ selectedTier }}</span> wheel - you have
        <span class="text-lavender font-semibold"> {{ availableSpins }} </span>
        spins
      </span>
    </div>

    <!-- WHEEL -->
    <Transition
      class="h-[320px] sm:h-[404px] mt-4"
      name="zoom-in"
    >
      <StakingWheelGacha
        v-if="selectedWheel && !loading"
        :class="{ 'grayscale-100': !canSpinSelected }"
        :prizes="selectedWheel.prizes"
        :tier="selectedTier"
        :target-section="targetSection"
        :spinning="spinning"
        @finished="onFinished"
        @reset="onReset"
        @click="handleClickMainCTA"
      />
    </Transition>

    <!-- CTA -->
    <div class="flex justify-center items-center mt-8">
      <GlowButton
        v-if="isConnected"
        class="w-[140px]"
        :color="EButtonColor.ORANGE"
        :disabled="disabled"
        @click="handleClickMainCTA"
      >
        <span v-if="isLoadingSpin">{{ $t('rewards.stakingWheel.spinning') }}</span>
        <span v-else>{{ $t('rewards.wheel.spinNow') }}</span>
      </GlowButton>

      <GlowButton
        v-else
        class="w-[140px]"
        :color="EButtonColor.BLUE"
        @click="handleClickLogInSignUp"
      >
        {{ $t('rewards.wheel.logInSignUp') }}
      </GlowButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useGetMe } from '@/composables/get-me'
import { useWalletConnect } from '@/composables/wallet/use-wallet-connect'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import { useRouter } from 'vue-router'
import { LingoRouteName } from '@/router/routes'
import api from '@/services/api'
import InlineSvg from 'vue-inline-svg'
import HelpButton from '@/components/help-modal/HelpButton.vue'
import { EHelpType } from '@/types/staking'
import helpIconSolid from '@/assets/images/medals/details-icon.svg'

import StakingWheelGacha from './StakingWheelGacha.vue'
import type { StakingWheel, StakingWheelSpin } from '@/composables/use-staking-wheels'

import silverLogo from '@/assets/images/wheel/silver-logo-sm.png'
import goldLogo from '@/assets/images/wheel/gold-logo-sm.png'
import diamondLogo from '@/assets/images/wheel/diamond-logo-sm.png'

type Tier = 'silver' | 'gold' | 'diamond'
const tiers: Tier[] = ['silver', 'gold', 'diamond']

const props = defineProps<{
  selectedTier?: Tier
}>()

const emit = defineEmits<{
  (e: 'on-spin-finished', spinPrize: StakingWheelSpin): void
  (e: 'update:selectedTier', tier: Tier): void
}>()

const { connect } = useWalletConnect()
const { isConnected, accountAddress } = useGetMe()
const queryClient = useQueryClient()

const selectedTier = computed<Tier>({
  get: () => props.selectedTier ?? 'silver',
  set: (tier) => emit('update:selectedTier', tier),
})

const didAutoSelect = ref(false)

const { data: wheelsRes, isLoading: isLoadingWheels } = useQuery({
  queryKey: ['stakingWheels', accountAddress],
  queryFn: () => api.getStakingWheels(),
  initialData: { wheels: [] as StakingWheel[], isAuthenticated: false },
})

const wheels = computed(() => wheelsRes.value.wheels ?? [])

const tierFromWheel = (w?: StakingWheel | null): Tier => {
  const title = (w?.title ?? '').toLowerCase()
  if (title.includes('diamond')) return 'diamond'
  if (title.includes('gold')) return 'gold'
  return 'silver'
}

const tierRank: Record<Tier, number> = { silver: 0, gold: 1, diamond: 2 }
const sortedWheelsForPick = computed(() => {
  return wheels.value.slice().sort((a, b) => tierRank[tierFromWheel(a)] - tierRank[tierFromWheel(b)])
})

const wheelByTier = computed<Record<Tier, StakingWheel | null>>(() => {
  const res: Record<Tier, StakingWheel | null> = { silver: null, gold: null, diamond: null }
  for (const w of wheels.value) res[tierFromWheel(w)] = w
  return res
})

const selectedWheel = computed<StakingWheel | null>(() => wheelByTier.value[selectedTier.value])
const wheelId = computed(() => selectedWheel.value?.id ?? null)

watchEffect(() => {
  if (didAutoSelect.value) return
  if (!sortedWheelsForPick.value.length) return

  const firstEligible = sortedWheelsForPick.value.find(w => w.userEligibility?.eligible === true)
  const picked = firstEligible ?? sortedWheelsForPick.value[0]

  selectedTier.value = tierFromWheel(picked)
  didAutoSelect.value = true
})

const {
  data: eligibility,
  isLoading: isLoadingEligibility,
  refetch: refetchEligibility,
} = useQuery({
  queryKey: ['stakingWheelEligibility', wheelId, accountAddress],
  queryFn: () => api.getStakingWheelEligibility({ wheelId: wheelId.value as string }),
  enabled: () => Boolean(wheelId.value && isConnected.value),
})

const availableSpins = computed(() => {
  if (!selectedWheel.value) return 0
  return eligibility.value?.remainingSpins ?? (selectedWheel.value.userEligibility?.remainingSpins ?? 0)
})

const isEligible = computed(() => {
  if (!selectedWheel.value) return false
  return Boolean(eligibility.value?.eligible ?? selectedWheel.value.userEligibility?.eligible)
})

const canSpinSelected = computed(() => isConnected.value && isEligible.value && availableSpins.value > 0)

const loading = computed(() => {
  if (!isConnected.value) return isLoadingWheels.value
  return isLoadingWheels.value || isLoadingEligibility.value
})

const spinning = ref(false)
const targetSection = ref<string | undefined>(undefined)
const spinResult = ref<StakingWheelSpin | null>(null)

const { mutateAsync: spinAsync, isPending: isLoadingSpin } = useMutation({
  mutationKey: ['stakingWheelSpin', wheelId, accountAddress],
  mutationFn: async () => {
    if (!wheelId.value) throw new Error('No wheelId selected')
    return await api.spinStakingWheel({ wheelId: wheelId.value })
  },
})

const disabled = computed(() => loading.value || isLoadingSpin.value || !canSpinSelected.value)

async function handleClickMainCTA() {
  if (!isConnected.value) return handleClickLogInSignUp()
  if (disabled.value) return

  spinning.value = true
  const result = await spinAsync()
  spinResult.value = result
  targetSection.value = result.prize.id
}

async function handleClickLogInSignUp() {
  await connect()
}

function onFinished() {
  if (!spinResult.value) {
    spinning.value = false
    return
  }

  emit('on-spin-finished', spinResult.value)

  refetchEligibility()
  queryClient.invalidateQueries({ queryKey: ['stakingWheels'] })

  spinning.value = false
}

function onReset() {
  spinResult.value = null
  targetSection.value = undefined
}

const tierSpins = (t: Tier) => {
  const w = wheelByTier.value[t]
  if (!w) return 0
  if (t === selectedTier.value) return availableSpins.value
  return w.userEligibility?.remainingSpins ?? 0
}

const tierColor = (t: Tier) => {
  if (t === 'silver') return EButtonColor.SILVER
  if (t === 'gold') return EButtonColor.GOLD
  return EButtonColor.DIAMOND
}

const tierBorderColor = (t: Tier) => {
  if (t === 'silver') return '#8A9AC2'
  if (t === 'gold') return '#FFBC70'
  return '#F1E6FA'
}

const tierBgFill = (t: Tier) => {
  if (t === 'silver') return '#8A9AC229'
  if (t === 'gold') return '#FFBC7029'
  return '#F1E6FA29'
}

const logoForTier = (t: Tier) => {
  if (t === 'gold') return goldLogo
  if (t === 'diamond') return diamondLogo
  return silverLogo
}

const labelForTier = (t: Tier) => {
  if (t === 'gold') return 'Gold Wheel'
  if (t === 'diamond') return 'Diamond Wheel'
  return 'Silver Wheel'
}

const router = useRouter()
const goToStaking = () => {
  router.push({ name: LingoRouteName.STAKING_NEW, query: { redirect: 'rewards' } })
}
</script>

<style scoped>
.zoom-in-enter-active {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  transition-delay: 0.3s;
}
.zoom-in-leave-active {
  transition: transform 0.1s ease-in-out, opacity 0.1s ease-in-out;
  transition-delay: 0s;
}
.zoom-in-enter-from,
.zoom-in-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

.staking-tier-btn.is-not-selected {
  opacity: 0.55;
  transition: opacity 0.2s ease;
}
.staking-tier-btn.is-not-selected:hover {
  opacity: 0.75;
}
.staking-tier-btn.is-selected {
  opacity: 1;
}
.staking-tier-btn.is-not-selected :deep(> div:nth-child(2)) {
  display: none !important;
}
</style>
