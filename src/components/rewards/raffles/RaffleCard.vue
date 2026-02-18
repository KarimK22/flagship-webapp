<template>
  <div
    class=" bg-dark2 text-white p-2 rounded-2xl relative overflow-hidden w-[288px] h-[512px] flex flex-col bg-cover bg-center mx-auto"
    :style="{ backgroundImage: `url(${raffleImage})` }"
  >
    <RaffleCardContent
      :raffle="raffle"
      :my-raffle-status="myRaffleStatus"
      class="mb-2"
    />
    <div class="mb-6 mx-5 mt-auto">
      <GlowButton
        v-if="hasEnoughTickets"
        :color="EButtonColor.BLUE"
        class="w-full"
        :disabled="isFuture(raffle)"
        @click="handleEnter"
      >
        {{ isFuture(raffle) ? t('common.comingSoon') : t('common.enterNow') }}
      </GlowButton>
      <GlowButton
        v-else
        :color="EButtonColor.PURPLE"
        class="w-full"
        @click="emit('getMore')"
      >
        + Get More Tickets
      </GlowButton>
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
import RaffleEnterModal from  '@/components/rewards/raffles/RaffleEnterModal.vue'
import RaffleCardContent from '@/components/rewards/raffles/RaffleCardContent.vue'
import { EButtonColor } from '@/types/shared/button.ts'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import backgroundImage from '@/assets/images/dummies/raffle-card-test.png'
import { useRoute, useRouter } from 'vue-router'
import ExtraTicketsModal from '@/components/rewards/raffles/ExtraTicketsModal.vue'
import { useRaffles } from '@/composables/raffles.ts'
import { useStakes } from '@/composables/contracts/stakes.ts'
import { useGetMe } from '@/composables/get-me'
import { useTranslation } from '@/composables/use-i18n'

const { t } = useTranslation()

const props = defineProps<{
  raffle: Raffle
  myRaffleStatus?: RaffleStatus
}>()

const emit = defineEmits<{
  (e: 'getMore'): void
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

const raffleImage = computed(() => {
  return props.raffle.imageUrl || backgroundImage
})

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

<style scoped>
.badge-gradient {
  position: absolute;
  top: -15px;
  right: -10px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  backdrop-filter: blur(8px);
  background: radial-gradient(circle at top right,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0.90) 10px,
      rgba(255, 255, 255, 0.70) 20px,
      #5858F5 40px,
      color-mix(in srgb, #5858F5, transparent 30%) 50px,
      color-mix(in srgb, #5858F5, transparent 50%) 60px,
      rgba(38, 38, 56, 0.9) 70px,
      transparent 80%);
}
</style>