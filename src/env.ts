const baseContracts: Record<
  string,
  {
    stakingAddress: `0x${string}`
    vestingAddress: `0x${string}`
    tokenAddress: `0x${string}`
    lingoTokenAddress: `0x${string}`
    badgesContractAddress: `0x${string}`
    tokenClaimApyAddress: `0x${string}`
    investorsKOLAddress: `0x${string}`
  }
> = {
  dev: {
    stakingAddress: '0x3827590BF09F0040B2462bf1C6A42142Df1828Ae',
    vestingAddress: '0x69957D15dF96854Eafd2526F381c3078623E0f8B',
    tokenAddress: '0xd72e9dac2d304377060357c284e33399417abf57',
    lingoTokenAddress: '0x589E4b06C2eaeA6A1B172b519C5298F9AC06EeD1',
    badgesContractAddress: '0x4BACfBD3e1f288ac01ba7c18E10483f65Eb95D39',
    investorsKOLAddress: '0xA0470F252a4774F17c91F40C66C23cEa541137A8',
    tokenClaimApyAddress: '0xB3686e4a9aD736d0Af60cCB571167fc5B430048f',
  },
  prod: {
    stakingAddress: '0x9aF8C0dac726CcEE2BFd6c0f3E21f320d42398AC',
    vestingAddress: '0xAd11F733E401E16C72033c5DECAf05dcC0e1BEB8',
    tokenAddress: '0xfb42Da273158B0F642F59F2Ba7cc1d5457481677',
    lingoTokenAddress: '0x610111763A4a6C64DD8926c12CA3e52Fb7b7897c',
    badgesContractAddress: '0xe2cf9cd0751f42c782bd1cdff2fc17346c4ada19',
    investorsKOLAddress: '0x8001b2029782bbf1b3c85c3a23ecae60e3fa0447',
    tokenClaimApyAddress: '0x2f26621e931c32542579CF8860D7e8616DF32E0E',
  },
}
export const appEnv = import.meta.env.VITE_APP_ENV as string
export const env = {
  app: {
    url: import.meta.env.VITE_APP_URL as string,
    isProd: appEnv === 'prod',
  },
  reown: {
    projectId: import.meta.env.VITE_REOWN_PROJECT_ID as string,
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL as string,
  },
  contracts: {
    base: baseContracts[appEnv],
    rpcEndpoint: import.meta.env.VITE_RPC_ENDPOINT as string,
  },
  sentryDsn: import.meta.env.VITE_SENTRY_DSN as string,
  mixpanel: {
    debug: Boolean(import.meta.env.VITE_MIXPANEL_DEBUG === 'true'),
    test: Boolean(import.meta.env.VITE_MIXPANEL_TEST === 'true'),
    token: import.meta.env.VITE_MIXPANEL_TOKEN as string,
    host: import.meta.env.VITE_MIXPANEL_HOST as string || 'https://mp.lingocoin.io',
  },
  posthogToken: import.meta.env.VITE_POSTHOG_API_KEY as string,
  flagsmithEnvironmentId: import.meta.env
    .VITE_FLAGSMITH_ENVIRONMENT_ID as string,
  discord: {
    clientId: import.meta.env.VITE_DISCORD_CLIENT_ID as string,
    redirectUri: import.meta.env.VITE_DISCORD_REDIRECT_URI as string,
  },
  maintenance: {
    maintenanceCaption: import.meta.env.VITE_MAINTENANCE_CAPTION as string,
  },
}
