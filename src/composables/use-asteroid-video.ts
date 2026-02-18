import { type MaybeRef, ref, toRef, watch } from 'vue'

export const useAsteroidVideo = (smashAmount: MaybeRef<number>) => {
  const videoRef = ref<HTMLVideoElement>()
  const isElementShown = ref(false)

  const smashedAmount = toRef(smashAmount)
  const isVideoEnded = ref(false)

  // Video breakpoints map, based on smashed amount and video duration (in seconds)
  const videoBreakpointsMap: Record<number, number> = {
    0: 0.001,
    1: 0.8,
    2: 1.9,
    3: 4.087,
  }

  const onVideoLoad = (e: Event) => {
    const target = e.target as HTMLVideoElement
    if (!target) return

    // Smash amount is also related to timeframe, if video changed, we need to reset it
    target.currentTime = 0.001

    if (smashedAmount.value === 2 && !isElementShown.value) {
      isElementShown.value = true
    }
  }

  // Handle video play
  watch(
    () => smashedAmount.value,
    async (newValue, oldValue) => {
      if (!videoRef.value) return

      // Set start time based on previous state
      videoRef.value.currentTime = videoBreakpointsMap[oldValue]

      // Show element when video on the last smash
      if (oldValue === 3 && newValue === 0) {
        isElementShown.value = true
        return
      }

      try {
        await videoRef.value.play()
      } catch (error) {
        console.error('Failed to play video:', error)
      }
    },
  )

  // handle pause video when it reaches the current breakpoint
  function checkTime(e: Event) {
    const target = e.target as HTMLVideoElement
    if (!target) return

    const refTime = videoBreakpointsMap[smashedAmount.value]
    if (target.currentTime > refTime) {
      target.pause()
      target.currentTime = refTime

      if (smashedAmount.value === 3) {
        isVideoEnded.value = true
      }
    }
  }

  watch(
    () => videoRef.value,
    (newValue, oldValue) => {
      if (newValue && !oldValue) {
        newValue.load()
      }
    },
  )

  return {
    videoRef,
    isVideoEnded,
    onVideoLoad,
    checkTime,
  }
}
