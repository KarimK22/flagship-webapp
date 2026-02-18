<template>
  <BaseModal
    :model-value="modelValue"
    class="p-0 rounded-2xl"
    @update:model-value="(val: boolean) => emit('update:modelValue', val)"
  >
    <div
      class="bg-dark2 text-white px-4 py-6 rounded-2xl relative overflow-hidden sm:w-[420px] h-[640px] flex flex-col bg-cover bg-center transition-all duration-500"
      :style="{ backgroundImage: `url(${prizeImage || wonPrize?.imageUrl})` }"
    >
      <!-- Content (with higher z-index) -->
      <div class="relative z-10 flex flex-col h-full">
        <!-- BaseHeader Section -->
        <div class="text-purple-gray text-xl leading-8 -tracking-[0.6px] select-none transition-all duration-300 animate-fadeIn">
          {{ $t('components.raffleWonModal.congratulations') }}
        </div>

        <!-- Title Section -->
        <div class="mb-8 transition-all duration-500 animate-slideUp">
          <h2 class="text-lavender text-5xl leading-10 font-medium -tracking-[2.4px] mb-2 transition-all duration-300">
            {{ prizeTitle }}
          </h2>
        </div>

        <!-- Claim -->
        <template v-if="wonPrize">
          <Transition
            name="fade"
            mode="out-in"
            appear
          >
            <WheelWonModalVouchersContent
              v-if="wonPrize.prize.type === 'Voucher'"
              :voucher-code="voucherCode"
              class="transition-all duration-300"
              @hide="emit('update:modelValue', false)"
            />
            <RaffleWonModalPhysicalContent
              v-else-if="wonPrize.prize.type === 'Physical'"
              raffle-id="1"
              :prize-submitted-data="null"
              hide-winners-button
              do-not-require-claim
              class="transition-all duration-300"
              @hide="emit('update:modelValue', false)"
              @show-all-winners="showWinnersModal = true"
            />
          </Transition>
        </template>
      </div>
    </div>
  </BaseModal>
</template>
<script setup lang="ts">
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import RaffleWonModalPhysicalContent from '@/components/rewards/raffles/raffles-won/RaffleWonModalPhysicalContent.vue'
import { ref } from 'vue'
import WheelWonModalVouchersContent from './WheelWonModalVouchersContent.vue'

type PrizeLike = {
  prize: { type: string }
  imageUrl: string
}

defineProps<{
    modelValue: boolean
    prizeImage?: string
    prizeTitle?: string
    wonPrize?: PrizeLike
  voucherCode?: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()

const showWinnersModal = ref(false)
</script>

<style scoped>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
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

.animate-fadeIn {
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-slideUp {
  animation: slideUp 0.8s ease-out forwards;
  animation-delay: 0.2s;
  opacity: 0;
  animation-fill-mode: forwards;
}

/* Button hover effects */
:deep(.base-button) {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

:deep(.base-button:hover) {
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
}

:deep(.base-button:active) {
  transform: scale(0.98);
}

/* Background image transition */
.bg-cover {
  transition: transform 10s ease-in-out;
}

.bg-cover:hover {
  transform: scale(1.05);
}
</style>

