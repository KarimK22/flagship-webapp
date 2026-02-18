<template>
  <div class="relative border border-[#262638] rounded-[32px] p-5 overflow-hidden flex items-center gap-5">
    <!-- APY Gauge (Squircle) -->
    <div class="relative w-[152px] h-[152px] flex-shrink-0">
      <!-- Background squircle -->
      <div class="absolute inset-0 rounded-[32px] bg-[#0C0C14]" />

      <!-- Glow effect layer (blurred behind border) -->
      <div class="absolute inset-0 rounded-[32px] overflow-hidden blur-[8px]">
        <!-- Top-left glow -->
        <div class="absolute -top-[16px] -left-[16px] w-[104px] h-[32px] bg-[#C95CFF] opacity-80" style="border-radius: 50%;" />
        <div class="absolute -top-[8px] left-[4px] w-[64px] h-[32px] bg-[#FF7847] opacity-60" style="border-radius: 50%; mix-blend-mode: plus-lighter;" />
        <div class="absolute top-[2px] left-[12px] w-[40px] h-[24px] bg-[#FF7847] opacity-50" style="border-radius: 50%; mix-blend-mode: plus-lighter;" />
        <div class="absolute top-[10px] left-[18px] w-[24px] h-[8px] bg-white opacity-40" style="border-radius: 50%; mix-blend-mode: plus-lighter;" />
        <!-- Bottom-right glow -->
        <div class="absolute -bottom-[16px] -right-[16px] w-[104px] h-[32px] bg-[#C95CFF] opacity-80" style="border-radius: 50%;" />
        <div class="absolute -bottom-[8px] right-[4px] w-[64px] h-[32px] bg-[#FF7847] opacity-60" style="border-radius: 50%; mix-blend-mode: plus-lighter;" />
        <div class="absolute bottom-[2px] right-[12px] w-[40px] h-[24px] bg-[#FF7847] opacity-50" style="border-radius: 50%; mix-blend-mode: plus-lighter;" />
        <div class="absolute bottom-[10px] right-[18px] w-[24px] h-[8px] bg-white opacity-40" style="border-radius: 50%; mix-blend-mode: plus-lighter;" />
      </div>

      <!-- Inner fill of squircle -->
      <div class="absolute inset-0 rounded-[32px] overflow-hidden">
        <!-- Top-left glow inside -->
        <div class="absolute -top-[16px] -left-[16px] w-[104px] h-[32px] bg-[#C95CFF] opacity-30 blur-[40px]" style="border-radius: 50%;" />
        <div class="absolute -top-[8px] left-[4px] w-[64px] h-[32px] bg-[#FF7847] opacity-25 blur-[28px]" style="border-radius: 50%; mix-blend-mode: plus-lighter;" />
        <!-- Bottom-right glow inside -->
        <div class="absolute -bottom-[16px] -right-[16px] w-[104px] h-[32px] bg-[#C95CFF] opacity-30 blur-[40px]" style="border-radius: 50%;" />
        <div class="absolute -bottom-[8px] right-[4px] w-[64px] h-[32px] bg-[#FF7847] opacity-25 blur-[28px]" style="border-radius: 50%; mix-blend-mode: plus-lighter;" />
      </div>

      <!-- Glowing border of squircle -->
      <div class="absolute inset-0 rounded-[32px] overflow-hidden">
        <!-- Top-left border glow -->
        <div class="absolute -top-[16px] -left-[16px] w-[104px] h-[32px] bg-[#C95CFF] opacity-60 blur-[8px]" style="border-radius: 50%;" />
        <div class="absolute -top-[8px] left-[4px] w-[64px] h-[32px] bg-[#FF7847] opacity-50 blur-[6px]" style="border-radius: 50%; mix-blend-mode: plus-lighter;" />
        <div class="absolute top-[2px] left-[12px] w-[40px] h-[24px] bg-[#FF7847] opacity-40 blur-[4px]" style="border-radius: 50%; mix-blend-mode: plus-lighter;" />
        <div class="absolute top-[10px] left-[18px] w-[24px] h-[8px] bg-white opacity-30 blur-[2px]" style="border-radius: 50%; mix-blend-mode: plus-lighter;" />
        <!-- Bottom-right border glow -->
        <div class="absolute -bottom-[16px] -right-[16px] w-[104px] h-[32px] bg-[#C95CFF] opacity-60 blur-[8px]" style="border-radius: 50%;" />
        <div class="absolute -bottom-[8px] right-[4px] w-[64px] h-[32px] bg-[#FF7847] opacity-50 blur-[6px]" style="border-radius: 50%; mix-blend-mode: plus-lighter;" />
        <div class="absolute bottom-[2px] right-[12px] w-[40px] h-[24px] bg-[#FF7847] opacity-40 blur-[4px]" style="border-radius: 50%; mix-blend-mode: plus-lighter;" />
        <div class="absolute bottom-[10px] right-[18px] w-[24px] h-[8px] bg-white opacity-30 blur-[2px]" style="border-radius: 50%; mix-blend-mode: plus-lighter;" />
      </div>

      <!-- Border stroke -->
      <div class="absolute inset-0 rounded-[32px] border border-[#1C1C29]" />

      <!-- APY text centered -->
      <div class="absolute inset-0 flex flex-col items-center justify-center z-10">
        <span class="text-[50px] font-bold text-lavender leading-none tracking-tight">{{ apy }}</span>
        <span class="text-sm text-purple-gray mt-0.5">% APY</span>
      </div>
    </div>

    <!-- Staking Info -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2.5 mb-1">
        <span class="text-lg font-semibold text-lavender">Staking</span>
        <span
          class="rounded-full px-4 py-1.5 text-xs font-bold"
          :class="tierClass"
        >
          {{ tier }}
        </span>
      </div>
      <p class="text-[42px] font-bold text-lavender leading-tight tracking-tight">
        $ {{ stakedAmount.toLocaleString() }}
      </p>
      <p class="text-sm text-purple-gray mt-0.5">Staked</p>
    </div>

    <!-- Stake More! Button with glow -->
    <div class="relative flex-shrink-0">
      <!-- Button background -->
      <button class="relative rounded-full px-10 py-4 text-base font-bold text-lavender bg-[#0C0C14] overflow-hidden whitespace-nowrap hover:brightness-110 transition-all">
        <!-- Blue/Purple glow effects inside button -->
        <div class="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
          <!-- Top-left glow cluster -->
          <div class="absolute -top-[28px] left-[10px] w-[104px] h-[32px] bg-[#3333FF] opacity-70 blur-[40px]" style="border-radius: 50%;" />
          <div class="absolute -top-[4px] left-[30px] w-[64px] h-[32px] bg-[#C95CFF] opacity-50 blur-[28px]" style="border-radius: 50%; mix-blend-mode: plus-lighter;" />
          <div class="absolute top-[4px] left-[40px] w-[40px] h-[24px] bg-[#C95CFF] opacity-40 blur-[16px]" style="border-radius: 50%; mix-blend-mode: plus-lighter;" />
          <div class="absolute top-[8px] left-[46px] w-[24px] h-[8px] bg-white opacity-30 blur-[7px]" style="border-radius: 50%; mix-blend-mode: plus-lighter;" />
          <!-- Bottom-right glow cluster -->
          <div class="absolute -bottom-[28px] right-[10px] w-[104px] h-[32px] bg-[#3333FF] opacity-70 blur-[40px]" style="border-radius: 50%;" />
          <div class="absolute -bottom-[4px] right-[30px] w-[64px] h-[32px] bg-[#C95CFF] opacity-50 blur-[28px]" style="border-radius: 50%; mix-blend-mode: plus-lighter;" />
          <div class="absolute bottom-[4px] right-[40px] w-[40px] h-[24px] bg-[#C95CFF] opacity-40 blur-[16px]" style="border-radius: 50%; mix-blend-mode: plus-lighter;" />
          <div class="absolute bottom-[8px] right-[46px] w-[24px] h-[8px] bg-white opacity-30 blur-[7px]" style="border-radius: 50%; mix-blend-mode: plus-lighter;" />
        </div>
        <!-- Border glow -->
        <div class="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          <div class="absolute -top-[28px] left-[10px] w-[104px] h-[32px] bg-[#3333FF] opacity-80 blur-[8px]" style="border-radius: 50%;" />
          <div class="absolute -top-[4px] left-[30px] w-[64px] h-[32px] bg-[#C95CFF] opacity-60 blur-[6px]" style="border-radius: 50%; mix-blend-mode: plus-lighter;" />
          <div class="absolute -bottom-[28px] right-[10px] w-[104px] h-[32px] bg-[#3333FF] opacity-80 blur-[8px]" style="border-radius: 50%;" />
          <div class="absolute -bottom-[4px] right-[30px] w-[64px] h-[32px] bg-[#C95CFF] opacity-60 blur-[6px]" style="border-radius: 50%; mix-blend-mode: plus-lighter;" />
        </div>
        <!-- Button border -->
        <div class="absolute inset-0 rounded-full border border-[#1C1C29] pointer-events-none" />
        <!-- Button text -->
        <span class="relative z-10">Stake More!</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  apy: number
  tier: string
  stakedAmount: number
}>()

const tierClass = computed(() => {
  switch (props.tier.toLowerCase()) {
    case 'gold': return 'bg-transparent text-[#FFBC70] border border-[#FF9D5C]/30'
    case 'silver': return 'bg-transparent text-[#8A9AC2] border border-[#8A9AC2]/30'
    case 'diamond': return 'bg-transparent text-[#F1E6FA] border border-[#F1E6FA]/30'
    case 'bronze': return 'bg-transparent text-[#EF8674] border border-[#EF8674]/30'
    default: return 'bg-transparent text-[#FFBC70] border border-[#FF9D5C]/30'
  }
})
</script>
