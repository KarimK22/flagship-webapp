import { callApi } from '@/services/call-api'
import { useMutation } from '@tanstack/vue-query'

type SignatureVerifyParams = {
  nonce: string
  signature: string
  referrerCode: string
}

export const useSignatureVerify = () => {
  return useMutation({
    mutationKey: ['signature-verify'],
    mutationFn: async (params: SignatureVerifyParams) => {
      const { token } = await callApi<{ token: string }>({
        path: '/api/auth/signature/verify',
        method: 'POST',
        body: params,
      })

      return token
    },
  })
}
