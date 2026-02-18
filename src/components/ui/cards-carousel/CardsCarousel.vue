<template>
  <div>
    <div
      v-if="(title || withNavigation) && !$slots.header"
      class="mb-2 flex flex-nowrap items-center gap-6"
      :class="{ 'pl-30': withNavigation && leftNavigation }"
    >
      <h2
        v-if="title"
        class="text-[14px] font-semibold tracking-[.25rem] text-[#D4C5EB] opacity-[88%]"
      >
        {{ title }}
      </h2>

      <div
        v-if="withNavigation && !leftNavigation"
        class="justify-self-end inline-flex shrink-0 items-center justify-between gap-2 pr-6"
      >
        <InlineSvg
          :src="circleArrow"
          unique-ids
          class="size-10 rotate-180 rounded-full overflow-hidden cursor-pointer"
          @click="carouselRef?.prev()"
        />

        <InlineSvg
          :src="circleArrow"
          unique-ids
          class="size-10 rounded-full overflow-hidden cursor-pointer"
          @click="carouselRef?.next()"
        />
      </div>
    </div>
    <div
      v-if="$slots.header"
      class="header-container mb-2 flex flex-nowrap items-center gap-2 md:gap-6"
    >
      <slot name="header" />
      <div
        v-if="withNavigation && !leftNavigation"
        class="justify-self-end nav-container inline-flex shrink-0 items-center justify-between gap-2 pr-6"
      >
        <InlineSvg
          :src="circleArrow"
          unique-ids
          class="size-10 rotate-180 rounded-full overflow-hidden cursor-pointer"
          @click="carouselRef?.prev()"
        />

        <InlineSvg
          :src="circleArrow"
          unique-ids
          class="size-10 rounded-full overflow-hidden cursor-pointer"
          @click="carouselRef?.next()"
        />
      </div>
    </div>
    <div
      :class="{
        'flex gap-8': leftNavigation,
      }"
    >
      <div
        v-if="withNavigation && leftNavigation"
        class="justify-self-end inline-flex shrink-0 items-center justify-between gap-1"
      >
        <InlineSvg
          :src="circleArrow"
          unique-ids
          class="size-10 rotate-180 rounded-full overflow-hidden cursor-pointer"
          @click="carouselRef?.prev()"
        />

        <InlineSvg
          :src="circleArrow"
          unique-ids
          class="size-10 rounded-full overflow-hidden cursor-pointer"
          @click="carouselRef?.next()"
        />
      </div>
      <div
        v-if="items?.length"
        :style="leftNavigation ? 'min-width: calc(100vw - 244px);' : ''"
        :class="{
          'overflow-hidden': leftNavigation,
        }"
      >
        <CarouselComponent
          ref="carouselRef"
          v-model="currentPropertySlideIndex"
          v-bind="propertiesSliderConfig"
          :gap="gap"
        >
          <Slide
            v-for="(property, idx) in items || []"
            :key="idx"
          >
            <slot
              name="slide"
              :data="property"
              :index="idx"
              class="h-full"
            />
          </Slide>
        </CarouselComponent>

        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T = any">
import { computed, ref, useTemplateRef } from 'vue'
import { Carousel as CarouselComponent, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import circleArrow from '@/assets/icons/circle-arrow.svg'
import InlineSvg from 'vue-inline-svg'

interface IProps {
	items?: Array<T>
	title?: string
  withNavigation?: boolean
  leftNavigation?: boolean
  config?: Partial<InstanceType<typeof CarouselComponent>['$props']>
  gap?: number
}

const props = withDefaults(defineProps<IProps>(), {
  items: () => [],
  title: '',
  config: () => ({}),
  withNavigation: true,
  gap: 4,
})

const carouselRef = useTemplateRef<typeof CarouselComponent | null>('carouselRef')
const currentPropertySlideIndex = ref(0)

const propertiesSliderConfig = computed(() => ({
  snapAlign: 'start' as const,
  gap: 4,
  pagination: false,
  ...props.config,
}))
</script>
<style scoped lang="scss">
.carousel__slide--visible {
	transform: rotateY(0);
}
</style>