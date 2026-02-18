<template>
  <BaseModal
    v-model="isOpen"
    :show-close-button="currentState !== 'loading'"
    class="!max-w-[640px] !w-full sm:!w-[640px] !h-auto sm:!h-[760px] !max-h-[95vh] !p-0 !overflow-x-visible !overflow-y-auto sm:!overflow-y-hidden !rounded-2xl"
  >
    <div class="flex flex-col items-center w-full relative z-10">
      <img
        v-if="currentState === 'success'"
        src="@/assets/images/upsell/upsell-background-suc.webp"
        alt=""
        class="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100%-4px)] h-full z-0 pointer-events-none"
      />
      <img
        v-else-if="currentState === 'error'"
        src="@/assets/images/upsell/upsell-background-err.webp"
        alt=""
        class="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100%-4px)] h-full z-0 pointer-events-none"
      />
      <img
        v-else
        src="@/assets/images/upsell/upsell-background.webp"
        alt=""
        class="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100%-4px)] h-full z-0 pointer-events-none"
      />

      <template v-if="currentState !== 'loading'">
        <div class="w-full relative z-10 px-4 sm:px-0">
          <div class="flex justify-center mb-6 sm:mb-8 mt-8 sm:mt-16">
            <img
              src="@/assets/images/upsell/5x.webp"
              alt="5x"
              class="w-[280px] h-[238px] sm:w-[360px] sm:h-[306px] animate-5x-entrance aspect-[20/17]"
            />
          </div>

          <h2
            class="text-lavender text-[32px] sm:text-[56px] font-normal leading-8 sm:leading-[56px] tracking-[-1.28px] sm:tracking-[-2.24px] text-center mb-2 sm:mb-3"
          >
            5x Your Chances to Win!
          </h2>

          <p
            class="text-[#9A9AB8] text-[20px] sm:text-[32px] font-normal leading-6 sm:leading-[40px] tracking-[-0.6px] sm:tracking-[-0.96px] text-center mt-3 sm:mt-4 mb-4 sm:mb-6"
          >
            Multiply your odds to
            <span class="text-lavender font-semibold">{{
              multipliedTickets
            }}</span>
            tickets for just
            <span class="text-lavender font-semibold">{{ price }}USDC</span>
          </p>

          <p
            class="text-[#9A9AB8] text-[14px] sm:text-[20px] font-normal leading-5 sm:leading-6 tracking-[-0.42px] sm:tracking-[-0.6px] text-center mt-6 sm:mt-8 mb-6 sm:mb-8 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2"
          >
            <span>
              You have:
              <span class="text-lavender">{{ totalUserTickets }} tickets</span>
            </span>
            <span class="inline-block">→</span>
            <span>
              Add
              <span class="text-lavender"
                >{{ multipliedTickets }} more tickets</span
              >
            </span>
          </p>

          <div
            class="flex flex-col items-center gap-3 sm:gap-4 mt-8 sm:mt-[62px] relative z-20"
          >
            <div
              v-if="currentState === 'processing'"
              class="w-full flex flex-col items-center justify-center gap-4"
            >
              <div class="relative w-10 h-10">
                <svg
                  class="animate-spin w-full h-full"
                  viewBox="0 0 42 42"
                  fill="none"
                >
                  <defs>
                    <linearGradient
                      id="spinnerGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style="
                          stop-color: rgba(255, 120, 71, 0);
                          stop-opacity: 1;
                        "
                      />
                      <stop
                        offset="50%"
                        style="
                          stop-color: rgba(255, 157, 92, 0.5);
                          stop-opacity: 1;
                        "
                      />
                      <stop
                        offset="100%"
                        style="
                          stop-color: rgba(255, 188, 112, 1);
                          stop-opacity: 1;
                        "
                      />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="21"
                    cy="21"
                    r="19"
                    stroke="url(#spinnerGradient)"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
              <p
                class="text-sm leading-6 text-[#9A9AB8] font-semibold tracking-[0.42px]"
              >
                Loading
              </p>
            </div>

            <template v-else>
              <GlowButton
                :color="getButtonColor"
                class="w-full max-w-[229px] relative z-20"
                @click="handlePrimaryAction"
              >
                {{ primaryButtonText }}
              </GlowButton>

              <button
                v-if="currentState === 'idle'"
                class="w-full max-w-[229px] py-2 mb-6 sm:mb-8 text-[#FF7847] text-sm font-semibold leading-6 tracking-[0.42px] text-center hover:opacity-80 transition-opacity cursor-pointer select-none relative z-20"
                type="button"
                @click="handleDecline"
              >
                No thanks, continue with {{ currentTickets }} tickets
              </button>

              <p
                v-else
                class="text-[#F1E6FA] text-sm font-semibold leading-6 tracking-[0.42px] text-center mb-6 sm:mb-8"
              >
                {{ statusText }}
              </p>
            </template>
          </div>
        </div>
      </template>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import { useRaffleBoost } from '@/composables/contracts/raffle-boost'

type ModalState = 'idle' | 'processing' | 'loading' | 'success' | 'error'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    ticketCount: number
    raffleId: string
    /** User's total ticket count (e.g. after the purchase that opened this modal). When provided, used for display instead of boost offer API to avoid stale/wrong counts. */
    initialUserTickets?: number
    initialState?: ModalState
  }>(),
  {
    modelValue: false,
    ticketCount: 1,
    raffleId: '',
    initialUserTickets: undefined,
    initialState: 'idle',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (
    e: 'boost-accepted',
    data: {
      ticketCount: number
      multipliedTickets: number
      price: number
      txHash?: string
      boostId?: string
    }
  ): void
  (e: 'boost-declined'): void
}>()

