<template>
  <div class="pb-8 pt-4 md:pt-[88px]">
    <ClaimHeader
      :title="t('views.claimWizardView.title')"
      :claim-id="claimId"
      :is-a-p-y="isAPY"
    />
    <div>
      <div class="flex max-md:flex-col items-start justify-between mb-2 gap-8">
        <div
          class="relative w-full"
          :class="{ 'grayscale cursor-not-allowed pointer-events-none': !userCanStake }"
        >
          <RadioCard
            v-model="claimType"
            class="w-full"
            value="extra"
            :title="t('views.claimWizardView.claimExtra')"
            :description="extraDescription"
            :badge-text="t('views.claimWizardView.recommended')"
          />
          <RadioCardBackground :active-card="claimType === 'extra'" />
        </div>
        <div class="relative w-full">
          <RadioCard
            v-model="claimType"
            class="w-full"
            value="instant"
            :title="t('views.claimWizardView.claimInstantly')"
            :description="instantDescription"
          />
          <RadioCardBackground :active-card="claimType === 'instant'" />
        </div>
      </div>
      <div class="flex items-center justify-center">
        <GlowButton
          class="min-w-[224px] mx-auto mt-8"
          :color="EButtonColor.BLUE"
          @click="chooseClaimType"
        >
          <span>{{ t('views.claimWizardView.claimButton', { type: t(`views.claimWizardView.${claimType}`) }) }}</span>
        </GlowButton>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useTranslation } from '@/composables/use-i18n'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button.ts'
import RadioCard from '@/components/ui/radio-card/RadioCard.vue'
import { computed, ref, watch } from 'vue'
import ClaimHeader from '@/components/claiming/ClaimHeader.vue'
import { useBalance } from '@/composables/contracts/balance.ts'
import RadioCardBackground from '@/components/textures/RadioCardBackground.vue'
import { LingoRouteName } from '@/router/routes.ts'
import { useRoute, useRouter } from 'vue-router'
import { useApy } from '@/composables/use-apy'

const { t } = useTranslation()

const { totalClaimableBalance } = useBalance()
const route = useRoute()
const claimId = route.query.claimId as string
const isAPY = route.query.apy === 'true'
const claimType = ref<'extra' | 'instant' | null>('extra')
const { failedClaims, data: APYData } = useApy()
const rewardsNumber = computed(() => {
  const base = 0.05
  const asteroidPrice = 100
  return Math.floor(
    (totalClaimableBalance.value * base * (1 + 1.8) * 30) / asteroidPrice,
  )
})

const userCanStake = computed(() => {
  if (isAPY) {
    const amountToClaim = APYData.value?.amountEarnedSinceLastClaim
    const failedClaim = failedClaims.value.find(claim => claim.id === claimId)
    if (failedClaim) {
      return Number(failedClaim.amount) >= 1
    } else {
      return amountToClaim >= 1
    }
  }

  return true
})

watch(userCanStake, (newVal) => {
  if (!newVal) {
    claimType.value = 'instant'
  }
}, { immediate: true })

const rewardsDescription = computed(() => {
  return rewardsNumber.value >= 1
    ? t('views.claimWizardView.rewardsDescription', { rewards: rewardsNumber.value })
    : t('views.claimWizardView.rewardsDescriptionFallback')
})

const extraDescription = computed(() => [
  rewardsDescription.value,
  t('views.claimWizardView.extraDescription.0'),
  t('views.claimWizardView.extraDescription.1'),
  t('views.claimWizardView.extraDescription.2'),
])

const instantDescription = computed(() => [t('views.claimWizardView.instantDescription.0')])
const router = useRouter()
const chooseClaimType = () => {
  router.push({
    name: LingoRouteName.CLAIM_CONFIRM,
    query: {
      type: claimType.value,
      apy: isAPY.toString(),
      claimId,
    },
  })
}
</script>
<style scoped>
.claim-extra {
  width: 100%;
}
</style>
