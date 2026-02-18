<template>
  <BaseModal
    :model-value="modelValue"
    class="p-2 pt-4 md:p-4 md:pt-8 gap-0 !rounded-2xl w-[96vw] md:w-[640px] !max-w-[none] max-h-[96vh] md:max-h-[90%] h-auto"
    @update:model-value="updateModelValue"
  >
    <!-- Content (with higher z-index) -->
    <template #header>
      <div class="pr-20">
        <h1 class="text-lavender text-4xl md:text-[56px] leading-8 md:leading-10 font-normal tracking-[-1.28px] select-none">
          {{ t('modals.infoModal.title') }}
        </h1>
      </div>
    </template>
    <AccordionRoot
      type="single"
      collapsible
      default-value="1"
      class="flex flex-col z-10 w-full gap-1 mt-8"
    >
      <AccordionItem
        v-for="(item, index) in faqItems"
        :key="index"
        :value="item.id.toString()"
        class="border-none cursor-pointer"
      >
        <div
          :style="item.style"
          :class="item.questionBgClass"
          class="rounded-2xl inset-shadow-[0_-4px_16px_-2px_rgba(222,206,235,0.08)] bg-[rgba(38,38,56,0.32)] p-4"
        >
          <AccordionTrigger class="cursor-pointer outline-none py-2 relative">
            <span class="text-lavender text-2xl md:text-[40px] leading-8 md:leading-10 font-normal tracking-[-2px]">
              {{ t(item.question) }}
              <img
                :src="item.icon"
                alt="icon"
                :class="item.iconClass"
              >
            </span>
            <template #icon>
              <InlineSvg
                :src="chevronIcon"
                class="size-6 md:size-10"
                unique-ids="chevron-icon"
              />
            </template>
          </AccordionTrigger>
          <AccordionContent class="z-10">
            <component :is="item.answer" />
          </AccordionContent>
        </div>
      </AccordionItem>
    </AccordionRoot>
    <template #footer>
      <div class="p-8 pt-0 w-full flex justify-center mt-4 md:mt-9">
        <GlowButton
          :color="EButtonColor.ORANGE"
          @click="updateModelValue(false)"
        >
          <span> {{ t('modals.infoModal.letsGo') }} </span>
        </GlowButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import { AccordionContent, AccordionItem, AccordionRoot, AccordionTrigger } from '@/components/ui/accordion'
import chevronIcon from '@/assets/icons/rounded-chevron.svg'
import asteroidIcon from '@/assets/images/asteroid.png'
import giftBoxIcon from '@/assets/images/gift-box.png'
import question1Bg from '@/assets/images/faq/question-1.png'
import question2Bg from '@/assets/images/faq/question-2.png'
import question3Bg from '@/assets/images/faq/question-3.png'
import powerIcon from '@/assets/images/bolt.svg'
import InlineSvg from 'vue-inline-svg'
import FirstSection from './FirstSection.vue'
import SecondSection from './SecondSection.vue'
import ThirdSection from './ThirdSection.vue'
import { EButtonColor } from '@/types/shared/button'
import GlowButton from '../ui/button/GlowButton.vue'
import { useTranslation } from '@/composables/use-i18n'

const { t } = useTranslation()
defineProps<{
	modelValue: boolean
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void
}>()

const updateModelValue = (val: boolean) => {
  emit('update:modelValue', val)
}

const faqItems = [
  {
    id: 1,
    question: 'modals.infoModal.generatePower',
    style: `background-image:  url(${question1Bg})`,
    icon: powerIcon,
    iconClass: 'w-[40px] h-[40px] inline-block absolute top-2 right-30 md:right-60 z-0',
    questionBgClass: `bg-no-repeat bg-[size:680px_240px] bg-[top]`,
    answer: FirstSection,
  },
  {
    id: 2,
    question: 'modals.infoModal.playAndEarn',
    style: `background-image: url(${question2Bg})`,
    icon: asteroidIcon,
    iconClass: 'w-[174px] h-[106.5px] inline-block absolute -top-4 right-15 z-0',
    questionBgClass: `bg-no-repeat bg-[size:680px_240px] bg-[-40px_top] md:bg-[168px_top]`,
    answer: SecondSection,
  },
  {
    id: 3,
    question: 'modals.infoModal.winBigPrizes',
    style: `background-image: url(${question3Bg})`,
    icon: giftBoxIcon,
    iconClass: 'w-[48px] h-[47px] inline-block absolute top-0 right-20 md:right-30 z-0',
    questionBgClass: `bg-no-repeat bg-[size:680px_240px] bg-[-30px_top] md:bg-[168px_top]`,
    answer: ThirdSection,
  },
]
</script>
