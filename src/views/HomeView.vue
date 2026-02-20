<template>
  <div class="flex flex-col w-full bg-[#0C0C14] -mt-20 -mb-24 pt-24 overflow-hidden">
    <!-- Hero: Clean headline + single CTA + featured prize -->
    <HeroSection
      @stake="handleStake"
      @learn-more="scrollToHowItWorks"
    />

    <!-- Divider -->
    <div class="w-full h-px bg-gradient-to-r from-transparent via-[#262638] to-transparent" />

    <!-- How It Works: 3-step explainer -->
    <div ref="howItWorksRef">
      <HowItWorks />
    </div>

    <!-- Divider -->
    <div class="w-full h-px bg-gradient-to-r from-transparent via-[#262638] to-transparent" />

    <!-- Spin Wheel: With clear mechanic explanation -->
    <SpinWheelSection />

    <!-- Divider -->
    <div class="w-full h-px bg-gradient-to-r from-transparent via-[#262638] to-transparent" />

    <!-- Live Raffles: Cards with countdown + enter CTA -->
    <RafflesSection />

    <!-- Divider -->
    <div class="w-full h-px bg-gradient-to-r from-transparent via-[#262638] to-transparent" />

    <!-- Staking Tiers: Visual tier comparison -->
    <StakingTiers />

    <!-- Divider -->
    <div class="w-full h-px bg-gradient-to-r from-transparent via-[#262638] to-transparent" />

    <!-- Social Proof: Real winners + live feed -->
    <SocialProof />

    <!-- Footer: Final CTA + links -->
    <HomeFooter />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import HeroSection from '@/components/new-home/HeroSection.vue'
import HowItWorks from '@/components/new-home/HowItWorks.vue'
import SpinWheelSection from '@/components/new-home/SpinWheelSection.vue'
import RafflesSection from '@/components/new-home/RafflesSection.vue'
import StakingTiers from '@/components/new-home/StakingTiers.vue'
import SocialProof from '@/components/new-home/SocialProof.vue'
import HomeFooter from '@/components/new-home/HomeFooter.vue'

const router = useRouter()
const howItWorksRef = ref<HTMLElement>()

function handleStake() {
  router.push('/staking')
}

function scrollToHowItWorks() {
  howItWorksRef.value?.scrollIntoView({ behavior: 'smooth' })
}
</script>
