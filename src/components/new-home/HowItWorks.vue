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
        <!-- Step 1: Stake — Coin stack icon -->
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
              <ellipse cx="18" cy="26" rx="11" ry="4" stroke="#FF7847" stroke-width="2" fill="none" />
              <ellipse cx="18" cy="20" rx="11" ry="4" stroke="#FF7847" stroke-width="2" fill="none" />
              <ellipse cx="18" cy="14" rx="11" ry="4" stroke="#FF7847" stroke-width="2" fill="#FF7847" opacity="0.15" />
              <line x1="7" y1="14" x2="7" y2="26" stroke="#FF7847" stroke-width="2" />
              <line x1="29" y1="14" x2="29" y2="26" stroke="#FF7847" stroke-width="2" />
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

        <!-- Step 2: Earn — Circular arrows/refresh icon -->
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
                d="M28 14A11 11 0 0 0 8.5 12.5"
                stroke="#FF7847"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M8 22A11 11 0 0 0 27.5 23.5"
                stroke="#FF7847"
                stroke-width="2"
                stroke-linecap="round"
              />
              <polyline points="28,8 28,14 22,14" stroke="#FF7847" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
              <polyline points="8,28 8,22 14,22" stroke="#FF7847" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
              <circle cx="18" cy="18" r="4" fill="#FF7847" opacity="0.15" />
            </svg>
          </div>
          <span class="text-xs font-bold text-[#FF7847] uppercase tracking-widest mb-2">Step 2</span>
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

        <!-- Step 3: Win — Trophy icon -->
        <div class="flex flex-col items-center text-center group">
          <div
            class="w-20 h-20 rounded-2xl bg-[rgba(14,14,26,0.8)] border border-[#262638] flex items-center justify-center mb-6 group-hover:border-[#FF7847]/40 transition-colors"
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
            >
              <path d="M12 8H24V18C24 21.3 21.3 24 18 24C14.7 24 12 21.3 12 18V8Z" stroke="#FF7847" stroke-width="2" fill="#FF7847" opacity="0.15" />
              <path d="M12 12H8C8 12 7 12 7 14C7 16 8 17 10 17H12" stroke="#FF7847" stroke-width="2" stroke-linecap="round" fill="none" />
              <path d="M24 12H28C28 12 29 12 29 14C29 16 28 17 26 17H24" stroke="#FF7847" stroke-width="2" stroke-linecap="round" fill="none" />
              <line x1="18" y1="24" x2="18" y2="28" stroke="#FF7847" stroke-width="2" stroke-linecap="round" />
              <line x1="14" y1="28" x2="22" y2="28" stroke="#FF7847" stroke-width="2" stroke-linecap="round" />
            </svg>
          </div>
          <span class="text-xs font-bold text-[#FF7847] uppercase tracking-widest mb-2">Step 3</span>
          <h3 class="text-xl font-bold text-lavender mb-2">Win Real Prizes</h3>
          <p class="text-purple-gray text-sm leading-relaxed max-w-[260px]">
            Win iPhones, Rolexes, gaming PCs, and more. Prizes ship worldwide to your door.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
