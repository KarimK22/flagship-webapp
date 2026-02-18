<script setup lang="ts">
import { useTranslation } from '@/composables/use-i18n'
import FormStakeBase from '@/components/staking-view/stake-flow/FormStakeBase.vue'
import { TRANSACTION_TYPE } from '@/types/staking'

const { t } = useTranslation()
</script>

<template>
  <FormStakeBase
    :transaction-type="TRANSACTION_TYPE.STAKE"
    :title="t('components.newStake.title')"
    :confirm-title="t('components.newStake.confirmTitle')"
  />
</template>

<style scoped></style>
