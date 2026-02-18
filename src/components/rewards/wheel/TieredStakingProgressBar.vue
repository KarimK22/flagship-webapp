<template>
  <div class="w-full">
    <div class="flex items-start w-full gap-0 px-2">
      <template
        v-for="(tier, index) in sortedTiers"
        :key="tier.id"
      >
        <div
          class="flex flex-col items-center shrink-0"
          :class="index === 0 ? 'pr-1.5' : ''"
        >
          <div class="mt-3 w-8 h-8">
            <TooltipWrapper>
              <div class="relative grid place-items-center w-full h-full">
                <img
                  v-if="isActiveTier(tier)"
                  :src="activeTierRing"
                  class="absolute w-8 h-8"
                  alt=""
                >
                <img
                  :src="tierIcons[index]"
                  class="w-6 h-6"
                  alt=""
                >
              </div>
              <template #content>
                <div class="flex flex-col p-4 max-w-[224px]">
                  <p class="text-base font-semibold text-lavender tracking-[-0.16px] leading-4">
                    {{ tier.title }}
                  </p>
                  <p class="text-sm font-semibold text-lavender tracking-[-0.28px] leading-4 mt-2">
                    {{ tierRewardsParts(tier).title }}
                  </p>
                  <p class="text-xs font-semibold text-purple-gray tracking-[-0.28px] leading-4 whitespace-pre-line mt-1">
                    {{ tierRewardsParts(tier).list }}
                  </p>
                </div>
              </template>
            </TooltipWrapper>
          </div>
          <div class="mt-2 px-2.5 py-1 text-xs text-white bg-[#262638] rounded-full">
            {{ formatUsd(tier.lockAmountEligibility) }}
          </div>
        </div>

        <div
          v-if="index < segments.length"
          class="flex-1 h-1 rounded-full bg-dark3/80 overflow-hidden mt-6.5 -mx-1"
        >
          <div
            class="h-full transition-all"
            :style="segmentStyle(index, segments[index])"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TieredStakingWheel } from '@/services/api'
import { useTranslation } from '@/composables/use-i18n'
import TooltipWrapper from '@/components/TooltipWrapper.vue'
import bronzeIcon from '@/assets/images/wheel/bronze-tier.png'
import silverIcon from '@/assets/images/wheel/silver-tier.png'
import goldIcon from '@/assets/images/wheel/gold-tier.png'
import diamondIcon from '@/assets/images/wheel/diamond-logo-sm.png'
import activeTierRing from '@/assets/images/wheel/active-tier.svg'

const props = defineProps<{
  tiers: TieredStakingWheel[]
  currentValue: number
}>()

const { t } = useTranslation()

const tierOrder: Array<'bronze' | 'silver' | 'gold' | 'diamond'> = [
  'bronze',
  'silver',
  'gold',
  'diamond',
]

const sortedTiers = computed(() =>
  [...props.tiers].sort((a, b) => a.lockAmountEligibility - b.lockAmountEligibility),
)

const tierIcons = computed(() => {
  const byTier = {
    bronze: bronzeIcon,
    silver: silverIcon,
    gold: goldIcon,
    diamond: diamondIcon,
  }

  return sortedTiers.value.map((tier, index) => {
    const title = (tier.title ?? '').toLowerCase()
    const key =
      title.includes('diamond') ? 'diamond' :
        title.includes('gold') ? 'gold' :
          title.includes('silver') ? 'silver' :
            title.includes('bronze') ? 'bronze' :
              tierOrder[index] ?? 'bronze'

    return byTier[key]
  })
})

const segments = computed(() => {
  const tiers = sortedTiers.value
  if (tiers.length < 2) return []

  return tiers.slice(0, -1).map((tier, i) => {
    const start = tier.lockAmountEligibility
    const end = tiers[i + 1].lockAmountEligibility
    const range = Math.max(end - start, 1)
    const raw = (props.currentValue - start) / range
    return Math.min(Math.max(raw, 0), 1) * 100
  })
})

const segmentStyle = (index: number, width: number) => {
  const gradients = [
    `linear-gradient(90deg, var(--color-tier-bronze), var(--color-tier-silver))`,
    `linear-gradient(90deg, var(--color-tier-silver), var(--color-tier-gold))`,
    `linear-gradient(90deg, var(--color-tier-gold), var(--color-tier-diamond))`,
    `linear-gradient(90deg, var(--color-tier-diamond), var(--color-tier-diamond))`,
  ]

  return {
    width: `${width}%`,
    backgroundImage: gradients[index] ?? gradients[gradients.length - 1],
  }
}

const formatUsd = (value: number) => {
  return `$${Math.round(value).toLocaleString('en-US')}`
}

const isActiveTier = (tier: TieredStakingWheel) => {
  return props.currentValue >= tier.lockAmountEligibility
}

const tierRewardsParts = (tier: TieredStakingWheel) => {
  const rewards = (tier.prizes ?? [])
    .map(prize => prize.name)
    .filter(Boolean)
    .map(name => `- ${name}`)
    .join('\n')

  const raw = t('rewards.tieredStaking.tierRewardsDescription', { rewards })
  const [title, ...rest] = raw.split('\n')

  return {
    title: title ?? '',
    list: rest.join('\n'),
  }
}
</script>
