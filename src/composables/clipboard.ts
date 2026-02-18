const useClipboard = () => {
  const copyToClipboard = (text: string) => {
    if (window.navigator.clipboard) {
      window.navigator.clipboard.writeText(text)
    } else {
      console.warn('no clipboard available', text)
    }
  }

  return {
    copyToClipboard,
  }
}

export {
  useClipboard,
}