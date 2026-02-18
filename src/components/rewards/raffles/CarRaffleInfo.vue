<template>
  <div class="container mt-8 mb-4 px-4">
    <div class="relative bg-dark2/80 border border-dark3/60 rounded-2xl p-6 overflow-hidden max-w-[520px] mx-auto">
      <!-- Subtle background glow -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        <div class="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[260px] h-[80px] bg-sosiska/6 blur-[50px] rounded-full" />
      </div>

      <div class="relative z-10 flex flex-col gap-5">
        <!-- Header -->
        <div>
          <h3 class="text-lg font-bold text-lavender tracking-tight">
            How Tickets Work
          </h3>
          <p class="text-sm text-purple-gray mt-0.5">
            Multiple ways to earn more raffle tickets
          </p>
        </div>

        <!-- Base Rate -->
        <div class="flex flex-col gap-1.5">
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-[#60A5FA]">BASE RATE</span>
          </div>
          <p class="text-sm text-lavender/80 pl-1">
            $10 = 1 ticket <span class="text-purple-gray">(anyone can play!)</span>
          </p>
        </div>

        <!-- Bulk Bonuses -->
        <div class="flex flex-col gap-2">
          <span class="text-sm font-bold text-[#34D399]">BULK BONUSES</span>
          <div class="flex flex-col gap-1 pl-1">
            <div
              v-for="tier in bulkTiers"
              :key="tier.amount"
              class="flex items-center gap-2 text-sm"
            >
              <span class="text-dark3/80 text-xs">{{ tier.last ? '└' : '├' }}─</span>
              <span class="text-lavender/90">${{ tier.amount }} = {{ tier.tickets }} tickets</span>
              <span class="text-[#34D399]/80 text-xs font-semibold">(+{{ tier.bonus }}%)</span>
            </div>
          </div>
        </div>

        <!-- Bonus Cards Grid -->
        <div class="grid grid-cols-2 gap-3">
          <!-- New User Bonus -->
          <div class="bg-[#A855F7]/8 border border-[#A855F7]/15 rounded-xl p-3">
            <div class="flex items-center gap-1.5 mb-1.5">
              <span class="text-xs">🆕</span>
              <span class="text-xs font-bold text-[#A855F7]">NEW USER</span>
            </div>
            <p class="text-xs text-lavender/80 leading-relaxed">
              First purchase gets <span class="text-[#A855F7] font-semibold">2x tickets</span>!
              Buy $100 and get 22 tickets instead of 11
            </p>
          </div>

          <!-- Early Bird -->
          <div class="bg-[#FFB547]/8 border border-[#FFB547]/15 rounded-xl p-3">
            <div class="flex items-center gap-1.5 mb-1.5">
              <span class="text-xs">👋</span>
              <span class="text-xs font-bold text-[#FFB547]">EARLY BIRD</span>
            </div>
            <p class="text-xs text-lavender/80 leading-relaxed">
              First 1,000 people get
              <span class="text-[#FFB547] font-semibold">+25% tickets</span>
            </p>
          </div>
        </div>

        <!-- Lock Bonus -->
        <div class="flex flex-col gap-2">
          <span class="text-sm font-bold text-[#FF9D5C]">LOCK BONUS</span>
          <div class="flex flex-wrap gap-2 pl-1">
            <div
              v-for="lock in lockTiers"
              :key="lock.months"
              class="flex items-center gap-1.5 bg-[#FF9D5C]/8 border border-[#FF9D5C]/15 rounded-lg px-3 py-1.5"
            >
              <span class="text-xs text-lavender/70">{{ lock.months }}mo</span>
              <span class="text-xs font-bold text-[#FF9D5C]">+{{ lock.bonus }}%</span>
            </div>
          </div>
        </div>

        <!-- Referral Bonuses -->
        <div class="flex flex-col gap-2">
          <span class="text-sm font-bold text-[#60A5FA]">BRING FRIENDS = GET TICKETS</span>
          <div class="flex flex-col gap-1 pl-1">
            <div
              v-for="ref in referralTiers"
              :key="ref.friends"
              class="flex items-center gap-2 text-sm"
            >
              <span class="text-dark3/80 text-xs">{{ ref.last ? '└' : '├' }}─</span>
              <span class="text-lavender/90">Refer {{ ref.friends }} friend{{ ref.friends > 1 ? 's' : '' }} <span class="text-purple-gray">(who buys $50+)</span></span>
              <span class="text-[#60A5FA]/80 text-xs font-semibold">+{{ ref.tickets }} tickets</span>
            </div>
          </div>
          <p class="text-xs text-purple-gray pl-1 mt-0.5">
            Referrer gets bonus, referee gets new user bonus
          </p>
        </div>

        <!-- No Cap Badge -->
        <div class="flex items-center justify-center">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-lavender/5 border border-lavender/15 px-4 py-1.5 text-xs font-bold text-lavender tracking-wide">
            NO CAP ON TICKETS
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const bulkTiers = [
  { amount: '100', tickets: '11', bonus: '10', last: false },
  { amount: '500', tickets: '62', bonus: '25', last: false },
  { amount: '1,000', tickets: '150', bonus: '50', last: false },
  { amount: '5,000', tickets: '1,000', bonus: '100', last: true },
]

const lockTiers = [
  { months: 3, bonus: 30 },
  { months: 6, bonus: 60 },
  { months: 12, bonus: 100 },
]

const referralTiers = [
  { friends: 1, tickets: 5, last: false },
  { friends: 5, tickets: 30, last: false },
  { friends: 10, tickets: 100, last: true },
]
</script>
