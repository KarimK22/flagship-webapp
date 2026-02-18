<template>
  <BaseModal
    v-model="modelValue"
    class="max-w-[calc(100vw-30px)] sm:max-w-[420px] !rounded-2xl px-4 py-8"
  >
    <div class="relative flex flex-col gap-4">
      <IconWrapper
        variant="orange"
        position="right"
        :with-borders="false"
        class="!absolute right-5 -top-2"
      />
      <h1 class="text-lavender text-[40px] font-normal -tracking-[2px] leading-8 text-left pr-[30px]">
        {{ t('components.miniAppPromoModal.title') }}
      </h1>

      <img
        :src="miniAppPromoImage"
        alt="Mini App Promo"
        class="w-full h-auto"
      >

      <p
        class="text-purple-gray font-normal text-xl -tracking-[0.6px] leading-6 pr-2"
        v-html="t('components.miniAppPromoModal.description')"
      />

      <ol class="flex flex-col gap-2 text-purple-gray font-normal text-xl -tracking-[0.6px] leading-6 pr-2">
        <li class="flex gap-2 items-start">
          <span class="pt-1">🎁</span><span v-html="t('components.miniAppPromoModal.item1')" />
        </li>

        <li class="flex gap-2 items-start">
          <span class="pt-1">🏆</span><span v-html="t('components.miniAppPromoModal.item2')" />
        </li>

        <li class="flex gap-2 items-start">
          <span class="pt-1">😎</span><span v-html="t('components.miniAppPromoModal.item3')" />
        </li>
      </ol>

      <span class="text-purple-gray font-normal text-xl -tracking-[0.6px] leading-6 pr-2">
        {{ t('components.miniAppPromoModal.item4') }}
      </span>

      <div class="w-full h-16 p-4 flex items-center justify-between rounded-2xl bg-[rgba(38,38,56,0.40)] [&:hover]:bg-[rgba(38,38,56,0.60)] cursor-pointer inset-shadow-[0_0_48px_-16px_#595978]">
        <span class="text-lavender font-medium text-4xl -tracking-[1.8px] leading-8">
          {{ referralCode }}
        </span>
        <IconButtonWrapper
          :src="copyIcon"
          :text-on-hover="t('common.copy')"
          :text-on-click="t('common.copied')"
          :transparent="true"
          @click="copyReferralCode"
        />
      </div>
      <div class="flex items-center justify-end gap-1">
        <GlowButton
          :color="EButtonColor.BLUE"
          class="w-full"
          @click="handleOpenLink"
        >
          {{ t('components.miniAppPromoModal.button') }}
        </GlowButton>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { useTranslation } from '@/composables/use-i18n'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import IconWrapper from '@/components/icon-wrapper/IconWrapper.vue'
import { EButtonColor } from '@/types/shared/button.ts'
import miniAppPromoImage from '@/assets/images/mini-app-promo.png'
import copyIcon from '@/assets/icons/orange-copy.svg'
import IconButtonWrapper from './IconButtonWrapper.vue'
import { ref } from 'vue'

const { t } = useTranslation()

const props = withDefaults(defineProps<{
  onOpenLink: () => void
}>(), {
  onOpenLink: () => {},
})

const modelValue = defineModel<boolean>({ required: true, default: true })
const referralCode = ref('BqWuLLeo8y')
const miniAppLink = ref('https://farcaster.xyz/miniapps/KsmcYuYPj94E/lingo')

const copyReferralCode = () => {
  navigator.clipboard.writeText(referralCode.value)
}

const handleOpenLink = async () => {
  window.open(miniAppLink.value, '_blank')
  props.onOpenLink()
}
</script>

<style lang="scss">
.base-modal-content {
  &::before {
    background-image: var(--base-dialog-bg-texture);
  }
}
</style>
