<template>
  <div
    v-if="!route.query.lp_var"
    :style="{
      backgroundImage: `url(${headerBannerBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'bottom',
      backgroundRepeat: 'no-repeat',
    }"
    class="sticky top-0 left-0 right-0 z-10 w-full h-0 transition-[height,opacity] duration-300 ease-in-out opacity-0 overflow-hidden"
    :class="{
      'h-[104px] md:h-[80px] pointer-events-all opacity-100 cursor-pointer z-10': shouldShow && !isDismissed,
    }"
    role="button"
    @click="handleClick"
  >
    <div class="relative flex flex-col gap-2 md:flex-row items-center justify-center container h-full">
      <!-- Dismiss button -->
      <button
        class="absolute top-2 right-2 md:top-1/2 md:right-4 md:-translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white/70 hover:text-white transition-colors z-20"
        aria-label="Dismiss banner"
        @click.stop="isDismissed = true"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
      <span class="text-white text-2xl md:text-[32px] leading-5 md:leading-8 tracking-[-1.28px] text-center">
        {{ banner?.title }}
      </span>
      <div
        class="bg-cover bg-center relative"
      >
        <InlineSvg
          :src="headerBannerCdBg"
          unique-ids
          class=""
        />
        <span class="text-lavender text-xl tracking-[-0.6px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {{ cd }}
        </span>
      </div>
    </div>
    <ExtraTicketsModal
      v-if="shouldShow"
      v-model="showExtraTicketsModal"
      :name="raffleBanner?.title ?? ''"
      :extra-tickets="raffleBanner?.metadata.extraTickets!"
      :purchase-success-id="purchaseSuccessId"
      variant="banner"
    />
  </div>
</template>

<script setup lang="ts">
import headerBannerBg from '@/assets/images/header-banner-bg.png'
import headerBannerCdBg from '@/assets/images/header-banner-cd-bg.svg'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ExtraTicketsModal from '../rewards/raffles/ExtraTicketsModal.vue'
import { useGetMe } from '@/composables/get-me'
import { useWalletConnect } from '@/composables/wallet/use-wallet-connect'
import { useRaffleCountdown } from '@/composables/raffle-countdown'
import { useLocalStorage } from '@vueuse/core'

const route = useRoute()
const router = useRouter()
const { isConnected } = useGetMe()
const { connect } = useWalletConnect()
const showExtraTicketsModal = ref(false)
const isDismissed = useLocalStorage('raffleUpsellBannerDismissed', false)
const { cd, shouldShow, banner, raffleBanner } = useRaffleCountdown()

function handleClick() {
  if (!isConnected.value) {
    connect()
  } else {
    showExtraTicketsModal.value = true
  }
}

const purchaseSuccessId = ref<string>(route.query.purchaseSuccessId as string)

watch(() => route.query.purchaseSuccessId, (value) => {
  if (value) {
    purchaseSuccessId.value = value as string
    showExtraTicketsModal.value = true
    router.replace({ query: { ...route.query, purchaseSuccessId: undefined } })
  }
}, { immediate: true })
</script>

<style scoped>
.text-clip {
  position: absolute;
  left: 0;
}

.text-clip {
  background: linear-gradient(180deg, #ff9d5c 0%, rgba(255, 157, 92, 0) 64.42%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  z-index: 1;
  mix-blend-mode: plus-lighter;
  filter: blur(1px);
}

.text-main {
  color: #ff7847;
}
</style>
