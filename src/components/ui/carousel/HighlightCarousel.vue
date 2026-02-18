<script setup lang="ts">
import { ref, watch } from 'vue'
import useEmblaCarousel from 'embla-carousel-vue'
import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel'
import chevronIcon from '@/assets/icons/chevron.svg'

const TWEEN_FACTOR_BASE = 1/7

interface Props {
    slides: object[]
    options?: EmblaOptionsType
}

const props = defineProps<Props>()

const [emblaRef, emblaApi] = useEmblaCarousel(props.options)
const tweenFactor = ref(0)
const tweenNodes = ref<HTMLElement[]>([])
const selectedIndex = ref(0)
const prevBtnDisabled = ref(false)
const nextBtnDisabled = ref(false)

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max)

const setTweenNodes = (api: EmblaCarouselType) => {
  tweenNodes.value = api.slideNodes().map((slideNode) => {
    return slideNode.querySelector('.embla__slide__content') as HTMLElement
  })
}

const setTweenFactor = (api: EmblaCarouselType) => {
  tweenFactor.value = TWEEN_FACTOR_BASE * api.scrollSnapList().length
}

const tweenScale = (api: EmblaCarouselType, eventName?: string) => {
  const engine = api.internalEngine()
  const scrollProgress = api.scrollProgress()
  const slidesInView = api.slidesInView()
  const isScrollEvent = eventName === 'scroll'

  api.scrollSnapList().forEach((scrollSnap, snapIndex) => {
    let diffToTarget = scrollSnap - scrollProgress
    const slidesInSnap = engine.slideRegistry[snapIndex]

    slidesInSnap.forEach((slideIndex) => {
      if (isScrollEvent && !slidesInView.includes(slideIndex)) return

      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopItem) => {
          const target = loopItem.target()

          if (slideIndex === loopItem.index && target !== 0) {
            const sign = Math.sign(target)

            if (sign === -1) {
              diffToTarget = scrollSnap - (1 + scrollProgress)
            }
            if (sign === 1) {
              diffToTarget = scrollSnap + (1 - scrollProgress)
            }
          }
        })
      }

      const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.value)
      const scale = numberWithinRange(tweenValue, 0, 1).toString()
      const tweenNode = tweenNodes.value[slideIndex]
      if (tweenNode) {
        tweenNode.style.scale = `${scale}`
        tweenNode.style.opacity = `${scale}`

        const parent = tweenNode.parentElement
        if (parent) {
          parent.style.zIndex = `${Math.round(tweenValue * 100)}`
        }
      }
    })
  })
}

const updateButtons = () => {
  if (!emblaApi.value) return
  prevBtnDisabled.value = !emblaApi.value.canScrollPrev()
  nextBtnDisabled.value = !emblaApi.value.canScrollNext()
}

const onPrevButtonClick = () => {
  if (!emblaApi.value) return
  emblaApi.value.scrollPrev()
}

const onNextButtonClick = () => {
  if (!emblaApi.value) return
  emblaApi.value.scrollNext()
}
const updateSlideClasses = (selectedIndex: number) => {
  if (!emblaApi.value) return

  const slides = emblaApi.value.slideNodes()

  slides.forEach((slide: HTMLElement, index: number) => {
    slide.classList.remove('is-prev', 'is-next', 'is-selected')

    const totalSlides = slides.length
    const diff = (index - selectedIndex + totalSlides) % totalSlides

    if (diff === 0) {
      slide.classList.add('is-selected')
    } else if (diff <= 3) {
      slide.classList.add('is-next')
    } else {
      slide.classList.add('is-prev')
    }
  })
}

const updateClasses = () => {
  if (!emblaApi.value) return
  selectedIndex.value = emblaApi.value.selectedScrollSnap()
  updateSlideClasses(selectedIndex.value)
}
watch(() => emblaApi.value, (api) => {
  if (!api) return

  setTweenNodes(api)
  setTweenFactor(api)
  tweenScale(api)
  updateButtons()
  updateClasses()
  api.on('reInit', updateClasses)
  api.on('scroll', updateClasses)

  api.on('reInit', setTweenNodes)
  api.on('reInit', setTweenFactor)
  api.on('reInit', tweenScale)
  api.on('scroll', () => tweenScale(api, 'scroll'))
  api.on('select', updateButtons)
  api.on('slideFocus', tweenScale)
})
</script>

