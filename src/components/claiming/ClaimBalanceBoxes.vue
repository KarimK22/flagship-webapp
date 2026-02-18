<script setup lang="ts">
import bg from '@/assets/images/claiming/claiming-options.png'
import { formatNumberToUS } from '@/composables/helpers'
import { computed } from 'vue'
import { useSnapshot } from '@/composables/contracts/snapshot.ts'
import { useBalance } from '@/composables/contracts/balance.ts'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { totalClaimedBalance, unvested } = useBalance()
const { totalTokenAllocation } = useSnapshot()

const options = computed(() => {
  return [
    {
      name: t('components.claimBalanceBoxes.total'),
      quantity: formatNumberToUS(totalTokenAllocation.value),
    },
    {
      name: t('components.claimBalanceBoxes.totalClaimed'),
      quantity: formatNumberToUS(totalClaimedBalance.value),
    },
    {
      name: t('components.claimBalanceBoxes.totalLocked'),
      quantity: formatNumberToUS(unvested.value),
    },
  ]
})
const classNames = ['bg-cover bg-left', 'bg-cover bg-center', 'bg-cover bg-right']
</script>

<template>
  <div class="flex gap-2 w-full flex-wrap justify-center md:justify-start md:flex-nowrap select-none">
    <div
      v-for="(option, index) in options"
      :key="index"
      :style="{ backgroundImage: `url(${bg})` }"
      :class="classNames[index]"
      class="flex flex-col gap-2 overflow-hidden rounded-2xl p-4 h-36 relative justify-between w-[238px] min-w-[238px]"
    >
      <h2 class="font-semibold text-lavender leading-6 tracking-wide">
        {{ option.name }}
      </h2>
      <h1 class="text-purple text-5.5xl tracking-[-4.48px] leading-14">
        {{ option.quantity }}
      </h1>
    </div>
  </div>
</template>
