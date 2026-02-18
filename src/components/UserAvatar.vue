<script setup lang="ts">
import { computed } from 'vue'
import { generateAvatarUrl } from '@/composables/helpers'
import type { Address } from 'viem'

const props = defineProps<{
  walletAddress?: Address
}>()

const avatarUrl = computed(() => {
  return generateAvatarUrl(props.walletAddress)
})
</script>

<template>
  <div class="rounded-full overflow-hidden">
    <img
      :src="avatarUrl"
      :alt="walletAddress"
      class="object-cover w-full max-w-full"
    >
  </div>
</template>
