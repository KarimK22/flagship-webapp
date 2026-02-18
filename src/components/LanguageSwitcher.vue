<template>
  <div class="language-switcher">
    <div class="relative">
      <button
        class="flex items-center gap-1.5 px-2 py-1 text-xs bg-transparent border border-purple-gray/30 rounded hover:bg-purple-gray/10 hover:border-purple-gray/50 transition-all duration-200 text-purple-gray hover:text-lavender focus:outline-none focus:ring-2 focus:ring-lavender/20"
        @click="isOpen = !isOpen"
      >
        <span class="text-sm">{{ currentLocaleFlag }}</span>
        <span class="font-medium">{{ currentLocaleCode }}</span>
        <ChevronDown
          class="h-3 w-3 transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
        />
      </button>

      <div
        v-if="isOpen"
        class="absolute bottom-full right-0 mb-1 w-32 bg-background/95 backdrop-blur-sm border border-purple-gray/20 rounded-lg shadow-xl z-50"
      >
        <div class="p-1">
          <div class="text-xs text-purple-gray/60 px-2 py-1 font-medium">
            {{ t('common.language') }}
          </div>
          <div class="border-t border-purple-gray/20 my-1" />
          <button
            v-for="locale in availableLocales"
            :key="locale.code"
            class="w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded transition-all duration-150 hover:bg-purple-gray/10 hover:text-lavender"
            :class="{
              'bg-purple-gray/15 text-lavender border-l-2 border-lavender': currentLocale === locale.code,
              'text-purple-gray': currentLocale !== locale.code
            }"
            @click="handleLocaleChange(locale.code)"
          >
            <span class="text-sm">{{ locale.flag }}</span>
            <span class="flex-1 text-left font-medium">{{ locale.name }}</span>
            <CheckIcon
              v-if="currentLocale === locale.code"
              class="h-3 w-3 text-lavender"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check as CheckIcon, ChevronDown } from 'lucide-vue-next'
import { useLocalization } from '@/composables/use-i18n'
import type { LocaleType } from '@/i18n/types'

const { t, currentLocale, changeLocale, availableLocales } = useLocalization()
const isOpen = ref(false)

const currentLocaleFlag = computed(() => {
  const locale = availableLocales.find(l => l.code === currentLocale.value)
  return locale?.flag || '🌐'
})

const currentLocaleCode = computed(() => {
  return currentLocale.value.toUpperCase()
})

const handleLocaleChange = (newLocale: LocaleType) => {
  console.log('LanguageSwitcher: Changing to', newLocale)
  changeLocale(newLocale)
  isOpen.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.language-switcher')) {
    isOpen.value = false
  }
}

// Add click outside listener
if (typeof window !== 'undefined') {
  document.addEventListener('click', handleClickOutside)
}
</script>

<style scoped>
.language-switcher {
  display: inline-block;
}

/* Custom focus styles for better accessibility */
.language-switcher button:focus-visible {
  outline: 2px solid #8B5CF6;
  outline-offset: 2px;
}

/* Smooth transitions for dropdown */
.language-switcher .absolute {
  animation: fadeInUp 0.2s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>