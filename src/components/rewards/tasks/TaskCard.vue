<template>
  <div
    class="relative overflow-hidden rounded-2xl bg-dark2/90 px-6 py-5"
  >
    <div class="pointer-events-none absolute top-0 left-0 h-12 w-12">
      <InlineSvg
        :src="taskCardStroke"
        unique-ids
        class="absolute inset-0 mix-blend-plus-lighter"
      />
      <InlineSvg
        :src="taskCardFill"
        unique-ids
        class="absolute inset-0 mix-blend-plus-lighter"
      />
      <InlineSvg
        :src="taskCardDots"
        unique-ids
        class="absolute inset-0"
      />
      <InlineSvg
        :src="taskCardDots"
        unique-ids
        class="absolute inset-0 mix-blend-plus-lighter"
      />
    </div>
    <div class="relative flex flex-col gap-4 md:flex-row md:items-center">
      <div class="flex flex-1 flex-col gap-2">
        <div class="flex items-center gap-3">
          <div class="grid h-11 w-11 place-items-center rounded-xl bg-transparent">
            <img
              v-if="task.imageUrl"
              :src="task.imageUrl"
              :alt="task.name"
              class="h-11 w-11"
            >
          </div>
          <h4 class="text-lg font-normal text-lavender">
            {{ task.name }}
          </h4>
        </div>
        <div class="flex flex-wrap items-center gap-2 text-sm text-soft-gray">
          <span>{{ task.description || '' }}</span>
          <BalanceBadge
            color="#FF7847"
            is-gradient-to-transparent
          >
            <template #icon>
              <InlineSvg
                :src="boltIcon"
                width="24"
                height="24"
              />
            </template>
            {{ formatNumberToUS(task.powerMilesReward) }}
            <span class="ml-1 text-s font-semibold text-lavender">{{ t('components.tasks.powerMiles') }}</span>
          </BalanceBadge>
        </div>
        <p
          v-if="showBoostedReward"
          class="flex flex-wrap items-center gap-2 text-sm text-soft-gray"
        >
          <span class="text-soft-gray">{{ t('components.tasks.youWillReceivePrefix') }}</span>
          <span class="inline-flex items-center gap-1.5">
            <img
              :src="boltIcon"
              alt=""
              class="h-3.5 w-3.5"
            >
            <span class="font-semibold text-amber-soft">{{ formatNumberToUS(boostedReward) }}</span>
            <span class="text-lavender">{{ t('components.tasks.powerMiles') }}</span>
          </span>
          <span class="text-soft-gray">{{ t('components.tasks.withYourBoost') }}</span>
        </p>
      </div>
      <div class="md:self-center">
        <GlowButton
          :color="EButtonColor.BLUE"
          :loading="loading"
          :disabled="disabled"
          class="min-w-[120px] sm:h-9 md:min-w-[128px]"
          @click="emit('action', task)"
        >
          {{ actionLabel }}
        </GlowButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import { formatNumberToUS } from '@/composables/helpers'
import { useTranslation } from '@/composables/use-i18n'
import type { TaskProgress } from '@/services/api'
import boltIcon from '@/assets/images/bolt.svg'
import taskCardDots from '@/assets/images/textures/tasks/task-card-dots.svg'
import taskCardFill from '@/assets/images/textures/tasks/task-card-fill.svg'
import taskCardStroke from '@/assets/images/textures/tasks/task-card-stroke.svg'
import InlineSvg from 'vue-inline-svg'
import BalanceBadge from '@/components/user-balance/BalanceBadge.vue'

const props = defineProps<{
  task: TaskProgress
  bonusMultiplier: number
  actionLabel: string
  loading: boolean
  disabled: boolean
}>()

const emit = defineEmits<{
  (event: 'action', task: TaskProgress): void
}>()

const { t } = useTranslation()

const boostedReward = computed(() => {
  return Math.floor(props.task.powerMilesReward * (props.bonusMultiplier || 1))
})

const showBoostedReward = computed(() => {
  return props.bonusMultiplier > 1 && boostedReward.value > props.task.powerMilesReward
})
</script>
