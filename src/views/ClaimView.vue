<script setup lang="ts">
import { EButtonColor } from '@/types/shared/button.ts'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import IconWrapper from '@/components/icon-wrapper/IconWrapper.vue'
import { formatNumberToUS } from '@/composables/helpers.ts'
import { useBalance } from '@/composables/contracts/balance.ts'
import InlineSvg from 'vue-inline-svg'
import pointsIcon from '@/assets/images/lingo-icon.svg'
import ClaimBalanceBoxes from '@/components/claiming/ClaimBalanceBoxes.vue'
import { useSnapshot } from '@/composables/contracts/snapshot.ts'
import { beneficiaryNames } from '@/types/beneficiary.ts'
import { useClaimCustom } from '@/composables/contracts/claim-custom.ts'
import { useRouter } from 'vue-router'
import { LingoRouteName } from '@/router/routes.ts'
import { computed, onMounted } from 'vue'
import CardBackground from '@/components/textures/CardBackground.vue'
import GlowText from '@/components/glow-text/GlowText.vue'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import { formatCamelCase } from '@/composables/helpers.ts'
import ClaimInfoModal from '@/components/claiming/ClaimInfoModal.vue'
import mixpanel from 'mixpanel-browser'
import { useLocalStorage } from '@vueuse/core'
import { useInvestorsKOL } from '@/composables/contracts/claim-investorsKOL.ts'
import { useGetMe } from '@/composables/get-me'
import { useTranslation } from '@/composables/use-i18n'

const { accountAddress } = useGetMe()
const { t } = useTranslation()
const router = useRouter()
const { totalClaimableBalance } = useBalance()
const { allocationTypes, totalTokenAllocation, loadingSnapshot } = useSnapshot()
const { availableIslandTokens } = useClaimCustom()
const { whitelistInfo } = useInvestorsKOL()

const handleGoToClaim = () => {
  mixpanel.track('Claim Started')
  router.push({ name: LingoRouteName.CLAIM_WIZARD })
}

const totalAllocationTypes = computed(() => {
  return (allocationTypes.value ? Object.keys(allocationTypes.value).length : 0) +
    Object.keys(availableIslandTokens.value).length +
    (whitelistInfo.value?.length || 0)
})

const showClaimButton = computed(() => {
  return totalTokenAllocation.value > 0 && !loadingSnapshot.value
})

const emptyText = computed(() => {
  return !accountAddress.value ? t('claim.loginToSee') : t('claim.noTokensYet')
})

const hasSeenClaimModal = useLocalStorage('hasSeenClaimModal', false)
const showClaimInfoModal = computed(() => !hasSeenClaimModal.value)

const toggleClaimInfoModal = (val: boolean) => {
  if (!val) {
    hasSeenClaimModal.value = true
  }
}

const buyLingo = () => {
  if (!accountAddress.value) {
    return
  }

  mixpanel.track('Buy Button Clicked', {
    entryPoint: 'claimPage',
  })

  window.open('https://buy.kryptonim.com/lingo', '_blank')
}

onMounted(() => {
  mixpanel.track('Claim Page View')
})

</script>

