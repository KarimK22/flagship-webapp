<template>
  <div class="flex flex-col w-full bg-[#0C0C14] -mt-20 -mb-24 pt-24 overflow-hidden">
    <!-- Hero Section -->
    <HeroSection
      :username="mockUsername"
      :spins-ready="mockSpinsReady"
      :day-streak="mockDayStreak"
      :claimable-powermiles="mockClaimablePowermiles"
      :wheel-prizes="mockWheelPrizes"
    />

    <!-- Dream Reward -->
    <DreamRewardCard
      :title="mockDreamReward.title"
      :value="mockDreamReward.value"
      :score="mockDreamReward.score"
      :max-score="mockDreamReward.maxScore"
      :rank="mockDreamReward.rank"
      :total-participants="mockDreamReward.totalParticipants"
      :days-left="mockDreamReward.drawingIn.days"
      :hours-left="mockDreamReward.drawingIn.hours"
      :image-url="mockDreamReward.imageUrl"
    />

    <!-- Raffles -->
    <RafflesSection />

    <!-- Trading Boosts + Staking (left) + Live Wins (right) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 md:px-16 lg:px-24 mt-12">
      <!-- Left column: Trading Boosts + Staking stacked -->
      <div class="flex flex-col gap-6">
        <TradingBoosts :boosts="mockBoosts" />
        <StakingCard
          :apy="mockStaking.apy"
          :tier="mockStaking.tier"
          :staked-amount="mockStaking.stakedAmount"
        />
      </div>
      <!-- Right column: Live Wins -->
      <LiveWins :wins="mockLiveWins" />
    </div>

    <!-- Footer -->
    <HomeFooter />
  </div>
</template>

<script setup lang="ts">
import HeroSection from '@/components/new-home/HeroSection.vue'
import DreamRewardCard from '@/components/new-home/DreamRewardCard.vue'
import RafflesSection from '@/components/new-home/RafflesSection.vue'
import TradingBoosts from '@/components/new-home/TradingBoosts.vue'
import LiveWins from '@/components/new-home/LiveWins.vue'
import StakingCard from '@/components/new-home/StakingCard.vue'
import HomeFooter from '@/components/new-home/HomeFooter.vue'

// Mock data
const mockUsername = 'Adnan'
const mockSpinsReady = 8
const mockDayStreak = 14
const mockClaimablePowermiles = 350
const mockWheelPrizes = ['25$ Lingo', '25$ Lingo', '25$ Lingo', '25$ Lingo', '25$ Lingo', '25$ Lingo']

const mockDreamReward = {
  title: 'Custom Gaming PC',
  value: 15000,
  score: 4280,
  maxScore: 10000,
  rank: 23,
  totalParticipants: 842,
  drawingIn: { days: 4, hours: 12 },
  imageUrl: '/homepage-new/gaming-pc.png',
}

const mockBoosts = [
  { value: '1.5x', label: 'Dream Reward', active: false },
  { value: '25%', label: 'Raffle', active: false },
  { value: '2x', label: 'Entries', active: false },
]

const mockLiveWins = [
  { prize: 'AirPods Pro', user: 'alex_m', time: '2m', color: '#C95CFF' },
  { prize: '$50 USDC', user: 'crypto_k', time: '8m', color: '#4CAF50' },
  { prize: '250 Powermiles', user: 'whale_3', time: '12m', color: '#FF7847' },
  { prize: 'Raffle Entry', user: 'luna_22', time: '15m', color: '#3333FF' },
  { prize: '100 Powermiles', user: 'cryp_to', time: '16m', color: '#FF7847' },
  { prize: '$20 USDC', user: 'whale_4', time: '24m', color: '#4CAF50' },
]

const mockStaking = {
  apy: 33.6,
  tier: 'Gold',
  stakedAmount: 2500,
}
</script>
