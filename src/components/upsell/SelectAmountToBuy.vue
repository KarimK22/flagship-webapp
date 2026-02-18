<template>
  <div class="flex flex-col gap-4 w-[90vw] md:w-[388px]">
    <div class="relative">
      <h1 class="text-light1 font-medium text-[45px] leading-10 tracking-[-2.25px]">
        {{ t('components.selectAmountToBuy.selectEntries') }}
      </h1>
      <h1 class="text-light1 font-medium flare text-[45px] leading-10 tracking-[-2.25px]">
        {{ t('components.selectAmountToBuy.selectEntries') }}
      </h1>
    </div>
    <span class="text-lavender text-xl leading-5 tracking-[-0.8px] pt-1 pb-2" v-html="t('components.selectAmountToBuy.lingoPassDescription')">
    </span>
    <span class="text-lavender text-xl leading-5 tracking-[-0.8px] pt-1 pb-2">
      {{ t('components.selectAmountToBuy.sellAfterUse') }}
    </span>
    <div class="flex flex-col gap-1 text-lavender w-full">
      <div
        v-for="entry in options"
        :key="entry.amount"
        class="rounded-2xl bg-[rgba(38,38,56,0.40)] p-4 cursor-pointer relative overflow-hidden"
        :class="{
          'bg-[rgba(38,38,56,0.32)] shadow-[0px_-4px_16px_-2px_rgba(222,206,235,0.16)_inset]': selectedAmount === entry.amount,
        }"
        :style="{ width: entry.w }"
        @click="selectedAmount = entry.amount"
      >
        <div class="flex flex-col">
          <span class="text-[32px] leading-8 font-medium tracking-[-1.28px]">
            <span class="text-[#FFBC70]">{{ entry.entries }}</span> {{ t('components.selectAmountToBuy.entries') }}
          </span>
          <span class="leading-4 text-sm tracking-[-0.28px]">
            ${{ entry.amount }} {{ t('components.selectAmountToBuy.worthOfLingo') }}
          </span>
          <div
            v-if="selectedAmount === entry.amount"
            class="flex items-center absolute top-1/2 right-4 -translate-y-1/2"
          >
            <div class="w-96 h-10 absolute top-0 right-0">
              <div class="w-14 h-10 -right-[28px] -top-[3px] absolute bg-[#33F] rounded-full blur-[16px]" />
              <div class="w-18 h-8 -right-[1px] -top-[28px] absolute bg-[#FF7847] rounded-full blur-[24px]" />
              <div class="w-8 h-4 right-[2px] -top-[8px] absolute bg-[#6D6D8F] rounded-full blur-[8px] mix-blend-plus-lighter" />
            </div>
            <InlineSvg
              :src="checkIcon"
              class="size-8 z-10"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="flex h-20 items-center text-lavender w-full text-xl leading-5 tracking-[-0.8px] py-0 border-y-[1px] border-y-[#333347] border-dashed">
      <span>{{ t('components.selectAmountToBuy.forAmountReceive', { amount: selectedAmount }) }}</span>
      <InlineSvg
        class="-mr-12"
        :src="lingoIcon"
        unique-ids
      />
      <div class="flex flex-col">
        <span class="text-light1 font-medium text-[32px] leading-8 tracking-[-1.28px]">{{ quote }}</span>
        <span class="text-purple-gray font-semibold text-sm tracking-[-0.28px]">X Lingo</span>
      </div>
    </div>
    <div class="flex justify-center">
      <div class="p-4 pt-0 w-full flex justify-center mt-4">
        <GlowButton
          :color="EButtonColor.BLUE"
          class="w-full"
          @click="buyLingo"
        >
          <span>
            {{ t('components.selectAmountToBuy.buyWithCreditCard') }}
          </span>
        </GlowButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTranslation } from '@/composables/use-i18n'
import checkIcon from '@/assets/icons/checkmark.svg'
import lingoIcon from '@/assets/images/lingo-xl-icon.svg'
import { useLingoPrice } from '@/composables/contracts/lingo-price'
import { EUpsellSteps } from '@/types/staking'
import { computed, ref, watch } from 'vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import { useGetMe } from '@/composables/get-me'
import mixpanel from 'mixpanel-browser'
import { redirectToService } from '@/composables/helpers'
import { useStakes } from '@/composables/contracts/stakes'
import { useBuying } from '@/composables/contracts/buy'

const { t } = useTranslation()
const { accountAddress } = useGetMe()
const { price } = useLingoPrice()
const SMASH_POWER_MILES_COST = 100
const selectedAmount = ref(50)
const quote = ref(0)

const { calculatePowerPerDay } = useStakes()
const { getBuyQuote } = useBuying()

const getPowerMilesPerUsd = (usdAmount: number) => {
  const amount = usdAmount / price.value
  const lockDuration = 365
  const powerMilesPerDay = calculatePowerPerDay(amount)
  return powerMilesPerDay * lockDuration
}

const options = computed(() => {
  return [50, 25, 10].map((amount, index) => {
    const powerMilesPerAmount = getPowerMilesPerUsd(amount)
    const entries = Math.floor(powerMilesPerAmount / SMASH_POWER_MILES_COST)
    return {
      amount,
      entries,
      w: `${100 - index * 10}%`,
    }
  })
})

const buyLingo = () => {
  if (!accountAddress.value) {
    return
  }

  mixpanel.track('Staking Amount Selected', {
    amount: selectedAmount.value,
  })

  mixpanel.track('Buy Lingo', {
    entryPoint: 'upsell-select-amount',
    amount: selectedAmount.value,
  })
  const url = new URL(window.location.href)
  // clear the url params
  url.searchParams.delete('fs_init')
  url.searchParams.delete('lp_var')
  url.searchParams.delete('lp_code')
  window.history.replaceState({}, '', url.toString())
  redirectToService('https://buy.kryptonim.com/redirect-form', {
    currency: 'USD',
    convertedCurrency: 'LINGO',
    amount: selectedAmount.value,
    blockchain: 'Base',
    address: accountAddress.value,
    theme: 'dark',
    successUrl: `${window.location.host}?fs_continue=true&fs_step=${EUpsellSteps.BUY_SUCCESS}`,
  })
}

const getQuote = async (amount: number) => {
  const response = await getBuyQuote(amount, 'USD', 'LINGO', 'Base', 'USD')
  return response
}

watch(selectedAmount, (newAmount) => {
  getQuote(newAmount).then((response) => {
    if (response) {
      quote.value = Math.ceil(Number(response))
    }
  }).catch((error) => {
    console.error(error)
  })
}, { immediate: true })
</script>

<style>
.flare {
  width: 100%;
  position: absolute;
  filter: blur(4px);
  overflow: hidden;
  top: 0px;
  left: 0px;
  background: radial-gradient(104.64% 67.93% at 115.38% 32.81%, #F1E6FA 0%, rgba(241, 230, 250, 0.00) 100%);
  background-clip: text;
  color: transparent;
  transition: all 0.3s;
  mix-blend-mode: plus-lighter;
  pointer-events: none;
}
</style>
