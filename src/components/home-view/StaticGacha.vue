<template>
  <div>
    <div class="relative rounded-full size-[320px] sm:size-[420px]">
      <!-- Prize light bg -->
      <InlineSvg
        v-if="prize"
        :src="prizeLight"
        class="block absolute pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full scale-[4.1] transform-origin-center select-none"
      />

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

      <img
        v-if="pendingActivity && !prize"
        :src="content.image"
        class="w-[404px] h-full mb-10 z-10 relative"
      >

      <div
        class="relative rounded-full w-full h-full"
      >
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 z-[1]">
          <Transition
            name="bounce"
            mode="out-in"
          >
            <GlowButton
              v-if="prize"
              class="w-[160px] select-none"
              style="height: 40px"
              :color="prize.type === GACHA_ASTEROID_PRIZE_TYPE.ELEMENT
                ? EButtonColor.GREEN
                : EButtonColor.ORANGE
              "
              :text="t('components.interactiveAsteroid.tryAgain')"
              @click.prevent.stop="onReset"
            />
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import prizeLight from '@/assets/images/game/prize-light.svg'
import {
  GACHA_ASTEROID_PRIZE_TYPE,
  type GachaAsteroidPrize,
} from '@/types/shared/gacha-game'
import { elementImageMap } from '@/const/asteroid'
import { powerMilesImage } from '@/assets/images/game/elements'
import type { Raffle } from '@/services/api'
import { EButtonColor } from '@/types/shared/button'
import { useTranslation } from '@/composables/use-i18n'

import { useDynamicHome } from '@/composables/dynamic-home'

const { t } = useTranslation()

const props = defineProps<{
  prize: GachaAsteroidPrize | null
  raffle?: Raffle
}>()
const emit = defineEmits<{
  (e: 'finished'): void
}>()

const { content, pendingActivity } = useDynamicHome()

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

function onReset() {
  emit('finished')
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
