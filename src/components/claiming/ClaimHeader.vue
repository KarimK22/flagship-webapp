<template>
  <div class="flex max-md:flex-col items-center justify-between mb-10 md:mb-16 relative gap-y-6">
    <h1
      class="whitespace-pre-line text-lavender text-5xl md:text-[56px] leading-10 tracking-[-2.24px] max-md:text-center"
      :class="{ 'md:max-w-[320px]': showClaimableBalance }"
    >
      {{ title }}
    </h1>
    <div
      v-if="showClaimableBalance"
      class="flex justify-between"
      :class="{ 'md:absolute md:right-0': balance <= 0 }"
    >
      <div
        v-if="loadingBalance"
        class="flex justify-center items-center max-md:h-[80px]"
      >
        <BaseSpinner />
      </div>
      <div v-else>
        <div
          v-if="balance > 0"
          class="flex justify-between items-end gap-2"
        >
          <div class="flex flex-col items-end gap-2">
            <span class="text-light1 text-xl leading-8 tracking-[-0.6px]">{{ t('components.claimHeader.amount') }}</span>
            <p class="text-lavender text-5.5xl leading-10 tracking-[-2.24px] self-end select-none">
              {{ formatNumberToUS(balance) }}
            </p>
          </div>
          <IconWrapper
            variant="purple"
            position="right"
            :with-borders="false"
          >
            <InlineSvg
              :src="pointsIcon"
              width="40"
              height="40"
            />
          </IconWrapper>
        </div>
        <div
          v-else
          class="flex flex-col gap-3 flex-1 justify-center items-center relative rounded-2xl h-[13rem] max-md:max-h-[149px]"
        >
          <CardBackground
            class="absolute top-0 left-0 w-full h-full"
            variant="purple"
          />
          <GlowText
            :text="emptyText"
            variant="purple"
            class="max-w-[328px]"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useTranslation } from '@/composables/use-i18n'
import pointsIcon from '@/assets/images/lingo-icon.svg'
import { formatNumberToUS } from '@/composables/helpers.ts'
import CardBackground from '@/components/textures/CardBackground.vue'
import GlowText from '@/components/glow-text/GlowText.vue'
import IconWrapper from '@/components/icon-wrapper/IconWrapper.vue'
import InlineSvg from 'vue-inline-svg'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import { useBalance } from '@/composables/contracts/balance.ts'
import { computed } from 'vue'
import { useApy } from '@/composables/use-apy'
import { useGetMe } from '@/composables/get-me'

const { t } = useTranslation()

const props = withDefaults(defineProps<{
  showClaimableBalance?: boolean
  title: string
  claimId?: string
  isAPY?: boolean
}>(), {
  showClaimableBalance: true,
  isAPY: false,
  claimId: undefined,
})

const { accountAddress } = useGetMe()

const { totalClaimableBalance, loadingClaimableBalance } = useBalance()
const { data, isLoading, failedClaims } = useApy()

const balance = computed(() => {
  if (props.isAPY) {
    if (props.claimId) {
      const claim = failedClaims.value.find((claim) => claim.id === props.claimId)
      if (claim) {
        return Number(claim.amount)
      }
      return 0
    }
    return data.value.amountEarnedSinceLastClaim
  }
  return totalClaimableBalance.value
})

const loadingBalance = computed(() => {
  if (props.isAPY) {
    return isLoading.value
  }
  return loadingClaimableBalance.value
})

const emptyText = computed(() => {
  return !accountAddress.value ? t('components.claimHeader.loginToSee') : t('components.claimHeader.noClaimableTokens')
})
</script>

<style scoped></style>