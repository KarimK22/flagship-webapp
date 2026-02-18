<template>
  <BaseSheet v-model:open="openModel">
    <template #default="buttonProps">
      <SheetTrigger as-child>
        <BaseButton
          variant="ghost"
          size="icon"
          class="text-white"
          v-bind="buttonProps"
        >
          <span class="sr-only">{{ t('common.openMenu') }}</span>
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </BaseButton>
      </SheetTrigger>

      <SheetContent
        side="right"
        class="w-[320px] border-none bg-background pt-22 px-4 overflow-y-auto flex flex-col"
      >
        <template #close>
          <SheetClose
            class="absolute right-8 top-8 text-light1 rounded-full size-10 bg-dark2 cursor-pointer hover:bg-dark3 hover:text-lavender flex items-center justify-center"
          >
            <X
              class="text-light1"
              :size="24"
            />
          </SheetClose>
        </template>

        <VisuallyHidden>
          <SheetTitle />
          <SheetDescription />
        </VisuallyHidden>

        <div class="flex flex-col h-full justify-between">
          <BaseNavigation
            :is-mobile="true"
            @navigate="openModel = false"
          />

          <!-- Mobile User Info -->
          <div class="space-y-4 text-sm tracking-[0.03rem] font-semibold mt-auto">
            <template v-if="isConnected">
              <div v-if="userEmail">
                <div class="text-base text-light1">
                  {{ t('navigation.email') }}
                </div>
                <div class="text-purple-gray">
                  {{ userEmail }}
                </div>
              </div>

              <div v-if="isConnected">
                <div class="text-base text-light1">
                  {{ t('navigation.walletAddress') }}
                </div>
                <BaseClipboard
                  :text="shortWallet || ''"
                  :copy-value="accountAddress"
                  class="text-purple-gray"
                />
              </div>
            </template>

            <ConnectSocialsSection v-if="isConnected" />

            <div class="grid grid-cols-2 gap-x-1 gap-y-2">
              <template v-if="isConnected">
                <BaseButton
                  as="a"
                  href="https://buy.kryptonim.com/lingo"
                  target="_blank"
                  variant="outline"
                  class="flex-1 bg-dark2 border-dark3 h-10 text-light1 rounded-full"
                  @click="mixpanel.track('Buy Button Clicked', { entryPoint: 'userPopup' })"
                >
                  {{ t('navigation.buy') }}
                </BaseButton>

                <BaseButton
                  as="a"
                  href="https://bridge.lingocoin.io/"
                  target="_blank"
                  variant="outline"
                  class="flex-1 bg-dark2 border-dark3 h-10 text-light1 rounded-full"
                  @click="mixpanel.track('Bridge Button Clicked')"
                >
                  {{ t('navigation.bridge') }}
                </BaseButton>

                <BaseButton
                  :disabled="!isConnected"
                  variant="outline"
                  class="flex-1 bg-dark2 border-dark3 h-10 text-light1 rounded-full"
                  @click="emit('open-wallet')"
                >
                  {{ t('navigation.openWallet') }}
                </BaseButton>

                <BaseButton
                  variant="outline"
                  :loading="isDisconnecting"
                  class="flex-1 bg-dark2 border-dark3 h-10 text-light1 rounded-full"
                  @click="disconnect"
                >
                  <LogOut
                    class="text-purple-gray"
                    :size="20"
                  />
                  {{ t('navigation.logOut') }}
                </BaseButton>
              </template>

              <GlowButton
                v-else
                :color="EButtonColor.BLUE"
                class="col-span-2 ml-auto flex-1"
                @click.stop.prevent="connect"
              >
                {{ t('navigation.logInSignUp') }}
              </GlowButton>
            </div>
          </div>
        </div>
      </SheetContent>
    </template>
  </BaseSheet>
</template>

<script setup lang="ts">
import { LogOut, X } from 'lucide-vue-next'
import { BaseSheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { BaseButton } from '@/components/ui/button'
import BaseNavigation from '@/components/BaseNavigation.vue'
import BaseClipboard from '@/components/ui/clipboard/BaseClipboard.vue'
import { VisuallyHidden } from 'radix-vue'

import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import mixpanel from 'mixpanel-browser'
import { useGetMe } from '@/composables/get-me.ts'
import { computed } from 'vue'
import ConnectSocialsSection from '@/components/ConnectSocialsSection.vue'
import { useWalletConnect } from '@/composables/wallet/use-wallet-connect'
import { useTranslation } from '@/composables/use-i18n'

const { t } = useTranslation()

defineProps<{
	open: boolean
	shortWallet?: string | null
}>()
const openModel = defineModel<boolean>('open')
const emit = defineEmits<{
	(e: 'open-wallet'): void
}>()

const { connect, disconnect, isDisconnecting } = useWalletConnect()
const { meData, isConnected, accountAddress } = useGetMe()
const userEmail = computed(() => meData.value?.email)
</script>
