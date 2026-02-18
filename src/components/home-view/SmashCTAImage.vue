<template>
  <Transition mode="out-in">
    <img
      v-if="smashAmount === 0"
      :src="smashCTAIcon"
      class="max-w-[340px] w-[340px] pointer-events-none -mb-12 select-none"
    >
    <img
      v-else-if="smashAmount === 1"
      :src="againCTAIcon"
      class="max-w-[340px] w-[340px] pointer-events-none -mb-12 select-none"
    >
    <img
      v-else-if="smashAmount === 2"
      :src="breakCTAIcon"
      class="max-w-[340px] w-[340px] pointer-events-none -mb-12 select-none"
    >
  </Transition>
</template>

<script setup lang="ts">
import { againCTAIcon, breakCTAIcon, smashCTAIcon } from '@/assets/images/game/cta-images'

withDefaults(
  defineProps<{
		smashAmount: number
	}>(),
  {
    smashAmount: 0,
  },
)
</script>
