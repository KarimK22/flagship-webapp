<script setup lang="ts">
import orangeBackgroundLights from '@/assets/images/textures/orange/reduced-lights.png'
import purpleBackgroundLights from '@/assets/images/textures/purple/reduced-lights.png'
import mixedBackgroundLights from '@/assets/images/textures/mixed/reduced-lights.png'

const props = withDefaults(
  defineProps<{
		variant?: 'orange' | 'purple' | 'mixed'
	}>(),
  {
    variant: 'orange',
  },
)

const cardBackgroundLightsMap = {
  orange: orangeBackgroundLights,
  purple: purpleBackgroundLights,
  mixed: mixedBackgroundLights,
}

const cardBackgroundLights = cardBackgroundLightsMap[props.variant]
</script>

<template>
  <div class="texture-bg">
    <img
      :src="cardBackgroundLights"
      class="card-background-lights"
      width="932"
      height="400"
    >
  </div>
</template>

<style scoped>
* {
	z-index: -99;
}

.texture-bg {
	height: 400px;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.card-background-lights {
	@apply w-screen;
	min-height: 208px;
	object-fit: cover;
	object-position: center;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	@media (min-width: 550px) {
		min-width: 520px;
	}
}
</style>
