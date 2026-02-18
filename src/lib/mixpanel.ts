import { loginProvider } from '@/composables/auth'
import { useDynamicHome } from '@/composables/dynamic-home'
import { useNotifications } from '@/composables/notifications'
import { env } from '@/env'
import { useAppKitAccount } from '@reown/appkit/vue'
import mixpanel from 'mixpanel-browser'
import { watch } from 'vue'

export const trackWalletConnected = (address: string) => {
  const eventDetails = {
    provider: loginProvider.value || 'unknown',
    user_id: address,
  }

  mixpanel.track('Wallet Connected', eventDetails)
}

export default function startMixpanel() {
  const appKitAccount = useAppKitAccount()
  const { variant } = useDynamicHome()
  const { clearAll } = useNotifications()

  mixpanel.init(env.mixpanel.token || 'test', {
    debug: env.mixpanel.debug,
    api_host: env.mixpanel.host,
    loaded: () => {
      /* if already connected, identify the user; we need to be sure mixpanel is loaded before identifying */
      watch(
        () => appKitAccount.value.address,
        (value) => {
          clearAll()
          if (value) {
            mixpanel.identify(value)
            if (variant.value) {
              mixpanel.people.set({
                $variant: variant.value,
              })
            }
          } else {
            loginProvider.value = ''
            mixpanel.reset()
          }
        },
        { immediate: true },
      )
    },
  })
}
