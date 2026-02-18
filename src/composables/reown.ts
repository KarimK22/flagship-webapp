import { createAppKit, type CreateAppKit } from '@reown/appkit/vue'

import {
  type AppKitNetwork,
  base,
  baseSepolia,
  mainnet,
} from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { env } from '@/env.ts'
import { createClient, http } from 'viem'

export const lingoMainnet = env.app.isProd ? base : baseSepolia

export const metadata = {
  name: 'Lingo dev',
  description: 'Lingo token',
  url: window.location.origin, // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
}

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet, lingoMainnet]

export const wagmiAdapter = new WagmiAdapter({
  projectId: env.reown.projectId,
  networks,
  client({ chain }) {
    return createClient({ chain, transport: http(env.contracts.rpcEndpoint) })
  },
})
export const config = wagmiAdapter.wagmiConfig

/**
 * URL params:
 * To enable web2 only mode, set ?web2only=true
 * To enable email auth, set ?auth=email
 * To enable web2 auth, set ?auth=web2
 */
const authParams = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const auth = urlParams.get('auth') as 'email' | 'web2'
  const web2Only = urlParams.get('web2only') === 'true'
  return {
    isWeb2Only: web2Only || Boolean(auth),
    authEmail: auth === 'email',
    auth,
  }
}

export const { isWeb2Only, authEmail, auth } = authParams()

const allWallets: CreateAppKit['allWallets'] = isWeb2Only ? 'HIDE' : 'SHOW'

export const appkit = createAppKit({
  defaultAccountTypes: { eip155: 'smartAccount' },
  enableAuthLogger: true,
  enableNetworkSwitch: false,
  adapters: [wagmiAdapter],
  networks,
  defaultNetwork: lingoMainnet,
  metadata,
  allWallets,
  enableWallets: !isWeb2Only,
  projectId: env.reown.projectId,
  features: authEmail
    ? {
      analytics: true, // Optional - defaults to your Cloud configuration
      socials: [],
    }
    : {
      analytics: true, // Optional - defaults to your Cloud configuration
    },
})
