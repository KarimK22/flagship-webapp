<script setup lang="ts">
import texture from '@/assets/images/textures/bg.png'
import textureClean from '@/assets/images/textures/bg-clean.png'

withDefaults(
  defineProps<{
		variant?: 'clean' | 'vector'
	}>(),
  {
    variant: 'vector',
  },
)

const textureMap = {
  clean: textureClean,
  vector: texture,
}
</script>

<template>
  <div class="texture-bg pointer-events-none">
    <img
      :src="textureMap[variant]"
      class="texture-lights"
      width="1600"
      height="896"
    >
  </div>
</template>

<style scoped>
* {
	z-index: -99;
}

.texture-bg {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.texture-lights {
	object-fit: cover;
	object-position: center 90px;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.texture-lights {
	width: 1600px;
	height: 800px;
}
</style>
