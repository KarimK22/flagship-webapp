<template>
  <div class="flex flex-col gap-2 mt-auto mb-2">
    <div class="flex items-center justify-between">
      <p class="text-base font-semibold text-lavender tracking-[0.16px]">
        {{ $t('components.raffleWonModalVouchersContent.yourVoucherCode') }}
      </p>
    </div>
    <div
      v-if="voucherCode"
      class="flex items-center gap-1 min-h-[58px]"
    >
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
import CopyBox from '@/components/ui/CopyBox.vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button.ts'
import mixpanel from 'mixpanel-browser'

const props = defineProps<{
  voucherCode?: string
}>()

const emit = defineEmits<{
    (e: 'hide'): void
}>()

function goToBitrefill(e: Event) {
  if (!props.voucherCode) return
  e.preventDefault()
  emit('hide')

  mixpanel.track('Voucher Redeem Started')

  window.open(`https://www.bitrefill.com/redeem#${props.voucherCode}`, '_blank')
}
</script>