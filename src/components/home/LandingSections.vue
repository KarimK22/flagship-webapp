<template>
  <div
    v-if="variant === HomeVariants.wheelNotifyMe"
    class="flex flex-col gap-18 md:gap-16 px-4 md:px-16 mt-6"
  >
    <FeaturedIn />
    <CelebsSupport />
    <WhyTrustUs />
    <RewardsWinners />
    <SpinTheWheel />
  </div>
  <div
    v-else
    class="flex flex-col gap-18 md:gap-16 px-4 md:px-16 mt-22"
  >
    <FeaturedIn />
    <RewardsPool />
    <HowItWorks />
    <RewardsWinners />
    <ClaimRaffle />
  </div>
</template>

<script setup lang="ts">
import FeaturedIn from '@/components/home/FeaturedIn.vue'
import RewardsPool from '@/components/home/RewardsPool.vue'
import HowItWorks from '@/components/home/HowItWorks.vue'
import ClaimRaffle from '@/components/home/ClaimRaffle.vue'
import RewardsWinners from '@/components/home/RewardsWinners.vue'
import { HomeVariants, useDynamicHome } from '@/composables/dynamic-home'
import WhyTrustUs from './WhyTrustUs.vue'
import SpinTheWheel from './SpinTheWheel.vue'
import CelebsSupport from './CelebsSupport.vue'

const { variant } = useDynamicHome()
</script>
