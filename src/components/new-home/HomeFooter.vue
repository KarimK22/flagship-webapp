<template>
  <footer class="mt-16 px-6 md:px-16 lg:px-24 py-8 border-t border-[#1a1a3e]">
    <div class="flex flex-col md:flex-row items-center justify-between gap-4">
      <!-- Logo -->
      <div class="text-lavender font-bold text-xl tracking-widest border border-lavender/30 px-3 py-1 rounded">
        LINGO
      </div>

      <!-- Copyright -->
      <p class="text-sm text-purple-gray">
        &copy; 2026 Lingo. All rights reserved.
      </p>

      <!-- Links -->
      <div class="flex items-center gap-6">
        <a
          href="/terms-of-service"
          class="text-sm text-purple-gray hover:text-lavender transition-colors uppercase tracking-wider"
        >
          Terms & Conditions
        </a>
        <a
          href="/privacy-policy"
          class="text-sm text-purple-gray hover:text-lavender transition-colors uppercase tracking-wider"
        >
          Privacy Policy
        </a>
      </div>
    </div>
  </footer>
</template>
