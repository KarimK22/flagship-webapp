<script setup lang="ts">
import checkIcon from '@/assets/icons/checkmark.svg'
import InlineSvg from 'vue-inline-svg'
import { useTranslation } from '@/composables/use-i18n'

const { t } = useTranslation()

defineProps<{
	label: string
	isSelected?: boolean
	extraTickets?: number
}>()
</script>

<template>
  <div
    role="button"
    class="cursor-pointer relative tracking-normal flex flex-col justify-between gap-2 rounded-[32px] pt-8 pb-4 px-1 md:px-2 bg-[#0C0C14]"
  >
    <div
      v-if="extraTickets"
      class="relative text-center"
    >
      <h1
        class="text-purple text-5.5xl leading-10 tracking-[-3.36px]"
      >
        {{ extraTickets }}
      </h1>
      <h1
        class="flare text-purple text-5.5xl leading-10 tracking-[-3.36px]"
        :class="{ 'flare-active': isSelected }"
      >
        {{ extraTickets }}
      </h1>
      <span class="text-light1 font-semibold text-sm leading-6 tracking-[0.14px]">{{ t('common.entries') }}</span>
    </div>
    <div
      class="flex items-center justify-center text-center shadow-[0px_-28px_24px_-16px_rgba(222,206,235,0.08)_inset] backdrop-blur-[2px] rounded-[80px] transition-[background-color] duration-300 h-10 px-1 bg-background/32"
      :class="{
        'bg-[rgba(51,51,255,0.66)]!': isSelected,
      }"
    >
      <span class="text-lavender text-sm md:text-base font-semibold tracking-[-0.28px] md:-tracking-[0.16px] whitespace-pre flex-1">
        {{ label }}
      </span>

      <InlineSvg
        :src="checkIcon"
        unique-ids
        class="transition-[opacity,transform,width] duration-300 transform opacity-0 scale-0 w-0"
        :class="{
          'opacity-100 scale-100 w-8': isSelected,
        }"
      />
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
	border-radius: 32px;
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

.fade-scale-enter-active,
.fade-scale-leave-active {
	transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
	opacity: 0;
	transform: scale(0.8);
}
.fade-scale-enter-to,
.fade-scale-leave-from {
	opacity: 1;
	transform: scale(1);
}
</style>
