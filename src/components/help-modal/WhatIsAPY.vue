<template>
  <div class="flex flex-col gap-4 w-[90vw] md:w-[388px]">
    <h1 class="text-lavender text-5xl leading-10 font-medium tracking-[-2.4px] whitespace-pre-line">
      {{ t('modals.helpModal.whatIsAPY.title') }}
    </h1>
    <div class="flex flex-col text-purple-gray text-base md:text-[20px] leading-6 tracking-[-0.6px] gap-8 ">
      <span class="flex flex-col">
        <span v-html="t('modals.helpModal.whatIsAPY.description')" />
      </span>

      <div class="flex flex-col gap-0 pl-8 pr-4">
        <span class="list-item pl-2 marker:text-lavender">{{ t('modals.helpModal.whatIsAPY.flexibleStaking') }}</span>
        <span class="list-item pl-2 marker:text-lavender">{{ t('modals.helpModal.whatIsAPY.element6Boost') }}</span>
      </div>

      <span class="">{{ t('modals.helpModal.whatIsAPY.reflection') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
