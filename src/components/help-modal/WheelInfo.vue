<template>
  <div class="flex flex-col gap-4 w-[90vw] md:w-[388px]">
    <h1 class="text-lavender text-5xl leading-10 font-medium tracking-[-2.4px] whitespace-pre-line">
      {{ t('modals.helpModal.wheelInfo.title') }}
    </h1>
    <div class="flex flex-col text-purple-gray [&_strong]:contents [&_strong]:text-lavender text-base md:text-[20px] leading-6 tracking-[-0.6px] gap-8 ">
      <span
        class="flex flex-col"
        v-html="t('modals.helpModal.wheelInfo.description')"
      />

      <span class="" v-html="t('modals.helpModal.wheelInfo.note')"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
