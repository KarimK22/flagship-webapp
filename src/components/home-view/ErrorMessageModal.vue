<template>
  <div>
    <BaseModal
      :model-value="modelValue"
      class="p-4 gap-0 !rounded-2xl w-[96vw] md:w-[420px] !max-w-[none] max-h-[96vh] md:max-h-[90%] h-auto"
      description=" "
      :show-close-button="true"
      @update:model-value="closeAndClear"
    >
      <!-- Content -->
      <template #header>
        <div class="relative z-10 flex flex-col h-full">
          <!-- BaseHeader Section -->
          <div class="flex items-center justify-between gap-4 text-left">
            <div class="flex flex-col gap-2">
              <h1 class="text-[#FF7847] text-[32px] leading-7 font-medium tracking-[-1.28px] select-none">
                {{ t('components.errorMessageModal.oops') }}
              </h1>
              <h1 class="text-lavender text-[32px] leading-7 font-medium tracking-[-1.28px] select-none">
                {{ t('components.errorMessageModal.somethingWentWrong') }}
              </h1>
            </div>
          </div>
        </div>
      </template>
      <template #description>
        <div class="w-full pb-0 pt-2 text-purple-gray text-[20px] leading-5 tracking-[-0.6px]">
          <span v-if="errorMessage === 'discord'">
            {{ t('components.errorMessageModal.discordMessage') }}
          </span>
          <span v-else>
            {{ errorMessage }}
          </span>
        </div>
      </template>
      <template #footer>
        <div class="flex p-4 w-full">
          <GlowButton
            :color="EButtonColor.BLUE"
            class="flex items-center w-full gap-2"
            @click="handleRetry"
          >
            <span>{{ t('components.errorMessageModal.retry') }}</span>
          </GlowButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { useTranslation } from '@/composables/use-i18n'
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'

const { t } = useTranslation()

defineProps<{
    modelValue: boolean
    errorMessage?: string
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'retry'): void
}>()

const closeAndClear = () => {
  emit('close')
}

const handleRetry = () => {
  emit('retry')
}
</script>

<style scoped>
</style>