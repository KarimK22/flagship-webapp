<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <BaseButton
        variant="ghost"
        class="flex items-center space-x-1 py-1 pl-1 hover:bg-background rounded-[40px] text-sm font-semibold text-purple-gray border border-[#262638] hover:text-lavender"
      >
        <UserAvatar
          :wallet-address="accountAddress"
          class="size-8"
        />
        <div
          v-if="!isConnected"
          class="flex justify-center items-center"
        >
          <BaseSpinner />
        </div>
        <span v-else>{{ accountData?.embeddedWalletInfo?.user?.email || shortWallet }}</span>
        <ChevronDown :size="16" />
      </BaseButton>
    </DropdownMenuTrigger>

    <DropdownMenuContent class="w-82 bg-dark2 border-none rounded-2xl">
      <div class="p-4 space-y-4 text-purple-gray text-sm tracking-[0.03rem] font-semibold">
        <div v-if="meData?.email">
          <div class="text-base text-light1">
            {{ t('navigation.email') }}
          </div>
          <div class="text-purple-gray">
            {{ meData?.email }}
          </div>
        </div>

        <div>
          <div class="text-base text-light1">
            {{ t('navigation.walletAddress') }}
          </div>

          <BaseClipboard
            :text="shortWallet"
            :copy-value="accountAddress"
          />
        </div>

        <ConnectSocialsSection />

        <div class="grid grid-cols-2 gap-x-1 gap-y-2">
          <template v-if="isConnected">
            <BaseButton
              as="a"
              href="https://buy.kryptonim.com/lingo"
              target="_blank"
              variant="outline"
              class="flex-1 bg-dark2 border-dark3 h-10 text-light1 rounded-full"
            >
              {{ t('navigation.buy') }}
            </BaseButton>

            <BaseButton
              as="a"
              href="https://bridge.lingocoin.io/"
              target="_blank"
              variant="outline"
              class="flex-1 bg-dark2 border-dark3 h-10 text-light1 rounded-full"
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
              :loading="isDisconnecting"
              variant="outline"
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

          <BaseButton
            v-else
            variant="outline"
            class="col-start-1 ml-auto flex-1 bg-dark2 border-dark3 h-10 text-light1 rounded-full"
            @click.stop.prevent="connect"
          >
            <LogIn
              class="text-purple-gray"
              :size="20"
            />
            {{ t('navigation.logInSignUp') }}
          </BaseButton>
        </div>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { ChevronDown, LogIn, LogOut } from 'lucide-vue-next'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import UserAvatar from '@/components/UserAvatar.vue'
import { BaseButton } from '@/components/ui/button'
import BaseClipboard from '@/components/ui/clipboard/BaseClipboard.vue'

import type { UseAppKitAccountReturn } from '@reown/appkit'
import { useGetMe } from '@/composables/get-me.ts'

import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import ConnectSocialsSection from '@/components/ConnectSocialsSection.vue'
import { useWalletConnect } from '@/composables/wallet/use-wallet-connect'
import { useTranslation } from '@/composables/use-i18n'

defineProps<{
	shortWallet?: string | null
	accountData?: UseAppKitAccountReturn
}>()

const emit = defineEmits<{
	(e: 'open-wallet'): void
}>()
const { connect, disconnect , isDisconnecting } = useWalletConnect()

const { meData, isConnected, accountAddress } = useGetMe()

const { t } = useTranslation()

</script>