<template>
  <div class="embla">
    <div
      ref="emblaRef"
      class="embla__viewport"
    >
      <div class="embla__container">
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="embla__slide"
          :class="{ 'embla__slide--selected': selectedIndex === index }"
        >
          <div class="embla__slide__content">
            <slot
              name="slide"
              :slide="slide"
              :index="index"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="embla__buttons">
      <button
        class="absolute top-1/2 transform -translate-y-1/2 bg-background w-10 h-10 z-10 rounded-full flex items-center justify-center text-lavender left-8 cursor-pointer"
        :disabled="prevBtnDisabled"
        @click="onPrevButtonClick"
      >
        <InlineSvg
          :src="chevronIcon"
          width="12"
          class="embla__button__svg rotate-180"
        />
      </button>
      <button
        class="absolute top-1/2 transform -translate-y-1/2 bg-background w-10 h-10 z-10 rounded-full flex items-center justify-center text-lavender right-8 cursor-pointer"
        size="icon"
        :disabled="nextBtnDisabled"
        @click="onNextButtonClick"
      >
        <InlineSvg
          :src="chevronIcon"
          width="12"
          class="embla__button__svg"
        />
      </button>
    </div>
  </div>
</template>

<style scoped>
.embla {
    overflow: visible;
    position: relative;
    margin: auto;
    --slide-height: 19rem;
    --slide-spacing: 0;
    --slide-size: 100%;
    --slide-spacing-sm: 0;
    --slide-size-sm: calc(100% / 3);
    --slide-spacing-md: 0;
    --slide-size-md: calc(100% / 5);
    --slide-spacing-lg: 0;
    --slide-size-lg: calc(100% / 7);
}
.embla__viewport {
    overflow: hidden;
}
.embla__container {
    backface-visibility: hidden;
    display: flex;
    touch-action: pan-y pinch-zoom;
    margin-left: calc(var(--slide-spacing) * -1);
}
.embla__slide {
    min-width: 0;
    flex: 0 0 var(--slide-size);
    padding-left: var(--slide-spacing);
    padding-right: var(--slide-spacing);
}

.embla__slide__content {
    transform: scale(0.9);
    transition: transform 0.3s ease;
    border-radius: 16px;
    position: relative;
}

.embla__slide--selected {
    z-index: 1;
}

.embla__slide--selected .embla__slide__content {
    transform: scale(1);
    scale: 1 !important;
}

.embla__slide:not(.embla__slide--selected).is-prev .embla__slide__content {
    transform: perspective(1000px) rotateY(20deg);
    transform-origin: right center;
}

.embla__slide:not(.embla__slide--selected).is-next .embla__slide__content {
    transform: perspective(1000px) rotateY(-20deg);
    transform-origin: left center;
}

@media (min-width: 768px) {
    .embla__container {
        margin-left: calc(var(--slide-spacing-md) * -1);
    }
}
@media (min-width: 991px) {
    .embla__container {
        margin-left: calc(var(--slide-spacing-md) * -1);
    }
}
@media (min-width: 1200px) {
    .embla__container {
        margin-left: calc(var(--slide-spacing-lg) * -1);
    }
}

@media (min-width: 768px) {
    .embla__slide {
        flex: 0 0 var(--slide-size-sm);
        padding-left: var(--slide-spacing-sm);
        padding-right: var(--slide-spacing-sm);
    }
}
@media (min-width: 991px) {
    .embla__slide {
        flex: 0 0 var(--slide-size-md);
        padding-left: var(--slide-spacing-md);
        padding-right: var(--slide-spacing-md);
    }
}
@media (min-width: 1200px) {
    .embla__slide {
        flex: 0 0 var(--slide-size-lg);
        padding-left: var(--slide-spacing-lg);
        padding-right: var(--slide-spacing-lg);
    }
}

</style>