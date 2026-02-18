<template>
  <BaseModal
    :model-value="modelValue"
    class="p-0"
    @update:model-value="(val: boolean) => emit('update:modelValue', val)"
  >
    <div class="bg-dark2 rounded-2xl px-2 pt-6 pb-0 relative transition-all duration-300">
      <div class="space-y-3 mx-2">
        <div class="flex items-center gap-2 transition-all duration-300">
          <BalanceBadge
            color="#5858F5"
            class="z-10 bg-sosiska/[24%] transition-all duration-300 hover:scale-105"
          >
            {{ formatNumberToUS(raffle.metadata.ticketsCount) }} {{ $t('components.raffleWinnersModal.entries') }}
          </BalanceBadge>
          <h2 class="text-xl text-purple-gray leading-8 -tracking-[0.6px] transition-all duration-300">
            {{ $t('components.raffleWinnersModal.raffleResult') }}
          </h2>
        </div>
        <div class="flex items-center gap-2 transition-all duration-500">
          <div class="size-[96px] rounded-2xl overflow-hidden border border-background/[88%] mix-blend-plus-lighter flex items-center justify-center transition-all duration-300 hover:border-lavender/50">
            <img
              :src="raffle.imageUrl"
              :alt="raffle.title"
              class="object-contain object-center inset-0 transition-transform duration-500 hover:scale-110"
            >
          </div>
          <div class="flex flex-col">
            <h3 class="text-lavender text-[32px] leading-8 -tracking-[1.28px] font-medium transition-all duration-300">
              {{ raffle.title }}
            </h3>
            <div class="flex items-center gap-2 flex-wrap transition-all duration-300">
              <div class="bg-purple-gray text-lavender text-sm leading-6 font-semibold rounded-[80px] px-2 whitespace-nowrap transition-all duration-300 hover:bg-purple-gray/90">
                <span>{{ formatNumberToUS(raffle.metadata.participantsCount) }} {{ $t('components.raffleWinnersModal.participants') }}</span>
              </div>
              <p class="text-xl leading-8 -tracking-[0.6px] text-purple-gray whitespace-nowrap transition-all duration-300">
                {{ formattedEndDate }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        class="mt-4 animate-fadeIn"
        style="animation-delay: 0.2s;"
      >
        <div class="flex items-center justify-between gap-2 mx-2 transition-all duration-300">
          <h3 class="text-base text-lavender tracking-[0.16px] font-semibold mb-4 transition-all duration-300">
            {{ $t('components.raffleWinnersModal.winners') }}
          </h3>
          <div class="transition-all duration-500">
            <BalanceBadge
              v-if="userWon(raffle)"
              color="#5EB851"
              class="bg-[#5EB851]/[12%] transition-all duration-300 animate-pulse-subtle"
            >
              {{ $t('components.raffleWinnersModal.youWon', { prize: wonPrizeName }) }}
            </BalanceBadge>
            <BalanceBadge
              v-else-if="userLost(raffle)"
              color="#FF7847"
              class="bg-[#FF7847]/[12%] transition-all duration-300"
            >
              {{ $t('components.raffleWinnersModal.youDidntWin') }}
            </BalanceBadge>
            <BalanceBadge
              v-else-if="!userParticipationStatus(raffle)"
              color="#6D6D8F"
            >
              {{ $t('components.raffleWinnersModal.youDidntParticipate') }}
            </BalanceBadge>
          </div>
        </div>
        <div class="relative mx-2 h-[334px]">
          <Transition
            name="fade"
            mode="out-in"
          >
            <div
              v-if="fetchingRaffleWinners"
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
                  v-for="(winner, index) in raffleWinners"
                  :key="winner.walletAddress"
                  class="text-purple-gray text-sm leading-8 font-semibold flex items-center justify-between py-1 pl-2 pr-4 bg-dark3/[56%] shadow-[inset_0px_-4px_16px_-2px_rgba(222,206,235,0.20)] backdrop-blur-sm rounded-[80px] transition-all duration-300 hover:bg-dark3/[76%]"
                  :style="{ animationDelay: `${index * 0.05}s` }"
                >
                  <span
                    :class="{ 'text-light1' : winner.walletAddress === accountAddress }"
                    class="transition-all duration-300"
                  >{{ formatWalletAddress(winner.walletAddress.toString()) }}</span>
                  <span
                    v-if="winner.walletAddress === accountAddress"
                    class="ml-2  transition-all duration-300 animate-pulse-subtle"
                  >You</span>
                  <span class="ml-auto transition-all duration-300">{{ prizeName(winner) }}</span>
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
        <div
          v-if="transactionHash"
          class="flex items-center justify-end mb-2"
          @click="goToTransaction"
        >
          <div class="inline-flex items-center gap-2 cursor-pointer justify-end bg-dark1 pl-2 pr-1 rounded-full w-auto">
            <p class="text-purple-gray text-sm leading-6 font-semibold tracking-[0.14px]">
              {{ $t('components.raffleWinnersModal.blockchainProof') }}
            </p>
            <InlineSvg
              :src="eye"
              class="w-4"
            />
          </div>
        </div>
        <GlowButton
          :color="EButtonColor.BLUE"
          class="w-full transition-all duration-300 hover:scale-[1.02]"
          @click="$emit('update:modelValue', false)"
        >
          {{ $t('components.raffleWinnersModal.gotIt') }}
        </GlowButton>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import BalanceBadge from '@/components/user-balance/BalanceBadge.vue'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import { type Raffle, RAFFLE_PRIZE_TYPE, type RaffleStatus, type Winner } from '@/services/api.ts'
import { useRaffleWinners } from '@/composables/raffle-winners.ts'
import { useRaffles } from '@/composables/raffles.ts'
import { computed, watch } from 'vue'
import { DateTime } from 'luxon'
import { formatNumberToUS, formatWalletAddress } from '@/composables/helpers.ts'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button.ts'
import eye from '@/assets/icons/eye.svg'
import { env } from '@/env.ts'
import { PRIZE_TYPE } from '@/types/shared/raffle-prize.ts'
import { useGetMe } from '@/composables/get-me'

const props = defineProps<{
    modelValue: boolean
    raffle: Raffle
    participantsCount: number
		wonPrize?: RaffleStatus['wonPrizeV2']
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()

const { accountAddress } = useGetMe()

const raffleId = computed(() => props.raffle.id)
const { raffleWinners, refetchRaffleWinners, fetchingRaffleWinners } = useRaffleWinners(raffleId)
const { userWon, userLost, userParticipationStatus } = useRaffles()

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    refetchRaffleWinners()
  }
})

const formattedEndDate = computed(() => {
  return DateTime.fromISO(props.raffle.concludedAt || props.raffle.endDate)
    .toFormat('LLL dd yyyy · ha')
    .toLowerCase()
})

const transactionHash = computed(() => {
  return props.raffle.metadata.web3Seed?.transactionHash
})

const goToTransaction = () => {
  if (!transactionHash.value) {
    return
  }
  if (env.app.isProd) {
    window.open(`https://basescan.org/tx/${transactionHash.value}`, '_blank')
  } else {
    window.open(`https://sepolia.basescan.org/tx/${transactionHash.value}`, '_blank')

  }
}

const prizeName = (winner: Winner) => {
  if (winner.prize.type === PRIZE_TYPE.PHYSICAL){
    return winner.prize.name
  } else {
    return `$${winner.prize.amount} Voucher`
  }
}

const wonPrizeName = computed(() => {
  if (!props.wonPrize) return ''
  if (props.wonPrize.type === RAFFLE_PRIZE_TYPE.PHYSICAL){
    return props.wonPrize.name
  } else if (props.wonPrize.type === RAFFLE_PRIZE_TYPE.VOUCHERS){
    return `$${props.wonPrize.amount} Voucher`
  }
  return ''
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