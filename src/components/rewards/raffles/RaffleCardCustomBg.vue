<template>
  <div
    class="bg-[#0C0C14] text-white p-2 rounded-2xl relative overflow-hidden w-[288px] h-[512px] flex flex-col mx-auto"
  >
    <!-- Layer 1: Background glow (bgg.svg) — scaled to cover the card -->
    <div class="absolute inset-0 pointer-events-none">
      <InlineSvg
        :src="bgGlow"
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] max-w-none"
        unique-ids
      />
    </div>

    <!-- Layer 2: Decorative overlay (des.svg) — scaled to cover -->
    <div class="absolute inset-0 pointer-events-none z-[1]">
      <InlineSvg
        :src="overlay"
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] max-w-none"
        unique-ids
      />
    </div>

    <!-- Layer 3: Prize image — large, centered like the reference -->
    <div class="absolute inset-0 pointer-events-none z-[2] flex items-center justify-center">
      <img
        :src="prizeImage"
        :alt="raffle.title"
        class="w-[130%] max-w-none h-auto object-contain drop-shadow-[0_12px_40px_rgba(0,0,0,0.5)] translate-y-[5%]"
      >
    </div>

    <!-- Layer 4: Content overlay -->
    <div class="relative z-[3] flex flex-col h-full">
      <RaffleCardContent
        :raffle="raffle"
        :my-raffle-status="myRaffleStatus"
        class="mb-2 !min-h-0 flex-shrink"
      />
      <div class="mx-5 mt-auto pb-2">
        <GlowButton
          :color="EButtonColor.BLUE"
          class="w-full"
          @click="emit('openSimulator')"
        >
          Ticket Simulator
        </GlowButton>
      </div>
    </div>

    <RaffleEnterModal
      v-model="showModal"
      :raffle="raffle"
      :my-raffle-status="myRaffleStatus"
      @open-extra-tickets-modal="showModal = false; showExtraTicketsModal = true"
    />
    <ExtraTicketsModal
      v-if="haveExtraTicketsOption"
      v-model="showExtraTicketsModal"
      :extra-tickets="raffle.metadata.extraTickets"
      :purchase-success-id="purchaseSuccessId"
      :name="raffle.title"
      variant="banner"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Raffle, RaffleStatus } from '@/services/api.ts'
import { computed, onMounted, ref, watch } from 'vue'
import InlineSvg from 'vue-inline-svg'
import RaffleEnterModal from '@/components/rewards/raffles/RaffleEnterModal.vue'
import RaffleCardContent from '@/components/rewards/raffles/RaffleCardContent.vue'
import { EButtonColor } from '@/types/shared/button.ts'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { useRoute, useRouter } from 'vue-router'
import ExtraTicketsModal from '@/components/rewards/raffles/ExtraTicketsModal.vue'
import { useRaffles } from '@/composables/raffles.ts'
import { useStakes } from '@/composables/contracts/stakes.ts'
import { useGetMe } from '@/composables/get-me'
import { useTranslation } from '@/composables/use-i18n'
import bgGlow from '@/assets/images/raffles/raffle-card-bg-glow.svg'
import overlay from '@/assets/images/raffles/raffle-card-overlay.svg'
import prizeImage from '@/assets/images/raffles/raffle-car-prize.png'

const { t } = useTranslation()

const props = defineProps<{
  raffle: Raffle
  myRaffleStatus?: RaffleStatus
}>()

const emit = defineEmits<{
  (e: 'getMore'): void
  (e: 'openSimulator'): void
}>()

const route = useRoute()
const router = useRouter()
const { isConnected } = useGetMe()
const showModal = ref(route.query.raffleId === props.raffle.id || false)
const showExtraTicketsModal = ref(false)
const haveExtraTicketsOption = computed(() => Boolean(props.raffle.metadata.extraTickets?.onStake))
const { isFuture } = useRaffles()
const { totalPowerMiles } = useStakes()

const hasEnoughTickets = computed(() => {
  if (!isConnected.value) return false
  if (props.raffle.ticketPrice === 0) return true
  return Number(totalPowerMiles.value) >= props.raffle.ticketPrice
})

const purchaseSuccessId = ref<string>(route.query.purchaseSuccessId as string)

watch(purchaseSuccessId, (value) => {
  if (value) {
    showExtraTicketsModal.value = haveExtraTicketsOption.value && value === props.raffle.id
    router.replace({ query: { ...route.query, purchaseSuccessId: undefined } })
  }
}, { immediate: true })

const handleEnter = () => {
  showModal.value = true
}

onMounted(() => {
  if (route.query.raffleId === props.raffle.id) {
    showModal.value = true
    if (isConnected.value) {
      router.replace({ query: { ...route.query, rafflecode: undefined, raffleId: undefined } })
    } else {
      const unwatch = watch(isConnected, (newValue) => {
        if (newValue) {
          showModal.value = true
          router.replace({ query: { ...route.query, rafflecode: undefined, raffleId: undefined } })
          unwatch()
        }
      }, { immediate: true })
    }
  }
})
</script>
