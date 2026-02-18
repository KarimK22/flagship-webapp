<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <span
    class="z-10 relative flex flex-col text-purple-gray text-base md:text-[20px] leading-6 tracking-[-0.6px]"
    v-html="t('modals.infoModal.secondSection.combinedText')"
  />
</template>

<style scoped></style>
