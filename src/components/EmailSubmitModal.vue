<template>
  <BaseModal
    v-model="modelValue"
    class="max-w-[calc(100vw-30px)] sm:max-w-[420px] !rounded-2xl pl-4 pr-2 py-8"
  >
    <div class="relative">
      <IconWrapper
        variant="orange"
        position="right"
        :with-borders="false"
        class="!absolute right-0 top-0"
      />
      <h1 class="text-light1 text-[48px] font-medium -tracking-[2.4px] leading-10 max-w-[340px] text-left mb-4">
        {{ t('components.emailSubmitModal.title') }}
      </h1>
      <p class="text-purple-gray text-xl -tracking-[0.6px] leading-6 max-w-[340px] mb-8">
        {{ t('components.emailSubmitModal.description') }}
      </p>

      <div class="flex flex-col gap-1 mt-auto">
        <p class="text-base font-semibold text-lavender tracking-[0.16px]">
          {{ t('components.emailSubmitModal.emailLabel') }}
        </p>
        <form
          class="flex flex-col gap-2"
          @submit.prevent="handleSubmit"
        >
          <div class="flex items-center justify-end gap-1">
            <BaseInput
              v-model="userEmail"
              type="email"
              class="w-full flex-1 text-lavender"
              :placeholder="t('components.emailSubmitModal.emailPlaceholder')"
              :disabled="isLoading"
            />
            <GlowButton
              :color="EButtonColor.ORANGE"
              variant="lightinBlue"
              class="select-none min-w-[147px]"
              :loading="isLoading"
              :disabled="!isValidEmail"
              type="submit"
            >
              {{ t('components.emailSubmitModal.submit') }}
            </GlowButton>
          </div>
        </form>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { useTranslation } from '@/composables/use-i18n'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import IconWrapper from '@/components/icon-wrapper/IconWrapper.vue'
import { BaseInput } from '@/components/ui/input'
import { EButtonColor } from '@/types/shared/button.ts'
import { computed, ref } from 'vue'
import api from '@/services/api'
import { useGetMe } from '@/composables/get-me'

const { t } = useTranslation()

const modelValue = defineModel<boolean>({ required: true, default: false })
const { refetchGetMe } = useGetMe()
const userEmail = ref('')
const isLoading = ref(false)

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const isValidEmail = computed(() => {
  return userEmail.value && validateEmail(userEmail.value)
})

const handleSubmit = async () => {
  if (!isValidEmail.value) return

  try {
    isLoading.value = true
    const response = await api.updateUserEmail(userEmail.value)

    if (response.success) {
      await refetchGetMe()
      modelValue.value = false
      userEmail.value = ''
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss">
.base-modal-content {
	&::before {
		background-image: var(--base-dialog-bg-texture);
	}
}
</style>
