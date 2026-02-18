<script setup lang="ts">
import { computed } from 'vue'
import { useTranslation } from '@/composables/use-i18n'
import CardsCarousel from '@/components/ui/cards-carousel/CardsCarousel.vue'
import ClaimCard from '@/components/home-view/ClaimCard.vue'
import { useRecentClaims } from '@/composables/contracts/recent-claims'

const { t } = useTranslation()

const props = withDefaults(defineProps<{
	autoplay?: number
	transition?: number
}>(), {
  autoplay: 0,
  transition: 300,
})
const { recentClaims } = useRecentClaims()

const claimCarouselConfig = computed(() => ({
  breakpointMode: 'carousel' as const,
  gap: 4,
  autoplay: props.autoplay,
  transition: props.transition,
  itemsToShow: 'auto' as const,
}))
</script>

<template>
  <CardsCarousel
    :title="t('components.recentClaimsSlider.title')"
    :items="recentClaims"
    :config="claimCarouselConfig"
    :with-navigation="autoplay === 0"
    class="recent-claims-slider"
  >
    <template #slide="{ data: claim }">
      <ClaimCard v-bind="claim" />
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
