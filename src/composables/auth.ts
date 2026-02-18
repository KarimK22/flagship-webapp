import { useLocalStorage } from '@vueuse/core'

import type { CampaignParamValue } from '@/lib/campaign-param-handler'

export const apiToken = useLocalStorage('apiToken', '')
export const referrerCode = useLocalStorage<string>('referrerCode', null)
export const loginProvider = useLocalStorage('loginProvider', '')
export const utmCampaign = useLocalStorage<CampaignParamValue>(
  'utm_campaign',
  null,
)
