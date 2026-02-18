import { isWCReady } from '@/composables/wallet/wallet-events'
import mixpanel from 'mixpanel-browser'
import { ModalController } from '@reown/appkit-controllers'
import { openRequestSignLoginModal } from './use-app-login'
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/vue'
import flagsmith from 'flagsmith'
import { ref } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { useGetMe, useGetMeQueryKey } from '../get-me'

import { apiToken } from '../auth'

const isConnecting = ref(false)

ModalController.subscribeKey('loading', (v) => {
  isConnecting.value = v
})

const isDisconnecting = ref(false)

export const useWalletConnect = () => {
  const walletDisconnect = useDisconnect()
  const account = useAppKitAccount()
  const { open } = useAppKit()
  const { isConnected } = useGetMe()
  const queryClient = useQueryClient()

  const connect = (view?: string) => {
    if (!isWCReady.value || isConnecting.value) return
    // pendingLogin.value = true
    if (account.value.address && !isConnected.value) {
      openRequestSignLoginModal()
      return
    }
    mixpanel.track('Wallet Connect Started')
    const viewToOpen = (view || 'Connect') as 'Connect'
    console.log('viewToOpen:', viewToOpen)
    open({ view: viewToOpen, namespace: 'eip155' })
  }

  const clearUrlParams = () => {
    window.history.replaceState({}, '', window.location.pathname)
  }

  const disconnect = async () => {
    isDisconnecting.value = true
    queryClient.removeQueries({ queryKey: useGetMeQueryKey })
    clearUrlParams()
    try {
      await walletDisconnect.disconnect()
    } catch (e) {
      // In case wallet is not connected, it will throw an error
      console.log('error:', e)
    }
    await flagsmith.logout()

    apiToken.value = ''

    isDisconnecting.value = false
  }

  return {
    connect,
    disconnect,
    isDisconnecting,
    isConnecting,
  }
}
