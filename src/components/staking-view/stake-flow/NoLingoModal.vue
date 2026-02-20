<script setup lang="ts">
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import InlineSvg from 'vue-inline-svg'
import lingoIcon from '@/assets/images/lingo-icon.svg'
import { useI18n } from 'vue-i18n'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'buy-lingo'): void
}>()

const { t } = useI18n()

const handleBuyLingo = () => {
  emit('update:modelValue', false)
  emit('buy-lingo')
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    class="p-6 pt-8 gap-0 !rounded-2xl max-sm:w-full h-auto"
    @update:model-value="(val: boolean) => emit('update:modelValue', val)"
  >
    <template #header>
      <div class="flex flex-col items-center w-full gap-4">
        <!-- LINGO icon with glow -->
        <div class="relative">
          <div class="absolute inset-0 rounded-full bg-sosiska/20 blur-[16px] scale-150" />
          <div class="relative size-20 rounded-full bg-gradient-to-br from-[#2a2a40] to-[#1c1c29] border border-[rgba(201,92,255,0.15)] flex items-center justify-center shadow-[0_0_24px_rgba(88,88,245,0.2)]">
            <InlineSvg
              :src="lingoIcon"
              class="size-10"
            />
          </div>
        </div>

        <h1 class="text-lavender text-2xl sm:text-3xl font-normal tracking-[-1.2px] text-center">
          {{ t('staking.stakingFlow.noLingoModal.title') }}
        </h1>
      </div>
    </template>

    <div class="mt-3 z-10">
      <p class="text-purple-gray text-base text-center leading-6 tracking-[-0.2px]">
        {{ t('staking.stakingFlow.noLingoModal.description') }}
      </p>
    </div>

    <template #footer>
      <div class="flex flex-col w-full gap-3 mt-6">
        <GlowButton
          :color="EButtonColor.BLUE"
          class="w-full"
          @click="handleBuyLingo"
        >
          <span>{{ t('staking.stakingFlow.noLingoModal.buyLingo') }}</span>
        </GlowButton>
      </div>
    </template>
  </BaseModal>
</template>
