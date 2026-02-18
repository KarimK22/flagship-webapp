<template>
  <div
    v-if="currentLeaderboard && !isLoadingTopTraders"
    class="relative w-full mt-32 mb-10 flex flex-col items-center"
  >
    <!-- Top Glow Behind Title -->
    <img
      src="@/assets/images/leaderboard/leaderboard-bg.png"
      class="absolute top-[-70px] left-1/2 -translate-x-1/2
             w-[1100px] blur-[20px] pointer-events-none z-[1]"
    >

    <!-- Title -->
    <h2 class="text-center text-lavender text-6xl font-normal tracking-tight mb-12 z-[5]">
      {{ currentLeaderboard?.title || 'Leaderboard' }}
    </h2>

    <div class="w-full overflow-x-auto md:overflow-visible px-2 md:px-0">
      <!-- Table Container -->
      <div
        class="relative w-full max-w-6xl rounded-[16px] overflow-hidden backdrop-blur-md px-6 md:px-12 py-10 z-[5]"
        style="
          background: linear-gradient(
            180deg,
            rgba(38, 38, 56, 0.25) 0%,
            rgba(12, 12, 20, 0.25) 100%
          );
        "
      >
        <!-- Stroke Border Glow -->
        <img
          src="@/assets/images/leaderboard/strok.png"
          alt=""
          class="pointer-events-none select-none
                 absolute top-0 left-0 w-full h-auto z-[2] opacity-70"
        >

        <!-- DESKTOP HEADER -->
        <div
          class="hidden md:grid grid-cols-[120px_2fr_1fr_1fr_1fr] pb-6
                text-sm font-medium uppercase tracking-wide text-purple-gray"
        >
          <div>Rank</div>
          <div>Address</div>
          <div>Spins</div>
          <div>Vol Traded</div>
          <div>Rewards</div>
        </div>

        <!-- TABLE ROWS -->
        <div v-if="!isLoadingTopTraders">
          <div
            v-for="item in paddedList"
            :key="`${item.rank}-${item.address}`"
            class="py-6 border-b md:border-none border-white/10 last:border-none"
          >
            <!-- DESKTOP ROW -->
            <div
              class="hidden md:grid grid-cols-[120px_2fr_1fr_1fr_1fr] items-center
                    text-light1 text-base font-normal"
            >
              <!-- Rank -->
              <div class="relative w-[32px] h-[32px] flex items-center justify-center">
                <img
                  :src="medalIcon(item.rank)"
                  class="absolute inset-0 w-full h-full object-contain"
                >
                <span class="relative z-10">{{ item.rank }}</span>
              </div>

              <div class="tracking-wide">
                {{ item.address }}
              </div>
              <div class="tracking-wide">
                {{ item.spins }}
              </div>
              <div class="tracking-wide">
                $ {{ item.volume }}
              </div>
              <div class="tracking-wide">
                {{ item.reward?.name || null }}
              </div>
            </div>

            <!-- MOBILE ROW -->
            <div class="md:hidden flex gap-4 items-start text-light1 text-base">
              <div class="relative w-[32px] h-[32px] flex-shrink-0 flex items-center justify-center">
                <img
                  :src="medalIcon(item.rank)"
                  class="absolute inset-0 w-full h-full object-contain"
                >
                <span class="relative z-10 text-sm">{{ item.rank }}</span>
              </div>

              <div class="flex flex-col">
                <div class="font-mono">
                  {{ item.address }}
                </div>

                <div class="mt-1 text-sm opacity-70 flex gap-6">
                  <span>Spins: {{ item.spins }}</span>
                  <span>Vol: ${{ item.volume }}</span>
                </div>
                <div
                  v-if="item.reward"
                  class="mt-1 text-sm">
                  Reward: {{ item.reward?.name || null }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- LOADING -->
        <div
          v-else
          class="flex justify-center py-20 text-light1 text-lg">
          Loading leaderboard...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTradingGachaPulls } from '@/composables/use-wheel-pulls'
import { useLeaderboards } from '@/composables/use-wheel-pulls'
import rank1 from '@/assets/images/leaderboard/rank-1.png'
import rank2 from '@/assets/images/leaderboard/rank-2.png'
import rank3 from '@/assets/images/leaderboard/rank-3.png'
import rankDefault from '@/assets/images/leaderboard/rank-default.png'
import type { LeaderboardPrizes } from '@/services/api'

const {
  topTraders,
  isLoadingTopTraders,
} = useTradingGachaPulls()

const {
  currentLeaderboard,
} = useLeaderboards()

// Medal icons for ranks 1–3
const medalIcon = (rank: number) => {
  if (rank === 1) return rank1
  if (rank === 2) return rank2
  if (rank === 3) return rank3
  return rankDefault
}

const rewards = computed<LeaderboardPrizes[]>(() =>
  currentLeaderboard.value?.prizes ?? [],
)

const shorten = (addr: string) => {
  if (!addr) return '—'
  return addr.slice(0, 6) + '...' + addr.slice(-4)
}

const formatVolume = (v: number) => {
  if (typeof v !== 'number') return '—'
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(2) + 'M'
  if (v >= 1_000) return (v / 1_000).toFixed(2) + 'K'
  return v.toFixed(2)
}

const paddedList = computed(() => {
  if (!topTraders.value?.items) return []
  return topTraders.value.items.map((t) => ({
    rank: t.rank,
    address: shorten(t.walletAddress),
    spins: t.pullsCount,
    volume: formatVolume(t.tradedVolume),
    reward: rewards.value[t.rank-1],
  }))
})
</script>