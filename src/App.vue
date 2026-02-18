<template>
  <div class="bg-cover bg-center h-screen relative">
    <BaseLayout>
      <InfoModal
        :model-value="showInfoModal && isHome"
        @update:model-value="toggleInfoModal"
      />
      <router-view />
      <RequestSignLoginModal />
      <DiscordConnectModal
        :model-value="isDiscordConnectModalOpen"
        :is-connected="isConnected"
        :is-connecting="isConnecting"
        :is-error="isDiscordError"
        :error-message="discordErrorMessage"
        :roles="formattedRoles"
        @update:model-value="(isOpen: boolean) => isDiscordConnectModalOpen = isOpen"
      />
      <RequestOpenInBrowserModal />
      <MaintenanceModal />
      <EmailSubmitModal v-model="isEmailModalOpen" />
      <FreePowerMilesPromoModal />
      <FirstStakeModal v-model="shouldShowFirstStakeModal" />
    </BaseLayout>
  </div>
  <VueQueryDevtools />
</template>

<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import BaseLayout from '@/layouts/BaseLayout.vue'
import { referrerCode } from '@/composables/auth'
import { computed, onMounted, watch } from 'vue'
import InfoModal from './components/info-modal/InfoModal.vue'
import EmailSubmitModal from '@/components/EmailSubmitModal.vue'
import { useEmailModal } from '@/composables/use-email-modal'
import { LingoRouteName } from '@/router/routes'
import { useRoute } from 'vue-router'
import { unclaimedRaffleStatusCopy, useRaffles } from '@/composables/raffles'
import RequestSignLoginModal from '@/components/RequestSignLoginModal.vue'
import RequestOpenInBrowserModal from '@/components/RequestOpenInBrowserModal.vue'
import DiscordConnectModal from '@/components/DiscordConnectModal.vue'
import { showInfoModal } from '@/composables/ls-modals'
import { useDiscord } from '@/composables/use-discord'
import MaintenanceModal from './components/MaintenanceModal.vue'

import { useWalletEvents } from './composables/wallet/wallet-events'

import { useAuthListener } from './composables/wallet/use-auth-listener'
import startMixpanel from '@/lib/mixpanel'
import { useClickIdPostback } from './composables/use-click-id-postback'
import FreePowerMilesPromoModal from '@/components/upsell/FreePowerMilesPromoModal.vue'
import FirstStakeModal from './components/FirstStakeModal.vue'
import { useFirstStakeModal } from './composables/use-first-stake-modal'

startMixpanel()
useWalletEvents()
useAuthListener()
useClickIdPostback()

const route = useRoute()
const isHome = computed(() => route.name === LingoRouteName.HOME)
const {
  isConnected,
  isConnecting,
  isError: isDiscordError,
  errorMessage: discordErrorMessage,
  isDiscordConnectModalOpen,
  connectCallback,
  formattedRoles,
} = useDiscord()

const { isEmailModalOpen } = useEmailModal()
const { showFirstStakeModal } = useFirstStakeModal()
const shouldShowFirstStakeModal = computed(() => {
  return showFirstStakeModal.value && [LingoRouteName.STAKING, LingoRouteName.HOME].includes(route.name as LingoRouteName)
})
const { unclaimedRaffleStatus } = useRaffles()
const unwatch = watch(
  unclaimedRaffleStatus,
  (newStatus) => {
    setTimeout(() => {
      unclaimedRaffleStatusCopy.value = newStatus
    }, 1000)
    unwatch()
  },
  { deep: true },
)

onMounted(async () => {
  connectCallback()
})

const toggleInfoModal = (val: boolean) => {
  showInfoModal.value = val
}

if (!referrerCode.value) {
  const urlParams = new URLSearchParams(window.location.search)
  const referrerCodeRef = urlParams.get('ref')
  if (referrerCodeRef) {
    referrerCode.value = referrerCodeRef
  }
}
</script>
