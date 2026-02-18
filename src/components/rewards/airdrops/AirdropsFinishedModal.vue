<template>
  <BaseModal
    :model-value="showAirdropFinishedModal"
    class="p-0"
    @update:model-value="handleValueChange"
  >
    <div
      v-if="airdrop"
      class="bg-dark2 rounded-2xl px-2 pt-6 pb-0 relative transition-all duration-300"
    >
      <div class="space-y-3 mx-2">
        <div class="flex items-center gap-2 transition-all duration-300">
          <p class="text-xl text-purple-gray leading-8 -tracking-[0.6px] transition-all duration-300">
            {{ $t('components.airdropsFinishedModal.endedOn', { date: formattedEndDate }) }}
          </p>
        </div>
        <h3 class="text-lavender text-[32px] leading-8 -tracking-[1.28px] font-medium transition-all duration-300">
          {{ airdrop.name }}
        </h3>
        <div class="flex items-center gap-2 transition-all duration-500">
          <div class="size-[96px] rounded-2xl overflow-hidden border border-background/[88%] mix-blend-plus-lighter flex items-center justify-center transition-all duration-300 hover:border-lavender/50">
            <img
              :src="airdrop.imageUrl"
              :alt="airdrop.name"
              class="object-contain object-center inset-0 transition-transform duration-500 hover:scale-110"
            >
          </div>
          <div class="flex flex-col">
            <div
              v-if="airdrop.prizeAmount"
              class="flex flex-col items-center transition-all duration-300"
            >
              <p class="text-purple-gray text-xl font-normal leading-8 tracking-[-0.6px]">
                {{ airdrop.prizeName }}
              </p>
              <p class="text-lavender text-5xl font-medium leading-10 tracking-[-2.4px]">
                {{ airdrop.prizeAmount }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="airdrop.condition"
        class="[background:linear-gradient(180deg,rgba(20,20,31,0.00)_0%,#262638_100%)] rounded-2xl p-2"
      >
        <div class="flex items-center justify-between">
          <p class="text-base font-semibold text-lavender tracking-[0.16px]">
            {{ $t('components.airdropsFinishedModal.eligibilityCriteria') }}
          </p>
          <div class="bg-dark3 text-lavender text-sm leading-6 font-semibold rounded-[80px] px-2 whitespace-nowrap -tracking-[0.28px]">
            <p class="text-purple-gray">
              <span class="text-light1">{{ formatNumberToUS(eligibleWalletsList.length) }}</span> {{ t('components.airdropsFinishedModal.elegibleWallet', { count: eligibleWalletsList.length }) }}
            </p>
          </div>
        </div>
        <p class="text-purple-gray text-sm font-semibold leading-4 tracking-[-0.28px] my-2">
          {{ airdrop.condition }}
        </p>
      </div>

      <div
        class="mt-4 animate-fadeIn"
        style="animation-delay: 0.2s;"
      >
        <div class="flex items-center justify-between gap-2 mx-2 transition-all duration-300 mb-4">
          <h3 class="text-base text-lavender tracking-[0.16px] font-semibold transition-all duration-300">
            {{ t('components.airdropsFinishedModal.eligibleWallets') }}
          </h3>
          <div
            v-if="accountAddress"
            class="transition-all duration-500"
          >
            <BalanceBadge
              v-if="isEligibleForAirdrop(airdrop)"
              color="#5EB851"
              class="bg-[#5EB851]/[12%]"
            >
              {{ t('components.airdropsFinishedModal.youQualified') }}
            </BalanceBadge>
            <BalanceBadge
              v-else
              color="#FF7847"
              class="bg-[#FF7847]/[12%]"
            >
              {{ t('components.airdropsFinishedModal.youDidntQualify') }}
            </BalanceBadge>
          </div>
        </div>
        <div class="relative mx-2 h-[334px]">
          <Transition
            name="fade"
            mode="out-in"
          >
            <div
              v-if="loadingEligibleWallets"
              class="flex justify-center p-6"
            >
              <BaseSpinner class="animate-spin-slow" />
            </div>
            <div
              v-else
              class="h-full overflow-y-auto pb-20"
            >
              <TransitionGroup
                name="list"
                tag="div"
                class="space-y-0.5"
              >
                <div
                  v-for="(wallet, index) in eligibleWalletsList"
                  :key="wallet"
                  class="text-purple-gray text-sm leading-8 font-semibold flex items-center justify-between py-1 pl-2 pr-4 bg-dark3/[56%] shadow-[inset_0px_-4px_16px_-2px_rgba(222,206,235,0.20)] backdrop-blur-sm rounded-[80px] transition-all duration-300 hover:bg-dark3/[76%]"
                  :style="{ animationDelay: `${index * 0.05}s` }"
                >
                  <span
                    :class="{ 'text-light1' : wallet === accountAddress }"
                    class="transition-all duration-300"
                  >{{ formatWalletAddress(wallet.toString()) }}</span>
                  <span
                    v-if="wallet === accountAddress"
                    class="text-lavender transition-all duration-300 animate-pulse-subtle"
                  >{{ t('components.airdropsFinishedModal.you') }}</span>
                </div>
              </TransitionGroup>
            </div>
          </Transition>
          <div class="absolute inset-x-0 bottom-0 h-[130px] bg-gradient-to-t from-dark2 to-transparent pointer-events-none transition-opacity duration-300" />
        </div>
      </div>

      <div
        class="absolute bottom-6 left-8 right-8 transition-all duration-500 animate-slideUp"
        style="animation-delay: 0.4s;"
      >
        <GlowButton
          :color="EButtonColor.BLUE"
          class="w-full transition-all duration-300 hover:scale-[1.02]"
          @click="handleValueChange(false)"
        >
          {{ t('components.airdropsFinishedModal.gotIt') }}
        </GlowButton>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import BalanceBadge from '@/components/user-balance/BalanceBadge.vue'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import { computed, ref } from 'vue'
import { DateTime } from 'luxon'
import { formatNumberToUS, formatWalletAddress } from '@/composables/helpers.ts'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button.ts'
import { useAirdrops } from '@/composables/airdrops.ts'
import { useGetMe } from '@/composables/get-me'
import { useTranslation } from '@/composables/use-i18n'

const { clickedAirdrop: airdrop, showAirdropFinishedModal, isEligibleForAirdrop } = useAirdrops()
const { accountAddress } = useGetMe()
const loadingEligibleWallets = ref(false)
const { t } = useTranslation()

const eligibleWalletsList = computed(() => {
  return airdrop.value?.wallets || []
})

const handleValueChange = (val: boolean) => {
  showAirdropFinishedModal.value = val
}

const formattedEndDate = computed(() => {
  return airdrop.value?.endDate ? DateTime.fromISO(airdrop.value.endDate)
    .toFormat('dd LLL yyyy')
    .toLowerCase()
    : t('components.airdropsFinishedModal.comingSoon')
})

</script>

<style scoped>
/* Enhanced fade transition */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
	transform: translateY(10px);
}

