<template>
  <div
    :key="badge.id"
    class="relative p-2 flex items-center justify-center max-w-[250px] perspective-1000"
    @click="flip"
  >
    <BadgeBorder />
    <div
      v-if="badge.isClaimable && !badge.isClaimed"
      class="z-1 w-[199px] h-[199px] absolute top-6 left-1/2 -translate-x-1/2"
    >
      <div
        class="flex items-center justify-center w-full h-full"
      >
        <div class="group relative flex flex-col items-center justify-center">
          <GlowButton
            :color="EButtonColor.PURPLE"
            class="w-[104px] backdrop-blur-sm"
            @click="emit('handle-receive', badge)"
          >
            {{ t('components.badgeObject.receive') }}
          </GlowButton>
        </div>
      </div>
    </div>
    <div
      v-else-if="badge.isLocked"
      class="z-1 w-[199px] h-[199px] absolute top-6 left-1/2 -translate-x-1/2"
    >
      <div class="w-full h-full bg-slate-300/10 rounded-full backdrop-blur-lg absolute top-0 left-0" />
      <div
        class="flex items-center justify-center w-full h-full isolate"
      >
        <div class="group flex flex-col items-center justify-center gap-[2px]">
          <div class="relative">
            <BadgePopover
              :badge="badge"
              class="absolute -top-25 -left-[190px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            />
            <img
              :src="LockIcon"
              alt="lock"
              class="w-16 h-[89px]"
            >
          </div>
          <BadgeTitle
            :text="badge.name"
            :font-size="32"
            :letter-spacing="-1.6"
            class="h-[40px] opacity-100 group-hover:opacity-0 group-hover:h-0 transition-[height,opacity] duration-300"
            :stroke-right-value="2"
            :blur-layers="[{ value: 0.5, opacity: 1 }, { value: 12, opacity: 0.4 }, { value: 6, opacity: 0.64 }, { value: 2, opacity: 0.8 }]"
          />
        </div>
      </div>
    </div>
    <div
      ref="objectRef"
      class="object"
      :class="{ 'cursor-pointer': !badge.isLocked }"
    >
      <img
        :src="badge.image"
        alt="front"
        width="235"
        height="223"
        class="object-face object-front"
        :class="{ 'opacity-43 grayscale-90 saturate-90 contrast-90 hue-rotate-300': badge.isClaimable && !badge.isClaimed }"
      >
      <div
        class="object-face object-back relative"
      >
        <img
          v-if="badge.isClaimed"
          :src="Backside"
          alt="back"
          width="235"
          height="223"
          class="w-full h-full object-cover"
        >
        <div class="absolute group top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-2">
          <BadgeTitle
            :text="badge.name"
            class="h-[40px]"
          />

          <div class="relative text-center h-[32px] w-[200px] text-[#1C1C29] text-sm font-semibold leading-4 -tracking-[0.42px]">
            <span class="absolute top-0 left-0 z-10">
              {{ t(`badgesDescription.${badge.description}`) }}
            </span>
            <span class="absolute top-[2px] left-[2px] text-[#F1E6FA] opacity-32 blur-[2px] mix-blend-plus-lighter w-[200px]">
              {{ t(`badgesDescription.${badge.description}`) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LockIcon from '@/assets/images/badges/lock-icon.png'
import Backside from '@/assets/images/badges/backside.png'
import type { Badge } from '@/const/badges'
import BadgePopover from '@/components/rewards/badges/BadgePopover.vue'
import { ref } from 'vue'
import BadgeTitle from '@/components/rewards/badges/BadgeTitle.vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import BadgeBorder from '@/components/rewards/badges/BadgeBorder.vue'
import { useTranslation } from '@/composables/use-i18n'

const { t } = useTranslation()

const props = defineProps<{
  badge: Badge
}>()

const emit = defineEmits<{
  (e: 'handle-receive', badge: Badge): void
}>()

const isFlipped = ref(true)
const objectRef = ref<HTMLElement | null>(null)

const flip = () => {
  if (!objectRef.value || props.badge.isLocked) return

  objectRef.value.classList.remove('flip-to-front', 'flip-to-back')
  void objectRef.value.offsetWidth

  if (isFlipped.value) {
    objectRef.value.classList.add('flip-to-front')
  } else {
    objectRef.value.classList.add('flip-to-back')
  }

  isFlipped.value = !isFlipped.value
}
</script>

<style scoped>
@keyframes flip-to-back {
  0% {
    transform: rotateY(0deg);
  }

  100% {
    transform: rotateY(1440deg);
  }
}

@keyframes flip-to-front {
  0% {
    transform: rotateY(1440deg);
  }

  100% {
    transform: rotateY(180deg);
  }
}

.flip-to-back {
  animation: flip-to-back 1.2s cubic-bezier(0.4, 0.2, 0.2, 1) forwards;
}

.flip-to-front {
  animation: flip-to-front 1.2s cubic-bezier(0.4, 0.2, 0.2, 1) forwards;
}

.object {
  width: 235px;
  height: 223px;
  position: relative;
  transform-style: preserve-3d;
}

.object-face {
  position: absolute;
  width: 235px;
  height: 223px;
  object-fit: contain;
  backface-visibility: hidden;
  border-radius: 50%;
}

.object-back {
  transform: rotateY(180deg);
}

.object-front {
  transform: rotateY(0deg);
}
</style>

