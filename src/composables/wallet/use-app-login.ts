import mixpanel from 'mixpanel-browser'
import { lingoMainnet } from '../reown'
import { useSignMessage, useSwitchChain } from '@wagmi/vue'

import { getAddress } from 'viem'
import { useAppKitAccount } from '@reown/appkit/vue'
import { useMessageMutation } from './use-messsage-mutation'
import { useSignatureVerify } from './use-signature-verify-mutation'
import { apiToken, referrerCode } from '../auth'
import { trackWalletConnected } from '@/lib/mixpanel'
import flagsmith from 'flagsmith'
import { useUpdateEmail } from '../update-email'
import { ref } from 'vue'

import { useProviderChain } from './use-provider-chain'

export const isRequestSignLoginModalOpen = ref(false)

type OpenRequestSignLoginModalParams = {
  track?: boolean
}

export const openRequestSignLoginModal = (
  params?: OpenRequestSignLoginModalParams,
) => {
  const { track = true } = params || {}

  isRequestSignLoginModalOpen.value = true

  if (track) {
    mixpanel.track('Sign Message Pop-up View')
  }
}

export const closeRequestSignLoginModal = () => {
  isRequestSignLoginModalOpen.value = false
}

export const useAppLogin = () => {
  const isSigningIn = ref(false)
  const isError = ref(false)
  const errorMessage = ref('')
  const { chainId } = useProviderChain()
  const chainSwitcher = useSwitchChain()
  const account = useAppKitAccount()
  const messageMutation = useMessageMutation()
  const signMessageMutation = useSignMessage()
  const signatureVerify = useSignatureVerify()
  const { updateEmail, currentEmail } = useUpdateEmail()

  const authenticate = async () => {
    const isEmbeddedAccount = !!account.value.embeddedWalletInfo

    try {
      mixpanel.track('Sign Message to Login Started')
      isSigningIn.value = true

      if (lingoMainnet.id !== chainId.value) {
        await chainSwitcher.switchChainAsync({ chainId: lingoMainnet.id })
      }

      if (!account.value.address) {
        throw new Error('No address defined')
      }

      const address = getAddress(account.value.address)

      const { message, nonce } = await messageMutation.mutateAsync(address)

      if (isEmbeddedAccount) {
        closeRequestSignLoginModal()
      }

      const signature = await signMessageMutation.signMessageAsync({ message })

      if (isEmbeddedAccount) {
        openRequestSignLoginModal({ track: false })
      }

      const token = await signatureVerify.mutateAsync({
        signature,
        nonce,
        referrerCode: referrerCode.value,
      })

      apiToken.value = token

      trackWalletConnected(account.value.address)
      await flagsmith.identify(account.value.address)

      const userEmail = account.value.embeddedWalletInfo?.user?.email
      if (!currentEmail && userEmail) {
        await updateEmail(userEmail)
      }

      isSigningIn.value = false
      isRequestSignLoginModalOpen.value = false
    } catch (e) {
      isSigningIn.value = false
      console.error(e)
      isError.value = true
      if (e instanceof Error) {
        errorMessage.value = e.message
      }

      if (isEmbeddedAccount) {
        openRequestSignLoginModal({ track: false })
      }
    }
  }

  const resetError = () => {
    isError.value = false
    errorMessage.value = ''
  }

  return {
    authenticate,
    isError,
    isSigningIn,
    errorMessage,
    resetError,
  }
}
