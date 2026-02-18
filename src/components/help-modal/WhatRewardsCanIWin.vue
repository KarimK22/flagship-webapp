<template>
  <div class="flex flex-col gap-4 w-full md:w-[388px]">
    <h1 class="text-lavender text-5xl leading-10 font-medium tracking-[-2.4px] pr-10">
      {{ t('views.faq.whatRewardsCanIWin.title1') }}
      <IconWrapper
        :with-borders="false"
        variant="gray"
        class="inline-block align-middle !h-10 !w-12 -translate-x-14 md:translate-x-0"
      >
        <InlineSvg
          :src="asteroidIcon"
          class="width-[155px] -translate-y-10"
        />
      </IconWrapper>
      {{ t('views.faq.whatRewardsCanIWin.title2') }}
    </h1>
    <div class="flex flex-col text-purple-gray text-base md:text-[20px] leading-6 tracking-[-0.6px] gap-1 pr-10">
      <span class="flex flex-col">
        <span v-html="t('views.faq.whatRewardsCanIWin.rafflesDescription')"></span>
        <span v-html="t('views.faq.whatRewardsCanIWin.elementsDescription')"></span>
      </span>

      <div class="flex flex-col gap-0 pl-8 pr-4">
        <span class="list-item pl-2" v-html="t('views.faq.whatRewardsCanIWin.apyReward')"></span>
        <span class="list-item pl-2" v-html="t('views.faq.whatRewardsCanIWin.airdropReward')"></span>
        <span class="list-item pl-2" v-html="t('views.faq.whatRewardsCanIWin.carReward')"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import asteroidIcon from '@/assets/images/smash-asteroid.svg'
import InlineSvg from 'vue-inline-svg'
import IconWrapper from '../icon-wrapper/IconWrapper.vue'

const { t } = useI18n()
</script>
