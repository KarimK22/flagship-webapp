import { ref } from 'vue'
import flagsmith from 'flagsmith'
import type { IFlags } from 'flagsmith'
import { env } from '@/env.ts'

const flags = ref<IFlags<string>>({})
const isInitialized = ref(false)
export function useFeatureFlags() {

  if (!isInitialized.value) {
    flagsmith.init({
      environmentID: env.flagsmithEnvironmentId,
      onChange: () => {
        flags.value = flagsmith.getAllFlags()
      },
    })
    isInitialized.value = true
  }

  return {
    flags,
    isFeatureEnabled: (key: string) => Boolean(flags.value[key]?.enabled),
  }
}