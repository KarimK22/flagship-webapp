<template>
  <div class="flex justify-between md:justify-center items-center md:items-start flex-col md:flex-row gap-4 md:gap-0 mt-8 md:mt-0">
    <div class="flex flex-col gap-8 min-w-full md:min-w-[294px] items-start">
      <h3 class="text-light1 text-4.5xl font-normal leading-8 tracking-[-2px] text-left">
        {{ elementsTitle }}
        <HelpButton
          context=""
          class="cursor-pointer inline-block !size-8 bg-transparent shadow-[0px_-4px_16px_-2px_rgba(222,206,235,0.24)_inset]"
          :help-type="EHelpType.ELEMENTS"
        >
          <InlineSvg
            :src="helpIconSolid"
            class="size-8"
            unique-ids
          />
        </HelpButton>
      </h3>
      <GlowButton
        :color="EButtonColor.ORANGE"
        class="min-w-full md:min-w-[193px] self-start hidden md:block"
        @click="handleSmash"
      >
        <span class="flex items-center gap-2">
          {{ $t('compactElements.smashToUnlock') }} <InlineSvg :src="multiArrow" />
        </span>
      </GlowButton>
    </div>
    <div class="flex gap-1">
      <div
        v-for="(element, i) in elementImageMap"
        :key="i"
        class="relative w-[48px] h-[80px] sm:w-[60px] sm:h-[96px]"
      >
        <TooltipWrapper>
          <img
            v-if="i == 6"
            :src="element6Border"
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-11 min-w-[65px] min-h-[96px] sm:min-w-[90px] sm:min-h-[116px]"
          >
          <div class="flex flex-col items-center relative rounded-full w-full h-24 bg-dark2 overflow-hidden p-[0.6666px] h-full">
            <img
              :src="element"
              class="object-contain flex-1 absolute -top-6 left-0 blur-sm"
              :class="{ 'opacity-10': !elements?.[i] }"
            >
            <div
              class="flex flex-col items-center justify-center gap-1 w-full h-full bg-dark2/50 rounded-full z-10"
              :class="{ 'opacity-10': !elements?.[i] }"
            >
              <img
                :src="element"
                class="object-contain flex-1 w-[32px] max-h-[32px] sm:w-[44px] sm:max-h-[44px]"
              >
              <div
                class="rounded-full border border-dark3/88 shadow-[0px_0px_56px_-16px_rgba(28,28,41,0.40)_inset] p-2 size-6 flex items-center justify-center text-lavender text-[16px] font-normal leading-6 tracking-[-0.16px]"
              >
                {{ elements?.[i] || 0 }}
              </div>
            </div>
          </div>
          <template #content>
            <div
              v-if="i != 6"
              class="flex flex-col gap-2 max-w-[200px]"
            >
              <span
                v-if="elements?.[i]"
                class="text-light1 text-sm font-normal leading-4 tracking-[-0.48px]"
              >
                {{ $t('compactElements.unlocked') }}
              </span>
              <span
                v-else
                class="text-light1 text-sm font-normal leading-4 tracking-[-0.48px]"
              >
                {{ $t('compactElements.notUnlocked') }}
              </span>
            </div>
            <div
              v-else
              class="flex flex-col gap-2 max-w-[200px]"
            >
              <span
                class="text-light1 text-sm font-normal leading-4 tracking-[-0.48px]"
              >
                {{ $t('compactElements.collectAll') }}
              </span>
            </div>
          </template>
        </TooltipWrapper>
      </div>
    </div>
    <GlowButton
      :color="EButtonColor.ORANGE"
      class="min-w-full md:min-w-[193px] self-start md:hidden"
      @click="handleSmash"
    >
      <span class="flex items-center gap-2">
        {{ $t('compactElements.smashToUnlock') }} <InlineSvg :src="multiArrow" />
      </span>
    </GlowButton>
  </div>
</template>
<script setup lang="ts">
import { useElements } from '@/composables/elements'
import { elementImageMap } from '@/const/asteroid'
import { useTranslation } from '@/composables/use-i18n'
import GlowButton from '../ui/button/GlowButton.vue'
import multiArrow from '@/assets/icons/multi-arrow.svg'
import element6Border from '@/assets/images/element-border.svg'
import helpIconSolid from '@/assets/images/medals/details-icon.svg'
import { EButtonColor } from '@/types/shared/button'
import { computed } from 'vue'
import mixpanel from 'mixpanel-browser'
import TooltipWrapper from '../TooltipWrapper.vue'
import HelpButton from '../help-modal/HelpButton.vue'
import { EHelpType } from '@/types/staking'

const { t } = useTranslation()
const { elements } = useElements()

const elementsTitle = computed(() => {
  const unlockedElements = Object.values(elements.value || {}).filter(value => value > 0).length
  const totalElements = Object.values(elements.value || {}).length
  const stepsAway = totalElements - unlockedElements

  if (unlockedElements === 0) {
    return t('home.elements.collectAll')
  }
  return t('home.elements.stepsAway', {
    steps: stepsAway,
    plural: stepsAway === 1 ? '' : 's',
  })
})

const handleSmash = () => {
  const el = document.getElementById('asteroid-container')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  mixpanel.track('Unlock to Smash Button Click')
}

</script>