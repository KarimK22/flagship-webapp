// just once per page load
let isAlreadyInitialized = false

export enum TallyFormId {
  DEFAULT = 'wvvxE4',
  AFTER_MODAL_CLOSE = '3EV0yl',
  TGE_USER = '3jVgrY',
  SCHEDULED_FORM = 'mKjOrD',
}

const availableFormIds = [TallyFormId.SCHEDULED_FORM]

const ensureTallyScriptLoaded = (): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve() // SSR no hace nada
    // @ts-expect-error - ventana extendida
    if (window.Tally && typeof window.Tally.openPopup === 'function') {
      resolve()
      return
    }
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src^="https://tally.so/widgets/embed.js"]',
    )
    if (existing) {
      existing.addEventListener('load', () => resolve())
      // Si ya estaba cargado, resolvemos igual
      if (existing.dataset.loaded === '1') resolve()
      return
    }
    const s = document.createElement('script')
    s.src = 'https://tally.so/widgets/embed.js'
    s.async = true
    s.onload = () => {
      s.dataset.loaded = '1'
      resolve()
    }
    document.head.appendChild(s)
  })
}

const initTallyForm = async (
  address?: string,
  formId: TallyFormId = TallyFormId.DEFAULT,
) => {
  if (!availableFormIds.includes(formId)) {
    console.error(`Invalid formId: ${formId}`)
    return
  }
  await ensureTallyScriptLoaded()
  const config = {
    formId,
    popup: {
      emoji: {
        text: '👋',
        animation: 'wave',
      },
      open: {
        trigger: 'load',
      },
      hiddenFields: {
        wallet_address: address || '',
      },
      layout: 'modal',
      autoClose: 0,
      doNotShowAfterSubmit: true,
    },
  }
  if (typeof window !== 'undefined' && !isAlreadyInitialized) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).Tally.openPopup(config.formId, config.popup)
    isAlreadyInitialized = true
  }
}

export default initTallyForm
