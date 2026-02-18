<script setup lang="ts">
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import InlineSvg from 'vue-inline-svg'
import lingoIcon from '@/assets/images/lingo-icon.svg'
import { redirectToService } from '@/composables/helpers'
import { useGetMe } from '@/composables/get-me'
import mixpanel from 'mixpanel-browser'

const { accountAddress } = useGetMe()

const buyLingo = () => {
  if (!accountAddress.value) return

  mixpanel.track('Buy Lingo', {
    entryPoint: 'stakingPageBanner',
    amount: 100,
  })

  redirectToService('https://buy.kryptonim.com/redirect-form', {
    currency: 'USD',
    convertedCurrency: 'LINGO',
    convertedAmount: 100,
    blockchain: 'Base',
    address: accountAddress.value,
    theme: 'dark',
    successUrl: `${window.location.href}`,
  })
}
</script>

<template>
  <div class="buy-lingo-banner relative w-full max-w-[720px] mx-auto rounded-2xl overflow-hidden p-[1px]">
    <!-- Animated gradient border -->
    <div class="absolute inset-0 rounded-2xl gradient-border" />

    <!-- Inner content -->
    <div class="relative rounded-2xl bg-[rgba(28,28,41,0.92)] backdrop-blur-sm overflow-hidden">
      <!-- Background glow effects -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute -top-20 -left-20 w-60 h-60 bg-sosiska/8 rounded-full blur-[80px] animate-pulse-slow" />
        <div class="absolute -bottom-16 -right-16 w-48 h-48 bg-[#5858F5]/10 rounded-full blur-[60px] animate-pulse-slow delay-1000" />
      </div>

      <!-- Dot grid texture -->
      <div class="absolute inset-0 pointer-events-none opacity-[0.03]" style="background-image: radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px); background-size: 24px 24px;" />

      <div class="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-5 sm:p-6">
        <!-- Icon + text -->
        <div class="flex items-center gap-4 flex-1 min-w-0">
          <!-- LINGO icon with glow ring -->
          <div class="relative flex-shrink-0">
            <div class="absolute inset-0 rounded-full bg-sosiska/20 blur-[12px] scale-150" />
            <div class="relative size-14 rounded-full bg-gradient-to-br from-[#2a2a40] to-[#1c1c29] border border-[rgba(201,92,255,0.15)] flex items-center justify-center shadow-[0_0_20px_rgba(88,88,245,0.15)]">
              <InlineSvg
                :src="lingoIcon"
                class="size-8"
              />
            </div>
          </div>

          <!-- Message -->
          <div class="flex flex-col gap-0.5">
            <span class="text-lavender text-lg sm:text-xl font-medium -tracking-[0.6px] leading-tight">
              Get LINGO to start staking
            </span>
            <span class="text-purple-gray text-sm leading-5 -tracking-[0.2px]">
              Buy with credit card and start earning rewards instantly
            </span>
          </div>
        </div>

        <!-- CTA button -->
        <div class="w-full sm:w-auto flex-shrink-0">
          <GlowButton
            :color="EButtonColor.BLUE"
            class="w-full sm:w-[160px]"
            @click="buyLingo"
          >
            Buy LINGO
          </GlowButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gradient-border {
  background: linear-gradient(
    135deg,
    rgba(88, 88, 245, 0.3) 0%,
    rgba(201, 92, 255, 0.15) 30%,
    rgba(88, 88, 245, 0.08) 50%,
    rgba(201, 92, 255, 0.15) 70%,
    rgba(88, 88, 245, 0.3) 100%
  );
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

.delay-1000 {
  animation-delay: 1s;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}
</style>
