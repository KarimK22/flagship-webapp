<script setup lang="ts">
import { NewStake } from '@/components/staking-view/stake-flow'
import mixpanel from 'mixpanel-browser'
import { onMounted } from 'vue'

onMounted(() => {
  const entryPoint = new URLSearchParams(window.location.search).get('entryPoint')
  if (entryPoint) {
    mixpanel.track('Buy LINGO', {
      entryPoint,
    })
  }
})
</script>

<template>
  <div class="px-6 md:mb-24">
    <NewStake />
  </div>
</template>
