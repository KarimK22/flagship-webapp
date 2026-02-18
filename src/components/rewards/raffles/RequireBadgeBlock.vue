<template>
  <div
    v-if="badgeImage"
    class="max-w-[366px] md:max-w-full w-full h-auto bg-contain bg-top bg-no-repeat p-4 flex flex-col gap-4 md:gap-6 bg-[size:100%_100%]"
    :style="{ backgroundImage: `url(${badgeSection})` }"
  >
    <div class="flex items-center justify-center h-full">
      <div class="flex flex-col gap-2 md:gap-4">
        <span class="text-lavender text-[28px] md:text-[32px] leading-6 md:leading-6 tracking-[-1.6px]">
          {{ $t('components.requireBadgeBlock.becomeA') }} <div class="relative inline-block">
            <h1 class="text-[#FFBC70] font-medium ">
              {{ badgeImage?.name }}
            </h1>
            <h1 class="text-[#FFBC70] font-medium flare ">
              {{ badgeImage?.name }}
            </h1>
          </div>
          {{ $t('components.requireBadgeBlock.toParticipate') }}
        </span>
        <span class="w-[213px] text-purple-gray text-xl leading-6 tracking-[-0.6px]">
          {{ $t('components.requireBadgeBlock.requires') }} {{ $t(`badgesDescription.${badgeImage?.description}`) }}
        </span>
      </div>
      <img
        :src="badgeImage?.image2 || badgeImage?.image"
        class="w-[100px] md:w-[143px]"
      >
    </div>
    <GlowButton
      :color="EButtonColor.PURPLE"
      class="w-full"
      @click="handleClickMainCTA"
    >
      <span class="flex items-center justify-center gap-1 ">
        <span>{{ $t(text) }}</span>
        <InlineSvg
          v-if="badgeImage?.id !== BADGE_ID.PRIVATE_JET"
          :src="lingoIcon"
          class="size-6"
        />
      </span>
    </GlowButton>
  </div>
</template>

<script lang="ts" setup>
import lingoIcon from '@/assets/images/lingo-icon.svg'
import badgeSection from '@/assets/images/rewards/badge-section.png'
import { badges } from '@/const/badges'
import { computed } from 'vue'
import { EButtonColor } from '@/types/shared/button'
import { useRouter } from 'vue-router'
import mixpanel from 'mixpanel-browser'
import { LingoRouteName } from '@/router/routes'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { BADGE_ID } from '@/types/shared/badge'

const props = defineProps<{
  requiredBadge: number
}>()

const badgeImage = computed(() => {
  const badge = badges.find((badge) => badge.id === props.requiredBadge)
  return badge
})

const router = useRouter()

const text = computed(() => {
  if (badgeImage.value?.id === BADGE_ID.PRIVATE_JET) {
    return 'components.requireBadgeBlock.openDiscord'
  }
  return 'components.requireBadgeBlock.stakeLingo'
})

const handleClickMainCTA = () => {
  if (badgeImage.value?.id === BADGE_ID.PRIVATE_JET) {
    goToDiscord()
  } else {
    goToStaking()
  }
}

const goToDiscord = () => {
  window.open('https://discord.com/invite/lingo', '_blank')
}

const goToStaking = () => {
  mixpanel.track('Staking Started', {
    entryPoint: 'rafflePopup',
  })
  router.push({ name: LingoRouteName.STAKING_NEW, query: { redirect: 'raffles' } })
}
</script>

<style scoped>
.flare {
  width: 100%;
  position: absolute;
  filter: blur(1px);
  overflow: hidden;
  top: 0px;
  left: 0px;
  background: radial-gradient(100% 60% at 50% 0%,
      #F1E6FA 0%,
      rgba(241, 230, 250, 0) 100%);
  background-clip: text;
  color: transparent;
  mix-blend-mode: plus-lighter;
  pointer-events: none;
}
</style>