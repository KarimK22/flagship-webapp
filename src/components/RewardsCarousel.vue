<template>
  <div>
    <div
      v-if="isLoading"
      class="flex justify-center items-center h-[344px]"
    >
      <BaseSpinner />
    </div>
    <div
      v-else-if="currentSlides.length > 0"
      class="relative"
    >
      <Carousel3d
        :disable3d="true"
        :space="325"
        :perspective="29"
        :width="288"
        :height="512"
        :display="7"
        :border="0"
        :controls-visible="true"
        :animation-speed="700"
        controls-prev-html="&lt;"
        controls-next-html="&gt;"
        :controls-height="40"
        :controls-width="40"
        :start-index="startSlideIndex"
        :on-main-slide-click="() => {}"
        @after-slide-change="handleSlideChange"
      >
        <template v-if="type === 'rewards'">
          <Slide
            v-for="(raffle, index) in finishedWonRaffles"
            :key="index"
            :index="index"
            class="cursor-pointer !bg-dark2"
          >
            <RaffleWonCard
              :raffle="raffle"
              :my-raffle-status="myRafflesStatus[raffle.id]"
            />
          </Slide>
        </template>
        <template v-else-if="type === 'raffles'">
          <Slide
            v-for="(raffle, index) in sortedActiveRaffles"
            :key="index"
            :index="index"
            class="cursor-pointer !bg-dark2"
          >
            <RaffleCardCustomBg
              v-if="isCustomBgRaffle(raffle)"
              :raffle="raffle"
              :my-raffle-status="myRafflesStatus[raffle.id]"
              @get-more="emit('getMore')"
              @open-simulator="emit('openSimulator')"
            />
            <RaffleCard
              v-else
              :raffle="raffle"
              :my-raffle-status="myRafflesStatus[raffle.id]"
              @get-more="emit('getMore')"
            />
          </Slide>
        </template>
        <template v-else-if="type === 'airdrops'">
          <Slide
            v-for="(airdrop, index) in airdropsToShow"
            :key="index"
            :index="index"
            class="cursor-pointer !bg-dark2"
          >
            <AirdropCard :airdrop="airdrop" />
          </Slide>
        </template>
        <template v-else-if="type === 'experiences'">
          <Slide
            v-for="(experience, index) in sortedActiveExperiences"
            :key="index"
            :index="index"
            class="cursor-pointer !bg-dark2"
          >
            <ExperienceCard
              :experience="experience"
              :experience-claimed="!!myExperiencesStatus[experience.id]"
            />
          </Slide>
        </template>
        <Slide
          v-for="index in placeholderCount"
          :key="`placeholder-${index}`"
          :index="placeholderInfo[type] + index - 1"
          class="!bg-dark2"
        >
          <template #default="{ isCurrent }">
            <PlaceholderCard
              :is-current="isCurrent"
              class="w-[288px] h-[512px]"
            />
          </template>
        </Slide>
      </Carousel3d>
    </div>
    <div
      v-else
      class="flex justify-center items-center h-[344px] gap-12 mt-2 rounded-2xl relative"
    >
      <HeroBackground
        variant="clean"
        class="texture"
      />
      <GlowText
        :text="emptyText"
        variant="mixed"
        class="tracking-tighter max-w-[328px]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRaffles } from '@/composables/raffles'
import { useExperiences } from '@/composables/experiences'
import RaffleCard from '@/components/rewards/raffles/RaffleCard.vue'
import RaffleCardCustomBg from '@/components/rewards/raffles/RaffleCardCustomBg.vue'
import type { Raffle } from '@/services/api.ts'
import PlaceholderCard from '@/components/rewards/PlaceholderCard.vue'
import GlowText from '@/components/glow-text/GlowText.vue'
import HeroBackground from '@/components/textures/HeroBackground.vue'
import { Carousel3d, Slide } from '@nanoandrew4/vue3-carousel-3d'
import '@nanoandrew4/vue3-carousel-3d/dist/style.css'
import AirdropCard from '@/components/rewards/airdrops/AirdropCard.vue'
import 'vue3-carousel/dist/carousel.css'
import RaffleWonCard from '@/components/rewards/raffles/raffles-won/RaffleWonCard.vue'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import ExperienceCard from '@/components/rewards/experiences/ExperienceCard.vue'
import type { ExclusiveEvent } from '@/services/api.ts'
import { useAirdrops } from '@/composables/airdrops.ts'
import { useGetMe } from '@/composables/get-me'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps<{
  type: 'rewards' | 'raffles' | 'airdrops' | 'experiences'
}>()

