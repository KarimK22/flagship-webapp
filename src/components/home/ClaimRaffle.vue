<template>
  <section class="flex flex-col md:flex-row gap-0 mt-0 mb-16 md:mt-24 md:mb-24">
    <div class="flex flex-col gap-4 w-full md:w-2/3">
      <h1
        v-if="fs_init === 'true'"
        class="text-lavender text-center md:text-left md:text-8xl text-[56px] font-normal -tracking-[2.8px] md:-tracking-[4.8px] leading-12 md:leading-20"
      >
        {{ t('components.claimRaffle.titleForFree') }}
      </h1>
      <h1
        v-else
        class="text-lavender text-center md:text-left md:text-8xl text-[56px] font-normal -tracking-[2.8px] md:-tracking-[4.8px] leading-12 md:leading-20"
      >
        {{ t('components.claimRaffle.titleAndWin') }}
      </h1>
      <GlowButton
        class="w-[220px] mt-16 hidden md:block"
        :color="EButtonColor.ORANGE"
        @click="handleClick"
      >
        {{ t('components.claimRaffle.smashAsteroid') }}
      </GlowButton>
    </div>
    <div class="relative w-full md:w-1/3 h-[450px] md:h-auto flex justify-center items-end">
      <img
        :src="bg"
        alt="bg"
        class="absolute top-[40%] md:top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[540px] md:min-w-[640px] h-[668px] md:h-[792px] -z-10"
      >
      <GlowButton
        class="w-[220px] mt-16 block md:hidden"
        :color="EButtonColor.ORANGE"
        @click="handleClick"
      >
        {{ t('components.claimRaffle.smashAsteroid') }}
      </GlowButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import bg from '@/assets/images/home/claim-now/tickets.png'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import { useUrlSearchParams } from '@vueuse/core'

const { t } = useI18n()
const { fs_init } = useUrlSearchParams('history')

const handleClick = () => {
  const asteroidContainer = document.getElementById('asteroid-container')
  if (asteroidContainer) {
    asteroidContainer.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
</script>
