<template>
  <div class="flex-shrink-0 w-[220px] md:w-[240px] bg-[rgba(14,14,26,0.8)] border border-[#262638] rounded-2xl overflow-hidden backdrop-blur-sm flex flex-col transition-transform hover:scale-[1.02] hover:border-[#3a3a5e]">
    <!-- Top badges -->
    <div class="flex items-center justify-between px-4 pt-4 pb-2">
      <span class="bg-[#2e7d32] text-white text-[11px] font-bold rounded-full px-2.5 py-0.5">
        {{ raffle.entries }} Entries
      </span>
      <span class="text-[11px] text-purple-gray font-medium">
        {{ raffle.daysLeft }} Days Left
      </span>
    </div>

    <!-- Prize name & price -->
    <div class="px-4 mb-2">
      <h4 class="text-lg font-bold text-lavender leading-tight">{{ raffle.name }}</h4>
      <p class="text-sm text-purple-gray">${{ raffle.price.toLocaleString() }}</p>
    </div>

    <!-- Image -->
    <div class="flex-1 flex items-center justify-center px-4 py-4 min-h-[140px]">
      <img
        v-if="raffle.imageUrl"
        :src="raffle.imageUrl"
        :alt="raffle.name"
        class="max-w-full max-h-[130px] object-contain"
      >
      <div
        v-else
        class="w-24 h-24 rounded-xl bg-[#1a1a3e] flex items-center justify-center text-3xl"
      >
        🎁
      </div>
    </div>

    <!-- Enter Button -->
    <div class="px-4 pb-4">
      <button class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF7847] to-[#FFBC70] text-white font-semibold rounded-full py-2.5 text-sm hover:opacity-90 transition-opacity">
        Enter for
        <span class="inline-flex items-center gap-1">
          <svg
            width="14"
            height="14"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M6 1L7.5 4.5L11 6L7.5 7.5L6 11L4.5 7.5L1 6L4.5 4.5L6 1Z"
              fill="white"
            />
          </svg>
          {{ raffle.powermilesCost }} Powermiles
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  raffle: {
    id: string
    name: string
    price: number
    entries: number
    daysLeft: number
    powermilesCost: number
    imageUrl?: string
  }
}>()
</script>
