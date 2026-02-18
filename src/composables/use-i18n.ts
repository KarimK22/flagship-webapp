import { useI18n } from 'vue-i18n'
import { availableLocales, setLocale } from '@/i18n'
import { computed } from 'vue'
import type { LocaleType } from '@/i18n/types'

export function useLocalization() {
  const { t, locale } = useI18n()

  const changeLocale = (newLocale: LocaleType) => {
    setLocale(newLocale)
    // Force reactivity update
    locale.value = newLocale
  }

  const currentLocale = computed(() => {
    const current = locale.value as LocaleType
    return current
  })

  return {
    t,
    locale,
    currentLocale,
    changeLocale,
    availableLocales,
  }
}

// Type-safe translation helper
export function useTranslation() {
  const { t, locale } = useI18n()
  return { t, locale }
}