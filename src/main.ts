import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import InlineSvg from 'vue-inline-svg'
import { WagmiPlugin } from '@wagmi/vue'
import { config } from '@/composables/reown'
import { appEnv, env } from '@/env'
import * as Sentry from '@sentry/vue'
import { i18n } from '@/i18n'

import { handleCampaignParams } from '@/lib/campaign-param-handler'

handleCampaignParams()

const queryClient = new QueryClient()

const app = createApp(App)

// Sentry
const debugCode = new URL(window.location.href).searchParams.get('debug')
if (debugCode) {
  sessionStorage.setItem('debugCode', debugCode)
}
if (env.sentryDsn) {
  Sentry.init({
    app,
    dsn: env.sentryDsn,
    maxValueLength: 4096,
    allowUrls: [
      new RegExp('^https://app.lingocoin.io/'),
      new RegExp('^https://staking-webapp.pages.dev/'),
    ],
    integrations: [
      Sentry.browserTracingIntegration({ router }),
      Sentry.replayIntegration(),
    ],
    // Tracing
    tracesSampleRate: 0.1, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: [/^https:\/\/api-(dev|prod).lingo.tropee.com/],
    // Session Replay
    replaysSessionSampleRate: sessionStorage.getItem('debugCode') ? 1 : 0,
    replaysOnErrorSampleRate: sessionStorage.getItem('debugCode') ? 1 : 0,
    environment: appEnv,
  })
  if (sessionStorage.getItem('debugCode')) {
    Sentry.setExtra('debugCode', sessionStorage.getItem('debugCode'))
  }
}

// End Sentry
app.component('InlineSvg', InlineSvg)
app.use(router)
app.use(WagmiPlugin, { config })
app.use(VueQueryPlugin, { queryClient })
app.use(i18n)
app.mount('#app')