/* Enhanced list transitions */
.list-move,
.list-enter-active,
.list-leave-active {
	transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.list-enter-from,
.list-leave-to {
	opacity: 0;
	transform: translateY(30px);
}

/* Custom animations */
@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes slideIn {
	from {
		opacity: 0;
		transform: translateX(-20px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}

@keyframes slideUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes pulse-subtle {
	0% {
		opacity: 1;
	}
	50% {
		opacity: 0.8;
	}
	100% {
		opacity: 1;
	}
}

@keyframes spin-slow {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

.animate-fadeIn {
	animation: fadeIn 0.8s ease-out forwards;
	opacity: 0;
	animation-fill-mode: forwards;
}

.animate-slideIn {
	animation: slideIn 0.8s ease-out forwards;
	opacity: 0;
	animation-fill-mode: forwards;
}

.animate-slideUp {
	animation: slideUp 0.8s ease-out forwards;
	opacity: 0;
	animation-fill-mode: forwards;
}

.animate-pulse-subtle {
	animation: pulse-subtle 2s infinite ease-in-out;
}

.animate-spin-slow {
	animation: spin-slow 1.5s linear infinite;
}

/* Hover effects */
:deep(.base-button) {
	transition: all 0.3s ease;
}

:deep(.base-button:hover) {
	box-shadow: 0 0 15px rgba(88, 88, 245, 0.3);
}

:deep(.base-button:active) {
	transform: scale(0.98);
}

/* Badge transitions */
:deep(.balance-badge) {
	transition: all 0.3s ease;
}

:deep(.balance-badge:hover) {
	transform: scale(1.05);
}
</style>