const emit = defineEmits<{
  (e: 'getMore'): void
  (e: 'openSimulator'): void
  (e: 'activeRaffleChanged', raffleId: string | null): void
}>()

const {
  sortedActiveRaffles,
  finishedWonRaffles,
  myRafflesStatus,
  loadingRaffles,
  loadingMyRafflesStatus,
} = useRaffles()

const { accountAddress } = useGetMe()

const {
  experiences,
  orderActiveExperiences,
  loadingExperiences,
  loadingMyExperiencesStatus,
  myExperiencesStatus,
} = useExperiences()
const { airdrops, finishedAirdrops } = useAirdrops()

const customBgRaffleId = computed(() => {
  const match = sortedActiveRaffles.value.find(r => r.title.toLowerCase().includes('bitrefill'))
  return match?.id ?? null
})

const isCustomBgRaffle = (raffle: Raffle) => {
  return raffle.id === customBgRaffleId.value
}
const sortedActiveExperiences = ref<ExclusiveEvent[]>([])
const isLoading = computed(() => {
  if (props.type === 'airdrops') return false // Airdrops are static data
  if (props.type === 'rewards') {
    return loadingRaffles.value || (!!accountAddress.value && loadingMyRafflesStatus.value)
  }
  if (props.type === 'raffles') {
    return loadingRaffles.value
  }
  if (props.type === 'experiences') {
    return loadingExperiences.value || (!!accountAddress.value && loadingMyExperiencesStatus.value)
  }
  return false
})

const airdropsToShow = computed(() => {
  const lastTwo = finishedAirdrops.value.slice(-2)
  const rest = finishedAirdrops.value.slice(0, -2)
  return [...lastTwo, ...airdrops.value, ...rest]
})

const currentSlides = computed(() => {
  switch (props.type) {
  case 'raffles':
    return sortedActiveRaffles.value
  case 'rewards':
    return finishedWonRaffles.value
  case 'airdrops':
    return airdropsToShow.value
  case 'experiences':
    return sortedActiveExperiences.value
  default:
    return []
  }
})

const reorderExperiences = () => {
  if (!experiences.value || experiences.value.length === 0) return
  sortedActiveExperiences.value = orderActiveExperiences(experiences.value)
  initialLoadDone.value = true
}

// Initialize with sorted experiences only once
const initialLoadDone = ref(false)

// Watch for experience changes
watch(experiences, () => {
  if (!initialLoadDone.value) {
    reorderExperiences()
  } else {
    // On refetch, update values without reordering
    // Map new data to existing order
    if (sortedActiveExperiences.value.length > 0 && experiences.value && experiences.value.length > 0) {
      sortedActiveExperiences.value = sortedActiveExperiences.value.map(sortedExp => {
        // Find the updated experience with the same ID
        const updatedExp = experiences.value && experiences.value.find(exp => exp.id === sortedExp.id)
        // Return the updated experience or the original if not found
        return updatedExp || sortedExp
      })
    }
  }
})

const handleSlideChange = (index: number) => {
  if (props.type === 'raffles' && sortedActiveRaffles.value[index]) {
    emit('activeRaffleChanged', sortedActiveRaffles.value[index].id)
  }
}

// Emit initial active raffle when data loads
watch(sortedActiveRaffles, (raffles) => {
  if (props.type === 'raffles' && raffles.length > 0) {
    const initialIndex = startSlideIndex.value
    if (raffles[initialIndex]) {
      emit('activeRaffleChanged', raffles[initialIndex].id)
    }
  }
}, { once: true })

onMounted(() => {
  if (props.type === 'experiences' && experiences.value && experiences.value.length > 0) {
    reorderExperiences()
  }
})

// Calculate how many placeholder slides we need to add
const placeholderCount = computed(() => {
  if (props.type === 'airdrops') return 0
  const minSlides = 9
  const currentCount = currentSlides.value.length

  // If we have fewer than minSlides, return the number of placeholders needed
  return currentCount < minSlides ? minSlides - currentCount : 0
})

