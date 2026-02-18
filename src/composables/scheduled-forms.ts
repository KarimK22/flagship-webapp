import { computed, ref } from 'vue'
import initTallyForm, { TallyFormId } from '@/lib/tally'

const STORAGE_KEY_LAST_OPEN_MONTH = 'scheduled_form_last_open_month'
const DAYS_WINDOW = 5 // Last N days of each month

function getCurrentMonthKey(): string {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

function isWithinLastNDays(n: number): boolean {
  const now = new Date()
  // Local calendar days for the user
  const year = now.getFullYear()
  const monthIndex = now.getMonth() // 0-11
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  return now.getDate() > (daysInMonth - n)
}

function getLastOpenMonth(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_LAST_OPEN_MONTH)
  } catch {
    return null
  }
}

function setLastOpenMonth(monthKey: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_LAST_OPEN_MONTH, monthKey)
  } catch {
    // ignore
  }
}

export function useScheduledForms() {
  const currentMonthKey = ref<string>(getCurrentMonthKey())
  const lastOpenMonth = ref<string | null>(getLastOpenMonth())

  const isInWindow = computed<boolean>(() => isWithinLastNDays(DAYS_WINDOW))

  const isDue = computed<boolean>(() => {
    if (!isInWindow.value) return false
    return lastOpenMonth.value !== currentMonthKey.value
  })

  function markOpened(): void {
    const key = getCurrentMonthKey()
    lastOpenMonth.value = key
    setLastOpenMonth(key)
  }

  async function openScheduledForm(options?: { address?: string }) {
    if (!isDue.value) return
    const formId = TallyFormId.SCHEDULED_FORM
    await initTallyForm(options?.address, formId)
    markOpened()
  }

  return {
    // state
    isInWindow,
    isDue,
    // actions
    openScheduledForm,
    markOpened,
  }
}

export type UseScheduledForms = ReturnType<typeof useScheduledForms>

