<template>
  <div class="prices-wrapper flex justify-center items-center [&>.section-wrapper]:w-[40vw]">
    <div
      v-if="!pendingActivity"
      class="left-images section-wrapper justify-center items-center hidden md:flex"
    >
      <TransitionGroup name="left-to-right">
        <div v-if="isConnected || props.shouldHidePrizes" />
        <div
          v-for="image in leftImages"
          v-else
          :key="image.alt"
          class="left-image"
          :class="{ 'hidden md:block': image.smHidden }"
          :style="{ maxWidth: image.width + 'px', marginLeft: image.padding + 'px', zIndex: image.zIndex }"
        >
          <img
            :src="image.src"
            :alt="image.alt"
            :style="isMobile ? { maxWidth: image.width + 'px' } : {}"
          >
        </div>
      </TransitionGroup>
    </div>
    <div class="min-w-0 w-full">
      <slot />
    </div>
    <div
      v-if="!pendingActivity"
      class="right-images section-wrapper justify-center items-center hidden md:flex"
    >
      <TransitionGroup name="right-to-left">
        <div v-if="isConnected || props.shouldHidePrizes" />
        <div
          v-for="image in rightImages"
          v-else
          :key="image.alt"
          class="right-image"
          :class="{ 'hidden md:block': image.smHidden }"
          :style="{ maxWidth: image.width + 'px', marginRight: image.padding + 'px', zIndex: image.zIndex }"
        >
          <img
            :src="image.src"
            :alt="image.alt"
            :style="isMobile ? { maxWidth: image.width + 'px' } : {}"
          >
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import gift11 from '@/assets/images/home/gift-1-1.png'
import gift12 from '@/assets/images/home/gift-1-2.png'
import gift13 from '@/assets/images/home/gift-1-3.png'
import gift21 from '@/assets/images/home/gift-2-1.png'
import gift22 from '@/assets/images/home/gift-2-2.png'
import gift23 from '@/assets/images/home/gift-2-3.png'
import { useDynamicHome } from '@/composables/dynamic-home'
import { useGetMe } from '@/composables/get-me'
import { useWindowSize } from '@vueuse/core'
import { computed } from 'vue'

const props = defineProps<{
  shouldHidePrizes: boolean
}>()

const { pendingActivity } = useDynamicHome()

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)
const { isConnected } = useGetMe()

const leftImages = computed(() => [
  {
    smHidden: true,
    src: gift11,
    alt: 'Image 1',
    width: 232,
    padding: 0,
    zIndex: 1,
  },
  {
    src: gift12,
    alt: 'Image 2',
    width: isMobile.value ? 164 : 328,
    padding: isMobile.value ? -70 : -106,
    zIndex: 2,
  },
  {
    src: gift13,
    alt: 'Image 3',
    width: isMobile.value ? 188 : 376,
    padding: isMobile.value ? -60 : -118,
    zIndex: 3,
  },
])

const rightImages = computed(() => [
  {
    src: gift21,
    alt: 'Image 4',
    width: isMobile.value ? 188 : 376,
    padding: isMobile.value ? -60 : -118,
    zIndex: 3,
  },
  {
    src: gift22,
    alt: 'Image 5',
    width: isMobile.value ? 164 : 328,
    padding: isMobile.value ? -70 : -106,
    zIndex: 2,
  },
  {
    smHidden: true,
    src: gift23,
    alt: 'Image 6',
    width: 232,
    padding: 0,
    zIndex: 1,
  },
])

</script>

<style scoped>
.prices-wrapper {
  position: relative;
}

.section-wrapper {
  padding-top: 100px;
  z-index: 1;
  height: 100%;
  position: absolute;
  z-index: 1;
  pointer-events: none;
}

.left-images {
  display: flex;
  align-items: center;
  justify-content: left;
  top: 0;
  left: 0;
}

.right-images {
  display: flex;
  align-items: center;
  justify-content: right;
  top: 0;
  right: 0;
}

.left-to-right-enter-active,
.right-to-left-enter-active,
.left-to-right-leave-active,
.right-to-left-leave-active {
  transition: all 0.5s ease;
}

.left-to-right-enter-from {
  opacity: 0;
  transform: translateX(-500px);
}

.right-to-left-enter-from {
  opacity: 0;
  transform: translateX(500px);
}

.left-to-right-leave-to {
  opacity: 0;
  transform: translateX(-500px);
}

.right-to-left-leave-to {
  opacity: 0;
  transform: translateX(500px);
}
</style>
