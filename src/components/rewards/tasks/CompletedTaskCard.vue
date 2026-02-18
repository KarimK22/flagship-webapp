<template>
  <div
    class="relative overflow-hidden rounded-2xl bg-dark2/80 px-6 py-5"
  >
    <div class="flex flex-col gap-4 md:flex-row md:items-center">
      <div class="flex flex-1 flex-col gap-2">
        <div class="flex items-center gap-3">
          <div class="grid h-10 w-10 place-items-center rounded-xl bg-transparent">
            <img
              v-if="task.imageUrl"
              :src="task.imageUrl"
              :alt="task.taskName"
              class="h-11 w-11"
            >
          </div>
          <h4 class="text-lg font-normal text-lavender">
            {{ task.taskName }}
          </h4>
        </div>
        <p class="flex flex-wrap items-center gap-2 text-sm text-soft-gray">
          <span class="text-soft-gray">{{ t('components.tasks.youReceivedPrefix') }}</span>
          <span class="inline-flex items-center gap-1.5">
            <img
              :src="boltIcon"
              alt=""
              class="h-3.5 w-3.5"
            >
            <span class="font-semibold text-amber-soft">{{ formatNumberToUS(task.powerMilesEarned) }}</span>
            <span class="text-lavender">{{ t('components.tasks.powerMiles') }}</span>
          </span>
          <span class="text-soft-gray">{{ t('components.tasks.withYourBoost') }}</span>
        </p>
      </div>
      <div class="md:self-center">
        <span class="inline-flex items-center justify-center rounded-full border border-purple-gray/40 bg-dark3/80 px-5 py-2 text-sm font-semibold text-purple-gray">
          {{ t('components.tasks.claimed') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatNumberToUS } from '@/composables/helpers'
import { useTranslation } from '@/composables/use-i18n'
import type { TaskHistoryItem } from '@/services/api'
import boltIcon from '@/assets/images/bolt.svg'

defineProps<{
  task: TaskHistoryItem
}>()

const { t } = useTranslation()
</script>
