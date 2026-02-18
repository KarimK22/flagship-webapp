<script setup lang="ts">
import { useTranslation } from '@/composables/use-i18n'
import FormStakeBase from '@/components/staking-view/stake-flow/FormStakeBase.vue'
import { useStakes } from '@/composables/contracts/stakes'
import { TRANSACTION_TYPE } from '@/types/staking'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const { t } = useTranslation()

const route = useRoute()
const stakeId = route.params.id

const { myStakesList } = useStakes()
const stake = computed(() => myStakesList.value.find((stake) => stake.id === stakeId))
</script>

<template>
  <FormStakeBase
    :stake="stake"
    :transaction-type="TRANSACTION_TYPE.UNSTAKE"
    :title="t('components.claimStake.title')"
    :confirm-title="t('components.claimStake.confirmTitle')"
  />
</template>

<style scoped></style>
