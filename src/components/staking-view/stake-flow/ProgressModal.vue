<template>
  <div>
    <BaseModal
      :model-value="modelValue"
      class="p-4 gap-0 !rounded-2xl w-[96vw] md:w-[420px] !max-w-[none] max-h-[96vh] md:max-h-[90%] h-auto"
      description="LINGO Staked"
      @update:model-value="cancel"
    >
      <!-- Content (with higher z-index) -->
      <template #header>
        <div class="relative z-10 h-full pr-20 text-left">
          <h1 class="text-lavender text-[32px] leading-10 font-normal tracking-[-1.28px] select-none">
            {{ isEmbeddedAccount ? t('components.progressModal.processingAction') : t('components.progressModal.confirmWithWallet') }}
          </h1>
        </div>
      </template>
      <template #description>
        <div class="w-full pt-0">
          <ol class="space-y-1">
            <li
              v-for="step in steps"
              :key="step.label"
              class="p-4 bg-linear-180 from-[rgba(20,_20,_31,_0.32)] to-[#1C1C29] rounded-full flex justify-between items-center"
            >
              <span class="text-purple-gray text-[20px] leading-5 tracking-[-0.6px]">{{ step.label }}</span>
              <div class="flex items-center">
                <InlineSvg
                  v-if="step.status?.success"
                  :src="successIcon"
                  class="size-6"
                />
                <InlineSvg
                  v-else-if="step.status?.loading"
                  class="animate-[spin_2s_linear_infinite_reverse] size-6"
                  :src="loaderIcon"
                />
              </div>
            </li>
          </ol>
        </div>
      </template>
      <template #footer>
        <div class="p-8 pt-0 w-full" />
      </template>
    </BaseModal>
  </div>
</template>
<script setup lang="ts">
import { useTranslation } from '@/composables/use-i18n'
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import loaderIcon from '@/assets/icons/loader.svg'
import successIcon from '@/assets/icons/checkmark-small.svg'
import InlineSvg from 'vue-inline-svg'
import { status, transactionError, useStatus } from '@/composables/contracts/status'
import { computed, ref, watch } from 'vue'
import { TRANSACTION_TYPE } from '@/types/staking'
import { beneficiaryNames } from '@/types/beneficiary.ts'
import { useBalance } from '@/composables/contracts/balance.ts'
import { useAppKitAccount } from '@reown/appkit/vue'
import { useClaimCustom } from '@/composables/contracts/claim-custom.ts'
import { useInvestorsKOL } from '@/composables/contracts/claim-investorsKOL.ts'

const { t } = useTranslation()

const props = defineProps<{
	modelValue: boolean
	transactionType: TRANSACTION_TYPE
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void
}>()

const { updateStatus } = useStatus()
const { claimableAllocationTypes } = useBalance()
const { value: account } = useAppKitAccount()
const { releasablePools } = useInvestorsKOL()

// Take a snapshot of releasablePools when the modal opens
const releasablePoolsSnapshot = ref(releasablePools.value)

// Update snapshot when modal opens
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    releasablePoolsSnapshot.value = releasablePools.value
  }
})

const isEmbeddedAccount = computed(() => {
  return !!account?.embeddedWalletInfo
})

const formatCamelCase = (str: string) => {
  return str.replace(/([A-Z])/g, ' $1').trim()
}

const cancel = (val: boolean) => {
  /* Clear the status */
  transactionError.value = {
    text: null,
    value: null,
  }
  updateStatus(props.transactionType, 'global', { loading: false, success: false, error: false })

  emit('update:modelValue', val)
}

const steps = computed(() => {
  if (isEmbeddedAccount.value) {
    return [
      {
        label: t('components.progressModal.justAMoment'),
        status: status.waitForTransaction.global,
      },
    ]
  }
  switch (props.transactionType) {
  case TRANSACTION_TYPE.STAKE:
    return [
      {
        label: t('components.progressModal.approveContractToStake'),
        status: status.approveStaking.global,
      },
      {
        label: t('components.progressModal.confirmStaking'),
        status: status.stake.global,
      },
    ]
  case TRANSACTION_TYPE.RENEW:
    return [
      {
        label: t('components.progressModal.confirmClaiming'),
        status: status.unstake.global,
      },
      {
        label: t('components.progressModal.approveContractToStake'),
        status: status.approveStaking.global,
      },
      {
        label: t('components.progressModal.confirmStaking'),
        status: status.renew.global,
      },
    ]
  case TRANSACTION_TYPE.UNSTAKE:
    return [
      {
        label: t('components.progressModal.confirmClaiming'),
        status: status.unstake.global,
      },
    ]
  case TRANSACTION_TYPE.CLAIM_APY:
  case TRANSACTION_TYPE.CLAIM_TOKENS: {
    let claimSteps = []
    if (props.transactionType === TRANSACTION_TYPE.CLAIM_APY) {
      claimSteps.push({
        label: t('components.progressModal.claimAPY'),
        status: status[props.transactionType].global,
      })
    } else {
      claimSteps = Object.keys(claimableAllocationTypes.value || {}).map((key) => ({
        label: `${t('components.progressModal.claim')} (${formatCamelCase(beneficiaryNames?.[key] || '')})`,
        status: status[props.transactionType][key],
      }))

      if (totalCustomClaimableBalance.value > 0) {
        claimSteps.push({
          label: `${t('components.progressModal.claim')} ${islandTokensLabel.value}`,
          status: status['claimCustom'].global,
        })
      }

      // Add steps for each pool with releasable amount using the snapshot
      releasablePoolsSnapshot.value.forEach((pool) => {
        claimSteps.push({
          label: `${t('components.progressModal.claim')} ${pool.name}`,
          status: status['claimInvestorsKOL'][pool.index.toString()],
        })
      })
    }

    return claimSteps
  }
  case TRANSACTION_TYPE.CLAIM_AND_STAKE:
  case TRANSACTION_TYPE.CLAIM_AND_STAKE_APY: {
    let claimSteps = []
    if (props.transactionType === TRANSACTION_TYPE.CLAIM_AND_STAKE_APY) {
      claimSteps = [{
        label: t('components.progressModal.claimAndStakeAPY'),
        status: status[props.transactionType].global,
      }]
    } else {
      claimSteps = Object.keys(claimableAllocationTypes.value || {}).map((key) => ({
        label: `${t('components.progressModal.claimAndStake')} (${formatCamelCase(beneficiaryNames?.[key] || '')})`,
        status: status[props.transactionType][key],
      }))

      if (totalCustomClaimableBalance.value > 0) {
        claimSteps.push({
          label: `${t('components.progressModal.claimAndStake')} ${islandTokensLabel.value}`,
          status: status['claimAndStakeCustom'].global,
        })
      }

      // Add steps for each pool with releasable amount using the snapshot
      releasablePoolsSnapshot.value.forEach((pool) => {
        claimSteps.push({
          label: `${t('components.progressModal.claimAndStake')} ${pool.name}`,
          status: status['claimAndStakeInvestorsKOL'][pool.index.toString()],
        })
      })

    }
    return [
      {
        label: t('components.progressModal.approveContractToStake'),
        status: status.approveStaking.global,
      },
      ...claimSteps,
    ]
  }
  default:
    return []
  }
})
const { totalCustomClaimableBalance, availableIslandTokens } = useClaimCustom()
const islandTokensAllocationTypes = computed(() => Object.keys(availableIslandTokens.value))

const islandTokensLabel = computed(() => {
  return islandTokensAllocationTypes.value[0] + (islandTokensAllocationTypes.value.length > 1 ? ` and ${islandTokensAllocationTypes.value[1]}` : '')
})
</script>
