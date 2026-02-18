<template>
  <BaseModal
    :model-value="showAirdropClaimCardModal"
    class="p-0"
    @update:model-value="handleValueChange"
  >
    <div
      v-if="airdrop"
      class="bg-dark2 text-white py-4 px-2 rounded-2xl relative overflow-hidden sm:w-[420px] min-h-[584px] flex flex-col bg-contain bg-top bg-no-repeat"
      :style="{ backgroundImage: `url(${airdropImage})` }"
    >
      <div class="min-h-[389px] flex flex-col">
        <div class="flex items-center gap-2 mt-2 select-none mx-2">
          <div class="text-purple-gray text-xl leading-8 -tracking-[0.6px]">
            {{ t('components.airdropClaimCardModal.claimYourAirdrop') }}
          </div>
        </div>
        <h1 class="text-lavender text-[32px] font-medium leading-8 -tracking-[1.28px] mx-2">
          {{ airdrop.name }}
        </h1>
      </div>
      <div class="w-full">
        <div
          v-if="airdrop.claimingInstructions"
          class="[background:linear-gradient(180deg,rgba(20,20,31,0.00)_0%,#262638_100%)] rounded-2xl p-2"
        >
          <div class="flex items-center justify-start">
            <p class="text-base font-semibold text-lavender tracking-[0.16px]">
              {{ t('components.airdropClaimCardModal.airdropClaimInstructions') }}
            </p>
          </div>
          <div
            class="text-purple-gray text-sm font-semibold leading-4 tracking-[-0.28px] my-2 description-content whitespace-pre-wrap"
            v-html="airdrop.claimingInstructions"
          />
        </div>
      </div>
      <div class="mt-4 mb-3 mx-5">
        <GlowButton
          class="w-full"
          :color="EButtonColor.BLUE"
          @click="handleClick"
        >
          {{ t('components.airdropClaimCardModal.claimNow') }}
        </GlowButton>
      </div>
    </div>
  </BaseModal>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import backgroundImage from '@/assets/images/dummies/raffle-card-test.png'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import { EButtonColor } from '@/types/shared/button.ts'
import { useAirdrops } from '@/composables/airdrops.ts'
import { useWalletConnect } from '@/composables/wallet/use-wallet-connect'
import { useGetMe } from '@/composables/get-me'

const { t } = useI18n()
const { clickedAirdrop: airdrop, showAirdropClaimCardModal, handleClaimAirdrop } = useAirdrops()
const { accountAddress } = useGetMe()
const { connect } = useWalletConnect()
const handleClick = () => {
  if (accountAddress.value && airdrop.value) {
    if (airdrop.value.claimUrl) {
      window.open(airdrop.value.claimUrl, '_blank')
    }
    handleClaimAirdrop(airdrop.value)
    showAirdropClaimCardModal.value = false
    return
  }

  connect()
}

const handleValueChange = (val: boolean) => {
  showAirdropClaimCardModal.value = val
}

const airdropImage = computed(() => {
  return airdrop.value?.imageUrl || backgroundImage
})
</script>

<style scoped>

</style>