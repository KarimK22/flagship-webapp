import { jwtDecode } from 'jwt-decode'
import { watch } from 'vue'
import flagsmith from 'flagsmith'
import * as Sentry from '@sentry/vue'
import { useAppKitAccount } from '@reown/appkit/vue'
import { apiToken } from '../auth'
import { type Address, getAddress, isAddressEqual } from 'viem'
import { openRequestSignLoginModal } from './use-app-login'
import { useQueryClient } from '@tanstack/vue-query'
import { useGetMeQueryKey } from '../get-me'

export const useAuthListener = () => {
  const account = useAppKitAccount()
  const queryClient = useQueryClient()

  watch(
    () => [account.value.address, apiToken.value],
    ([address, token]) => {
      if (token && address && !isTokenValid(token, getAddress(address))) {
        apiToken.value = ''
        queryClient.removeQueries({ queryKey: useGetMeQueryKey })
      }
      if (address && !token) {
        openRequestSignLoginModal()
      }
    },
  )

  watch(
    () => account.value.address,
    async (value) => {
      if (!value) {
        Sentry.setUser(null)
        return
      }
      await flagsmith.identify(value)
      Sentry.setUser({
        id: value,
      })
    },
    { immediate: true },
  )
}

type JwtPayload = {
  sub: Address
  exp: number
}

const isTokenValid = (token: string, address: Address) => {
  try {
    const payload = jwtDecode<JwtPayload>(token)

    console.log('payload', payload)
    if (
      payload.exp * 1000 <= Date.now() ||
      !isAddressEqual(payload.sub, address)
    ) {
      return false
    }

    return true
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return false
  }
}
