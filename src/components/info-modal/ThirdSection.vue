<script setup lang="ts">
import { useTranslation } from '@/composables/use-i18n'

const { t } = useTranslation()
</script>

<template>
  <div class="flex flex-col text-purple-gray text-base md:text-[20px] leading-6 tracking-[-0.6px] gap-6">
    <span>{{ t('components.thirdSection.unlockElement6') }}</span>

    <div class="flex flex-col gap-0">
      <span v-html="t('components.thirdSection.superchargedStaking')"></span>
      <span v-html="t('components.thirdSection.airdropKingStatus')"></span>
      <span v-html="t('components.thirdSection.yearEndJackpot')"></span>
    </div>
  </div>
</template>

<style scoped></style>
