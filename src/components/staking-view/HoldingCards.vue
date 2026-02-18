<script setup lang="ts">
import bg from '@/assets/images/staking/holding-cards-bg.png'
import { useStakes } from '@/composables/contracts/stakes'
import { formatNumberToUS } from '@/composables/helpers'
import { DateTime } from 'luxon'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { myBoost, oneLingoBaseDailyPower, myStakesList } = useStakes()

const boostEndDate = computed(() => {
  if (!myBoost.value) return undefined
  // check if the boost is expired
  return DateTime.fromISO(myBoost.value.expiresAt).toFormat('MMM d ha')
})

const boostEndDateExpired = computed(() => {
  if (!myBoost.value || !myBoost.value.expiresAt) return true
  return DateTime.fromISO(myBoost.value.expiresAt) < DateTime.now()
})

const totalStakePositions = computed(() => myStakesList.value.length ?? 0)
const totalStakedLingo = computed(() => myStakesList.value.reduce((acc, stake) => acc + Number(stake.amount), 0))
const totalPowerRate = computed(() =>
  myStakesList.value.reduce((acc, stake) => acc + stake.dailyPower, 0),
)

const totalPowerPerDay = computed(() => {
  const manualBoost = myBoost.value?.amount ?? 0

  const boost = oneLingoBaseDailyPower.value * manualBoost
  const dailyPower = totalStakedLingo.value * boost
  return totalPowerRate.value + dailyPower
})

const extraPowerBoost = computed(() => {
  const boost = myBoost.value?.amount
  return boost ? boost * 100 : 0
})

const holdings = computed(() => {
  return [
    {
      name: t('staking.holdings.totalActiveHoldings'),
      quantity: totalStakePositions,
      description: '',
    },
    {
      name: t('staking.holdings.totalPowerRate'),
      quantity: formatNumberToUS(totalPowerPerDay.value),
      description: t('staking.holdings.powerMilesPerDay'),
    },
    {
      name: t('staking.holdings.extraPowerBoost'),
      quantity: formatNumberToUS(extraPowerBoost.value),
      suffix: '%',
      description: boostEndDateExpired.value ? '' : t('staking.holdings.until', { date: boostEndDate.value }),
    },
  ]
})
const classNames = ['bg-cover bg-left', 'bg-cover bg-center', 'bg-cover bg-right']
</script>

<template>
  <div class="py-10 flex flex-col gap-2">
    <h1 class="whitespace-pre-line text-lavender text-5.5xl leading-tightest tracking-tighter">
      {{ t('staking.holdings.title') }}
    </h1>
  </div>
  <div class="flex gap-2 w-full flex-wrap justify-center md:justify-start md:flex-nowrap">
    <div
      v-for="(holding, index) in holdings"
      :key="index"
      :style="{ backgroundImage: `url(${bg})` }"
      :class="classNames[index]"
      class="flex flex-col gap-2 overflow-hidden rounded-2xl p-4 h-36 relative justify-between w-[238px] min-w-[238px]"
    >
      <h2 class="font-semibold text-lavender leading-6 tracking-wide">
        {{ holding.name }}
      </h2>
      <h1 class="text-purple text-5.5xl tracking-[-4.48px] leading-14">
        {{ holding.quantity }}<i
          v-if="holding.suffix"
          class="text-[32px] pl-1.5"
        >{{ holding.suffix }}</i>
      </h1>
      <span
        :hidden="!holding.description"
        class="text-blue-gray absolute bottom-2 right-2 px-2 text-sm leading-6 rounded-full bg-black/88"
      >
        {{ holding.description }}
      </span>
    </div>
  </div>
</template>
