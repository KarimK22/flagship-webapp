<template>
  <section class="rewards-winners flex flex-col gap-4">
    <Transition name="fade">
      <div
        v-if="showTestimonials"
        class="relative"
      >
        <TestimonialsSlider class="md:[&_.header-container]:justify-center [&_.header-container]:justify-between [&_.header-container]:mb-8 md:[&_.header-container]:mb-17 [&_.nav-container]:pr-0 md:[&_.nav-container]:inline-flex [&_.nav-container]:absolute [&_.nav-container]:right-0">
          <template #header>
            <h2 class="text-lavender text-center md:text-[56px] text-[40px] font-normal leading-12 tracking-[-2.8px]">
              {{ $t('components.rewardsWinners.title') }}
            </h2>
          </template>
        </TestimonialsSlider>
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import TestimonialsSlider from '@/components/home-view/TestimonialsSlider.vue'
import { onMounted, ref } from 'vue'

const showTestimonials = ref(false)
onMounted(() => {
  showTestimonials.value = true
})
</script>