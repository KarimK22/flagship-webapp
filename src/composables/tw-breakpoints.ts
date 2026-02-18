export default function useTWBreakpoints() {
  const _styles = getComputedStyle(document.documentElement)

  const _convertRemToPixels = (remValue: string): number => {
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
    return parseFloat(remValue.replace('rem', '')) * rootFontSize
  }

  const breakpointXS = 375
  const breakpointSM = _convertRemToPixels(_styles.getPropertyValue('--breakpoint-sm'))
  const breakpointMD = _convertRemToPixels(_styles.getPropertyValue('--breakpoint-md'))
  const breakpointLG = _convertRemToPixels(_styles.getPropertyValue('--breakpoint-lg'))
  const breakpointXL = _convertRemToPixels(_styles.getPropertyValue('--breakpoint-xl'))
  const breakpointXXL = _convertRemToPixels(_styles.getPropertyValue('--breakpoint-2xl'))

  return {
    breakpointXS,
    breakpointSM,
    breakpointMD,
    breakpointLG,
    breakpointXL,
    breakpointXXL,
  }
}
