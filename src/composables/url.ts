export const currentUrl = (): string => {
  return window.location.href
}

export const cleanUpUrl = (url: string): string => {
  return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
}

export const cleanUpUrlQueries = (url: string): string => {
  return url.split('?')[0].replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
}