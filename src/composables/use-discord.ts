import { computed, ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import api from '@/services/api'

import { env } from '@/env'
import { useGetMe } from './get-me'

const redirectUri = env.discord.redirectUri || window.location.origin

export const useDiscord = () => {
  const isConnecting = ref(false)

  const me = useGetMe()

  const { data: discordInfo, refetch: refetchDiscordStatus, isLoading: loadingDiscordStatus } = useQuery({
    queryKey: ['discordInfo'],
    queryFn: async () => {
      return await api.getDiscordInfo()
    },
    enabled: me.isConnected,
    initialData: {
      discord: {
        username: '',
        roles: [],
      },
    },
    refetchOnWindowFocus: false,
  })

  function formatRole(role: string): string {
    const words = role.toLowerCase().split('_')
    const capitalized = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1),
    )

    let result = capitalized.join(' ')
    if (result.endsWith('s')) {
      result = result.slice(0, -1)
    }

    return result
  }

  const roles = computed(() => discordInfo.value?.discord?.roles || [])
  const totalPowerMiles = computed(() => roles.value?.reduce((acc, role) => acc + role.powerMiles, 0) || 0)
  const username = computed(() => discordInfo.value?.discord?.username)
  const isConnected = computed(() => {
    return Boolean(username.value)
  })
  const errorMessage = ref<string>()
  const isError = computed(() => {
    return Boolean(errorMessage.value)
  })
  const isSuccess = ref(false)
  const isDiscordConnectModalOpen = ref(false)
  const formattedRoles = computed(() => {
    return roles.value?.map((role) => ({
      powerMiles: role.powerMiles,
      id: role.name,
      name: formatRole(role.name),
    }))
  })

  const hasRole = (roleId: string) => {
    return roles.value?.some((role) => role.name === roleId)
  }

  function getOAuthUrl() {
    const state = crypto.randomUUID()

    const url = new URL('https://discord.com/api/oauth2/authorize')
    url.searchParams.set('client_id', env.discord.clientId)
    url.searchParams.set('redirect_uri', redirectUri)
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('state', state)
    url.searchParams.set('scope', 'role_connections.write identify')
    url.searchParams.set('prompt', 'consent')
    return { state, url: url.toString() }
  }

  const connect = async () => {
    if (isConnecting.value) return

    isConnecting.value = true
    const { state, url } = getOAuthUrl()
    localStorage.setItem('discord_state', state)
    // Redirect to Discord OAuth
    window.location.href = url
  }

  const connectCallback = async () => {
    const url = new URL(window.location.href)
    const state = url.searchParams.get('state')
    const code = url.searchParams.get('code')!
    const error = url.searchParams.get('error')
    const errorDescription = url.searchParams.get('error_description')

    if (error && errorDescription) {
      isDiscordConnectModalOpen.value = true
      console.error('Error connecting to Discord:', error, errorDescription)
      errorMessage.value = errorDescription
      return
    }

    if (!state || !code) {
      console.debug('No state or code')
      return
    }

    if (state !== localStorage.getItem('discord_state')) {
      console.debug('Invalid state', state, localStorage.getItem('discord_state'))
      return
    }

    try {
      isDiscordConnectModalOpen.value = true
      localStorage.removeItem('discord_state')
      isConnecting.value = true
      await api.discordConnect({ code, redirectUri })
      await refetchDiscordStatus()
    } catch (error) {
      const message =
        error instanceof Error && !error.message.includes('Unexpected token')
          ? error.message
          : 'Check your Discord account and try again'
      isDiscordConnectModalOpen.value = true
      errorMessage.value = message
      throw error
    } finally {
      isConnecting.value = false
    }
  }

  const disconnect = async () => {
    isConnecting.value = true
    await api.discordDisconnect()
    await refetchDiscordStatus()
    isDiscordConnectModalOpen.value = true
    isConnecting.value = false
  }

  const joinDiscord = () => {
    window.open('https://discord.com/invite/lingo', '_blank')
  }

  return {
    isConnected,
    roles,
    hasRole,
    connect,
    isConnecting,
    loadingDiscordStatus,
    refetchDiscordStatus,
    connectCallback,
    totalPowerMiles,
    username,
    isError,
    isSuccess,
    errorMessage,
    isDiscordConnectModalOpen,
    formattedRoles,
    disconnect,
    joinDiscord,
  }
}
