<template>
  <section class="px-6 md:px-16 lg:px-24 py-20">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <h2 class="text-3xl md:text-4xl font-bold text-lavender text-center mb-4">
        Real People. Real Prizes.
      </h2>
      <p class="text-purple-gray text-center text-lg mb-14 max-w-xl mx-auto">
        Join thousands of winners already earning real rewards
      </p>

      <!-- Winner cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="winner in winners"
          :key="winner.name"
          class="bg-[rgba(14,14,26,0.8)] border border-[#262638] rounded-2xl p-6 hover:border-[#3a3a5e] transition-colors"
        >
          <!-- User info -->
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
              :style="{ background: `linear-gradient(135deg, ${winner.color}44, ${winner.color}88)`, color: winner.color }"
            >
              {{ winner.initials }}
            </div>
            <div>
              <p class="text-sm font-semibold text-lavender">{{ winner.name }}</p>
              <p
                class="text-xs font-semibold mt-0.5"
                :style="{ color: winner.color }"
              >
                {{ winner.tier }} Tier
              </p>
            </div>
          </div>

          <!-- Prize won -->
          <div
            class="bg-[#1a1a3e] border border-[#262638] rounded-xl p-4 mb-4"
          >
            <p class="text-lg font-bold text-lavender">{{ winner.prize }}</p>
            <p class="text-sm text-[#FFBC70] font-semibold">{{ winner.value }}</p>
          </div>

          <!-- Testimonial -->
          <p class="text-sm text-purple-gray leading-relaxed italic">
            "{{ winner.quote }}"
          </p>
        </div>
      </div>

      <!-- Live activity feed -->
      <div class="mt-12 bg-[rgba(14,14,26,0.8)] border border-[#262638] rounded-2xl p-6">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse" />
          <span class="text-sm font-semibold text-lavender">Live Wins</span>
        </div>
        <div class="space-y-3">
          <div
            v-for="(win, i) in recentWins"
            :key="i"
            class="flex items-center justify-between py-2 border-b border-[#1a1a3e] last:border-0"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                :style="{ background: `linear-gradient(135deg, ${win.color}33, ${win.color}66)`, color: win.color }"
              >
                {{ win.user.charAt(0).toUpperCase() }}
              </div>
              <div>
                <span class="text-sm font-semibold text-lavender">{{ win.user }}</span>
                <span class="text-sm text-purple-gray"> won </span>
                <span class="text-sm font-semibold text-lavender">{{ win.prize }}</span>
              </div>
            </div>
            <span class="text-xs text-purple-gray">{{ win.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const winners = [
  {
    name: 'Alex M.',
    initials: 'AM',
    tier: 'Gold',
    prize: 'Rolex Submariner',
    value: '$20,000',
    color: '#FFBC70',
    quote: 'I staked for the APY and ended up winning a Rolex. Absolutely unreal experience!',
  },
  {
    name: 'Sarah K.',
    initials: 'SK',
    tier: 'Silver',
    prize: 'iPhone 16 Pro',
    value: '$1,199',
    color: '#8A9AC2',
    quote: 'Won on my third week of staking. The daily spins make it so exciting.',
  },
  {
    name: 'CryptoWhale',
    initials: 'CW',
    tier: 'Diamond',
    prize: 'Custom Gaming PC',
    value: '$3,500',
    color: '#F1E6FA',
    quote: 'Diamond tier multipliers are insane. Already won multiple prizes this month.',
  },
]

const recentWins = [
  { user: 'alex_m', prize: 'AirPods Pro', time: '2m ago', color: '#C95CFF' },
  { user: 'crypto_k', prize: '$50 USDC', time: '8m ago', color: '#4CAF50' },
  { user: 'whale_3', prize: '250 Powermiles', time: '12m ago', color: '#FF7847' },
  { user: 'luna_22', prize: 'Raffle Entry', time: '15m ago', color: '#3333FF' },
  { user: 'staker_99', prize: '$25 LINGO', time: '18m ago', color: '#FFBC70' },
]
</script>
