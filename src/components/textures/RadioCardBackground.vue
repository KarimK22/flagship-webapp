<script setup lang="ts">
import radioCardBg from '@/assets/images/textures/radio-card-bg.png'
import radioCardBgLight from '@/assets/images/textures/radio-card-light.png'

defineProps<{
	activeCard: boolean
}>()
</script>

<!-- TODO: This could be translated to a multiple shadow effect or use pseudo elements -->
<template>
  <div
    :style="{ '--texture-light': `url(${radioCardBgLight})` }"
    class="texture-light rounded-2xl opacity-0 scale-50 transition-all duration-300"
    :class="{ 'opacity-100 blur-[10px] scale-100': activeCard }"
  />
  <div
    :style="{ '--texture-light': `url(${radioCardBgLight})` }"
    class="texture-light-2 rounded-2xl opacity-0 scale-50 transition-all duration-300"
    :class="{ 'opacity-100 blur-[20px] scale-100': activeCard }"
  />
  <div
    :style="{ '--texture-light': `url(${radioCardBgLight})` }"
    class="texture-light-3 rounded-2xl opacity-0 scale-50 transition-all duration-300"
    :class="{ 'opacity-100 blur-[40px] scale-100': activeCard }"
  />
  <div
    :style="{ '--texture-light': `url(${radioCardBgLight})` }"
    class="texture-light-4 rounded-2xl opacity-0 scale-50 transition-all duration-300"
    :class="{ 'opacity-100 blur-[60px] scale-100': activeCard }"
  />
  <div
    :style="{ '--texture-light': `url(${radioCardBgLight})` }"
    class="card-border rounded-2xl"
    :class="{ active: activeCard }"
  />
  <div
    :style="{ '--texture-bg': `url(${radioCardBg})` }"
    class="texture-bg transition-opacity duration-300 opacity-0"
    :class="{ 'opacity-100': activeCard }"
  />
</template>

<style scoped>
* {
	z-index: -99;
	pointer-events: none;
}

.card-border {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-image: var(--texture-light);
	transition: all 0.3s ease-in-out;
	mix-blend-mode: plus-lighter;
	filter: blur(0.22px);
	opacity: 0.8;
}

.card-border.active {
	width: calc(100% + 2px);
	height: calc(100% + 2px);
	top: -1.5px;
	left: -1px;
}

.texture-light,
.texture-light-2,
.texture-light-3,
.texture-light-4 {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-image: var(--texture-light);
	mix-blend-mode: screen;
	opacity: 0.8;
}

.texture-light-3 {
	mix-blend-mode: saturation;
}

.texture-light-4 {
	mix-blend-mode: plus-lighter;
}

.texture-bg {
	position: absolute;
	top: 50%;
	left: 50%;
	width: calc(1261px / 2);
	height: calc(1244px / 2);
	background-image: var(--texture-bg);
	background-size: calc(1261px / 1.98) calc(1244px / 1.98);
	background-repeat: no-repeat;
	background-position: -42px 40px;
	transform: translate(-50%, -50%);
}
</style>
