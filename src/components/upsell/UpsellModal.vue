<template>
  <BaseModal
    :model-value="showUpsellModal"
    class="bg-dark1 p-2 pt-4 md:p-4 md:pt-8 gap-0 !rounded-2xl w-[96vw] md:w-auto !max-w-[none] max-h-[96vh] md:max-h-[90%] h-auto"
    @update:model-value="updateModelValue"
  >
    <!-- Content (with higher z-index) -->
    <div class="z-10">
      <component
        :is="upsellSteps[upsellStep].component"
      />
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import { EUpsellSteps } from '@/types/staking'
import SelectAmountToBuy from '@/components/upsell/SelectAmountToBuy.vue'
import StakeConfirm from '@/components/upsell/StakeConfirm.vue'
import StakeSuccess from '@/components/upsell/StakeSuccess.vue'
import { useUpsellModals } from '@/composables/upsell-modals'

const { upsellStep, showUpsellModal } = useUpsellModals()

const updateModelValue = (val: boolean) => {
  showUpsellModal.value = val
}

const upsellSteps = {
  [EUpsellSteps.BUY_SELECTOR]: {
    component: SelectAmountToBuy,
  },
  [EUpsellSteps.BUY_SUCCESS]: {
    component: StakeConfirm,
  },
  [EUpsellSteps.STAKE_SUCCESS]: {
    component: StakeSuccess,
  },
}
</script>
