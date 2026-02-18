<script setup lang="ts">
import { useTranslation } from '@/composables/use-i18n'

const { t } = useTranslation()
</script>

<template>
  <div class="py-8">
    <h1 class="text-3xl font-bold text-white mb-6">
      {{ t('views.bridge.title') }}
    </h1>
    <p class="text-gray-400">
      {{ t('views.bridge.description') }}
    </p>
  </div>
</template>