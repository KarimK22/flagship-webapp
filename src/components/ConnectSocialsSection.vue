<template>
  <div class="min-w-[288px]">
    <span class="text-base text-light1">
      {{ t('common.connectSocials.title') }}
    </span>
    <div class="mt-4">
      <DiscordConnect />
    </div>
  </div>
</template>

<script setup lang="ts">
import DiscordConnect from '@/components/DiscordConnect.vue'
import { useTranslation } from '@/composables/use-i18n'

const { t } = useTranslation()
</script>
