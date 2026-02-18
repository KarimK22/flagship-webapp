<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <div class="flex flex-col p-4 max-w-[224px]">
    <p class="text-base font-semibold text-lavender tracking-[-0.16px] leading-4">
      {{ title }}
    </p>
    <p class="text-sm font-semibold text-purple-gray tracking-[-0.28px] leading-4">
      {{ description }}
    </p>
  </div>
</template>