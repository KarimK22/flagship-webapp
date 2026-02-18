<template>
  <p class="text-purple-gray text-xl font-normal leading-6 tracking-[-0.6px] mb-12">
    <span v-html="t('components.elementsList.collectElementsDescription')"></span>
  </p>
  <div class="flex max-[800px]:flex-col gap-3 min-[800px]:gap-1 max-[800px]:mb-10">
    <div
      v-for="i in 5"
      :key="i"
      class="element-item flex flex-col items-center gap-2"
    >
      <div
        class="relative rounded-full flex min-[800px]:flex-col items-center justify-between gap-5 p-2 min-[800px]:w-36 min-[800px]:h-[230px] bg-dark2"
        :class="{'opacity-12': !elements?.[i]}"
      >
        <img
          :src="elementImageMap[i as keyof typeof elementImageMap]"
          class="object-contain flex-1 max-[800px]:!w-16 max-[800px]:m-3"
          :style="`width: ${elementImageWidths[i-1]}px`"
        >
        <div
          class="rounded-full border border-dark3/88 shadow-[0px_0px_56px_-16px_rgba(28,28,41,0.40)_inset] p-2 text-2xl size-16 flex items-center justify-center text-lavender text-[32px] font-normal leading-16 tracking-[-1.28px]"
        >
          {{ elements?.[i] || 0 }}
        </div>
      </div>
      <span class="text-light1 text-xl font-medium leading-8 tracking-[-0.2px]">{{ t('components.elementsList.element', { number: i }) }}</span>
    </div>
  </div>
  <div class="connectors relative h-[50px] z-10 max-[800px]:hidden">
    <img
      :src="element1Connector"
      class="absolute bottom-0 right-1/2 h-full object-contain"
      alt="Element 1 connector"
      :class="{'opacity-56': !elements?.[1]}"
    >
    <img
      :src="element2Connector"
      class="absolute bottom-0 right-1/2 h-full object-contain"
      alt="Element 2 connector"
      :class="{'opacity-56': !elements?.[2]}"
    >
    <img
      :src="element3Connector"
      class="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-full object-contain"
      alt="Element 3 connector"
      :class="{'opacity-56': !elements?.[3]}"
    >
    <img
      :src="element4Connector"
      class="absolute bottom-0 left-1/2 h-full object-contain"
      alt="Element 4 connector"
      :class="{'opacity-56': !elements?.[4]}"
    >
    <img
      :src="element5Connector"
      class="absolute bottom-0 left-1/2 h-full object-contain"
      alt="Element 5 connector"
      :class="{'opacity-56': !elements?.[5]}"
    >
    <img
      :src="elementConnectorRoot"
      class="absolute -bottom-1/2 left-1/2 transform -translate-x-1/2 h-full object-contain"
      alt="Element connector root"
    >
  </div>
  <div class="relative flex flex-col items-center">
    <div class="relative rounded-full bg-dark2 flex items-center justify-center px-[60px] pt-4 pb-3 mb-2">
      <img
        :src="element6bg"
        class="absolute inset-0 z-0"
        alt="Element 6 background"
      >
      <img
        :src="elementImageMap[6]"
        class="w-20 min-[800px]:w-[136px] object-contain z-10"
        alt="Element 6"
      >
    </div>
    <div class="flex items-center gap-2 h-10">
      <span class="text-lavender text-center text-[56px] font-normal leading-10 -tracking-[2.8px]">{{ t('components.elementsList.element6') }}</span>
      <div
        class="rounded-full text-lavender text-[32px] font-normal leading-8 tracking-[-1.28px] py-4 px-6 border border-dark3/88 shadow-[0px_0px_56px_-16px_rgba(28,28,41,0.40)_inset]"
      >
        {{ elements?.[6] || 0 }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useElements } from '@/composables/elements'
import { elementImageMap } from '@/const/asteroid'
import element6bg from '@/assets/images/game/elements/mics/element6-gradient.png'
import element1Connector from '@/assets/images/game/elements/mics/element-1-connector.png'
import element2Connector from '@/assets/images/game/elements/mics/element-2-connector.png'
import element3Connector from '@/assets/images/game/elements/mics/element-3-connector.png'
import element4Connector from '@/assets/images/game/elements/mics/element-4-connector.png'
import element5Connector from '@/assets/images/game/elements/mics/element-5-connector.png'
import elementConnectorRoot from '@/assets/images/game/elements/mics/element-connector-root.svg'
import { useTranslation } from '@/composables/use-i18n'

const { t } = useTranslation()
const { elements } = useElements()

// add widths to the images by index
const elementImageWidths = [
  104,
  104,
  100,
  88,
  116,
]
</script>