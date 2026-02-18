<script setup lang="ts">
import CardsCarousel from '@/components/ui/cards-carousel/CardsCarousel.vue'
import ronaldinho from '@/assets/images/home/celebs/ronaldinho.png'
import alexa from '@/assets/images/home/celebs/alexa.png'
import kingsley from '@/assets/images/home/celebs/kingsley.png'
import romain from '@/assets/images/home/celebs/romain.png'
import correntinTolisso from '@/assets/images/home/celebs/correntin-tolisso.png'
import mrPSquare from '@/assets/images/home/celebs/mr-p-square.png'
import bryanHabana from '@/assets/images/home/celebs/bryan-habana.png'
import chitoVera from '@/assets/images/home/celebs/chito-vera.png'
import CelebrityCard from './CelebrityCard.vue'

type Celebrity = {
  name: string
  image: string
  url: string
}

const celebrities: Celebrity[] = [
  {
    name: 'Ronaldinho ⚽',
    image: ronaldinho,
    url: '#',
  },
  {
    name: 'Kingsley Coman ⚽',
    image: kingsley,
    url: '#',
  },

  {
    name: 'Romain Ntamack 🏉',
    image: romain,
    url: '#',
  },
  {
    name: 'Alexa Grasso 🥊',
    image: alexa,
    url: '#',
  },
  {
    name: 'Corentin Tolisso ⚽',
    image: correntinTolisso,
    url: '#',
  },
  {
    name: 'Mr P Square🎤',
    image: mrPSquare,
    url: '#',
  },
  {
    name: 'Bryan Habana 🏉',
    image: bryanHabana,
    url: '#',
  },
  {
    name: 'Chito Vera 🥊',
    image: chitoVera,
    url: '#',
  }
]

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

const claimCarouselConfig = {
  breakpointMode: 'carousel' as const,
  gap: 4,
  transition: props.transition,
  itemsToShow: 'auto' as const,
}
</script>

<template>
  <CardsCarousel
    :title="title"
    :items="celebrities"
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
    <template #slide="{ data: celebrity, index }">
      <CelebrityCard
        v-bind="celebrity"
      />
      <div
        v-if="index === celebrities.length - 1"
        class="w-[200px] h-full"
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
