<template>
  <div class="mt-5">
    <p class="flex flex-wrap items-center gap-2 text-sm font-normal tracking-[-0.28px] text-lavender">
      {{ t('components.tasks.boostIntro') }}
      <BalanceBadge
        color="#5858F5"
        is-gradient-to-transparent
      >
        <template #icon>
          <InlineSvg
            :src="lingoIcon"
            width="24"
            height="24"
          />
        </template>
        {{ formattedLingo }}
      </BalanceBadge>
      {{ t('components.tasks.boostOutro', { usd: formattedUsd }) }}
      <span class="text-lavender">{{ t('components.tasks.boostLabel') }} {{ bonusMultiplier }}x</span>
    </p>
    <div class="relative mt-4 h-[92px]">
      <div
        class="absolute left-4 right-4 h-[3px] rounded-full bg-dark3"
        :style="{ top: trackTop }"
      />
      <div
        class="absolute left-4 h-[3px] rounded-full bg-[linear-gradient(90deg,#8a7aff,#7b6bff)]"
        :style="{ width: progressWidth, top: trackTop, background: progressGradient }"
      />
      <div
        v-for="step in steps"
        :key="step.value"
        class="absolute top-0 -translate-x-1/2 text-center"
        :style="{ left: stepLeft(step.percent) }"
      >
        <div class="relative flex flex-col items-center">
          <div
            class="relative z-10 grid h-8 w-8 place-items-center rounded-full border-2 bg-dark2"
            :style="{ borderColor: step.value <= bonusMultiplier ? step.color : '#4a4a64' }"
          >
            <div
              v-if="step.value === activeStep?.value"
              class="absolute -inset-2.5"
            >
              <InlineSvg
                :src="activeMultiplierTop"
                unique-ids
                class="absolute inset-0"
              />
              <InlineSvg
                :src="activeMultiplierBottom"
                unique-ids
                class="absolute inset-0"
              />
            </div>
            <span
              class="grid h-full w-full place-items-center rounded-full border border-dark3 bg-transparent text-xs font-semibold"
              :class="step.value <= bonusMultiplier ? 'text-white' : 'text-purple-gray'"
            >
              {{ step.label }}
            </span>
          </div>
          <span
            class="mt-2 inline-flex rounded-full px-4 py-1 text-[11px] font-semibold"
            :class="pillClass(step.value, step.value <= bonusMultiplier)"
          >
            {{ step.caption }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTranslation } from '@/composables/use-i18n'
import { formatNumberToUS } from '@/composables/helpers'
import lingoIcon from '@/assets/images/lingo-icon.svg'
import activeMultiplierTop from '@/assets/images/textures/tasks/active-multiplier-top.svg'
import activeMultiplierBottom from '@/assets/images/textures/tasks/active-multiplier-bottom.svg'
import InlineSvg from 'vue-inline-svg'
import BalanceBadge from '@/components/user-balance/BalanceBadge.vue'

const props = defineProps<{
  stakedAmountUsd: number
  bonusMultiplier: number
  stakedLingoAmount: number
}>()

const { t } = useTranslation()

const steps = computed(() => ([
  { value: 1, label: '1x', caption: t('components.tasks.boostSteps.free'), percent: 0, color: '#5858F5' },
  { value: 2, label: '2x', caption: t('components.tasks.boostSteps.holdAny'), percent: 35, color: '#965BFA' },
  { value: 5, label: '5x', caption: t('components.tasks.boostSteps.stake100'), percent: 70, color: '#C95CFF' },
  { value: 10, label: '10x', caption: t('components.tasks.boostSteps.stake500'), percent: 100, color: '#B56BFF' },
]))

const activeStep = computed(() => {
  return steps.value.reduce((acc, step) => {
    if (step.value <= props.bonusMultiplier) return step
    return acc
  }, steps.value[0])
})

const progressPercent = computed(() => {
  return activeStep.value?.percent ?? 0
})

const progressWidth = computed(() => {
  return `calc((100% - 32px) * ${progressPercent.value} / 100)`
})

const stepLeft = (percent: number) => {
  return `calc((100% - 32px) * ${percent} / 100 + 16px)`
}

const trackTop = 'calc(16px - 1.5px)'

const progressGradient = computed(() => {
  const entries = steps.value
    .map((step) => `${step.color} ${step.percent}%`)
    .join(', ')
  return `linear-gradient(90deg, ${entries})`
})

const pillClass = (value: number, isActive: boolean) => {
  if (!isActive) return 'bg-[#2d2d3f] text-purple-gray'
  if (value === 1) return 'bg-[#5f5bff] text-white'
  if (value === 2) return 'bg-[#8a62ff] text-white'
  if (value === 5) return 'bg-[#c05bff] text-white'
  return 'bg-[#B56BFF] text-white'
}

const formattedLingo = computed(() => formatNumberToUS(props.stakedLingoAmount))
const formattedUsd = computed(() => formatNumberToUS(props.stakedAmountUsd))
</script>
