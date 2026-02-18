const enc = new TextEncoder()

export function base64urlEncode(text: string): string {
  const bytes = enc.encode(text)
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '')
  }
  let bin = ''
  bytes.forEach((b) => (bin += String.fromCharCode(b)))
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function xorEncryptDecrypt(text: string, key: string): string {
  const textChars = Array.from(text).map((c) => c.charCodeAt(0))
  const keyChars = Array.from(key).map((c) => c.charCodeAt(0))

  return String.fromCharCode(
    ...textChars.map((char, i) => char ^ keyChars[i % keyChars.length])
  )
}

export const makeRequestId = () =>
  base64urlEncode(xorEncryptDecrypt(`flagship/${Date.now()}`, 'flagship-vue'))
