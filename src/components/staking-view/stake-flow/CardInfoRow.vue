<script setup lang="ts">
</script>

<template>
  <div
    class="flex flex-col justify-between gap-2 p-4 w-full bg-dark1 inset-shadow-[0_0_48px_-16px_#2c2c3c] -mt-2 overflow-hidden rounded-2xl h-auto"
  >
    <slot name="header" />
    <div class="flex items-center justify-center gap-2">
      <slot name="main-content" />
    </div>
  </div>
</template>

<style scoped></style>
