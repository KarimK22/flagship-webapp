<script setup lang="ts">
import type { Component } from 'vue'
import checkIcon from '@/assets/images/staking/check-period.svg'
import InlineSvg from 'vue-inline-svg'
defineProps<{
	label: string
	reward: number
	description: string
	isSelected?: boolean
	badge: Component
}>()
</script>

<template>
  <div
    role="button"
    class="cursor-pointer relative tracking-normal flex flex-col justify-between gap-2 rounded-2xl p-4 bg-[#0C0C14]"
  >
    <InlineSvg
      :src="checkIcon"
      class="size-8 absolute bottom-1 right-1 transition-opacity duration-300"
      :class="{ 'opacity-100': isSelected, 'opacity-0': !isSelected }"
    />
    <span class="text-lavender font-semibold"> {{ label }} <component
      :is="badge"
      v-if="badge"
    /> </span>
    <div class="relative">
      <h1
        v-if="reward"
        class="text-purple text-5.5xl leading-14 tracking-[-3.36px]"
      >
        {{ reward }}<i class="text-[32px] font-bold">%</i>
      </h1>
      <h1
        v-if="reward"
        class="flare text-purple text-5.5xl leading-14 tracking-[-3.36px]"
        :class="{ 'flare-active': isSelected }"
      >
        {{ reward }}<i class="text-[32px] font-bold">%</i>
      </h1>
      <span class="text-purple-gray font-semibold text-sm tracking-[0.14px]">{{ description }}</span>
    </div>
    <div
      class="selected-border"
      :class="{ 'selected-border-active': isSelected }"
    />
  </div>
</template>

<style scoped>
.flare {
	width: 100%;
	position: absolute;
	filter: blur(0px);
	color: #fff;
	overflow: hidden;
	top: 0px;
	left: 0px;
	opacity: 0;
	background: linear-gradient(to bottom, #d0c2eb 10%, transparent 60%);
	background-clip: text;
	color: transparent;
	transition: all 0.3s;
	mix-blend-mode: plus-lighter;
	pointer-events: none;
}

.selected-border {
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	border-radius: 18px;
	background: linear-gradient(#0b0b1300, #0b0b13) padding-box, linear-gradient(to top, #5858F5, transparent 76%) border-box;
	border: 1px solid transparent;
	z-index: -1;
	opacity: 0;
	transition: all 0.3s;
}

.selected-border-active {
	opacity: 1;
	top: -2px;
	left: -2px;
	width: calc(100% + 4px);
	height: calc(100% + 4px);
}

.flare-active {
	opacity: 1;
	left: 2px;
	filter: blur(4px);
}
</style>