<template>
  <div class="pb-8 pt-4 md:pt-[88px]">
    <div class="flex max-md:flex-col items-center justify-between mb-3 md:mb-7 relative gap-y-6">
      <h1 class="md:max-w-[256px] text-lavender text-5xl md:text-[56px] leading-10 tracking-[-2.24px] max-md:text-center">
        {{ t('claim.title') }}
      </h1>
      <div
        class="flex justify-between"
        :class="{'md:absolute md:right-0': totalTokenAllocation <= 0 }"
      >
        <div
          v-if="loadingSnapshot"
          class="flex justify-center items-center max-md:h-[149px]"
        >
          <BaseSpinner />
        </div>
        <div v-else>
          <div
            v-if="totalTokenAllocation > 0"
            class="flex justify-between not-odd:flex-row-reverse gap-2"
          >
            <div class="flex flex-col">
              <p class="text-lavender text-5.5xl leading-tightest tracking-tighter self-end mb-2 select-none">
                {{ formatNumberToUS(totalClaimableBalance) }}
              </p>
              <span class="text-light1 text-xl leading-8 tracking-[-0.6px]">{{ t('claim.readyToClaim') }}</span>
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
            <GlowButton
              v-if="accountAddress"
              class="min-w-[115px] max-md:order-1"
              :color="EButtonColor.PURPLE"
              @click="buyLingo"
            >
              {{ t('claim.buyNow') }}
            </GlowButton>
          </div>
        </div>
      </div>
    </div>
    <div class="flex max-md:flex-col justify-center md:justify-between items-center md:mb-7 gap-6">
      <h2 class="text-purple-gray text-xl leading-8 tracking-[-0.6px] max-md:text-center max-md:order-2 min-h-[46px]">
        {{ t('claim.allocationDetails') }}
      </h2>
      <GlowButton
        v-if="showClaimButton"
        class="min-w-[115px] max-md:order-1"
        :color="EButtonColor.BLUE"
        :disabled="Number(formatNumberToUS(totalClaimableBalance)) === 0"
        @click="handleGoToClaim"
      >
        {{ t('claim.claim') }}
      </GlowButton>
    </div>
    <ClaimBalanceBoxes class="mb-2" />
    <div
      v-if="totalAllocationTypes > 0"
      class="flex items-center justify-between mb-2"
    >
      <span class="text-purple-gray text-sm font-semibold leading-8 opacity-[0.64]">{{ t('claim.description') }}</span>
      <span class="text-purple-gray text-sm font-semibold leading-8 opacity-[0.64]">{{ t('claim.totalAmount') }}</span>
    </div>
    <div
      v-if="totalAllocationTypes > 0"
      class="flex flex-col gap-1"
    >
      <div
        v-for="(value, key) in allocationTypes"
        :key="key"
        class="flex justify-between items-center p-4 [background:rgba(20,20,31,0.56)] shadow-[0px_0px_48px_-16px_#1C1C29_inset] backdrop-blur-lg rounded-2xl"
      >
        <div class="text-purple-gray text-xl leading-6 tracking-[-0.6px]">
          {{ formatCamelCase(beneficiaryNames[key]) }}
        </div>
        <div class="flex items-center gap-2 text-light1 text-right text-xl leading-6 tracking-[-0.6px]">
          <span>{{ formatNumberToUS(value) }}</span>
          <InlineSvg
            :src="pointsIcon"
            width="24"
            height="24"
          />
        </div>
      </div>
      <div
        v-for="(value, key) in availableIslandTokens"
        :key="key"
        class="flex justify-between items-center p-4 [background:rgba(20,20,31,0.56)] shadow-[0px_0px_48px_-16px_#1C1C29_inset] backdrop-blur-lg rounded-2xl"
      >
        <div class="text-purple-gray text-xl leading-6 tracking-[-0.6px]">
          {{ key }}
        </div>
        <div class="flex items-center gap-2 text-light1 text-right text-xl leading-6 tracking-[-0.6px]">
          <span>{{ formatNumberToUS(value) }}</span>
          <InlineSvg
            :src="pointsIcon"
            width="24"
            height="24"
          />
        </div>
      </div>
      <div
        v-for="info in whitelistInfo"
        :key="info.poolIndex"
        class="flex justify-between items-center p-4 [background:rgba(20,20,31,0.56)] shadow-[0px_0px_48px_-16px_#1C1C29_inset] backdrop-blur-lg rounded-2xl"
      >
        <div class="text-purple-gray text-xl leading-6 tracking-[-0.6px]">
          {{ info.poolName }}
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 text-light1 text-right text-xl leading-6 tracking-[-0.6px]">
            <span>{{ formatNumberToUS(info.dcbAmount) }}</span>
            <InlineSvg
              :src="pointsIcon"
              width="24"
              height="24"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="px-4 py-6">
      <p class="text-sm leading-4 text-[#F1E6FA] opacity-64 font-semibold">
        {{ t('claim.importantNotice') }}
      </p>
    </div>
    <ClaimInfoModal
      :model-value="showClaimInfoModal"
      @update:model-value="toggleClaimInfoModal"
    />
  </div>
</template>