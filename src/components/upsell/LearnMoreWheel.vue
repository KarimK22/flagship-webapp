<template>
  <BaseModal
    :model-value="modelValue"
    class="gap-0 px-4 py-8 !rounded-2xl w-[96vw] md:w-auto !max-w-[none] max-h-[96vh] md:max-h-[90%] h-auto"
    @update:model-value="updateModelValue"
  >
    <!-- Content (with higher z-index) -->
    <div class="z-10 w-full md:w-[640px] text-lavender">
      <h2 class="text-4.5xl md:text-[40px] leading-8 font-normal pr-16 tracking-[-2px] mb-4">
        {{ $t('modals.howItWorks.title') }}
      </h2>
      <p class="text-xl md:text-[20px] leading-6 md:leading-8 tracking-[-0.8px]">
        {{ $t('modals.howItWorks.description') }}
      </p>
    </div>
    <div class="w-full mb-8 mt-4 flex gap-1 flex-wrap [&_.item]:bg-[#262638] [&_.item]:h-[72px] [&_.item]:relative">
      <div class="flex gap-1 w-full">
        <div class="item w-1/2 flex items-center justify-start gap-2 p-1 rounded-2xl overflow-hidden">
          <img
            class="size-16 absolute -top-4 -left-4 blur-lg"
            :src="community"
            alt="community"
          >
          <img
            class="size-16 z-10"
            :src="community"
            alt="community"
          >
          <span class="text-lavender text-base leading-4 tracking-[0.16px] font-semibold">
            {{ $t('modals.howItWorks.users') }}
          </span>
        </div>
        <div class="item w-1/2 flex items-center justify-start gap-2 p-1 rounded-2xl overflow-hidden">
          <img
            class="size-16 absolute -top-4 -left-4 blur-lg"
            :src="x"
            alt="x"
          >
          <img
            class="size-16 z-10"
            :src="x"
            alt="x"
          >
          <span class="text-lavender text-base leading-4 tracking-[0.16px] font-semibold">
            {{ $t('modals.howItWorks.x') }}
          </span>
        </div>
      </div>
      <div class="item w-full flex items-center justify-start gap-2 p-1 rounded-2xl overflow-hidden">
        <img
          class="size-16 absolute -top-4 -left-4 blur-lg"
          :src="instagram"
          alt="instagram"
        >
        <img
          class="size-16 z-10"
          :src="instagram"
          alt="instagram"
        >
        <span class="text-lavender text-base leading-4 tracking-[0.16px] font-semibold">
          {{ $t('modals.howItWorks.instagram') }}
        </span>
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <h3 class="text-[32px] text-lavender font-medium leading-6 md:leading-8 tracking-[-1.28px]">
        ✨ {{ $t('modals.howItWorks.howItWorks') }}
      </h3>
      <div class="flex flex-col gap-4 mb-4">
        <span class="text-[#9A9AB8] text-base leading-4 tracking-[0.16px] list-decimal">
          <strong class="text-lavender font-medium">{{ $t('modals.howItWorks.getALingoPass') }}</strong> {{ $t('modals.howItWorks.startsAtJust') }}
        </span>
        <span class="text-[#9A9AB8] text-base leading-4 tracking-[0.16px] list-decimal">
          <strong class="text-lavender font-medium">{{ $t('modals.howItWorks.collectPoints') }}</strong> {{ $t('modals.howItWorks.yourPassEarnsPoints') }}
        </span>
        <span class="text-[#9A9AB8] text-base leading-4 tracking-[0.16px] list-decimal">
          <strong class="text-lavender font-medium">{{ $t('modals.howItWorks.spinAndWin') }}</strong> {{ $t('modals.howItWorks.useYourPoints') }}
        </span>
      </div>
      <h3 class="text-[32px] text-lavender font-medium leading-7 md:leading-8 tracking-[-1.28px]">
        🎁 {{ $t('modals.howItWorks.tryItForFree') }}
      </h3>
      <span class="text-[#9A9AB8] text-base leading-4 tracking-[0.16px] mb-4">
        {{ $t('modals.howItWorks.getYourFirstSpin') }}
      </span>
      <h3 class="text-[32px] text-lavender font-medium leading-7 md:leading-8 tracking-[-1.28px]">
        🛡️ {{ $t('modals.howItWorks.privacyFirst') }}
      </h3>
      <span class="text-[#9A9AB8] text-base leading-4 tracking-[0.16px] mb-8">
        {{ $t('modals.howItWorks.weNeverSpamOrSellYourData') }}
      </span>
    </div>

    <template
      #footer
    >
      <GlowButton
        :color="EButtonColor.BLUE"
        class="w-full"
        @click="updateModelValue(false)"
      >
        {{ $t('modals.howItWorks.claimThePrize') }}
      </GlowButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import { EButtonColor } from '@/types/shared/button'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import community from '@/assets/images/home/why-trust-us/community.png'
import instagram from '@/assets/images/home/why-trust-us/instagram.png'
import x from '@/assets/images/home/why-trust-us/x.png'

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
