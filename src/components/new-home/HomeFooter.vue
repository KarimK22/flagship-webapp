<template>
  <footer class="mt-8 px-6 md:px-16 lg:px-24 py-12 border-t border-[#1a1a3e]">
    <div class="max-w-5xl mx-auto">
      <!-- Top: CTA banner -->
      <div
        class="relative bg-[rgba(14,14,26,0.8)] border border-[#262638] rounded-2xl p-8 md:p-12 mb-12 overflow-hidden text-center"
      >
        <div
          class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,120,71,0.06)_0%,transparent_60%)] pointer-events-none"
        />
        <h2 class="relative text-2xl md:text-3xl font-bold text-lavender mb-3">
          Ready to Start Winning?
        </h2>
        <p class="relative text-purple-gray mb-6 max-w-md mx-auto">
          Join 15,950+ stakers already earning daily rewards and winning real prizes.
        </p>
        <button
          class="relative bg-gradient-to-r from-[#FF7847] to-[#FFBC70] text-white font-bold rounded-full px-10 py-4 text-lg hover:opacity-90 transition-opacity shadow-[0_0_40px_rgba(255,120,71,0.25)]"
        >
          Start Staking
        </button>
      </div>

      <!-- Bottom: Links -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="text-lavender font-bold text-xl tracking-widest">
          LINGO
        </div>

        <p class="text-sm text-purple-gray">
          &copy; 2026 Lingo. All rights reserved.
        </p>

        <div class="flex items-center gap-6">
          <router-link
            to="/terms-of-service"
            class="text-sm text-purple-gray hover:text-lavender transition-colors"
          >
            Terms & Conditions
          </router-link>
          <router-link
            to="/privacy-policy"
            class="text-sm text-purple-gray hover:text-lavender transition-colors"
          >
            Privacy Policy
          </router-link>
          <router-link
            to="/faq"
            class="text-sm text-purple-gray hover:text-lavender transition-colors"
          >
            FAQ
          </router-link>
        </div>
      </div>
    </div>
  </footer>
</template>
