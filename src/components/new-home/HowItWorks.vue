<template>
  <section class="px-6 md:px-16 lg:px-24 py-20">
    <div class="max-w-5xl mx-auto">
      <!-- Section header -->
      <h2 class="text-3xl md:text-4xl font-bold text-lavender text-center mb-4">
        How It Works
      </h2>
      <p class="text-purple-gray text-center text-lg mb-14 max-w-xl mx-auto">
        Three simple steps to start winning real prizes
      </p>

      <!-- Steps -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
        <!-- Step 1 -->
        <div class="relative flex flex-col items-center text-center group">
          <div
            class="w-20 h-20 rounded-2xl bg-[rgba(14,14,26,0.8)] border border-[#262638] flex items-center justify-center mb-6 group-hover:border-[#FF7847]/40 transition-colors"
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
            >
              <path
                d="M18 3L22.5 13.5L33 18L22.5 22.5L18 33L13.5 22.5L3 18L13.5 13.5L18 3Z"
                stroke="#FF7847"
                stroke-width="2"
                fill="none"
              />
              <path
                d="M18 10L20.5 15.5L26 18L20.5 20.5L18 26L15.5 20.5L10 18L15.5 15.5L18 10Z"
                fill="#FF7847"
                opacity="0.3"
              />
            </svg>
          </div>
          <span class="text-xs font-bold text-[#FF7847] uppercase tracking-widest mb-2">Step 1</span>
          <h3 class="text-xl font-bold text-lavender mb-2">Stake LINGO</h3>
          <p class="text-purple-gray text-sm leading-relaxed max-w-[260px]">
            Stake as little as $500 worth of LINGO tokens. Choose your tier for bigger multipliers.
          </p>

          <!-- Connector arrow (hidden on mobile) -->
          <div class="hidden md:block absolute top-10 -right-3 translate-x-1/2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M5 12H19M19 12L13 6M19 12L13 18"
                stroke="#262638"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="relative flex flex-col items-center text-center group">
          <div
            class="w-20 h-20 rounded-2xl bg-[rgba(14,14,26,0.8)] border border-[#262638] flex items-center justify-center mb-6 group-hover:border-[#C95CFF]/40 transition-colors"
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
            >
              <circle
                cx="18"
                cy="18"
                r="14"
                stroke="#C95CFF"
                stroke-width="2"
              />
              <circle
                cx="18"
                cy="18"
                r="6"
                fill="#C95CFF"
                opacity="0.3"
              />
              <line
                x1="18"
                y1="4"
                x2="18"
                y2="10"
                stroke="#C95CFF"
                stroke-width="2"
                stroke-linecap="round"
              />
              <line
                x1="18"
                y1="26"
                x2="18"
                y2="32"
                stroke="#C95CFF"
                stroke-width="2"
                stroke-linecap="round"
              />
              <line
                x1="4"
                y1="18"
                x2="10"
                y2="18"
                stroke="#C95CFF"
                stroke-width="2"
                stroke-linecap="round"
              />
              <line
                x1="26"
                y1="18"
                x2="32"
                y2="18"
                stroke="#C95CFF"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <span class="text-xs font-bold text-[#C95CFF] uppercase tracking-widest mb-2">Step 2</span>
          <h3 class="text-xl font-bold text-lavender mb-2">Earn Spins & Entries</h3>
          <p class="text-purple-gray text-sm leading-relaxed max-w-[260px]">
            Get daily wheel spins and raffle entries automatically. Higher tiers earn more entries.
          </p>

          <!-- Connector arrow -->
          <div class="hidden md:block absolute top-10 -right-3 translate-x-1/2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M5 12H19M19 12L13 6M19 12L13 18"
                stroke="#262638"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="flex flex-col items-center text-center group">
          <div
            class="w-20 h-20 rounded-2xl bg-[rgba(14,14,26,0.8)] border border-[#262638] flex items-center justify-center mb-6 group-hover:border-[#4CAF50]/40 transition-colors"
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
            >
              <path
                d="M8 18L14 24L28 10"
                stroke="#4CAF50"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <rect
                x="4"
                y="4"
                width="28"
                height="28"
                rx="6"
                stroke="#4CAF50"
                stroke-width="2"
                fill="none"
                opacity="0.3"
              />
            </svg>
          </div>
          <span class="text-xs font-bold text-[#4CAF50] uppercase tracking-widest mb-2">Step 3</span>
          <h3 class="text-xl font-bold text-lavender mb-2">Win Real Prizes</h3>
          <p class="text-purple-gray text-sm leading-relaxed max-w-[260px]">
            Win iPhones, Rolexes, gaming PCs, and more. Prizes ship worldwide to your door.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
