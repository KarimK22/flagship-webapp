<template>
  <div>
    <h3 class="text-2xl md:text-3xl font-bold text-lavender mb-5">Live Wins</h3>
    <div class="flex flex-col gap-1">
      <div
        v-for="(win, i) in wins"
        :key="i"
        class="flex items-center gap-3 py-3 border-b border-[#1a1a3e] last:border-0"
      >
        <!-- Avatar -->
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          :style="{ background: `linear-gradient(135deg, ${win.color}33, ${win.color}66)` }"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <circle
              cx="10"
              cy="7"
              r="4"
              :fill="win.color"
              opacity="0.8"
            />
            <path
              d="M2 18C2 14.6863 5.58172 12 10 12C14.4183 12 18 14.6863 18 18"
              :stroke="win.color"
              stroke-width="2"
              stroke-linecap="round"
              opacity="0.8"
            />
          </svg>
        </div>
        <!-- Prize & User -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-lavender truncate">{{ win.prize }}</p>
          <p class="text-xs text-purple-gray">{{ win.user }}</p>
        </div>
        <!-- Time -->
        <span class="text-xs text-purple-gray flex-shrink-0">{{ win.time }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  wins: Array<{
    prize: string
    user: string
    time: string
    color: string
  }>
}>()
</script>
