import { useAppKitEvents } from '@reown/appkit/vue'
import mixpanel from 'mixpanel-browser'
import { ref, watch } from 'vue'
import { loginProvider } from '@/composables/auth'
import { isRequestSignLoginModalOpen } from './use-app-login'
import { useWalletConnect } from './use-wallet-connect'
import initTallyForm, { TallyFormId } from '@/lib/tally'
import { useDynamicHome } from '../dynamic-home'

const isWCReady = ref(false)
const prevEventName = ref('')

const useWalletEvents = () => {
  const events = useAppKitEvents()
  const { disconnect, isDisconnecting } = useWalletConnect()
  const { isWheel } = useDynamicHome()

  watch(events, (events) => {
    const eventName = events.data.event
    console.debug('eventName', eventName)
    switch (eventName) {
    case 'INITIALIZE':
      isWCReady.value = true
      break
    case 'SOCIAL_LOGIN_STARTED':
      mixpanel.track('Wallet Provider Clicked', {
        provider: events.data.properties.provider,
      })
      loginProvider.value = events.data.properties.provider
      break

    case 'EMAIL_LOGIN_SELECTED':
      mixpanel.track('Wallet Provider Clicked', {
        provider: 'email',
      })
      loginProvider.value = 'email'
      break

    case 'SELECT_WALLET':
      mixpanel.track('Wallet Provider Clicked', {
        provider: events.data.properties.name,
      })
      loginProvider.value = events.data.properties.name
      break

    case 'EMAIL_VERIFICATION_CODE_SENT':
      mixpanel.track('OTP Sent')
      break

    case 'EMAIL_VERIFICATION_CODE_PASS':
    case 'EMAIL_VERIFICATION_CODE_FAIL':
      mixpanel.track('OTP Entered', {
        passed: eventName === 'EMAIL_VERIFICATION_CODE_PASS',
      })
      break

    case 'DISCONNECT_SUCCESS':
      if (isWCReady.value) {
        console.debug('DISCONNECT_SUCCESS', events.data)
        if (!isDisconnecting.value) {
          disconnect()
        }
        isRequestSignLoginModalOpen.value = false
        /* TODO: remove this once we have a proper way to handle state cleanup */
        window.location.reload()
      }
      break
    case 'MODAL_CLOSE':
      if (
        isWheel.value &&
        [
          'EMAIL_VERIFICATION_CODE_FAIL',
          'EMAIL_VERIFICATION_CODE_SENT',
          'MODAL_OPEN',
          'EMAIL_LOGIN_SELECTED',
        ].includes(prevEventName.value)
      ) {
        initTallyForm(undefined, TallyFormId.AFTER_MODAL_CLOSE)
      }
      break
    }
    prevEventName.value = eventName
  })
}

export { useWalletEvents, isWCReady }
