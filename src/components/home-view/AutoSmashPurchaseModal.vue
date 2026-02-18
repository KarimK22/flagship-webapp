<template>
  <BaseModal
    :model-value="modelValue"
    class="!max-w-[500px] p-0"
    @update:model-value="emit('update:modelValue', false)"
  >
    <div class="relative autosmash-modal overflow-hidden rounded-2xl">
      <!-- top-right glow -->
      <img
        :src="modalTop"
        class="pointer-events-none absolute -top-12 -right-12 w-[350px] opacity-80"
      >

      <!-- bottom-left glow -->
      <img
        :src="modalBottom"
        class="pointer-events-none absolute -bottom-16 -left-16 w-[350px] opacity-80"
      >

      <div class="relative z-10 px-10 py-9 space-y-8">
        <!-- header -->
        <div>
          <h2 class="text-5xl text-lavender">
            {{ t('home.asteroid.autoSmash.autoSmash') }}
          </h2>

          <p class="mt-3 text-purple-gray leading-relaxed">
            {{ t('home.asteroid.autoSmash.description') }}
          </p>
        </div>

        <!-- features -->
        <div class="mt-2 flex flex-wrap justify-center gap-3">
          <div class="feature-card w-[150px] sm:w-[165px]">
            <img
              :src="fingerBg"
              class="feature-bg"
            >
            <img
              :src="finger"
              class="feature-icon"
            >
            <p class="feature-text text-lavender">
              {{ t('home.asteroid.autoSmash.finger') }}
            </p>
          </div>

          <div class="feature-card w-[150px] sm:w-[165px]">
            <img
              :src="ticketBg"
              class="feature-bg"
            >
            <img
              :src="ticket"
              class="feature-icon"
            >
            <p class="feature-text text-lavender">
              {{ t('home.asteroid.autoSmash.ticket') }}
            </p>
          </div>
        </div>

        <!-- helper text -->
        <p class="text-center text-purple-gray">
          {{ t('home.asteroid.autoSmash.helperText') }}
        </p>

        <!-- error -->
        <p
          v-if="error"
          class="text-center text-red-500 text-sm"
        >
          {{ error }}
        </p>

        <!-- CTA -->
        <div class="flex justify-center pt-2">
          <GlowButton
            :disabled="loading"
            @click="$emit('confirm')"
          >
            <div class="flex items-center gap-2">
              <template v-if="!loading">
                {{ t('home.asteroid.autoSmash.buy', {lingoAmount: Number(eligibility?.lingoAmount).toFixed(2), usdAmount: (eligibility?.usdAmount || 0)}) }}
              </template>
              <template v-else>
                <span>{{ t('home.asteroid.autoSmash.confirming') }}</span>
                <InlineSvg
                  :src="loaderIcon"
                  class="size-4 animate-[spin_2s_linear_infinite_reverse]"
                />
              </template>
            </div>
          </GlowButton>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import finger from '@/assets/images/autosmash/finger.png'
import fingerBg from '@/assets/images/autosmash/finger-bg.png'
import ticket from '@/assets/images/autosmash/ticket.png'
import ticketBg from '@/assets/images/autosmash/ticket-bg.png'
import modalTop from '@/assets/images/autosmash/modal-top.png'
import modalBottom from '@/assets/images/autosmash/modal-bottom.png'
import { useI18n } from 'vue-i18n'
import loaderIcon from '@/assets/icons/loader.svg'
import InlineSvg from 'vue-inline-svg'

defineProps<{
  modelValue: boolean
  eligibility: {
    eligible: boolean
    lingoAmount: string
    lingoPrice: string
    usdAmount: string
    alreadyPurchased: boolean
    contractAddress: string
  } | null
  loading: boolean
  error: string | null
}>()

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirm'): void
}>()

</script>

<style>
.feature-card {
  position: relative;
  height: 96px;
  width: 200px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  overflow: hidden;
}

.feature-text {
  font-size: 14px;
  text-align: center;
  z-index: 2;
}

.feature-icon {
  position: relative;
  z-index: 2;
  height: 28px;
}

.feature-bg {
  position: absolute;
  top: 0;
  width: 180px;
  opacity: 0.9;
  z-index: 1;
  pointer-events: none;
}
</style>