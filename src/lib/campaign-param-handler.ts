import { utmCampaign } from '@/composables/auth'

export enum CampaignParam {
  UTM_CAMPAIGN = 'utm_campaign',
}

export enum CampaignParamValue {
  KOL_FREE_ASTEROID_APRIL_2025 = 'kol_free_asteroid_april_2025',
  DROPEE_CAMPAIGN_MAY_2025 = 'dropee_campaign_may_2025',
}

export function handleCampaignParams() {
  /* NOTE: If utm_campaign will have different values for different campaign types, we need to handle it differently */
  if (utmCampaign.value) {
    return
  }
  const urlParams = new URLSearchParams(window.location.search)
  const campaign = urlParams.get(CampaignParam.UTM_CAMPAIGN)
  utmCampaign.value = campaign as CampaignParamValue
}