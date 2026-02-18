<template>
  <div class="mb-12">
    <h2 class="text-3xl font-bold mb-6">
      Your Reward History
    </h2>
    <div class="space-y-4">
      <div
        v-for="(item, index) in history"
        :key="index"
        class="bg-[#1A1A24] p-4 rounded-lg flex justify-between items-center"
      >
        <div class="text-gray-400">
          {{ item.date }}
        </div>
        <div class="text-white">
          {{ item.reward }}
        </div>
      </div>
    </div>
    <BaseButton
      variant="ghost"
      class="mt-4"
    >
      Show More
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { BaseButton } from '@/components/ui/button'

interface RewardHistoryItem {
  date: string
  reward: string
}

defineProps<{
  history: RewardHistoryItem[]
}>()
</script>