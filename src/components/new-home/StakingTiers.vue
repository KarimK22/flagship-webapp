<template>
  <section class="px-6 md:px-16 lg:px-24 py-20">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <h2 class="text-3xl md:text-4xl font-bold text-lavender text-center mb-4">
        The More You Stake,<br>The More You Win
      </h2>
      <p class="text-purple-gray text-center text-lg mb-14 max-w-xl mx-auto">
        Higher tiers unlock bigger multipliers on all your rewards
      </p>

      <!-- Tier cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div
          v-for="tier in tiers"
          :key="tier.name"
          class="relative bg-[rgba(14,14,26,0.8)] border rounded-2xl p-5 md:p-6 text-center overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          :class="[
            tier.borderClass,
            selectedTier === tier.name ? 'ring-2 ring-offset-2 ring-offset-[#0E0E1A] ' + tier.ringClass : '',
          ]"
          @click="selectedTier = tier.name"
        >
          <!-- Glow effect -->
          <div
            class="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[60px] rounded-full blur-[40px] pointer-events-none"
            :class="tier.glowClass"
          />

          <!-- Multiplier badge -->
          <div
            class="relative inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl mb-4"
            :class="tier.badgeBgClass"
          >
            <span
              class="text-2xl md:text-3xl font-bold"
              :class="tier.textClass"
            >
              {{ tier.multiplier }}
            </span>
          </div>

          <!-- Tier name -->
          <h3
            class="text-lg md:text-xl font-bold mb-2"
            :class="tier.textClass"
          >
            {{ tier.name }}
          </h3>

          <!-- Stake requirement -->
          <p class="text-sm text-purple-gray mb-4">
            Stake {{ tier.stakeMin }}
          </p>

          <!-- Benefits -->
          <ul class="space-y-2 text-left">
            <li
              v-for="benefit in tier.benefits"
              :key="benefit"
              class="flex items-start gap-2 text-sm text-purple-gray"
            >
              <svg
                class="w-4 h-4 flex-shrink-0 mt-0.5"
                :class="tier.checkClass"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M4 8L7 11L12 5"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>{{ benefit }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Upsell warning bar -->
      <div
        v-if="upsellMessage"
        class="flex items-center justify-center gap-2 mt-8 mx-auto max-w-xl rounded-xl bg-[#92400e]/20 border border-amber-500/30 px-5 py-3 text-amber-400 text-sm font-medium transition-all duration-300"
      >
        <span class="text-base">&#9888;</span>
        <span>{{ upsellMessage }}</span>
        <button
          class="ml-1 underline underline-offset-2 hover:text-amber-300 transition-colors font-semibold"
          @click="selectedTier = 'Diamond'"
        >
          Switch &rarr;
        </button>
      </div>

      <!-- CTA -->
      <div class="text-center mt-8">
        <button
          class="bg-gradient-to-r from-[#FF7847] to-[#FFBC70] text-white font-bold rounded-full px-10 py-4 text-lg hover:opacity-90 transition-opacity shadow-[0_0_40px_rgba(255,120,71,0.25)]"
        >
          Start Staking Now
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const selectedTier = ref<string | null>(null)

const tiers = [
  {
    name: 'Bronze',
    multiplier: '1x',
    numericMultiplier: 1,
    stakeMin: '$500+',
    annualRewardEstimate: 600,
    borderClass: 'border-[#EF8674]/20 hover:border-[#EF8674]/40',
    ringClass: 'ring-[#EF8674]',
    glowClass: 'bg-[#EF8674]/10',
    badgeBgClass: 'bg-[#EF8674]/10 border border-[#EF8674]/20',
    textClass: 'text-[#EF8674]',
    checkClass: 'text-[#EF8674]',
    benefits: ['1 daily spin', '1x raffle entries', 'Basic rewards'],
  },
  {
    name: 'Silver',
    multiplier: '2x',
    numericMultiplier: 2,
    stakeMin: '$2,500+',
    annualRewardEstimate: 3_000,
    borderClass: 'border-[#8A9AC2]/20 hover:border-[#8A9AC2]/40',
    ringClass: 'ring-[#8A9AC2]',
    glowClass: 'bg-[#8A9AC2]/10',
    badgeBgClass: 'bg-[#8A9AC2]/10 border border-[#8A9AC2]/20',
    textClass: 'text-[#8A9AC2]',
    checkClass: 'text-[#8A9AC2]',
    benefits: ['2 daily spins', '2x raffle entries', 'Boosted rewards'],
  },
  {
    name: 'Gold',
    multiplier: '3x',
    numericMultiplier: 3,
    stakeMin: '$10,000+',
    annualRewardEstimate: 12_000,
    borderClass: 'border-[#FFBC70]/20 hover:border-[#FFBC70]/40',
    ringClass: 'ring-[#FFBC70]',
    glowClass: 'bg-[#FFBC70]/10',
    badgeBgClass: 'bg-[#FFBC70]/10 border border-[#FFBC70]/20',
    textClass: 'text-[#FFBC70]',
    checkClass: 'text-[#FFBC70]',
    benefits: ['3 daily spins', '3x raffle entries', 'Premium prizes'],
  },
  {
    name: 'Diamond',
    multiplier: '5x',
    numericMultiplier: 5,
    stakeMin: '$50,000+',
    annualRewardEstimate: 60_000,
    borderClass: 'border-[#A8D8FF]/30 hover:border-[#A8D8FF]/60',
    ringClass: 'ring-[#A8D8FF]',
    glowClass: 'bg-[#A8D8FF]/20',
    badgeBgClass: 'bg-gradient-to-br from-[#A8D8FF]/20 to-[#C4B5FD]/20 border border-[#A8D8FF]/30',
    textClass: 'text-[#A8D8FF]',
    checkClass: 'text-[#A8D8FF]',
    benefits: ['5 daily spins', '5x raffle entries', 'Exclusive prizes'],
  },
]

const diamondTier = tiers.find(t => t.name === 'Diamond')!

const upsellMessage = computed(() => {
  if (!selectedTier.value) return null

  const selected = tiers.find(t => t.name === selectedTier.value)
  if (!selected || selected.name === 'Diamond' || selected.name === 'Bronze') return null

  const multiplierDiff = diamondTier.numericMultiplier - selected.numericMultiplier
  const rewardDiff = selected.annualRewardEstimate * multiplierDiff / selected.numericMultiplier
  const formattedAmount = rewardDiff.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

  return `You're leaving ~${formattedAmount}/yr on the table vs Diamond.`
})
</script>
