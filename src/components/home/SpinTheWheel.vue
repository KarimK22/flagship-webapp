<template>
  <section class="flex flex-col md:flex-row gap-0 mt-0 mb-1 md:mt-24 md:mb-10">
    <div class="flex flex-col gap-4 w-full md:w-2/3">
      <h1
        class="text-lavender text-center md:text-left md:text-8xl text-4.5xl font-normal -tracking-[2px] md:-tracking-[4.8px] leading-8 md:leading-20"
      >
        {{ t('home.spinTheWheel.title') }}
      </h1>
      <GlowButton
        class="w-[220px] mt-16 hidden md:block"
        :color="EButtonColor.ORANGE"
        @click="handleClick"
      >
        {{ t('home.spinTheWheel.cta') }}
      </GlowButton>
    </div>
    <div class="relative w-full md:w-1/3 h-[450px] md:h-auto flex justify-center items-end">
      <img
        :src="bg"
        alt="bg"
        class="absolute top-[40%] md:top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[375px] md:min-w-[640px] -z-10"
      >
      <GlowButton
        class="w-[220px] block md:hidden absolute bottom-12 "
        :color="EButtonColor.ORANGE"
        @click="handleClick"
      >
        {{ t('home.spinTheWheel.cta') }}
      </GlowButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import bg from '@/assets/images/home/claim-now/gift-box.png'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'

const { t } = useI18n()

const handleClick = () => {
  const asteroidContainer = document.getElementById('wheel-container')
  if (asteroidContainer) {
    asteroidContainer.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
</script>
