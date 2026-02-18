<template>
  <div class="container">
    <div
      v-if="!activeWheel"
      class="space-y-6"
    >
      <h2 class="mt-6 text-lavender text-[40px] leading-10 tracking-[-1.6px]">
        {{ t('views.rewardsView.wheels') }}
      </h2>
      <div class="space-y-4">
        <button
          v-for="card in wheelCards"
          :key="card.value"
          class="flex w-full items-center justify-between gap-4 rounded-[18px] border border-[color-mix(in_srgb,var(--color-purple-gray)_25%,transparent)] bg-[radial-gradient(120%_120%_at_0%_0%,color-mix(in_srgb,var(--color-purple-gray)_35%,transparent)_0%,color-mix(in_srgb,var(--color-dark2)_90%,transparent)_55%,color-mix(in_srgb,var(--color-dark1)_90%,transparent)_100%)] px-8 py-7 text-left text-inherit shadow-[inset_0_0_40px_color-mix(in_srgb,var(--color-purple-gray)_15%,transparent)] transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--color-lavender)_50%,transparent)] hover:shadow-[inset_0_0_48px_color-mix(in_srgb,var(--color-lavender)_20%,transparent),0_12px_30px_color-mix(in_srgb,var(--color-dark1)_40%,transparent)] cursor-pointer"
          type="button"
          @click="goToWheel(card.value)"
        >
          <div>
            <div class="text-2xl sm:text-3xl font-medium text-lavender">
              {{ card.title }}
            </div>
            <div class="mt-2 text-lavender/70 text-base sm:text-lg">
              {{ card.description }}
            </div>
          </div>
          <ChevronRight
            class="shrink-0 cursor-pointer text-[color-mix(in_srgb,var(--color-lavender)_60%,transparent)]"
            :size="22"
          />
        </button>
      </div>
    </div>

    <div v-else>
      <button
        class="mt-4 inline-flex h-10 items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--color-dark3)_80%,transparent)] bg-[color-mix(in_srgb,var(--color-dark3)_70%,transparent)] px-4 text-sm font-semibold text-[color-mix(in_srgb,var(--color-lavender)_80%,transparent)] transition-[border-color,color] duration-200 hover:border-[color-mix(in_srgb,var(--color-lavender)_60%,transparent)] hover:text-lavender cursor-pointer"
        type="button"
        @click="clearWheel"
      >
        <ChevronLeft :size="16" />
        {{ t('views.rewardsView.backToWheels') }}
      </button>

      <div
        v-if="activeWheel === 'whale'"
        class="-mt-8"
      >
        <WhaleSpins />
      </div>
      <div
        v-else-if="activeWheel === 'staking'"
        class="-mt-8"
      >
        <WheelStaking />
      </div>
      <div
        v-else
        class="-mt-8"
      >
        <TieredStakingWheels />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import WhaleSpins from '@/components/rewards/WhaleSpins.vue'
import WheelStaking from '@/components/rewards/WheelStaking.vue'
import TieredStakingWheels from '@/components/rewards/TieredStakingWheels.vue'

type WheelValue = 'whale' | 'staking' | 'tiered'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const activeWheel = computed<WheelValue | null>(() => {
  const wheel = route.query.wheel
  if (wheel === 'whale' || wheel === 'staking' || wheel === 'tiered') {
    return wheel
  }
  return null
})

const wheelCards = computed(() => [
  {
    value: 'staking' as const,
    title: 'Welcome Wheel',
    description: t('views.rewardsView.stakingWheelsDesc'),
  },
  {
    value: 'tiered' as const,
    title: 'Staking Rewards Wheel',
    description: t('views.rewardsView.tieredStakingWheelsDesc'),
  },
  {
    value: 'whale' as const,
    title: t('views.rewardsView.whaleWheel'),
    description: t('views.rewardsView.whaleWheelDesc'),
  },
])

const goToWheel = (wheel: WheelValue) => {
  router.push({
    query: {
      ...route.query,
      wheel,
    },
  })
}

const clearWheel = () => {
  const nextQuery = { ...route.query }
  delete nextQuery.wheel
  router.push({ query: nextQuery })
}
</script>
