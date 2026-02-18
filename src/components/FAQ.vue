<template>
  <div class="container mb-12 text-leght1">
    <h2 class="text-3xl font-bold mb-6">
      {{ t('modals.faq.title') }}
    </h2>
    <AccordionRoot
      type="single"
      collapsible
    >
      <AccordionItem
        v-for="(item, index) in faqItems"
        :key="index"
        :value="'item-' + index"
      >
        <AccordionTrigger>{{ item.question }}</AccordionTrigger>
        <AccordionContent>
          {{ item.answer }}
        </AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  </div>
</template>
<script setup lang="ts">
import { AccordionContent, AccordionItem, AccordionRoot, AccordionTrigger } from '@/components/ui/accordion'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const faqItems = [
  {
    question: t('modals.faq.whyStaking'),
    answer: t('modals.faq.whyStakingAnswer'),
  },
  {
    question: t('modals.faq.whatArePowerMiles'),
    answer: t('modals.faq.whatArePowerMilesAnswer'),
  },
]
</script>
