<template>
  <section
    class="flex flex-col gap-0 md:gap-4"
    :style="{
      '--section-bg': `url(${sectionBg})`,
      '--section-bg-mobile': `url(${sectionBgMobile})`,
    }"
  >
    <h2 class="text-lavender md:text-[56px] text-[40px] font-normal leading-12 tracking-[-2.8px] mb-4 text-center">
      {{ t('home.whyTrustUs.title') }}
    </h2>
    <div
      class="flex flex-col md:flex-row gap-4 items-center justify-center [&>.card-content]:bg-[image:var(--section-bg-mobile)] md:[&>.card-content]:bg-[image:var(--section-bg)] [&>.card-content]:bg-cover [&>.card-content]:h-[256px] [&>.card-content]:w-[343px] md:[&>.card-content]:min-w-[429px] [&>.card-content]:rounded-2xl overflow-x-auto"
    >
      <div class="card-content flex flex-col h-64 md:bg-left-top! justify-center items-center pt-0">
        <img
          :src="community"
          alt="community"
          class="w-[128px] h-[128px]"
        >
        <h1 class="text-lavender text-[32px] font-normal leading-8 tracking-[-1.6px] mb-1">
          {{ t('home.whyTrustUs.step1.title') }}
        </h1>
        <span class="text-lavender text-5xl font-medium leading-10 tracking-[-2.4px] text-center">
          1.2M
        </span>
      </div>
      <div class="card-content flex flex-col h-64 bg-center! justify-center items-center pt-0">
        <img
          :src="x"
          alt="x"
          class="w-[128px] h-[128px]"
        >
        <h1 class="text-lavender text-[32px] font-normal leading-8 tracking-[-1.6px] mb-2">
          <span class="text-lavender text-4.5xl font-semibold leading-8 tracking-[-1.6px]">632.7K</span> {{ t('home.whyTrustUs.step2.title') }}
        </h1>
        <div>
          <GlowButton
            :text="t('home.whyTrustUs.step2.cta')"
            :color="EButtonColor.ORANGE"
            class="w-full min-w-[139px] mt-4"
            @click.stop.prevent="handleClickX"
          />
        </div>
      </div>
      <div class="card-content flex flex-col h-64 bg-right-bottom! justify-center items-center pt-0">
        <img
          :src="instagram"
          alt="instagram"
          class="w-[128px] h-[128px]"
        >
        <h1 class="text-lavender text-[32px] font-normal leading-8 tracking-[-1.6px] mb-2">
          <span class="text-lavender text-4.5xl font-semibold leading-8 tracking-[-1.6px]">87.3K</span> {{ t('home.whyTrustUs.step3.title') }}
        </h1>
        <div>
          <GlowButton
            :text="t('home.whyTrustUs.step3.cta')"
            :color="EButtonColor.GRAY"
            class="w-full min-w-[190px] mt-4"
            @click.stop.prevent="handleClickInstagram"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useTranslation } from '@/composables/use-i18n'
import community from '@/assets/images/home/why-trust-us/community.png'
import instagram from '@/assets/images/home/why-trust-us/instagram.png'
import x from '@/assets/images/home/why-trust-us/x.png'
import sectionBg from '@/assets/images/home/how-it-works/section-bg.png'
import sectionBgMobile from '@/assets/images/home/how-it-works/section-bg-mobile.png'

import { EButtonColor } from '@/types/shared/button'
import GlowButton from '../ui/button/GlowButton.vue'
import mixpanel from 'mixpanel-browser'

const { t } = useTranslation()

const handleClickX = () => {
  mixpanel.track(' Lingo X Profile View')
  window.open('https://x.com/Lingocoins', '_blank')
}

const handleClickInstagram = () => {
  mixpanel.track('Lingo Instagram Profile View')
  window.open('https://www.instagram.com/lingo?igsh=M3I0bm1wbHM0MDR6', '_blank')
}
</script>
