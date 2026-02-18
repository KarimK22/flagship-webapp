<template>
  <div :class="`${variant} shadow-inset shadow-[0px_0px_56px_-16px_rgba(28,28,41,0.40)] relative bg-[rgba(38,38,56,0.88)] flex flex-col items-center justify-center p-[1px] rounded-2xl mb-6 md:-mb-9 overflow-hidden min-w-[153px] h-[144px]`">
    <InlineSvg
      :src="widgetBg"
      unique-ids
      class="absolute top-0 right-0 pointer-events-none"
    />
    <InlineSvg
      :src="widgetFill"
      unique-ids
      class="absolute top-0 right-0 w-full h-full pointer-events-none opacity-88 mix-blend-plus-lighter"
    />
    <div class="rounded-[15px] overflow-hidden relative bg-background w-full h-full z-10">
      <InlineSvg
        :src="widgetFill"
        unique-ids
        class="absolute top-0 right-0 w-full h-full pointer-events-none opacity-72"
      />
      <InlineSvg
        :src="widgetFill"
        unique-ids
        class="absolute top-0 right-0 w-full h-full pointer-events-none opacity-30 mix-blend-plus-lighter"
      />
      <InlineSvg
        :src="widgetTexture"
        unique-ids
        class="absolute top-0 right-0 pointer-events-none opacity-88"
      />
      <InlineSvg
        :src="widgetTexture"
        unique-ids
        class="absolute top-0 right-0 pointer-events-none opacity-88 mix-blend-plus-lighter"
      />
      <div class="p-2 flex flex-col gap-6">
        <div class="flex gap-3.5 items-start">
          <div class="mt-2 ml-2 flex items-baseline gap-1.5">
            <span class="text-lavender text-5xl font-normal leading-[56px] tracking-[-2.4px]">{{ value }}</span>
            <span class="text-purple-gray text-base font-semibold leading-5 tracking-[-0.48px]">/ {{ maxValue }}</span>
          </div>
          <div class="absolute top-2 right-2">
            <BalanceBadge
              v-if="badgeText"
              :color="badgeColor"
            >
              <template #icon>
                <InlineSvg
                  :src="badgeIcon"
                  unique-ids
                  width="24"
                  height="24"
                />
              </template>
              <span>{{ badgeText }}</span>
            </BalanceBadge>
          </div>
        </div>
        <slot
          name="button"
          class="max-w-[153px]"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import elementIcon from '@/assets/icons/element-icon.svg'
import widgetBg from '@/assets/images/textures/widget-bg.svg'
import widgetTexture from '@/assets/images/textures/widget-texture.svg'
import widgetFill from '@/assets/images/textures/widget-fill.svg'
import InlineSvg from 'vue-inline-svg'
import BalanceBadge from '@/components/user-balance/BalanceBadge.vue'

interface Props {
  variant: 'orange' | 'purple'
  badgeColor?: string
  badgeIcon?: string
  badgeText?: string
  value: number
  maxValue: number
}

withDefaults(defineProps<Props>(), {
  variant: 'orange',
  badgeColor: '#C95CFF',
  badgeIcon: elementIcon,
  badgeText: '',
  value: 0,
  maxValue: 0,
})
</script>

<style scoped>
.orange {
  --color-tertiary: #D4C5EB;
  --color-secondary: #FF9D5C;
  --color-primary: #FF7847;
  --fill-primary: #FF7847;
  --fill-secondary: #FF9D5C;
  --fill-primary-support: transparent;
  --fill-tertiary: #D4C5EB;
}

.purple {
  --color-tertiary: #5858F5;
  --color-secondary: #6D6D8F;
  --color-primary: #C95CFF;
  --fill-primary: #3333FF;
  --fill-primary-support: #3333FF;
  --fill-secondary: #6D6D8F;
  --fill-tertiary: #C95CFF;
}
</style>