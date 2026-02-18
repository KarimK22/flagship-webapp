<script setup lang="ts">
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import { EButtonColor } from '@/types/shared/button'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import loaderIcon from '@/assets/icons/loader-lg.svg'
import successIcon from '@/assets/icons/checkmark.svg'
import modalBg from '@/assets/images/game/modal-bg.png'
import InlineSvg from 'vue-inline-svg'
import { useGetMe } from '@/composables/get-me'
import {
  closeRequestSignLoginModal,
  isRequestSignLoginModalOpen,
  useAppLogin,
} from '@/composables/wallet/use-app-login'
import { useWalletConnect } from '@/composables/wallet/use-wallet-connect'
import { useDynamicHome } from '@/composables/dynamic-home'
import initTallyForm, { TallyFormId } from '@/lib/tally'

const { authenticate, errorMessage, isError, isSigningIn, resetError } =
  useAppLogin()
const { disconnect } = useWalletConnect()

const { pendingClaim, staticPrize, isWheel } = useDynamicHome()
const { isConnected } = useGetMe()

const handleDisconnect = () => {
  disconnect()
  closeRequestSignLoginModal()
}

const handleChangeModelValue = (v: boolean) => {
  isRequestSignLoginModalOpen.value = v
  if (!v && isWheel.value && pendingClaim.value) {
    initTallyForm(undefined, TallyFormId.AFTER_MODAL_CLOSE)
  }
}
</script>

<template>
  <BaseModal
    :model-value="isRequestSignLoginModalOpen"
    class="p-2 pt-4 md:p-4 md:pt-8 gap-0 !rounded-2xl w-[96vw] md:w-[420px] !max-w-[420px] max-h-[96vh] md:max-h-[90%] h-auto"
    :class="{ [`!min-h-[580px] bg-cover bg-center`]: pendingClaim && !isError }"
    :style="pendingClaim && !isError ? { backgroundImage: `url(${modalBg})` } : {}"
    description=" "
    @update:model-value="handleChangeModelValue"
  >
    <!-- Content (with higher z-index) -->
    <template #header>
      <div class="pr-10 mb-4 z-10 relative">
        <div
          v-if="isError"
          class="flex flex-col gap-2"
        >
          <h1
            class="text-[#FF7847] text-[32px] leading-7 font-medium tracking-[-1.28px] select-none"
          >
            {{ $t('components.requestSignLoginModal.oops') }}
          </h1>
          <h1
            class="text-lavender text-[32px] leading-7 font-medium tracking-[-1.28px] select-none"
          >
            {{ $t('components.requestSignLoginModal.somethingWentWrong') }}
          </h1>
        </div>
        <div
          v-else
          class="contents"
        >
          <div
            v-if="pendingClaim"
            class="flex flex-col gap-2 text-left"
          >
            <h1 class="text-lavender text-4xl md:text-[40px] leading-6 md:leading-8 font-medium tracking-[-1.28px] md:tracking-[-2px]">
              {{ $t('components.requestSignLoginModal.oneStepAway') }}
              {{ $t('components.requestSignLoginModal.fromClaimingPrize') }}
            </h1>
            <span class="text-lavender text-xl leading-6 font-normal tracking-[-0.6px] pr-0">
              {{ $t('components.requestSignLoginModal.signQuickMessage') }}
            </span>
          </div>
          <h1
            v-else
            class="text-lavender text-justify text-4xl md:text-[48px] leading-8 md:leading-10 font-medium tracking-[-2.4px]"
            v-html="$t('components.requestSignLoginModal.welcome')"
          />
        </div>
      </div>
    </template>
    <template #description>
      <div
        v-if="isError"
        class="text-purple-gray text-xl leading-6 font-normal tracking-[-0.6px] pr-20"
      >
        <span v-if="errorMessage">
          {{ errorMessage }}
        </span>
        <span
          v-else
          v-html="$t('components.requestSignLoginModal.discordCommunity')"
        />
      </div>
      <span
        v-else-if="!pendingClaim"
        class="text-purple-gray text-xl leading-6 font-normal tracking-[-0.6px] pr-20"
      >
        {{ $t('components.requestSignLoginModal.signQuickMessage') }}
        <span>
          {{ $t('components.requestSignLoginModal.totallyFree') }}
          <br>
          <br>
          {{ $t('components.requestSignLoginModal.needToLoginDifferently') }}
          <a
            href="#"
            class="text-[#D4C5EB] cursor-pointer"
            role="button"
            @click="handleDisconnect"
          >{{ $t('components.requestSignLoginModal.disconnect') }}</a>.
        </span>
      </span>
      <div
        v-else
        class="h-[300px]"
      />
    </template>
    <div v-if="pendingClaim && !isError">
      <img
        :src="staticPrize.imageBg"
        class="w-full h-[444px] object-cover absolute bottom-0 left-0"
      >
    </div>
    <template #footer>
      <div class="p-0 pb-3.5 w-full flex justify-center mt-8 z-10">
        <div
          v-if="isError"
          class="contents"
        >
          <GlowButton
            :color="EButtonColor.BLUE"
            class="w-full"
            @click="resetError"
          >
            <span> {{ $t('components.requestSignLoginModal.tryAgain') }} </span>
          </GlowButton>
        </div>
        <div
          v-if="!isError"
          class="contents"
        >
          <GlowButton
            v-if="!isSigningIn && !isConnected"
            :color="EButtonColor.BLUE"
            class="w-full"
            @click="authenticate"
          >
            <span>{{ $t('components.requestSignLoginModal.continueToSign') }}</span>
          </GlowButton>
          <div
            v-else
            class="w-full"
          >
            <ol class="space-y-1">
              <li
                class="p-1 pl-4 h-10 relative rounded-full flex justify-between items-center overflow-hidden"
              >
                <div
                  :class="{
                    'bg-[rgba(38,38,56,0.72)] opacity-100': isConnected,
                  }"
                  class="opacity-80 inset-shadow-[0px_-4px_16px_-2px_rgba(222,_206,_235,_0.08)] bg-[rgba(38,38,56,0.32)] rounded-full absolute top-0 left-0 w-full h-full"
                />
                <span
                  :class="{ 'text-lavender': isSigningIn }"
                  class="text-purple-gray text-base leading-5 font-semibold tracking-[-0.6px]"
                >{{ $t('components.requestSignLoginModal.signingIn') }}</span>
                <div class="flex items-center">
                  <div
                    :class="{ 'opacity-100': isConnected }"
                    class="opacity-0 w-96 h-10 absolute top-0 right-0"
                  >
                    <div
                      class="w-14 h-10 -right-[28px] -top-[3px] absolute bg-[#33F] rounded-full blur-[16px]"
                    />
                    <div
                      class="w-18 h-8 -right-[1px] -top-[28px] absolute bg-[#FF7847] rounded-full blur-[24px]"
                    />
                    <div
                      class="w-8 h-4 right-[2px] -top-[8px] absolute bg-[#6D6D8F] rounded-full blur-[8px] mix-blend-plus-lighter"
                    />
                  </div>
                  <InlineSvg
                    v-if="isConnected"
                    :src="successIcon"
                    class="size-8 z-10"
                  />
                  <InlineSvg
                    v-else-if="isSigningIn"
                    class="animate-[spin_2s_linear_infinite_reverse] size-4 m-3 z-10"
                    :src="loaderIcon"
                  />
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </template>
  </BaseModal>
</template>
