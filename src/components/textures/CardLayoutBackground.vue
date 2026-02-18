<script setup lang="ts">
import topLeftBg from '@/assets/images/textures/top.png'
import bottomRightBg from '@/assets/images/textures/bottom.png'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const container = ref<HTMLDivElement>()
const dimensions = ref({ width: 0, height: 0 })
let resizeObserver: ResizeObserver

const backgroundStyle = computed(() => ({
  '--bg-image-top-left': `url(${topLeftBg})`,
  '--bg-image-bottom-right': `url(${bottomRightBg})`,
  '--bg-image-width': `${dimensions.value.width}px`,
  '--bg-image-height': `${dimensions.value.height}px`,
}))

onMounted(() => {
  if (container.value) {
    const { width, height } = container.value.getBoundingClientRect()
    dimensions.value = { width, height }

    // For window resize events
    const handleResize = () => {
      if (container.value) {
        const { width, height } = container.value.getBoundingClientRect()
        dimensions.value = { width, height }
      }
    }

    resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container.value)
  }
})

onUnmounted(() => {
  resizeObserver.disconnect()
})
</script>

<template>
  <div
    ref="container"
    :style="backgroundStyle"
    class="main-container rounded-2xl bg-[rgba(20,20,31,0.88)] mb-10 md:mb-0"
  >
    <div class="texture-container md:min-h-[100vh]">
      <div class="bg-top-left" />
      <div class="bg-bottom-right" />
    </div>
    <slot />
    <div class="outer-lines-vertical">
      <div class="outer-lines-horizontal">
        <div class="bg-container">
          <div class="border-container">
            <div class="border-blur min-h-80" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.texture-container {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	pointer-events: none;
	z-index: -1;
	min-height: calc(100% + 100px);
}
.bg-top-left {
	position: absolute;
	top: calc(((100% - var(--bg-image-height)) / 2) - 154px);
	left: calc(((100% - var(--bg-image-width)) / 2) - 132px);
	width: 600px;
	height: 600px;
	background-image: var(--bg-image-top-left);
	background-size: contain;
	background-repeat: no-repeat;
	background-position: top left;
}

.bg-bottom-right {
	position: absolute;
	bottom: calc(((100% - var(--bg-image-height)) / 2) - 157px);
	right: calc(((100% - var(--bg-image-width)) / 2) - 135.5px);
	width: 600px;
	height: 600px;
	background-image: var(--bg-image-bottom-right);
	background-size: contain;
	background-repeat: no-repeat;
	background-position: bottom right;
}

.border-container {
	position: relative;
	width: 100%;
	height: 100%;
}

.border-blur {
	z-index: -1;
	position: absolute;
	top: -2px;
	left: -2px;
	width: calc(100% + 4px);
	height: calc(100% + 4px);
}

.border-blur::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	/* backdrop-filter: blur(4px); */
}

.main-container {
	position: relative;
	box-shadow: 0px 0px 56px -16px rgba(28, 28, 41, 0.4) inset;
	--line-color: #3e3e67;
	--page-background-color: var(--color-background);
	--line-width: 1px;
	--dot-size: 1px;
	--dot-color: white;
}

.bg-container {
	position: relative;
	width: 100%;
	height: 100%;
}

/* decorative dots in bg-container */
.bg-container::after {
	content: '';
	--analog-size: var(--dot-size);
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	pointer-events: none;
	/* Dots */
	background-image: radial-gradient(circle var(--analog-size), var(--dot-color) 50%, transparent 50%),
		radial-gradient(circle var(--analog-size), var(--dot-color) 50%, transparent 50%),
		radial-gradient(circle var(--analog-size), var(--dot-color) 50%, transparent 50%),
		radial-gradient(circle var(--analog-size), var(--dot-color) 50%, transparent 50%);

	background-size: var(--analog-size) var(--analog-size);
	background-position: 0 0, 100% 0, 0 100%, 100% 100%;
	background-repeat: no-repeat;
}

.outer-lines-horizontal {
	position: relative;
	width: 100%;
	height: 100%;
}

.outer-lines-vertical {
	position: absolute;
	top: -40px;
	left: -40px;
	width: calc(100% + 80px);
	height: calc(100% + 80px);
	z-index: -1;
}

@media (max-width: 768px) {
	.outer-lines-vertical {
		left: -15px;
		max-width: calc(100vw - 20px);
	}
}

.outer-lines-horizontal::before,
.outer-lines-vertical::before {
	content: '';
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	pointer-events: none;
	background-repeat: no-repeat;
}

.outer-lines-vertical::before {
	top: 50%;
	transform: translateY(-50%);
	height: 100vh;
	background-image: linear-gradient(to top, transparent, var(--line-color) 50%, transparent),
		linear-gradient(to top, transparent, var(--line-color) 50%, transparent);
	background-size: var(--line-width) 100%;
	background-position: 0 0, 100% 0;
	background-repeat: no-repeat;
}

.outer-lines-horizontal::before {
	left: 50%;
	transform: translateX(-50%);
	width: 100vw;
	background-image: linear-gradient(to left, transparent, var(--line-color) 50%, transparent),
		linear-gradient(to left, transparent, var(--line-color) 50%, transparent);
	background-size: 100% var(--line-width);
	background-position: 0 0, 0 100%;
	background-repeat: no-repeat;
}
</style>
