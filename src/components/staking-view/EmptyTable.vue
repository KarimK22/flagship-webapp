<script setup lang="ts">
import GlowText from '@/components/glow-text/GlowText.vue'
import CardBackground from '@/components/textures/CardBackground.vue'
import { useTranslation } from '@/composables/use-i18n'

const { t } = useTranslation()
</script>

<template>
  <div class="flex justify-center items-center h-52 gap-12 mt-2 rounded-2xl overflow-hidden relative">
    <div>
      <CardBackground
        class="absolute top-0 left-0 w-full h-full"
        variant="mixed"
      />
      <GlowText
        :text="t('staking.activeHoldingsEmpty')"
        variant="mixed"
        class="tracking-tighter max-w-[360px]"
      />
    </div>
  </div>
</template>

<style scoped>
.texture {
	top: 100%;
}
</style>