const currentState = ref<ModalState>('idle')

// Initialize boost composable
const {
  state: boostState,
  error: boostError,
  executeBoosPurchase,
  fetchBoostOffer,
  boostOffer,
  boostStatus,
  reset: resetBoost,
} = useRaffleBoost()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit('update:modelValue', value)
    if (!value) {
      setTimeout(() => {
        currentState.value = 'idle'
        resetBoost()
      }, 300)
    }
  },
})

const multipliedTickets = computed(() => {
  // User's purchased tickets (from input) * 5
  return props.ticketCount * 5
})

const price = computed(() => {
  if (boostOffer.value && boostOffer.value.pricePerTicketUsd > 0) {
    return props.ticketCount * boostOffer.value.pricePerTicketUsd
  }
  return props.ticketCount * 1.2 // Fallback
})

// Total tickets user has when declining ("No thanks, continue with X tickets")
const currentTickets = computed(() => {
  if (props.initialUserTickets !== undefined && props.initialUserTickets !== null) {
    return props.initialUserTickets
  }
  return boostOffer.value?.currentTickets ?? 0
})

// Total tickets to show: before boost use initialUserTickets or API; after success use initial + multiplied
const totalUserTickets = computed(() => {
  const base = props.initialUserTickets !== undefined && props.initialUserTickets !== null
    ? props.initialUserTickets
    : (boostOffer.value?.currentTickets ?? 0)
  if (currentState.value === 'success') {
    return base + multipliedTickets.value
  }
  return base
})

const getButtonColor = computed(() => {
  if (currentState.value === 'success') return EButtonColor.GREEN
  if (currentState.value === 'error') return EButtonColor.PURPLE
  return EButtonColor.ORANGE
})

const primaryButtonText = computed(() => {
  if (currentState.value === 'success') return 'Continue'
  if (currentState.value === 'error') return 'Try Again'
  return `Boost Now for ${price.value}USDC`
})

const statusText = computed(() => {
  if (currentState.value === 'success') return 'Success!'
  if (currentState.value === 'error' && boostError.value?.toLowerCase().includes('insufficient')) {
    return 'Your balance does not have enough USDC. Please top up your account and click "Try again."'
  }
  return 'Error!'
})

const handlePrimaryAction = () => {
  if (currentState.value === 'success') {
    handleClose()
  } else if (currentState.value === 'error') {
    handleRetry()
  } else {
    handleAccept()
  }
}

const handleAccept = async () => {
  currentState.value = 'processing'

  try {
    const success = await executeBoosPurchase(props.raffleId, props.ticketCount)

    if (success) {
      currentState.value = 'success'
      emit('boost-accepted', {
        ticketCount: props.ticketCount,
        multipliedTickets: multipliedTickets.value,
        price: price.value,
        txHash: boostStatus.value?.txHash,
        boostId: boostStatus.value?.boostId,
      })
    } else {
      currentState.value = 'error'
      console.error('Boost purchase failed:', boostError.value)
    }
  } catch (error) {
    currentState.value = 'error'
    console.error('Boost purchase error:', error)
  }
}

const handleDecline = () => {
  emit('boost-declined')
  isOpen.value = false
}

const handleClose = () => {
  isOpen.value = false
}

const handleRetry = () => {
  currentState.value = 'idle'
  resetBoost()
}

// Load boost offer when modal opens
watch(
  () => props.modelValue,
  async (newValue) => {
    if (newValue) {
      currentState.value = props.initialState

      // Fetch real boost offer if raffleId is provided and state is idle
      if (props.raffleId && props.initialState === 'idle') {
        try {
          await fetchBoostOffer(props.raffleId)
        } catch (error) {
          console.error('Failed to fetch boost offer:', error)
        }
      }
    }
  }
)

// Watch boost state and sync with modal state
watch(
  () => boostState.value,
  (newState) => {
    // Map boost states to modal states
    if (
      newState === 'checking-balance' ||
      newState === 'fetching-offer' ||
      newState === 'initiating' ||
      newState === 'approving' ||
      newState === 'transferring' ||
      newState === 'polling'
    ) {
      currentState.value = 'processing'
    } else if (newState === 'success') {
      currentState.value = 'success'
    } else if (newState === 'error') {
      currentState.value = 'error'
    }
  }
)

// On mount, check for pending boost
onMounted(async () => {
  if (props.raffleId) {
    try {
      await fetchBoostOffer(props.raffleId)
    } catch (error) {
      console.error('Failed to fetch boost offer on mount:', error)
    }
  }
})
</script>

<style scoped>
:deep(.base-modal-content) {
  max-width: 640px !important;
  width: 640px !important;
  height: 760px !important;
  max-height: 95vh !important;
  padding: 0 !important;
  overflow-x: visible !important;
  overflow-y: auto !important;
}

:deep(.base-modal-content::before) {
  pointer-events: none !important;
}

@keyframes scaleAndShake {
  0% {
    transform: rotate(0deg);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  40% {
    transform: rotate(-3deg);
  }
  60% {
    transform: rotate(3deg);
  }
  75% {
    transform: rotate(-2deg);
  }
  90% {
    transform: rotate(1deg);
  }
  100% {
    transform: rotate(0deg);
    opacity: 1;
  }
}

.animate-5x-entrance {
  animation: scaleAndShake 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@media (max-width: 640px) {
  :deep(.base-modal-content) {
    width: 95vw !important;
  }
}
</style>
