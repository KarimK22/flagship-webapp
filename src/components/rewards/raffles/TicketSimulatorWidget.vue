<template>
  <div class="container mt-12 mb-4 px-4">
    <div
      class="relative bg-dark2/80 border border-dark3/60 rounded-2xl p-5 overflow-hidden cursor-pointer group transition-all duration-300 hover:border-sosiska/30 max-w-[480px] mx-auto"
      @click="emit('open')"
    >
      <!-- Subtle background glow -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[200px] h-[60px] bg-sosiska/8 blur-[40px] rounded-full" />
      </div>

      <div class="relative z-10">
        <!-- Top row: icon + title + description -->
        <div class="flex items-start gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-[#FF4D6A]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <InlineSvg
              :src="ticketIcon"
              unique-ids
              width="18"
              class="text-[#FF4D6A]"
            />
          </div>
          <div class="flex-1">
            <h3 class="text-base font-bold text-lavender">
              Ticket Simulator
            </h3>
            <p class="text-sm text-purple-gray mt-0.5 leading-snug">
              See how many raffle tickets you can earn by staking LINGO
            </p>
          </div>
        </div>

        <!-- Bonus badges -->
        <div class="flex flex-wrap gap-2 mb-4">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 border border-green-500/20 px-3 py-1 text-xs font-semibold text-green-400">
            <span class="text-xs">🆕</span> New User +100%
          </span>
          <span class="inline-flex items-center gap-1.5 rounded-full bg-[#FFB547]/10 border border-[#FFB547]/20 px-3 py-1 text-xs font-semibold text-[#FFB547]">
            <span class="text-xs">👋</span> Early Bird +25%
          </span>
          <span class="inline-flex items-center gap-1.5 rounded-full bg-[#FF9D5C]/10 border border-[#FF9D5C]/20 px-3 py-1 text-xs font-semibold text-[#FF9D5C]">
            <span class="text-xs">🔒</span> Lock Bonus up to +100%
          </span>
        </div>

        <!-- CTA button -->
        <GlowButton
          :color="EButtonColor.BLUE"
          class="w-full"
          @click.stop="emit('open')"
        >
          Ticket Simulator
        </GlowButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InlineSvg from 'vue-inline-svg'
import ticketIcon from '@/assets/icons/ticket.svg'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button.ts'

const emit = defineEmits<{
  (e: 'open'): void
}>()
</script>
