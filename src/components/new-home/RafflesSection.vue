<template>
  <section class="py-20">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8 px-6 md:px-16 lg:px-24">
      <div>
        <h2 class="text-3xl md:text-4xl font-bold text-lavender mb-1">
          Live Raffles
        </h2>
        <p class="text-purple-gray text-base">
          Enter for a chance to win — new prizes every week
        </p>
      </div>
      <router-link
        to="/rewards"
        class="hidden sm:flex items-center gap-2 text-sm text-lavender font-semibold hover:text-[#FFBC70] transition-colors"
      >
        View All
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M6 4L10 8L6 12"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </router-link>
    </div>

    <!-- Raffle Cards Grid -->
    <div class="px-6 md:px-16 lg:px-24">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          v-for="raffle in raffles"
          :key="raffle.name"
          class="group relative bg-[rgba(14,14,26,0.8)] border border-[#262638] rounded-2xl overflow-hidden hover:border-[#3a3a5e] transition-all duration-300"
        >
          <!-- Image -->
          <div class="relative h-[180px] flex items-center justify-center p-4 overflow-hidden">
            <div
              class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,92,255,0.08)_0%,transparent_70%)]"
            />
            <div class="text-6xl">
              {{ raffle.emoji }}
            </div>
          </div>

          <!-- Info -->
          <div class="p-4 pt-0">
            <h3 class="text-base font-bold text-lavender mb-1 truncate">
              {{ raffle.name }}
            </h3>
            <p class="text-sm text-[#FFBC70] font-semibold mb-3">
              {{ raffle.value }}
            </p>

            <!-- Countdown -->
            <div class="flex items-center gap-2 mb-4">
              <div class="flex items-center gap-1">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <circle
                    cx="7"
                    cy="7"
                    r="6"
                    stroke="#6B6B8D"
                    stroke-width="1.5"
                  />
                  <path
                    d="M7 4V7L9 9"
                    stroke="#6B6B8D"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
                <span class="text-xs text-purple-gray">{{ raffle.timeLeft }}</span>
              </div>
              <span class="text-xs text-purple-gray">·</span>
              <span class="text-xs text-purple-gray">{{ raffle.entries }} entries</span>
            </div>

            <!-- Enter button -->
            <button
              class="w-full bg-[#1a1a3e] border border-[#262638] text-lavender font-semibold rounded-xl py-2.5 text-sm hover:bg-[#262650] hover:border-[#3a3a5e] transition-all"
            >
              Enter Raffle
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const raffles = [
  { name: 'PlayStation 5', value: '$499', emoji: '🎮', timeLeft: '2d 8h', entries: 1247 },
  { name: 'iPhone 16 Pro', value: '$1,199', emoji: '📱', timeLeft: '3d 16h', entries: 2103 },
  { name: 'GoPro Hero 13', value: '$399', emoji: '📷', timeLeft: '1d 4h', entries: 856 },
  { name: 'Custom Gaming PC', value: '$3,500', emoji: '🖥️', timeLeft: '5d 22h', entries: 3421 },
]
</script>
