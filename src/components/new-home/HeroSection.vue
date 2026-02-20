<template>
  <section class="relative px-6 md:px-16 lg:px-24 pt-12 pb-16 overflow-hidden">
    <!-- Background glow effects -->
    <div class="absolute inset-0 pointer-events-none">
      <div
        class="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(51,51,255,0.1)_0%,transparent_70%)]"
      />
      <div
        class="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(201,92,255,0.06)_0%,transparent_70%)]"
      />
    </div>

    <div class="relative max-w-6xl mx-auto">
      <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <!-- Left: Headline + CTA -->
        <div class="flex-1 text-center lg:text-left">
          <h1
            class="text-4xl md:text-5xl lg:text-6xl font-bold text-lavender leading-tight tracking-tight mb-6"
          >
            Stake $500.<br />
            <span
              class="bg-gradient-to-r from-[#FF7847] to-[#FFBC70] bg-clip-text text-transparent"
            >
              Win up to $20,000
            </span>
            <br />in real prizes.
          </h1>

          <p class="text-lg text-purple-gray mb-8 max-w-lg mx-auto lg:mx-0">
            Stake your LINGO tokens, earn daily spins, and win real-world prizes
            from iPhones to Rolexes.
          </p>

          <!-- Single primary CTA -->
          <div class="flex flex-col sm:flex-row items-center gap-4 mb-10 lg:justify-start justify-center">
            <button
              class="bg-gradient-to-r from-[#FF7847] to-[#FFBC70] text-white font-bold rounded-full px-10 py-4 text-lg hover:opacity-90 transition-opacity shadow-[0_0_40px_rgba(255,120,71,0.3)]"
              @click="$emit('stake')"
            >
              Start Staking
            </button>
            <button
              class="text-lavender font-semibold text-base hover:text-white transition-colors underline underline-offset-4 decoration-purple-gray/40"
              @click="$emit('learn-more')"
            >
              How does it work?
            </button>
          </div>

          <!-- Stats bar -->
          <div class="flex flex-wrap items-center gap-6 lg:gap-10 justify-center lg:justify-start">
            <div class="text-center lg:text-left">
              <p class="text-2xl font-bold text-lavender">15,950+</p>
              <p class="text-sm text-purple-gray">Active Stakers</p>
            </div>
            <div class="w-px h-10 bg-[#262638] hidden sm:block" />
            <div class="text-center lg:text-left">
              <p class="text-2xl font-bold text-lavender">$127K+</p>
              <p class="text-sm text-purple-gray">Prizes Awarded</p>
            </div>
            <div class="w-px h-10 bg-[#262638] hidden sm:block" />
            <div class="text-center lg:text-left">
              <p class="text-2xl font-bold text-lavender">$2.4M+</p>
              <p class="text-sm text-purple-gray">Total Staked</p>
            </div>
          </div>
        </div>

        <!-- Right: Featured Prize Card -->
        <div class="flex-shrink-0 w-full max-w-[380px]">
          <div
            class="relative bg-[rgba(14,14,26,0.8)] border border-[#262638] rounded-3xl p-6 backdrop-blur-sm overflow-hidden"
          >
            <!-- Card glow -->
            <div
              class="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,188,112,0.1)_0%,transparent_70%)] pointer-events-none"
            />

            <!-- Featured tag -->
            <div class="flex items-center gap-2 mb-4">
              <span
                class="bg-gradient-to-r from-[#FF7847] to-[#FFBC70] text-white text-xs font-bold rounded-full px-3 py-1"
              >
                FEATURED PRIZE
              </span>
            </div>

            <!-- Prize image -->
            <div class="flex items-center justify-center mb-4">
              <div
                class="relative w-full h-[200px] flex items-center justify-center"
              >
                <div
                  class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,92,255,0.12)_0%,transparent_70%)] rounded-2xl"
                />
                <img
                  src="/homepage-new/gaming-pc.png"
                  alt="Rolex Submariner"
                  class="relative max-w-full max-h-full object-contain z-10"
                  loading="lazy"
                >
              </div>
            </div>

            <!-- Prize info -->
            <h3 class="text-xl font-bold text-lavender mb-1">
              Rolex Submariner
            </h3>
            <p class="text-purple-gray text-sm mb-4">
              Value: <span class="text-[#FFBC70] font-semibold">$20,000</span>
            </p>

            <!-- Winner progress -->
            <div class="flex items-center justify-between text-xs text-purple-gray mb-2">
              <span>842 participants</span>
              <span>Drawing in 4d 12h</span>
            </div>
            <div class="w-full h-1.5 bg-[#1a1a3e] rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-[#C95CFF] to-[#3333FF] rounded-full"
                style="width: 68%"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineEmits<{
  stake: []
  'learn-more': []
}>()
</script>
