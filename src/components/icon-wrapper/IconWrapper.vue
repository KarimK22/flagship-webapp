<script setup lang="ts">
import InlineSvg from 'vue-inline-svg'
import cardBackgroundLights from '@/assets/images/textures/orb/lights.svg'
import echoes from '@/assets/images/textures/orb/echoes.svg'

export type IconWrapperProps = {
	variant?: 'orange' | 'purple' | 'green' | 'gray'
	position?: 'left' | 'right' | 'center'
	withBorders?: boolean
	withLights?: boolean
}

withDefaults(defineProps<IconWrapperProps>(), {
  variant: 'orange',
  position: 'left',
  withBorders: true,
  withLights: true,
})
</script>

<template>
  <div class="texture-bg">
    <InlineSvg
      v-if="withBorders"
      :src="echoes"
      class="echoes"
      :class="variant"
      unique-ids
    />
    <InlineSvg
      v-if="withLights"
      :src="cardBackgroundLights"
      class="lights"
      :class="`${position} ${variant}`"
      unique-ids
    />
    <slot />
  </div>
</template>

<style scoped>
* {
	z-index: -99;
	pointer-events: none;
}

.orange {
	--glow: #ffbc70;
	--bright: #ffbc70ab;

	--main-dark: #ff7847;
	--main-light: #ff9d5c;
}

.purple {
	--glow: #5858f5;
	--bright: #c95cff;

	--main-dark: #3333ff;
	--main-light: #c95cff;
}

.green {
	--glow: #5eb851;
	--bright: #5eb85129;

	--main-dark: #5eb851;
	--main-light: #5eb85129;
}

.gray {
	--glow: #d9d9d9;
	--bright: #f1e6fa;

	--main-dark: #d9d9d9;
	--main-light: #8e7b9f;
}

.texture-bg {
	position: relative;
	height: fit-content;
	width: fit-content;
}

.lights,
.echoes {
	--gray: #d9d9d9;
	--light: #f1e6fa;
	--border-dark: #262638;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.left {
	transform: translate(-50%, -50%) unset;
	left: 80px;
}

.right {
	transform: translate(-50%, -50%) rotateY(180deg);
	left: -30px;
}

.center {
	transform: translate(-50%, -50%);
}
</style>
