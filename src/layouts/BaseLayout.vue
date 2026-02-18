<script setup lang="ts">
import BaseHeader from '@/components/BaseHeader.vue'
import BaseFooter from '@/components/BaseFooter.vue'
import PageTransition from '@/components/PageTransition.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const hasContainer = computed(() => route.meta.hasContainer)
const isWide = computed(() => route.meta.isWide)
</script>

<template>
  <div class="min-h-screen text-white flex flex-col relative">
    <BaseHeader />

    <PageTransition>
      <main
        class="mx-auto h-full flex-1 flex flex-col w-full"
        :class="{ container: hasContainer, 'px-[0]': isWide }"
      >
        <slot />
      </main>
    </PageTransition>

    <BaseFooter />
  </div>
</template>
