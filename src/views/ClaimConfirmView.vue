<template>
  <div class="pb-8 pt-4 md:pt-[88px]">
    <ClaimHeader
      :title="title"
      :show-claimable-balance="!isConfirmStep"
      :claim-id="claimId"
      :is-a-p-y="isAPY"
    />
    <ClaimForm
      :title="title"
      :confirm-title="confirmTitle"
      :transaction-type="transactionType"
      :claim-id="claimId"
      :is-a-p-y="isAPY"
      @confirm="isConfirmStep = true"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTranslation } from '@/composables/use-i18n'
import { TRANSACTION_TYPE } from '@/types/staking.ts'
import ClaimHeader from '@/components/claiming/ClaimHeader.vue'
import ClaimForm from '@/components/claiming/ClaimForm.vue'

const { t } = useTranslation()
const route = useRoute()
const claimId = route.query.claimId as string
const isAPY = route.query.apy === 'true'
const claimType = route.query.type as 'extra' | 'instant'
const isConfirmStep = ref(claimType === 'instant')

const transactionType = computed(() => {
  if (isAPY) {
    return claimType === 'instant' ? TRANSACTION_TYPE.CLAIM_APY : TRANSACTION_TYPE.CLAIM_AND_STAKE_APY
  }
  return claimType === 'instant' ? TRANSACTION_TYPE.CLAIM_TOKENS : TRANSACTION_TYPE.CLAIM_AND_STAKE
})

const confirmTitle = computed(() => {
  return isConfirmStep.value && claimType === 'extra' ? t('views.claimConfirm.confirmStaking') : t('views.claimConfirm.confirmClaiming')
})

const title = computed(() => {
  return isConfirmStep.value ? confirmTitle.value : t('views.claimConfirm.claimAndStake')
})
</script>