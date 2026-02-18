<script setup lang="ts">
import { computed } from 'vue'
import IconWrapper from '@/components/icon-wrapper/IconWrapper.vue'
import { useStakes } from '@/composables/contracts/stakes'
import { formatNumber, formatNumberToUS } from '@/composables/helpers'
import { useLingoPrice } from '@/composables/contracts/lingo-price'
import lingoIcon from '@/assets/images/lingo-icon.svg'
import powerIcon from '@/assets/images/bolt.svg'
import InlineSVG from 'vue-inline-svg'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { totalPowerMiles, totalStakedLingo } = useStakes()
const { price } = useLingoPrice()
const totalStakedLingoInFiat = computed(() => totalStakedLingo.value * price.value)

const stakingOrbs = computed<{
	[key: string]: {
		name: string
		quantity: string | number
		position: 'left' | 'right'
		variant: 'orange' | 'purple'
		icon: string
	}
}>(() => ({
  powerMiles: {
    name: t('staking.tokens.powerMiles'),
    quantity: formatNumberToUS(totalPowerMiles.value),
    position: 'left',
    variant: 'orange',
    icon: powerIcon,
  },
  holdingTotal: {
    name: t('staking.tokens.holdingTotal'),
    quantity: formatNumber(totalStakedLingo.value, 2),
    position: 'right',
    variant: 'purple',
    icon: lingoIcon,
  },
}))
</script>

<template>
  <div class="flex justify-between relative">
    <div
      v-for="(orb, key) in stakingOrbs"
      :key="key"
      class="flex justify-between not-odd:flex-row-reverse gap-2"
    >
      <IconWrapper
        :variant="orb.variant"
        :position="orb.position"
        :with-borders="false"
      >
        <InlineSVG
          :src="orb.icon"
          class="size-10"
        />
      </IconWrapper>

      <div class="flex flex-col">
        <h1
          class="text-lavender text-4xl md:text-5.5xl leading-tightest tracking-tighter"
          :class="{ 'self-end': orb.position === 'right' }"
        >
          {{ orb.quantity }}
        </h1>
        <span class="text-purple-gray text-xl leading-loose tracking-tighter-x1 font-normal whitespace-nowrap">{{ orb.name }}</span>
      </div>
    </div>
    <span class="text-[#D4C5EB] text-2xl md:text-[32px] tracking-tighter-x2 absolute top-[100%] right-0">
      ${{ formatNumberToUS(totalStakedLingoInFiat) }}
    </span>
  </div>
</template>

<style scoped>
.texture {
	top: 100%;
}
</style>
