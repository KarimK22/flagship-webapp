<template>
  <div class="rounded-2xl bg-[linear-gradient(180deg,rgba(20,20,31,0.00)_0%,#262638_100%)] mt-2">
    <div
      :style="{ backgroundImage: `url(${isEligible ? elegibleBg : notEligibleBg})` }"
      class="flex flex-col justify-between px-4 py-8 rounded-2xl bg-cover bg-right md:bg-center w-full md:w-[404px] h-[260px] md:h-[288px] bordered md:border-none!"
    >
      <div class="flex items-center gap-4">
        <div class="flex flex-col gap-2 max-w-[205px]">
          <h1
            class="text-5xl font-medium tracking-[-2.4px]"
            :class="isEligible ? 'text-[#5EB851]' : 'text-[#FF9D5C]'"
          >
            {{ isEligible ? $t('components.airdropEligibleStatus.eligible') : $t('components.airdropEligibleStatus.notEligible') }}
          </h1>
          <span
            v-if="isEligible"
            class="text-[32px] text-lavender leading-6 md:leading-8 font-medium tracking-[-1.28px]"
          >
            {{ t('components.airdropEligibleStatus.notified') }}
          </span>
          <span
            v-else-if="airdrop.minLockDurationId"
            class="text-[32px] text-lavender leading-6 md:leading-8 font-medium tracking-[-1.28px]"
          >
            {{ t('components.airdropEligibleStatus.stakeToQualify', {
              amount: formatNumberToUS(requiredAmountInLingo),
              duration: LockDurationToDescription[airdrop.minLockDurationId]
            }) }}
          </span>
        </div>
        <div
          class="w-32 md:w-32 h-38 md:h-38 relative"
        >
          <div
            :style="{ backgroundImage: `url(${isEligible ? airdropImage : coinImage})` }"
            class="w-[273px] h-[233px] bg-no-repeat bg-[40px_16px] bg-[length:180px] md:bg-[length:210px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      </div>
      <GlowButton
        :color="isEligible ? EButtonColor.GREEN : EButtonColor.PURPLE"
        class="w-full leading-6"
        @click="handleClickMainButton"
      >
        <span class="flex items-center justify-center gap-1 ">
          <span>{{ isEligible ? t('components.airdropEligibleStatus.gotIt') : t('components.airdropEligibleStatus.stakeLingo') }}</span>
          <InlineSvg
            v-if="!isEligible"
            :src="lingoIcon"
            class="size-6"
          />
        </span>
      </GlowButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { EButtonColor } from '@/types/shared/button.ts'
import lingoIcon from '@/assets/images/lingo-icon.svg'
import elegibleBg from '@/assets/images/airdrops/elegible-bg.png'
import notEligibleBg from '@/assets/images/airdrops/not-elegible-bg.png'
import airdropImage from '@/assets/images/airdrops/airdrop.png'
import coinImage from '@/assets/images/airdrops/coin.png'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import InlineSvg from 'vue-inline-svg'
import { LingoRouteName } from '@/router/routes.ts'
import { useRouter } from 'vue-router'
import { useLingoPrice } from '@/composables/contracts/lingo-price.ts'
import mixpanel from 'mixpanel-browser'
import type { Airdrop } from '@/const/airdrops.ts'
import { useAirdrops } from '@/composables/airdrops'
import { formatNumberToUS } from '@/composables/helpers'
import { useStakes } from '@/composables/contracts/stakes'
import { LockDurationToDays, LockDurationToDescription } from '@/types/lock-config'
import { useTranslation } from '@/composables/use-i18n'

const { t } = useTranslation()

const props = defineProps<{
  airdrop: Airdrop
}>()

const { isEligibleForAirdrop, showAirdropCardModal } = useAirdrops()

const isEligible = computed(() => isEligibleForAirdrop(props.airdrop))

const router = useRouter()
const goToStaking = () => {
  mixpanel.track('Staking Started', {
    entryPoint: 'airdropPopup',
  })
  router.push({ name: LingoRouteName.STAKING_NEW, query: { presetAmount: roundedStakeAmount.value, redirect: 'airdrop' } })
}

const handleClickMainButton = () => {
  if (isEligible.value) {
    showAirdropCardModal.value = false
  } else {
    goToStaking()
  }
}

const { price } = useLingoPrice()
const { myStakesList } = useStakes()

const totalStakedLingoInUSD = computed(() => {
  if (!myStakesList.value || !props.airdrop.minLockDurationId) {
    return 0
  }
  const requiredLockDuration = LockDurationToDays[props.airdrop.minLockDurationId]
  return myStakesList.value.reduce((acc, stake) => {
    const lockDurationInDays = LockDurationToDays[stake.lockDurationId]
    if (lockDurationInDays >= requiredLockDuration) {
      const stakeInUSD = Number(stake.amount) * Number(stake.lingoPrice)
      return acc + stakeInUSD
    }
    return acc
  }, 0)
})

const requiredAmountInLingo = computed(() => {
  if (!props.airdrop.minAmount) {
    return 0
  }
  const amountInLingo = props.airdrop.minAmount / price.value
  const currentStakedInLingo = totalStakedLingoInUSD.value / price.value
  return Math.ceil(amountInLingo - currentStakedInLingo)
})

const roundedStakeAmount = computed(() => {
  if (!props.airdrop.minAmount) {
    return 0
  }
  const amountInLingo = props.airdrop.minAmount / price.value
  const currentStakedInLingo = totalStakedLingoInUSD.value / price.value
  return Math.ceil(amountInLingo - currentStakedInLingo)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.bordered {
  border-left: 1px solid rgba(94, 184, 81, 0.16);
  border-bottom: 1px solid rgba(94, 184, 81, 0.16);
}
</style>