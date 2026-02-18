import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import es from './locales/es.json'
import it from './locales/it.json'
import fr from './locales/fr.json'
import pt from './locales/pt.json'
import type { LocaleType } from './types'
import { Settings } from 'luxon'

// Get browser language or default to English
const getDefaultLocale = (): LocaleType => {
  const browserLang = navigator.language.split('-')[0]
  return ['en', 'es', 'it', 'fr', 'pt'].includes(browserLang) ? (browserLang as LocaleType) : 'en'
}

// Get stored locale from localStorage or use default
const getStoredLocale = (): LocaleType => {
  try {
    const stored = localStorage.getItem('lingo-locale')

    if (stored && ['en', 'es', 'it', 'fr', 'pt'].includes(stored)) {
      return stored as LocaleType
    }

    const defaultLocale = getDefaultLocale()
    Settings.defaultLocale = defaultLocale
    return defaultLocale
  } catch (error) {
    console.error('❌ Error getting stored locale:', error)
    return 'en'
  }
}

const params = new URLSearchParams(window.location.search)
const lpVar = params.get('lp_var') || ''
const stored = localStorage.getItem('lingo-locale') || ''
const shouldLoadLocale = lpVar.includes('wheel') || Boolean(stored)
const initialLocale = shouldLoadLocale ? getStoredLocale() : 'en'

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    es,
    it,
    fr,
    pt,
  },
  pluralizationRules: {
    en: (choice: number) => {
      return choice === 1 ? 0 : 1
    },
    es: (choice: number) => {
      return choice === 1 ? 0 : choice >= 2 && choice <= 4 ? 1 : 2
    },
    it: (choice: number) => {
      return choice === 1 ? 0 : choice >= 2 && choice <= 4 ? 1 : 2
    },
    fr: (choice: number) => {
      return choice === 1 ? 0 : choice >= 2 ? 1 : 2
    },
    pt: (choice: number) => {
      return choice === 1 ? 0 : choice >= 2 && choice <= 4 ? 1 : 2
    },
  },
})

// Export function to change locale
export const setLocale = (locale: LocaleType): void => {

  i18n.global.locale.value = locale
  // update datetime locale
  Settings.defaultLocale = locale
  localStorage.setItem('lingo-locale', locale)
  document.documentElement.lang = locale
}

// Export function to get current locale
export const getCurrentLocale = (): LocaleType => {
  return i18n.global.locale.value as LocaleType
}

// Export available locales
export const availableLocales = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
] as const