export function formatNumber(value: number, decimals: number): number {
  const formatted = value.toFixed(decimals)
  return parseFloat(formatted)
}

export const formatNumberToUS = (x: number | string | undefined | null): string => {
  if (!x || Number(x) < 0) {
    return '0'
  }
  const numberValue = Number(x)
  const formattedNumber = formatNumber(numberValue, 2)
  return formattedNumber.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

export function formatCamelCase(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .trim()
}

export function redirectToService(baseUrl: string, params: Record<string, string | number | undefined>): void {
  const queryString = new URLSearchParams(params as Record<string, string>).toString()
  const fullUrl = `${baseUrl}?${queryString}`

  window.open(fullUrl, '_blank')
}

export function formatWalletAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Encodes an image URL to handle spaces and special characters
 * @param url The image URL to encode
 * @returns Encoded URL or empty string
 */
export const encodeImageUrl = (url?: string): string => {
  if (!url) return ''
  return encodeURI(url)
}

export const generateAvatarUrl = (seed: string = 'anon') => {
  return `https://api.dicebear.com/9.x/bottts/svg?backgroundColor=D4C5EB&seed=${seed}`
}

export const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return 'th'
  switch (day % 10) {
  case 1: return 'st'
  case 2: return 'nd'
  case 3: return 'rd'
  default: return 'th'
  }
}

export const formatDateWithOrdinal = (date: Date): string => {
  const month = date.toLocaleDateString('en-US', { month: 'long' })
  const day = date.getDate()
  return `${month} ${day}${getOrdinalSuffix(day)}`
}
