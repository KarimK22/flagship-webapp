<template>
  <section class="flex flex-col">
    <h2 class="text-lavender text-center md:text-[56px] text-[40px] font-normal leading-12 tracking-[-2.8px] mb-8 md:mb-17">
      {{ $t('components.rewardsPool.title') }}
    </h2>
    <div class="flex gap-4 overflow-x-auto justify-start md:justify-evenly">
      <div
        v-for="item in topRaffles"
        :key="item.title"
        class="flex flex-col min-w-[318px] gap-4 p-2 h-[510px] w-[318px] bg-[rgba(20,20,31,0.72)] shadow-[0px_0px_48px_-16px_#1C1C29_inset] rounded-2xl"
      >
        <div
          :style="{
            backgroundImage: `url(${item.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }"
          class="w-full h-[310px] rounded-[14px]"
        />
        <span class="text-lavender text-4.5xl font-normal leading-8 tracking-[-2px] text-center">{{ item.title }}</span>
        <div class="flex flex-col">
          <span class="text-[#9A9AB8] text-sm font-normal leading-6 tracking-[3.5px] text-center mb-8">{{ $t('components.rewardsPool.endingIn') }}</span>
          <RaffleCountdown
            :raffle-end-date="item.endDate"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRaffles } from '@/composables/raffles'
import { computed } from 'vue'
import RaffleCountdown from './RaffleCountdown.vue'

const { sortedActiveRaffles } = useRaffles()

const topRaffles = computed(() => sortedActiveRaffles.value?.slice(0, 4) ?? [])
</script>
