<template>
  <BaseModal
    :model-value="modelValue"
    class="relativep-2 gap-0 p-[1px] !rounded-2xl w-[96vw] md:w-auto !max-w-[none] max-h-[96vh] md:max-h-[90%] h-auto"
    @update:model-value="updateModelValue"
  >
    <div class="w-full h-full absolute top-0 left-0">
      <img
        :src="badge?.image"
        class="w-[264px] h-[250px] grayscale-100 object-cover blur-[104px] absolute top-0 left-1/2 -translate-x-1/2 mix-blend-plus-lighter opacity-32"
        :class="{ '!grayscale-0': badge?.isClaimed }"
      >
      <img
        :src="badge?.image"
        class="w-[304px] h-[288px] grayscale-100 object-cover blur-[24px] absolute top-3 left-1/2 -translate-x-1/2 mix-blend-plus-lighter opacity-66"
        :class="{ '!grayscale-0': badge?.isClaimed }"
      >
    </div>
    <div class="relative z-10 bg-dark2/90 max-w-[420px] rounded-[15px]">
      <div class="w-full h-full absolute top-0 left-0">
        <InlineSVG
          :src="modalTexture"
          unique-ids
          class="absolute top-[-8px] left-0 w-full h-full"
        />
        <img
          :src="badge?.image"
          class="w-[264px] h-[250px] grayscale-100 object-cover blur-[104px] absolute top-0 left-1/2 -translate-x-1/2 mix-blend-plus-lighter opacity-32"
          :class="{ '!grayscale-0': badge?.isClaimed }"
        >
        <img
          :src="badge?.image"
          class="w-[304px] h-[288px] grayscale-100 object-cover blur-[104px] absolute top-0 left-1/2 -translate-x-1/2 mix-blend-plus-lighter opacity-66"
          :class="{ '!grayscale-0': badge?.isClaimed }"
        >
      </div>
      <div class="isolate p-8 flex flex-col items-center justify-center gap-6">
        <h2
          v-if="badge?.isClaimable"
          class="text-lavender text-center text-[32px] font-medium leading-7 -tracking-[1.28px] w-full"
        >
          {{ t('components.badgeMintModal.congratsUnlocked') }}<br>{{ t('components.badgeMintModal.unlockedNewBadge') }}
        </h2>
        <h2
          v-else
          class="text-lavender text-center text-[32px] font-medium leading-7 -tracking-[1.28px] w-full"
        >
          {{ t('components.badgeMintModal.congratsUnlocked') }}<br>{{ t('components.badgeMintModal.receivedBadge') }}
        </h2>

        <img
          :src="badge?.image"
          :alt="badge?.name"
          class="w-[304px] h-[288px] object-cover"
          :class="{ 'grayscale-100 saturate-50 contrast-90 hue-rotate-300': badge?.isClaimable }"
        >
        <div class="flex flex-col items-center justify-center gap-5">
          <h1 class="text-lavender text-center text-5xl font-medium leading-10 -tracking-[2.4px]">
            {{ badge?.name }}
          </h1>
          <p class="text-purple-gray text-center text-xl font-normal leading-6 -tracking-[0.6px] [&:first-letter]:capitalize">
            {{ t(`badgesDescription.${badge?.description}`) }}
          </p>
        </div>
        <div class="w-full flex justify-center pt-2">
          <GlowButton
            v-if="badge?.isClaimable"
            :color="EButtonColor.BLUE"
            class="w-full"
            @click="handleMintBadge"
          >
            <span> {{ t('components.badgeMintModal.mintAndGet') }} </span>
          </GlowButton>
          <GlowButton
            v-else
            :color="EButtonColor.BLUE"
            class="w-full"
            @click="handleShareOnX"
          >
            <span> {{ t('components.badgeMintModal.shareOnX') }} </span>
          </GlowButton>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import { EButtonColor } from '@/types/shared/button'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import modalTexture from '@/assets/images/badges/modal-texture.svg'
import InlineSVG from 'vue-inline-svg'
import { useMyBadges } from '@/composables/my-badges'
import { useGetMe } from '@/composables/get-me'
import { useTranslation } from '@/composables/use-i18n'

defineProps<{
  modelValue: boolean
}>()

const { referralCode } = useGetMe()
const { badgeToReceive: badge, handleMintBadge } = useMyBadges()
const { t } = useTranslation()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const updateModelValue = (val: boolean) => {
  emit('update:modelValue', val)
}

const handleShareOnX = () => {
  const tweet = `Just unlocked a fresh NFT badge on @Lingocoins! Stake $LINGO and start collecting yours! app.lingocoin.io/rewards?ref=${referralCode.value}`
  const tweetText = encodeURIComponent(tweet).replace(/%20/g, '+')
  window.open(`https://x.com/intent/post?text=${tweetText}`, '_blank')
}
</script>

<style scoped>
.blued {
  filter:
    saturate(50%)
    /* reduce la saturación */
    brightness(1.1)
    /* un poco más de luz general */
    contrast(110%)
    /* mejora el contraste */
    hue-rotate(200deg)
    /* cambia tono hacia azul */
    drop-shadow(0 0 6px #5bc0ff);
  /* un toque de sombra azul */
}
</style>
