
export const usePlatform = () => {
  const ua = navigator.userAgent || navigator.vendor
  const isMobile = ua.includes('Mobi')
  const phoneType = isMobile ? (ua.includes('Android') ? 'android' : 'ios') : null
  const userAgentFromApps = [
    'Instagram',
    'ByteLocale',
    'musical_ly',
    'TikTok',
    'FB',
  ]
  const isTelegram = Boolean(
    (window as unknown as { TelegramWebview?: string }).TelegramWebview ||
      (window as unknown as { TelegramWebviewProxy?: string })
        .TelegramWebviewProxy ||
      (window as unknown as { TelegramWebviewProxyProto?: string })
        .TelegramWebviewProxyProto,
  )

  const isEmbedded = userAgentFromApps.some(app => String(ua).toLowerCase().includes(app.toLowerCase())) || isTelegram
  const baseUrl = window.location.href

  const redirectToDefaultBrowser = () => {
    if (!isMobile) return
    const url =
      phoneType === 'android'
        ? `intent:${baseUrl}?redirected=true#Intent;end`
        : phoneType === 'ios'
          ? `x-safari-${baseUrl}?redirected=true`
          : null
    if (url) {
      window.location.href = url
    } else {
      console.warn('Unsupported platform or unable to determine device type.')
    }
  }

  return { redirectToDefaultBrowser, isEmbedded }
}
