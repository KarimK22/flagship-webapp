<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'

const getTextureUrls = (variant: 'orange' | 'purple' | 'mixed') => {
  return Promise.all([
    import(`@/assets/images/textures/${variant}/text.png`),
    import(`@/assets/images/textures/${variant}/text2.png`),
    import(`@/assets/images/textures/${variant}/text3.png`),
    import(`@/assets/images/textures/${variant}/text4.png`),
  ])
}

const props = withDefaults(
  defineProps<{
		text: string
		variant?: 'orange' | 'purple' | 'mixed'
	}>(),
  {
    variant: 'orange',
  },
)

const textures = ref<string[]>([])

watchEffect(async () => {
  try {
    const textureModule = await getTextureUrls(props.variant)
    textures.value = textureModule.map((module) => module.default)
  } catch (error) {
    console.error('Failed to load textures:', error)
    textures.value = []
  }
})

const variantLayers = {
  orange: {
    blur: [0.5, 2, 8, 12],
    opacity: [0.66, 0.66, 0.8, 0.32],
    stroke: [2, 2, 2, 1],
    strokeColor: ['#00000000', 'transparent', 'transparent', '#808080'],
  },
  purple: {
    blur: [0.5, 2, 8, 12],
    opacity: [0.66, 0.66, 0.8, 0.32],
    stroke: [2, 2, 2, 1],
    strokeColor: ['#00000000', 'transparent', 'transparent', '#808080'],
  },
  mixed: {
    blur: [0.5, 2, 8, 12],
    opacity: [0.8, 0.8, 0.88, 0.8],
    stroke: [1.5, 2, 2, 1],
    strokeColor: ['#ffffff29', 'transparent', 'transparent', '#808080'],
  },
}

interface LayerConfig {
	url: string
	blur: number
	opacity: number
	stroke: number
	strokeColor: string
}

const layerConfigs = computed<LayerConfig[]>(() => {
  const config = variantLayers[props.variant]
  return Array.from({ length: 4 }, (_, i) => ({
    url: textures.value[i] || '',
    blur: config.blur[i],
    opacity: config.opacity[i],
    stroke: config.stroke[i],
    strokeColor: config.strokeColor[i],
  }))
})
</script>

<template>
  <div class="relative font-semibold will-change-auto">
    <svg
      class="absolute"
      aria-hidden="true"
    >
      <filter
        id="inner-shadow"
        color-interpolation-filters="sRGB"
        filterUnits="objectBoundingBox"
        primitiveUnits="userSpaceOnUse"
      >
        <feFlood
          flood-color="rgba(12, 12, 20, 0.64)"
          flood-opacity="1"
          result="flood"
        />
        <feComposite
          in="flood"
          in2="SourceAlpha"
          operator="out"
          result="composite1"
        />
        <feOffset
          dx="-2"
          dy="2"
          in="composite1"
          result="offset"
        />
        <feGaussianBlur
          stdDeviation="1 1"
          in="offset"
          edgeMode="none"
          result="blur"
        />
        <feComposite
          in="blur"
          in2="SourceAlpha"
          operator="in"
          result="composite2"
        />
        <feMerge result="merge">
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="composite2" />
        </feMerge>
      </filter>
    </svg>

    <h2
      class="text-shadow text-4.5xl leading-8 tracking-[-0.15rem] text-center"
      :style="`--content: '${text}';`"
    >
      {{ text }}
      <span
        v-for="(layer, index) in layerConfigs"
        :key="index"
        class="text-light text-4.5xl leading-8 tracking-[-0.15rem] text-center"
        :style="{
          '--url': `url(${layer.url})`,
          '--blur': `${layer.blur}px`,
          '--opacity': layer.opacity,
          '--stroke': `${layer.stroke}px`,
          '--stroke-color': layer.strokeColor,
        }"
        aria-hidden="true"
      >
        {{ text }}
      </span>
    </h2>
  </div>
</template>

<style scoped>
.text-shadow {
	position: relative;
	color: rgba(38, 38, 56, 0.88);
	font-weight: inherit;
	&::before {
		content: var(--content);
		filter: url(#inner-shadow);
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	.text-light {
		will-change: transform;
		filter: blur(var(--blur));
		content: var(--content);
		background-image: var(--url);
		background-size: 100% 120%;
		background-repeat: no-repeat;
		background-position: center;
		-webkit-mix-blend-mode: plus-lighter;
		mix-blend-mode: plus-lighter;
		opacity: var(--opacity);
		-webkit-text-stroke-width: var(--stroke);
		-webkit-text-stroke-color: var(--stroke-color);
		height: 120%;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		color: transparent;
		background-clip: text;
		z-index: -1;
	}
}
</style>
