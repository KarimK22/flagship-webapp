<template>
  <div class="flex gap-x-2">
    <div class="inline-flex">
      <TooltipWrapper>
        <BalanceBadge
          color="#5858F5"
          class="z-10"
          is-gradient-to-transparent
        >
          <template #icon>
            <InlineSvg
              :src="pointsIcon"
              width="24"
              height="24"
            />
          </template>
          {{ formattedTokenBalance }}
        </BalanceBadge>
        <template #content>
          <TooltipContent
            :title="t('header.balance.available')"
            :description="t('header.balance.availableDescription')"
          />
        </template>
      </TooltipWrapper>

      <TooltipWrapper>
        <BalanceBadge
          :color="isPositivePercentageChange ? '#5EB851' : '#fb2c36'"
          is-gradient-to-transparent
        >
          <div class="flex flex-nowrap justify-center items-center gap-x-1 whitespace-nowrap min-w-20">
            <span>$ {{ formattedPrice }}</span>

            <div
              v-if="changePercentage24h"
              class="flex items-center"
              :class="isPositivePercentageChange ? 'text-green-500' : 'text-red-500'"
            >
              <span>{{ formattedChangePercentage24h }}%</span>

              <ChevronUp
                class="inline-block"
                :class="{ 'rotate-180': !isPositivePercentageChange }"
                :size="16"
                stroke-width="3"
              />
            </div>
          </div>
        </BalanceBadge>
        <template #content>
          <TooltipContent
            :title="t('header.balance.price')"
            :description="t('header.balance.priceDescription')"
          />
        </template>
      </TooltipWrapper>
    </div>

    <TooltipWrapper>
      <BalanceBadge
        color="#FF7847"
        is-gradient-to-transparent
      >
        <template #icon>
          <InlineSvg
            :src="powerIcon"
            width="24"
            height="24"
          />
        </template>

        {{ formattedPowerMiles }}
      </BalanceBadge>
      <template #content>
        <TooltipContent
          :title="t('header.balance.powerMiles')"
          :description="t('header.balance.powerMilesDescription')"
        />
      </template>
    </TooltipWrapper>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import InlineSvg from 'vue-inline-svg'
import BalanceBadge from '@/components/user-balance/BalanceBadge.vue'
import pointsIcon from '@/assets/images/game/points-processed.svg'
import powerIcon from '@/assets/images/game/power.svg'
import { ChevronUp } from 'lucide-vue-next'
import { useLingoPrice } from '@/composables/contracts/lingo-price.ts'
import { useStakes } from '@/composables/contracts/stakes'
import { useBalance } from '@/composables/contracts/balance'
import { useTranslation } from '@/composables/use-i18n'
import TooltipWrapper from '../TooltipWrapper.vue'
import TooltipContent from '../TooltipContent.vue'

const { t } = useTranslation()
const { tokenBalance } = useBalance()
const { price, changePercentage24h } = useLingoPrice()
const { totalPowerMiles } = useStakes()

const isPositivePercentageChange = computed(() => changePercentage24h.value >= 0)

const formattedTokenBalance = computed(() => {
  return Number(tokenBalance.value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
})

const formattedPrice = computed(() => {
  return Number(price.value).toLocaleString('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })
})

const formattedPowerMiles = computed(() => {
  return Number(totalPowerMiles.value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
})

const formattedChangePercentage24h = computed(() => {
  return Number(changePercentage24h.value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
})
</script>
