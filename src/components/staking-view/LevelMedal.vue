<script setup lang="ts">
import type { Level } from '@/const/tiers'

defineProps<{
	level: Level
}>()
</script>

<template>
  <div class="mt-[-80px] w-[22rem] h-[22rem]">
    <Transition name="fade">
      <img
        v-if="level.imageUrl"
        :src="level.imageUrl"
        alt="Level Medal"
        class="w-full h-full"
        width="352"
        height="352"
      >
    </Transition>
  </div>
</template>
