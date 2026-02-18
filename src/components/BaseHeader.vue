<template>
  <header
    class="sticky top-0 left-0 right-0 z-50 transition-all duration-600"
    :class="{
      'backdrop-blur-xs from-background to-background/50 bg-gradient-to-b':
        y > BG_TRANSITION_Y,
    }"
  >
    <MiniAppBanner />
    <RaffleUpsellBanner />
    <div
      class="w-full max-w-full lg:max-w-screen-lg xl:max-w-screen-2xl mx-auto p-5 lg:p-8"
    >
      <div class="flex items-center justify-between gap-6 min-h-11">
        <!-- Logo and Navigation -->
        <div class="md:min-w-[calc(50%-(768px/2))]">
          <router-link to="/">
            <img
              :src="lingoLogo"
              alt="Lingo"
              class="h-6"
            >
          </router-link>
        </div>

        <div class="grow">
          <button
            v-if="isBackButtonVisible"
            type="button"
            class="flex-1 bg-background border border-dark3 h-10 text-light1 rounded-full px-4 inline-flex items-center gap-x-1 font-semibold text-sm leading-6"
            @click="handleBack"
          >
            <span class="sr-only">{{ t('common.back') }}</span>
            <ChevronLeft :size="16" />
            {{ t('common.back') }}
          </button>

          <BaseNavigation
            v-else
            class="max-xl:!hidden"
          />
        </div>
        <!-- Mobile Menu  -->
        <div class="flex items-center gap-x-2">
          <GlowButton
            v-if="!accountAddress?.length && !isWheel"
            :color="EButtonColor.BLUE"
            :loading="isConnecting"
            class="ml-auto flex-1"
            @click.stop.prevent="connect"
          >
            {{ t('common.logInSignUp') }}
          </GlowButton>
          <button
            v-if="variant === HomeVariants.wheelNotifyMe"
            class="h-10 px-6 cursor-pointer text-sm tracking-[0.42px] text-white rounded-full bg-[rgba(38,38,56,0.56)] shadow-[0px_-4px_16px_-2px_rgba(222,206,235,0.24)_inset] hover:bg-[rgba(38,38,56,0.72)]"
            @click="handleLearnMore"
          >
            {{ t('home.learnMore') }}
          </button>

          <MobileMenu
            v-model:open="isMobileMenuOpen"
            :short-wallet="transformedAddress"
            class="xl:hidden"
            @open-wallet="handleOpenWallet"
          />

          <!-- User Section ( Desktop ) -->
          <div class="hidden xl:flex items-center space-x-6">
            <div
              v-if="accountAddress?.length ?? 0 > 0"
              class="flex items-center space-x-4"
            >
              <UserBalance />

              <UserDropdown
                :account-data="accountData"
                :short-wallet="transformedAddress"
                @open-wallet="handleOpenWallet"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'
import lingoLogo from '@/assets/logo-lingo.svg'
import MobileMenu from '@/components/MobileMenu.vue'
import BaseNavigation from '@/components/BaseNavigation.vue'
import UserDropdown from '@/components/UserDropdown.vue'
import UserBalance from '@/components/user-balance/UserBalance.vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import { useAppKitAccount } from '@reown/appkit/vue'
import { useAppKit } from '@reown/appkit/vue'
import { formatWalletAddress } from '@/composables/helpers.ts'
import { useWindowScroll } from '@vueuse/core'
import { useGetMe } from '@/composables/get-me'
import { useWalletConnect } from '@/composables/wallet/use-wallet-connect'
import RaffleUpsellBanner from './upsell/RaffleUpsellBanner.vue'
import { HomeVariants, showLearnMoreWheel, useDynamicHome } from '@/composables/dynamic-home'
import { useTranslation } from '@/composables/use-i18n'
import mixpanel from 'mixpanel-browser'
import MiniAppBanner from './upsell/MiniAppBanner.vue'

const { t } = useTranslation()

const BG_TRANSITION_Y = 40
const { y } = useWindowScroll()
const route = useRoute()
const router = useRouter()
const { isWheel, variant } = useDynamicHome()

const { connect, isConnecting } = useWalletConnect()
const accountData = useAppKitAccount()
const { open } = useAppKit()

const isMobileMenuOpen = ref(false)
const { accountAddress } = useGetMe()

const transformedAddress = computed(() =>
  accountAddress.value
    ? formatWalletAddress(accountAddress.value)
    : t('common.connecting'),
)

const pathSlices = computed(() => (route.path || '').split('/').filter(Boolean))
const isBackButtonVisible = computed(() => pathSlices.value.length > 1)

const handleOpenWallet = () => {
  open({ view: 'Account' })
}

const handleBack = () => {
  if (pathSlices.value.length > 1) {
    router.back()
  }
}

const handleLearnMore = () => {
  showLearnMoreWheel.value = true
  mixpanel.track('Wheel Learn More Popup View')
}
</script>

<style scoped>
:deep(.sheet-content) {
  background-color: #1a1a24;
  border-color: #2d2d3d;
}
</style>