const emptyText = computed(() => {
  switch (props.type) {
  case 'raffles':
    return t('rewards.carousel.rafflesEmpty')
  case 'rewards':
    return accountAddress.value ? t('rewards.carousel.rewardsEmpty') : t('rewards.carousel.rewardsEmptyNotLogged')
  case 'airdrops':
    return t('rewards.carousel.airdropsEmpty')
  case 'experiences':
    return t('rewards.carousel.experiencesEmpty')
  default:
    return ''
  }
})

const startSlideIndex = computed(() => {
  if (props.type === 'airdrops') {
    if (airdropsToShow.value.length >= 3) return 2
    return 0
  }
  const slides = currentSlides.value.length
  if (slides === 7) return 1
  if (slides === 8) return 2
  if (slides === 9) return 3
  return 0
})

const placeholderInfo = computed(() => {
  return {
    raffles: sortedActiveRaffles.value.length,
    rewards: finishedWonRaffles.value.length,
    airdrops: airdropsToShow.value.length,
    experiences: sortedActiveExperiences.value.length,
  }
})
</script>

<style scoped>
.carousel-3d-slide {
    @apply rounded-[16px];
    transition: all 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) !important;
    backface-visibility: hidden;
    will-change: transform, opacity, width, height;
}

/* Add opacity effect for non-current slides */
.carousel-3d-container .carousel-3d-slide {
    opacity: 0.3;
    transition: width 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) 0.2s, height 0.7s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) !important;
    backface-visibility: hidden;
    will-change: transform, opacity, width, height;
}

/* Current slide (center) */
.carousel-3d-container .carousel-3d-slide.current {
    opacity: 1;
}

/* Slides closer to the center have higher opacity */
.carousel-3d-container .carousel-3d-slide:not(.current) {
    opacity: var(--slide-opacity, 0.3) !important;
}

/* First level slides (adjacent to current) */
.carousel-3d-container .carousel-3d-slide.left-1,
.carousel-3d-container .carousel-3d-slide.right-1 {
    --slide-opacity: 1;
}

/* Second level slides */
.carousel-3d-container .carousel-3d-slide.left-2,
.carousel-3d-container .carousel-3d-slide.right-2 {
    --slide-opacity: 0.72;
}

/* Third level slides */
.carousel-3d-container .carousel-3d-slide.left-3,
.carousel-3d-container .carousel-3d-slide.right-3 {
    --slide-opacity: 0.32;
}

/* Fourth and beyond level slides */
.carousel-3d-container .carousel-3d-slide.depth-4,
.carousel-3d-container .carousel-3d-slide.depth-5,
.carousel-3d-container .carousel-3d-slide.depth-6 {
    --slide-opacity: 0.2;
}

.carousel-3d-container .carousel-3d-slide.left-1 {
transform: translateX(-312px) translateY(5px) translateZ(-175px) rotateY(29deg) !important;
    width: 273px !important;
    height: 502px !important;

}

.carousel-3d-container .carousel-3d-slide.right-1 {
    width: 273px !important;
    height: 502px !important;
transform: translateX(312px) translateY(5px) translateZ(-175px) rotateY(-29deg) !important;
}

.carousel-3d-container .carousel-3d-slide.left-2 {
    width: 256px !important;
    height: 510px !important;
    transform: translateX(-640px) translateY(-2px) translateZ(-276px) rotateY(36deg) !important;
}

.carousel-3d-container .carousel-3d-slide.right-2 {
    width: 256px !important;
    height: 510px !important;
    transform: translateX(640px) translateY(-2px) translateZ(-276px) rotateY(-36deg) !important;
}

.carousel-3d-container .carousel-3d-slide.left-3 {
    width: 224px !important;
    height: 448px !important;
    transform: translateX(-975px) translateY(32px) translateZ(-375px) rotateY(50deg) !important;
}

.carousel-3d-container .carousel-3d-slide.right-3 {
    width: 224px !important;
    height: 448px !important;
    transform: translateX(975px) translateY(32px) translateZ(-375px) rotateY(-50deg) !important;
}

:deep(.carousel-3d-controls .prev),
:deep(.carousel-3d-controls .next) {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(12, 12, 20, 0.8) !important;
    color: #D4C5EB;
    border-radius: 100% !important;
    padding: 8px !important;
    cursor: pointer !important;
    transition: opacity 0.3s ease !important;
    font-size: 35px;
}
</style>