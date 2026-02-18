<template>
  <section class="mt-12">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6 px-6 md:px-16 lg:px-24">
      <div class="flex items-center gap-3">
        <h2 class="text-3xl md:text-4xl font-bold text-lavender">Raffles</h2>
        <span class="bg-[#1a1a3e] border border-[#262638] rounded-full px-3 py-1 text-sm text-lavender font-semibold">
          {{ raffleCount }}
        </span>
      </div>
    </div>

    <!-- Reuse the exact same 3D carousel from the Rewards page -->
    <RewardsCarousel type="raffles" />
  </section>
</template>

<script setup lang="ts">
import RewardsCarousel from '@/components/RewardsCarousel.vue'
import { useRaffles } from '@/composables/raffles'
import { computed } from 'vue'

const { sortedActiveRaffles } = useRaffles()
const raffleCount = computed(() => sortedActiveRaffles.value.length || 12)
</script>
