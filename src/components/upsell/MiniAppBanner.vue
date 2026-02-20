<template>
  <div
    :style="{
      backgroundImage: `url(${headerBannerBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'bottom',
      backgroundRepeat: 'no-repeat',
    }"
    class="sticky top-0 left-0 right-0 z-10 w-full h-0 transition-[height,opacity] duration-300 ease-in-out opacity-0 overflow-hidden"
    :class="{
      'h-[104px] md:h-[80px] pointer-events-all opacity-100 cursor-pointer z-10': shouldShow && !isDismissed,
    }"
    role="button"
    @click="handleClick"
  >
    <div class="relative flex flex-row items-center justify-center container h-full">
      <!-- Dismiss button -->
      <button
        class="absolute top-2 right-2 md:top-1/2 md:right-4 md:-translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white/70 hover:text-white transition-colors z-20"
        aria-label="Dismiss banner"
        @click.stop="dismissBanner"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
      <img
        :src="sparklesLeft"
        class="pointer-events-none absolute left-0 top-0 h-full w-auto object-contain"
      >

      <div
        class="relative w-[96px] md:w-[120px] h-[64px] md:h-[72px]"
      >
        <img
          :src="rolexBg"
          class="pointer-events-none absolute inset-0 w-full h-full object-contain"
          style="z-index: 5"
        >

        <img
          :src="bannerImage"
          class="absolute top-1/2 left-[48%]
           -translate-x-1/2 -translate-y-[52%]
           w-[85px] md:w-[97px]
           h-auto object-contain pointer-events-none"
        >
      </div>

      <span
        class="text-white text-2xl md:text-[32px] leading-5 md:leading-8 tracking-[-1.28px] text-center whitespace-pre-line"
      >
        {{ $t('components.miniAppBanner.title') }}
      </span>

      <GlowButton
        :color="EButtonColor.ORANGE"
        class="w-[120px] md:w-[186px] m-1 md:m-3"
        @click="handleClick"
      >
        {{ $t('components.miniAppBanner.button') }}
      </GlowButton>

      <img
        :src="sparklesRight"
        class="pointer-events-none absolute right-0 top-0 h-full w-auto object-contain"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import headerBannerBg from '@/assets/images/header/banner-background.png'
import bannerImage from '@/assets/images/header/banner-rolex.png'
import sparklesLeft from '@/assets/images/header/banner-sparkles-left.png'
import sparklesRight from '@/assets/images/header/banner-sparkles-right.png'
import rolexBg from '@/assets/images/header/banner-rolex-background.png'
import { onMounted, ref, watch } from 'vue'
import { useGetMe } from '@/composables/get-me'
import GlowButton from '../ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import { useLocalStorage } from '@vueuse/core'

const { isConnected } = useGetMe()
const shouldShow = ref(true)
const isDismissed = useLocalStorage('miniAppBannerDismissed', false)
const forceClose = useLocalStorage('forceCloseMiniAppBanner', false)

function dismissBanner() {
  isDismissed.value = true
}

watch(isConnected, (newVal) => {
  if (newVal && !forceClose.value) {
    forceClose.value = true
  } else {
    forceClose.value = false
  }
})

const handleFormLoaded = (e: MessageEvent) => {
  if (e?.data?.includes?.('Tally.FormLoaded')) {
    document.body.style.pointerEvents = 'auto'
  }
}

onMounted(async () => {
  window.addEventListener('message', handleFormLoaded)

  return () => {
    window.removeEventListener('message', handleFormLoaded)
  }
})

function handleClick() {
  window.open('https://watchgacha.fun/', '_blank')
}
</script>

<style scoped>
.text-clip {
  position: absolute;
  left: 0;
}

.text-clip {
  background: linear-gradient(180deg, #ff9d5c 0%, rgba(255, 157, 92, 0) 64.42%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  z-index: 1;
  mix-blend-mode: plus-lighter;
  filter: blur(1px);
}

.text-main {
  color: #ff7847;
}
</style>
