<template>
  <div class="card">
    <div
      class="w-full h-full opacity-0 transition-opacity duration-300"
      :class="{ 'is-current': isCurrent }"
    />
    <Transition name="fade">
      <div
        v-if="isCurrent"
        class="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center"
      >
        <h1 class="text-lavender text-5.5xl tracking-[-2.8px] leading-10">
          {{ t('components.placeholderCard.thisSpot') }}
        </h1>
        <p
          class="second-text text-[32px] tracking-[-1.6px] leading-12"
          :class="{ 'text-[20px]!': locale !== 'en' }"
        >
          {{ t('components.placeholderCard.waitingForContent') }}
        </p>
        <img
          :src="lingoLogo"
          alt="lingo-logo"
          class="w-[88px] h-auto mt-16"
        >
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import lingoLogo from '@/assets/images/rewards/lingo-logo.png'
import { useTranslation } from '@/composables/use-i18n'

const { t, locale } = useTranslation()

defineProps<{
    isCurrent: boolean
}>()
</script>

<style scoped>
.card {
    background-color: #14141F;
    background-image: repeating-linear-gradient(-45deg,
            hsla(240, 22%, 10%, 0.8) 0px,
            hsla(240, 22%, 10%, 0.8) 15px,
            #1F202D 15px,
            #1F202D 30px);
    height: 100%;
    width: 100%;
}

.second-text {
    background: linear-gradient(180deg, #F1E6FA 0%, #6D6D8F 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.is-current {
    background-color: #1c1c27;
    opacity: 0.24;
    background: radial-gradient(94.04% 100% at 50% 0%, #D4C5EB 0%, rgba(38, 38, 56, 0.00) 100%);
}

/* TODO: Put this animation globally */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.3s ease;
}

.slide-fade-enter-from {
    opacity: 0;
    transform: translateX(20px);
}

.slide-fade-leave-to {
    opacity: 0;
    transform: translateX(-20px);
}
</style>
