<template>
  <footer class="relative z-10">
    <div class="w-full max-w-full lg:max-w-screen-lg xl:max-w-screen-2xl mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row gap-y-4 md:gap-y-0 items-center justify-between text-sm text-purple-gray font-semibold">
        <p class="text-purple-gray/50">
          {{ t('footer.copyright') }}
        </p>

        <div class="flex flex-col md:flex-row gap-y-4 md:gap-y-0 items-center gap-x-6 *:hover:text-lavender">
          <router-link
            v-if="isHome"
            to="#"
            :onclick="openInfoModal"
            class="cursor-pointer"
          >
            {{ t('footer.howItWorks') }}
          </router-link>
          <router-link :to="lingoRoutePath[LingoRouteName.TERMS_OF_SERVICE]">
            {{ t('footer.termsOfService') }}
          </router-link>
          <router-link :to="lingoRoutePath[LingoRouteName.PRIVACY_POLICY]">
            {{ t('footer.privacyPolicy') }}
          </router-link>
          <router-link :to="lingoRoutePath[LingoRouteName.FAQ]">
            {{ t('footer.faq') }}
          </router-link>

          <!-- Language Switcher -->
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { showInfoModal } from '@/composables/ls-modals'
import { LingoRouteName, lingoRoutePath } from '@/router/routes'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { useTranslation } from '@/composables/use-i18n'

const { t } = useTranslation()
const route = useRoute()
const isHome = computed(() => route.name === LingoRouteName.HOME)

const openInfoModal = () => {
  showInfoModal.value = true
}
</script>
