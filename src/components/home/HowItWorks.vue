<template>
  <section
    class="flex flex-col gap-0 md:gap-4"
    :style="{
      '--section-bg': `url(${sectionBg})`,
      '--section-bg-mobile': `url(${sectionBgMobile})`,
    }"
  >
    <h2 class="text-lavender md:text-[56px] text-[40px] font-normal leading-12 tracking-[-2.8px] mb-4 text-center">
      {{ t('home.howItWorks.title') }}
    </h2>
    <span class="text-[#9A9AB8] text-base font-semibold leading-6 tracking-[-0.16px] text-center mb-8 md:mb-16 whitespace-pre-line">
      {{ t('home.howItWorks.subtitle') }}
    </span>
    <div
      class="flex flex-col md:flex-row gap-4 items-center justify-center [&_div]:bg-[image:var(--section-bg-mobile)] md:[&_div]:bg-[image:var(--section-bg)] [&_div]:bg-cover [&_div]:h-[256px] [&_div]:w-[343px] md:[&_div]:min-w-[429px] [&_div]:rounded-2xl overflow-x-auto"
    >
      <div class="flex flex-col h-64 md:bg-left-top! justify-center items-center p-8 pt-0">
        <img
          :src="lingo"
          alt="lingo"
          class="w-[128px] h-[128px]"
        >
        <h1 class="text-lavender text-[32px] font-normal leading-8 tracking-[-1.6px] mb-2">
          {{ t('home.howItWorks.step1.title') }}
        </h1>
        <span class="text-[#9A9AB8] text-xl font-normal leading-6 tracking-[-0.6px] text-center">
          {{ t('home.howItWorks.step1.description') }}
        </span>
      </div>
      <div class="flex flex-col h-64 bg-center! justify-center items-center p-8 pt-0">
        <img
          :src="points"
          alt="points"
          class="w-[128px] h-[128px]"
        >
        <h1 class="text-lavender text-[32px] font-normal leading-8 tracking-[-1.6px] mb-2">
          {{ t('home.howItWorks.step2.title') }}
        </h1>
        <span class="text-[#9A9AB8] text-xl font-normal leading-6 tracking-[-0.6px] text-center">
          {{ t('home.howItWorks.step2.description') }}
        </span>
      </div>
      <div class="flex flex-col h-64 bg-right-bottom! justify-center items-center p-8 pt-0">
        <img
          :src="repeat"
          alt="repeat"
          class="w-[128px] h-[128px]"
        >
        <h1 class="text-lavender text-[32px] font-normal leading-8 tracking-[-1.6px] mb-2">
          {{ t('home.howItWorks.step3.title') }}
        </h1>
        <span class="text-[#9A9AB8] text-xl font-normal leading-6 tracking-[-0.6px] text-center">
          {{ t('home.howItWorks.step3.description') }}
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useTranslation } from '@/composables/use-i18n'
import lingo from '@/assets/images/home/how-it-works/lingo-icon.png'
import points from '@/assets/images/home/how-it-works/power-icon.png'
import repeat from '@/assets/images/home/how-it-works/repeat-icon.png'
import sectionBg from '@/assets/images/home/how-it-works/section-bg.png'
import sectionBgMobile from '@/assets/images/home/how-it-works/section-bg-mobile.png'

const { t } = useTranslation()
</script>
