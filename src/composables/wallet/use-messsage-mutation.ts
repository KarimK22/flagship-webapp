import { callApi } from '@/services/call-api'
import { useMutation } from '@tanstack/vue-query'
import type { Address } from 'viem'
import { useDynamicHome } from '../dynamic-home'

const defaultMessage = 'Please sign this message to login to Lingo!'

const wheelMessage =
  'Sign to claim your prize 🎁 and activate your account 👾 — more rewards are waiting!'

export const useMessageMutation = () => {
  const { isWheel } = useDynamicHome()

  return useMutation({
    mutationKey: ['signature-message'],
    mutationFn: (walletAddress: Address) => {
      const message = isWheel.value ? wheelMessage : defaultMessage

      return callApi<{
        message: string
        nonce: string
      }>({
        path: '/api/auth/signature/message',
        method: 'POST',
        body: {
          message,
          walletAddress,
        },
      })
    },
  })
}
