<template>
  <BaseModal
    :model-value="modelValue"
    class="p-4 pt-8 gap-0 !rounded-2xl max-sm:w-full h-auto"
    @update:model-value="updateModelValue"
  >
    <!-- Content (with higher z-index) -->
    <template #header>
      <div class="max-w-[340px]">
        <h1 class="text-lavender text-5xl font-medium leading-10 tracking-[-2.4px]">
          {{ $t('components.claimInfoModal.title') }}
        </h1>
      </div>
    </template>
    <div class="mt-2 max-w-[340px]">
      <p class=" text-[#6D6D8F] text-xl font-normal leading-6 tracking-[-0.6px]">
        {{ $t('components.claimInfoModal.description') }}
      </p>
      <ul class="mt-6">
        <li class="text-[#6D6D8F] text-xl font-normal leading-6 tracking-[-0.6px] list-disc ml-8">
          <span class="text-[#F1E6FA]">{{ $t('components.claimInfoModal.importantNote') }}:</span> {{ $t('components.claimInfoModal.tokensNotAvailable') }}
        </li>
        <li class="text-[#6D6D8F] text-xl font-normal leading-6 tracking-[-0.6px] list-disc ml-8">
          {{ $t('components.claimInfoModal.claimableAmountReaches') }} <span class="text-[#F1E6FA]">{{ $t('components.claimInfoModal.onePercentMinimum') }}</span> {{ $t('components.claimInfoModal.willBeUpdated') }}
        </li>
        <li class="text-[#6D6D8F] text-xl font-normal leading-6 tracking-[-0.6px] list-disc ml-8">
          {{ $t('components.claimInfoModal.updateProcessMayTake') }} <span class="text-[#F1E6FA]">{{ $t('components.claimInfoModal.twentyFourToFortyEightHours') }}</span> {{ $t('components.claimInfoModal.dependingOnVesting') }}
        </li>
      </ul>
    </div>
    <template #footer>
      <div class="p-8 pt-0 w-full flex justify-center mt-4 md:mt-9">
        <GlowButton
          :color="EButtonColor.ORANGE"
          class="min-w-[117px]"
          @click="updateModelValue(false)"
        >
          <span>{{ $t('components.claimInfoModal.gotIt') }}</span>
        </GlowButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import { EButtonColor } from '@/types/shared/button'
import GlowButton from '../ui/button/GlowButton.vue'

defineProps<{
	modelValue: boolean
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void
}>()

const updateModelValue = (val: boolean) => {
  emit('update:modelValue', val)
}
</script>
