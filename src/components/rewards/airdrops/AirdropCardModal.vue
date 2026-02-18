<template>
  <BaseModal
    :model-value="showAirdropCardModal"
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
            {{ t('components.airdropCardModal.dontMissOut') }}
          </div>
          <div v-if="accountAddress">
            <BalanceBadge
              color="#3333FF"
              class="bg-[#5EB851]/[12%]"
            >
              {{ t('components.airdropCardModal.walletsEligible', { count: formatNumberToUS(eligibleWallets) }) }}
            </BalanceBadge>
          </div>
        </div>
        <h1
          class="text-lavender text-[32px] font-medium leading-8 -tracking-[1.28px] mx-2"
        >
          {{ airdrop.name }}
        </h1>
        <div
          v-if="airdrop.prizeAmount"
          class="mx-2 mt-auto w-full mb-2"
        >
          <p
            class="text-purple-gray text-xl font-normal leading-8 tracking-[-0.6px]"
          >
            {{ airdrop.prizeName }}
          </p>
          <p
            class="text-lavender text-5xl font-medium leading-10 tracking-[-2.4px]"
          >
            {{ airdrop.prizeAmount }}
          </p>
        </div>
      </div>
      <div class="w-full">
        <div
          v-if="airdrop.description"
          class="[background:linear-gradient(180deg,rgba(20,20,31,0.00)_0%,#262638_100%)] rounded-2xl p-2"
        >
          <div class="flex items-center">
            <p class="text-base font-semibold text-lavender tracking-[0.16px]">
              {{ t('components.airdropCardModal.description') }}
            </p>
          </div>
          <div
            class="text-purple-gray text-sm font-semibold leading-4 tracking-[-0.28px] my-2 description-content whitespace-pre-wrap"
            v-html="airdrop.description"
          />
        </div>
      </div>
      <AirdropEligibleStatus
        v-if="accountAddress"
        :airdrop="airdrop"
      />
      <div
        v-else
        class="mt-4 mb-3 mx-5"
      >
        <GlowButton
          class="w-full"
          :color="EButtonColor.BLUE"
          @click.stop.prevent="connect"
        >
          {{ t('components.airdropCardModal.loginToCheck') }}
        </GlowButton>
      </div>
    </div>
  </BaseModal>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import backgroundImage from '@/assets/images/dummies/raffle-card-test.png'
import BalanceBadge from '@/components/user-balance/BalanceBadge.vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import { formatNumberToUS } from '@/composables/helpers.ts'
import { EButtonColor } from '@/types/shared/button.ts'
import { useAirdrops } from '@/composables/airdrops.ts'
import { useGetMe } from '@/composables/get-me'
import { useWalletConnect } from '@/composables/wallet/use-wallet-connect'
import AirdropEligibleStatus from './AirdropEligibleStatus.vue'
import { useTranslation } from '@/composables/use-i18n'

const { clickedAirdrop: airdrop, showAirdropCardModal } = useAirdrops()

const eligibleWallets = computed(() => {
  return airdrop.value?.wallets.length || 0
})

const { accountAddress } = useGetMe()

const { connect } = useWalletConnect()

const { t } = useTranslation()

const handleValueChange = (val: boolean) => {
  showAirdropCardModal.value = val
}

const airdropImage = computed(() => {
  return airdrop.value?.imageUrl || backgroundImage
})
</script>

<style scoped></style>
