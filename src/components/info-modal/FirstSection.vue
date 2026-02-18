<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col text-lavender text-base md:text-[20px] leading-6 tracking-[-0.6px] gap-4">
    <span class="text-purple-gray">
      {{ t('modals.infoModal.firstSection.platformRuns') }}
    </span>
    <span class="whitespace-pre-line">
      {{ t('modals.infoModal.firstSection.newToCrypto') }}<br>
      <span class="text-purple-gray text-sm leading-4 tracking-[-0.28px] font-semibold pt-2">
        {{ t('modals.infoModal.firstSection.stakingExplanation') }}
      </span>
    </span>
  </div>
</template>

<style scoped></style>
