<template>
  <CustomCursorWrapper :disabled="disabled || showTimer || !!prize">
    <div class="relative rounded-full size-[320px] sm:size-[420px]">
      <!-- Prize light bg -->
      <InlineSvg
        v-if="prize"
        :src="prizeLight"
        class="block absolute pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full scale-[4.1] transform-origin-center select-none"
      />

      <!-- Asteroid light bg -->
      <img
        v-else
        :src="asteroidLight"
        class="block absolute pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full scale-[4.1] transform-origin-center select-none"
      >

      <!-- Prize image -->
      <Transition name="zoom-in">
        <img
          v-if="elementImage"
          :src="elementImage"
          class="block absolute delay-100! pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-auto w-auto h-[90%] select-none"
        >
      </Transition>

      <!-- Raffle image -->
      <Transition name="zoom-in">
        <img
          v-if="raffle"
          :src="raffle?.imageUrl"
          :alt="raffle?.title"
          class="block absolute pointer-events-none rounded-xl select-none border border-transparent overflow-hidden top-0 right-[20px] backdrop-blur-md w-[96px] h-[143px] object-cover object-center"
        >
      </Transition>

      <!-- Asteroid video -->
      <video
        ref="videoRef"
        class="absolute top-0 left-0 w-full h-full pointer-events-none scale-[4.1] transform-origin-center select-none"
        width="100%"
        height="100%"
        muted
        playsinline
        preload="auto"
        :poster="asteroidVideoPoster"
        @loadeddata="onVideoLoad"
        @timeupdate="checkTime"
      >
        <source
          :src="asteroidVideoSafari"
          type="video/quicktime"
        >
        <source
          :src="asteroidVideoChrome"
          type="video/webm"
        >
      </video>

      <!-- V shape blur -->
      <InlineSvg
        :src="vShapeBlur"
        class="block absolute pointer-events-none top-[50px] left-1/2 -translate-x-1/2 max-w-[880px] select-none"
      />

      <div
        class="relative rounded-full w-full h-full"
        @click.prevent.stop="onSmash"
      >
        <template v-if="isConnected">
          <BaseTimer
            v-if="showTimer"
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
            :end-date-timestamp="endDateTimestamp"
            :progress="progress"
          />

          <div class="absolute bottom-0 left-1/2 -translate-x-1/2 z-[1]">
            <Transition
              name="bounce"
              mode="out-in"
            >
              <GlowButton
                v-if="showTimer"
                class="w-[160px] select-none"
                style="height: 40px"
                :color="EButtonColor.ORANGE"
                :text="t('components.interactiveAsteroid.speedUp')"
                @click.stop="emit('speedUp')"
              />
              <GlowButton
                v-else-if="prize"
                class="w-[160px] select-none"
                style="height: 40px"
                :color="
                  prize.type === GACHA_ASTEROID_PRIZE_TYPE.ELEMENT
                    ? EButtonColor.GREEN
                    : EButtonColor.ORANGE
                "
                :text="hasStakes ? t('components.interactiveAsteroid.tryAgain') : t('components.wheelContainer.whatsNext')"
                @click.prevent.stop="onReset"
              />
              <SmashCTAImage
                v-else-if="showText"
                :smash-amount="smashedAmount"
              />
            </Transition>
          </div>
        </template>
      </div>
    </div>

    <template #cursor>
      <GlowButton
        class="opacity-100 [&>span]:!p-0 size-12!"
      >
        <Shrink :size="16" />
      </GlowButton>
    </template>
  </CustomCursorWrapper>
</template>

<script lang="ts" setup>
import { computed, toRef } from 'vue'
import { Shrink } from 'lucide-vue-next'
import { useTranslation } from '@/composables/use-i18n'

import asteroidVideoPoster from '@/assets/images/game/asteroid-poster.png'
import asteroidVideoSafari from '@/assets/asteroid/safari.mov'
import asteroidVideoChrome from '@/assets/asteroid/chrome.webm'
import CustomCursorWrapper from '@/components/CustomCursorWrapper.vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import BaseTimer from '@/components/ui/timer/BaseTimer.vue'
import SmashCTAImage from '@/components/home-view/SmashCTAImage.vue'
import asteroidLight from '@/assets/images/game/asteroid-light.png'
import prizeLight from '@/assets/images/game/prize-light.svg'
import vShapeBlur from '@/assets/images/game/asteroid-v-shape.svg'
import {
  GACHA_ASTEROID_PRIZE_TYPE,
  type GachaAsteroidPrize,
} from '@/types/shared/gacha-game'
import { elementImageMap } from '@/const/asteroid'
import { powerMilesImage } from '@/assets/images/game/elements'
import type { Raffle } from '@/services/api'
import { EButtonColor } from '@/types/shared/button'

import { useAsteroidVideo } from '@/composables/use-asteroid-video'
import { useGetMe } from '@/composables/get-me'

const props = defineProps<{
  showTimer?: boolean
  disabled?: boolean
  smashedAmount: number
  totalPowerMiles: number
  endDateTimestamp: number
  progress: number
  prize: GachaAsteroidPrize | null
  raffle?: Raffle
  showText?: boolean
  isFreeAsteroid?: boolean
  hasStakes?: boolean
}>()
const emit = defineEmits<{
  (e: 'smash'): void
  (e: 'reset'): void
  (e: 'speedUp'): void
}>()

const smashedAmount = toRef(props, 'smashedAmount')
const { videoRef, onVideoLoad, checkTime } = useAsteroidVideo(smashedAmount)
const { isConnected } = useGetMe()
const { t } = useTranslation()

const elementImage = computed<string | null>(() => {
  if (!props.prize) return null

  switch (props.prize.type) {
  case GACHA_ASTEROID_PRIZE_TYPE.ELEMENT:
    return elementImageMap[
        props.prize.elementId as keyof typeof elementImageMap
    ]
  case GACHA_ASTEROID_PRIZE_TYPE.POWER_MILES:
    return powerMilesImage
  default:
    return null
  }
})

const onSmash = () => {
  if (props.disabled || props.prize || props.smashedAmount >= 3) return

  emit('smash')
}

function onReset() {
  emit('reset')

  // Reset video time
  if (videoRef.value) {
    videoRef.value.load()
    videoRef.value.currentTime = 0.001
  }
}

</script>

<style scoped>
.zoom-in-enter-active {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  transition-delay: 0.8s;
}

.zoom-in-leave-active {
  transition: transform 0.1s ease-in-out, opacity 0.1s ease-in-out;
  transition-delay: 0s;
}

.zoom-in-enter-from,
.zoom-in-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>
