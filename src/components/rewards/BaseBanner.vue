<template>
  <div
    :style="colorsAsStyle"
    class="shadow-inset shadow-[0px_0px_56px_-16px_rgba(28,28,41,0.40)] relative bg-[rgba(38,38,56,0.88)] p-[1px] flex flex-col items-center justify-center rounded-2xl overflow-hidden w-full max-w-[720px] h-[100px] sm:h-[72px]"
  >
    <InlineSvg
      :src="bannerBg"
      unique-ids
      class="absolute top-0 right-0 opacity-64 mix-blend-plus-lighter pointer-events-none"
    />
    <InlineSvg
      :src="bannerBg"
      unique-ids
      class="absolute top-0 right-0 w-full h-full pointer-events-none opacity-88 mix-blend-plus-lighter"
    />
    <div class="border-solid border-1 border-[rgba(201,92,255,0.12)] w-full h-full absolute top-0 left-0 rounded-2xl" />
    <div class="rounded-2xl overflow-hidden relative bg-[rgba(28,28,41,0.80)] w-full h-full z-10">
      <InlineSvg
        :src="bannerBg"
        unique-ids
        class="absolute h-full top-0 right-0 pointer-events-none opacity-72"
      />
      <InlineSvg
        :src="bannerTexture"
        unique-ids
        class="absolute top-0 right-0 pointer-events-none opacity-88 mix-blend-plus-lighter"
      />
      <InlineSvg
        :src="bannerTexture"
        unique-ids
        class="absolute top-0 right-0 pointer-events-none opacity-88 mix-blend-plus-lighter"
      />
      <div class="flex flex-col sm:flex-row items-center sm:justify-between w-full h-full p-1 sm:p-4 isolate">
        <span
          v-if="$slots.title"
          :class="titleClass"
          class="text-[#D4C5EB] text-[22px] md:text-[32px] font-normal leading-8 -tracking-[1.28px]"
        >
          <slot name="title" />
          <InlineSvg
            v-if="icon"
            :src="icon"
            unique-ids
            class="size-[26px] inline-block"
          />
        </span>
        <span
          v-else-if="title"
          class="text-[#D4C5EB] text-[22px] md:text-[32px] font-normal leading-8 -tracking-[1.28px]"
        >
          {{ title }}
        </span>
        <div class="flex gap-2">
          <GlowButton
            class="w-36"
            :color="buttonColor"
            @click="emit('ctaButtonClick')"
          >
            {{ ctaButton }}
          </GlowButton>
          <div
            v-if="showCloseButton"
            class="flex items-center justify-center size-10 rounded-full bg-light1/[0.02%] cursor-pointer backdrop-blur-[2px] shadow-[inset_0px_-28px_24px_-16px_rgba(222,206,235,0.08)] hover:shadow-[inset_0px_-28px_24px_-16px_rgba(222,206,235,0.20)]"
            @click="handleClose"
          >
            <X class="size-5 text-purple-gray" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import bannerBg from '@/assets/images/textures/reward-banner-bg.svg'
import bannerTexture from '@/assets/images/textures/reward-bannel-texture.svg'
import { EButtonColor } from '@/types/shared/button.ts'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import InlineSvg from 'vue-inline-svg'
import { X } from 'lucide-vue-next'
import { computed } from 'vue'
import { useNotifications } from '@/composables/notifications'

const props = withDefaults(defineProps<{
  title?: string
  titleClass?: string
	ctaButton: string
  showCloseButton?: boolean
  colors?: string[]
  buttonColor?: EButtonColor
  icon?: string
  id?: string | number
}>(), {
  title: '',
  icon: '',
  id: '',
  showCloseButton: true,
  titleClass: '',
  colors: () => ['#5858F5', '#5858F5', '#C95CFF', '#C95CFF', '#C95CFF', '#3333FF', '#3333FF'],
  buttonColor: EButtonColor.PURPLE,
})

const { readNotification } = useNotifications()

const handleClose = () => {
  if (props.id) {
    readNotification(props.id)
  }
  emit('close')
}

const colorsAsStyle = computed(() => {
  return props.colors.map((color, index) => {
    return `--${index}-color: ${color}`
  })
})

defineSlots<{
	title?: string
}>()

const emit = defineEmits<{
		(e:'ctaButtonClick'): void
		(e:'close'): void
	}>()
</script>

<style scoped></style>