import { EUpsellSteps } from '@/types/staking'
import type { DateTime } from 'luxon'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

let upsellModals: ReturnType<typeof createUpsellModals> | null = null

const createUpsellModals = () => {
  const showUpsellModal = ref(false)
  const showFreePowerMilesPromoModal = ref(false)
  const freePowerMilesPromoVariant = ref<'basic' | 'grant_power_miles'>('basic')
  const freePowerMilesPromoEndDate = ref<DateTime>()
  const upsellStep = ref(EUpsellSteps.BUY_SELECTOR)
  const route = useRoute()

  watch(
    route,
    (newRoute) => {
      const fsContinue = newRoute.query.fs_continue
      const fsStep = newRoute.query.fs_step as EUpsellSteps
      if (fsContinue === 'true' && fsStep) {
        upsellStep.value = fsStep
        showUpsellModal.value = true
      } else {
        showUpsellModal.value = false
      }
    },
    { immediate: true },
  )

  return {
    showUpsellModal,
    upsellStep,
    showFreePowerMilesPromoModal,
    freePowerMilesPromoVariant,
    freePowerMilesPromoEndDate,
  }
}

export const useUpsellModals = () => {
  if (!upsellModals) {
    upsellModals = createUpsellModals()
  }

  return upsellModals
}