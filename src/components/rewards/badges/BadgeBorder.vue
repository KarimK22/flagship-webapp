<template>
  <div class="absolute w-full h-full pointer-events-none">
    <InlineSvg
      :src="StarCorner"
      class="absolute -left-[32px] -top-[32px] h-16 w-16"
    />
    <InlineSvg
      :src="StarCorner"
      class="absolute -right-[32px] -top-[32px] h-16 w-16"
    />
    <InlineSvg
      :src="StarCorner"
      class="absolute -right-[32px] -bottom-[32px] h-16 w-16"
    />
    <InlineSvg
      :src="StarCorner"
      class="absolute -left-[32px] -bottom-[32px] h-16 w-16"
    />
    <div class="w-full h-full p-[1px] bg-[rgba(212,197,235,0.04)]">
      <div class="w-full h-full bg-background" />
    </div>
  </div>
</template>

<script setup lang="ts">
import StarCorner from '@/assets/images/badges/star-corner.svg'
import InlineSvg from 'vue-inline-svg'
</script>
