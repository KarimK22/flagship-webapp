<template>
  <div>
    <BaseModal
      :model-value="modelValue"
      class="p-4 gap-0 !rounded-2xl w-[96vw] md:w-[420px] !max-w-[none] max-h-[96vh] md:max-h-[90%] h-auto"
      :description="t('components.badgeProgressModal.lingoStaked')"
      @update:model-value="cancel"
    >
      <!-- Content (with higher z-index) -->
      <template #header>
        <div class="relative z-10 h-full pr-20 text-left">
          <div
            v-if="isError"
            class="flex flex-col gap-2"
          >
            <h1 class="text-[#FF7847] text-[32px] leading-7 font-medium tracking-[-1.28px] select-none">
              {{ t('components.badgeProgressModal.oops') }}
            </h1>
            <h1 class="text-lavender text-[32px] leading-7 font-medium tracking-[-1.28px] select-none">
              {{ t('components.badgeProgressModal.somethingWentWrong') }}
            </h1>
          </div>
          <h1
            v-else
            class="text-lavender text-[32px] leading-7 font-medium tracking-[-1.28px]"
          >
            {{ t('components.badgeProgressModal.confirmMinting') }}
          </h1>
        </div>
      </template>
      <template #description>
        <div
          v-if="isError"
          class="w-full pt-4"
        >
          <p class="text-lavender text-base leading-5 font-semibold tracking-[-0.6px]">
            {{ transactionError.text }}
          </p>
        </div>
        <div
          v-else
          class="w-full pt-4"
        >
          <ol class="space-y-1">
            <li
              v-for="step in steps"
              :key="step.label"
              class="p-1 pl-4 h-10 relative rounded-full flex justify-between items-center overflow-hidden"
            >
              <div
                :class="{ 'bg-[rgba(38,38,56,0.72)] opacity-100': step.status?.success }"
                class="opacity-80 inset-shadow-[0px_-4px_16px_-2px_rgba(222,_206,_235,_0.08)] bg-[rgba(38,38,56,0.32)] rounded-full absolute top-0 left-0 w-full h-full"
              />
              <span
                :class="{ 'text-lavender': step.status?.loading }"
                class="text-purple-gray text-base leading-5 font-semibold tracking-[-0.6px]"
              >{{ step.label }}</span>
              <div class="flex items-center">
                <div
                  :class="{ 'opacity-100': step.status?.success }"
                  class="opacity-0 w-96 h-10 absolute top-0 right-0"
                >
                  <div class="w-14 h-10 -right-[28px] -top-[3px] absolute bg-[#33F] rounded-full blur-[16px]" />
                  <div class="w-18 h-8 -right-[1px] -top-[28px] absolute bg-[#FF7847] rounded-full blur-[24px]" />
                  <div class="w-8 h-4 right-[2px] -top-[8px] absolute bg-[#6D6D8F] rounded-full blur-[8px] mix-blend-plus-lighter" />
                </div>
                <InlineSvg
                  v-if="step.status?.success"
                  :src="successIcon"
                  class="size-8 z-10"
                />
                <InlineSvg
                  v-else-if="step.status?.loading"
                  class="animate-[spin_2s_linear_infinite_reverse] size-4 m-3 z-10"
                  :src="loaderIcon"
                />
              </div>
            </li>
          </ol>
        </div>
        <div
          v-if="isError"
          class="flex gap-2 w-full pt-4"
        >
          <GlowButton
            :color="EButtonColor.BLUE"
            class="flex items-center w-full gap-2"
            @click="handleRetry"
          >
            <span>{{ t('components.badgeProgressModal.retry') }}</span>
          </GlowButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>
<script setup lang="ts">
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import loaderIcon from '@/assets/icons/loader-lg.svg'
import successIcon from '@/assets/icons/checkmark.svg'
import InlineSvg from 'vue-inline-svg'
import { status, transactionError, useStatus } from '@/composables/contracts/status'
import { computed, ref, watch } from 'vue'
import { EButtonColor } from '@/types/shared/button'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { useMyBadges } from '@/composables/my-badges'
import { useTranslation } from '@/composables/use-i18n'

const { t } = useTranslation()

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'retryTransaction'): void
}>()

const { handleMintBadge } = useMyBadges()

const handleRetry = () => {
  emit('retryTransaction')
  isError.value = false
  updateStatus('mintBadge', 'global', { loading: false, success: false, error: false })
  updateStatus('waitForTransaction', 'global', { loading: false, success: false, error: false })
  handleMintBadge()
}

const { updateStatus } = useStatus()
const isError = ref(false)

watch(() => {
  return [status.mintBadge.global?.error, status.waitForTransaction.global?.error]
}, (val) => {
  val.forEach((error) => {
    if (error) {
      isError.value = true
    }
  })
})

const cancel = (val: boolean) => {
  emit('update:modelValue', val)
  /* Clear the status */
  setTimeout(() => {
    updateStatus('mintBadge', 'global', { loading: false, success: false, error: false })
    updateStatus('waitForTransaction', 'global', { loading: false, success: false, error: false })
    transactionError.value = {
      text: null,
      value: null,
    }
    isError.value = false
  }, 1000)
}

const steps = computed(() => {
  return [
    {
      label: t('components.badgeProgressModal.confirmClaiming'),
      status: status.mintBadge.global,
    },
    {
      label: t('components.badgeProgressModal.mintingInProgress'),
      status: status.waitForTransaction.global,
    },
  ]
})
</script>
