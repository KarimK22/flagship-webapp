<script setup lang="ts">
import { useTranslation } from '@/composables/use-i18n'
import CardsCarousel from '@/components/ui/cards-carousel/CardsCarousel.vue'
import TestimonialCard from '@/components/home-view/TestimonialCard.vue'
import { useTestimonials } from '@/composables/use-testimonials'
import { computed } from 'vue'

const { t } = useTranslation()

const { testimonials } = useTestimonials()

const props = withDefaults(defineProps<{
  transition?: number
  title?: string
  withNavigation?: boolean
  leftNavigation?: boolean
  class?: string
}>(), {
  transition: 300,
  title: '',
  withNavigation: false,
  leftNavigation: false,
  class: '',
})

const effectiveTitle = computed(() => props.title || t('components.testimonialsSlider.title'))

const claimCarouselConfig = {
  breakpointMode: 'carousel' as const,
  gap: 4,
  transition: props.transition,
  itemsToShow: 'auto' as const,
}
</script>

<template>
  <CardsCarousel
    :title="effectiveTitle"
    :items="testimonials"
    :config="claimCarouselConfig"
    :with-navigation="true"
    class="recent-claims-slider"
    :class="props.class"
    :gap="8"
  >
    <template
      v-if="$slots.header"
      #header
    >
      <slot name="header" />
    </template>
    <template #slide="{ data: testimonial, index }">
      <TestimonialCard v-bind="testimonial" />
      <div
        v-if="index === testimonials.length - 1"
        class="w-[452px] h-full"
      />
    </template>
  </CardsCarousel>
</template>

<style scoped lang="scss">
.recent-claims-slider {
  :deep(.carousel__viewport) {
    overflow: visible !important;
  }
}
</style>
