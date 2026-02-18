<template>
  <BlockBrowserBase
    :model-value="showMaintenanceModal"
  >
    <template #header>
      {{ $t('components.maintenanceModal.title') }}
    </template>
    <template #description>
      <span class="text-lavender block mt-4">
        {{ $t('components.maintenanceModal.description') }}
        {{ $t('components.maintenanceModal.temporarilyUnavailable') }} <br>
        🔧 <strong>{{ env.maintenance.maintenanceCaption }}</strong><br>
        {{ $t('components.maintenanceModal.appreciatePatience') }}
      </span>
    </template>
  </BlockBrowserBase>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BlockBrowserBase from './BlockBrowserBase.vue'
import { env } from '@/env'

const showMaintenanceModal = ref(Boolean(env.maintenance.maintenanceCaption))
</script>
