<template>
  <div class="flex flex-col gap-4 w-[90vw] md:w-[388px]">
    <h2 class="text-light1 text-[32px] leading-7 tracking-[-1.28px]">
      {{ t('components.stakeConfirm.success') }}
    </h2>
    <div class="relative">
      <h1 class="text-light1 font-medium text-[45px] leading-10 tracking-[-2.25px]" v-html="t('components.stakeConfirm.activateLingoPass')">
      </h1>
      <h1 class="text-light1 font-medium flare text-[45px] leading-10 tracking-[-2.25px]" v-html="t('components.stakeConfirm.activateLingoPass')">
      </h1>
    </div>
    <span class="text-lavender text-xl leading-5 tracking-[-0.8px] pt-1 pb-2" v-html="t('components.stakeConfirm.oneStepToGo') + t('components.stakeConfirm.approveHolding')">
    </span>

    <div class="flex justify-center">
      <div class="p-4 pt-0 w-full flex justify-center mt-4">
        <GlowButton
          :color="EButtonColor.BLUE"
          class="w-full"
          :disabled="loadingMyStakes || loadingTokenBalance"
          @click="handleStake"
        >
          <span>
            {{ t('components.stakeConfirm.continueToActivate') }}
          </span>
        </GlowButton>
      </div>
    </div>
  </div>
  <ProgressModal
    :model-value="showProgressModal"
    :transaction-type="TRANSACTION_TYPE.STAKE"
    @update:model-value="showProgressModal = false"
  />
  <ResultModal
    v-model="showResultModal"
    :transaction-type="TRANSACTION_TYPE.STAKE"
    @retry-transaction="handleStake"
  />
</template>

<script setup lang="ts">
import { EUpsellSteps, LOCK_DURATION_ID, TRANSACTION_TYPE } from '@/types/staking'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import { useStaking } from '@/composables/contracts/staking'
import { useStakes } from '@/composables/contracts/stakes'
import { useBalance } from '@/composables/contracts/balance'
import { onMounted, ref, watch } from 'vue'
import { status } from '@/composables/contracts/status'
import ProgressModal from '@/components/staking-view/stake-flow/ProgressModal.vue'
import ResultModal from '@/components/staking-view/stake-flow/ResultModal.vue'
import { computed } from 'vue'
import { useUpsellModals } from '@/composables/upsell-modals'
import router from '@/router'
import { LingoRouteName } from '@/router/routes'
import mixpanel from 'mixpanel-browser'
import { useTranslation } from '@/composables/use-i18n'

const { t } = useTranslation()
const { loadingTokenBalance, tokenBalanceAsString: userBalance, refetch: refetchBalance } = useBalance()
const { loadingMyStakes, refetchMyStakes } = useStakes()
const { stake: doStake } = useStaking()
const { upsellStep } = useUpsellModals()
const showProgressModal = ref(false)
const showResultModal = ref(false)

function handleStake() {
  if (!userBalance.value) {
    return
  }

  mixpanel.track('Staking Confirmed')

  return doStake(userBalance.value, LOCK_DURATION_ID.TWELVE_MONTHS)
}

const stakeStatus = computed(() => {
  const { global: currentGlobalStatus } = status.stake
  const { global: waitForTransactionGlobalStatus } = status.waitForTransaction

  return {
    success: currentGlobalStatus?.success || waitForTransactionGlobalStatus?.success,
    error: currentGlobalStatus?.error || waitForTransactionGlobalStatus?.error,
    loading: currentGlobalStatus?.loading || waitForTransactionGlobalStatus?.loading,
  }
})

watch(stakeStatus, (stakeStatus) => {
  showProgressModal.value = Boolean(stakeStatus.loading)
  if (stakeStatus.success) {
    mixpanel.track('Staking Done')
    refetchBalance()
    refetchMyStakes().then(() => {
      showResultModal.value = false
      showProgressModal.value = false
      upsellStep.value = EUpsellSteps.STAKE_SUCCESS
      router.push({ name: LingoRouteName.HOME, query: { fs_continue: 'true', fs_step: EUpsellSteps.STAKE_SUCCESS } })
    })
  }

  if (stakeStatus.error) {
    console.log('stakeStatus.error', stakeStatus.error)
    showResultModal.value = true
    showProgressModal.value = false
  }
})

onMounted(() => {
  mixpanel.track('Buy Lingo Done')
})
</script>

<style>
.flare {
  width: 100%;
  position: absolute;
  filter: blur(4px);
  overflow: hidden;
  top: 0px;
  left: 0px;
  background: radial-gradient(104.64% 67.93% at 115.38% 32.81%, #F1E6FA 0%, rgba(241, 230, 250, 0.00) 100%);
  background-clip: text;
  color: transparent;
  transition: all 0.3s;
  mix-blend-mode: plus-lighter;
  pointer-events: none;
}
</style>
