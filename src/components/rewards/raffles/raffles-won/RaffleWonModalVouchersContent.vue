<template>
  <div class="flex flex-col gap-2 mt-auto mb-2">
    <div class="flex items-center justify-between">
      <p class="text-base font-semibold text-lavender tracking-[0.16px]">
        {{ $t('components.raffleWonModalVouchersContent.yourVoucherCode') }}
      </p>
      <RaffleWinners
        v-if="!hideWinnersButton"
        class="ml-auto"
        @click="emit('showAllWinners')"
      />
    </div>
    <div class="flex items-center gap-1 min-h-[58px]">
      <CopyBox
        class="w-full flex-1"
        :text="voucherCode.slice(0, -5) + '*****'"
        :copy-value="voucherCode"
        :clean-url="false"
        copy-label=""
      />
      <div class="select-none">
        <GlowButton
          :color="EButtonColor.BLUE"
          @click="goToBitrefill"
        >
          {{ $t('components.raffleWonModalVouchersContent.redeem') }}
        </GlowButton>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RAFFLE_PRIZE_TYPE, type RaffleStatus } from '@/services/api.ts'
import RaffleWinners from '@/components/rewards/raffles/raffles-won/RaffleWinners.vue'
import CopyBox from '@/components/ui/CopyBox.vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button.ts'
import mixpanel from 'mixpanel-browser'

const props = defineProps<{
    wonPrize?: RaffleStatus['wonPrizeV2']
    hideWinnersButton?: boolean
}>()

const emit = defineEmits<{
    (e: 'hide'): void
    (e: 'showAllWinners'): void
}>()

const voucherCode = props.wonPrize?.type === RAFFLE_PRIZE_TYPE.VOUCHERS ? props.wonPrize.code : ''

function goToBitrefill(e: Event) {
  e.preventDefault()
  emit('hide')

  mixpanel.track('Voucher Redeem Started')

  if (props.wonPrize?.type === RAFFLE_PRIZE_TYPE.VOUCHERS) {
    window.open(`https://www.bitrefill.com/redeem#${props.wonPrize?.code}`, '_blank')
  }
}
</script>