<script setup lang="ts">
import bg from '@/assets/images/textures/confirm-bg.png'

</script>

<template>
  <div
    :style="{ backgroundImage: `url(${bg})` }"
    class="relative component-container flex flex-col bg-cover bg-center p-4 bg-[#14141F] overflow-clip rounded-2xl pb-4 h-[320px] md:h-[210px] justify-end border-[2px_solid_#2A2A3D]"
  >
    <slot />
    <div
      class="lights"
      aria-hidden="true"
      tabindex="-1"
    >
      <div class="lights-border" />
    </div>
    <div
      class="lights-accent"
      aria-hidden="true"
      tabindex="-1"
    />
  </div>
</template>

<style scoped>
.lights {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: #00000059;
	opacity: 0.8;
	mix-blend-mode: screen;
	pointer-events: none;
}

.lights-border {
	position: absolute;
	top: calc(50% - 0.5px);
	left: calc(50% - 1px);
	transform: translate(-50%, -50%);
	width: calc(100%);
	height: calc(100% + 1px);
	border-radius: 16px;
	pointer-events: none;
}

.lights-border::after {
	content: "";
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: calc(100% - 2px);
	height: calc(100% - 2px);
	border-radius: inherit;
	padding: 1px;
	/* control the border thickness */
	background: linear-gradient(90deg, #3333ff9d, #c95cff84, rgba(255, 255, 255, 0.107), rgba(0, 0, 0, 0.072));
	mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
	-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
	-webkit-mask-composite: xor;
	mask-composite: exclude;
	mix-blend-mode: soft-light;
	pointer-events: none;
}

.lights::after,
.component-container::after,
.lights-accent::after {
	content: "";
	position: absolute;
	top: 50%;
	left: 0;
	width: 560px;
	height: 270px;
	background: #c95cffba;
	border-radius: 560px;
	opacity: 0.2;
	mix-blend-mode: soft-light;
	filter: blur(40px);
	pointer-events: none;
	isolation: isolate;
}

.lights::before,
.component-container::before,
.lights-accent::before {
	content: "";
	position: absolute;
	top: 28%;
	left: -122px;
	width: 244px;
	height: 270px;
	border-radius: 270px;
	opacity: 0.56;
	background: #3333ffb8;
	mix-blend-mode: soft-light;
	filter: blur(84px);
	pointer-events: none;
	isolation: isolate;
}

.component-container::after {
	opacity: 0.2;
}

.component-container::before {
	opacity: 0.64;
}

.lights-accent {
	opacity: 0.4;
	mix-blend-mode: screen;
	pointer-events: none;
}

.lights-accent::after {
	opacity: 0.2;
}

.lights-accent::before {
	opacity: 0.64;
}
</style>
