<template>
  <div
    v-if="ptScores"
    class="container flex flex-col gap-4 mt-8"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <PTScoreCard
        v-for="tier in ptScores.tiers"
        :key="tier.tier"
        :tier="tier"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PTScoreCard from '@/components/rewards/PTScoreCard.vue'
import { usePTScores } from '@/composables/use-wheel-pulls'

const { ptScores } = usePTScores()
</script>