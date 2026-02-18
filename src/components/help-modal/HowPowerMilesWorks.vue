<template>
  <div class="flex flex-col gap-4 w-[90vw] md:w-[388px]">
    <h1 class="text-lavender text-5xl leading-10 font-medium tracking-[-2.4px] pr-10 whitespace-pre-line">
      {{ t('modals.helpModal.howPowerMilesWork.title') }}
      <IconWrapper
        :with-borders="false"
        class="inline-block vertical-top"
      >
        <InlineSvg
          :src="powerIcon"
          class="size-10"
        />
      </IconWrapper>
    </h1>
    <div class="flex flex-col text-purple-gray text-base md:text-[20px] leading-6 tracking-[-0.6px] gap-8 pr-10">
      <span class="flex flex-col">
        <span>{{ t('modals.helpModal.howPowerMilesWork.description') }}</span>
      </span>

      <div class="flex flex-col gap-0 pl-8 pr-4">
        <span class="list-item pl-2 marker:text-lavender"><span class="text-lavender">{{ t('modals.helpModal.howPowerMilesWork.earning') }}</span> {{ t('modals.helpModal.howPowerMilesWork.earningDetails') }}</span>
        <span class="list-item pl-2 marker:text-lavender"><span class="text-lavender">{{ t('modals.helpModal.howPowerMilesWork.rewards') }}</span> {{ t('modals.helpModal.howPowerMilesWork.rewardsDetails') }}</span>
        <span class="list-item pl-2 marker:text-lavender"><span class="text-lavender">{{ t('modals.helpModal.howPowerMilesWork.boost') }}</span> {{ t('modals.helpModal.howPowerMilesWork.boostDetails') }}</span>
      </div>

      <span class="pr-10">{{ t('modals.helpModal.howPowerMilesWork.conclusion') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import powerIcon from '@/assets/images/bolt.svg'
import InlineSvg from 'vue-inline-svg'
import IconWrapper from '../icon-wrapper/IconWrapper.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
