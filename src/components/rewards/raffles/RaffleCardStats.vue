<template>
  <div class="flex">
    <div class="flex flex-col gap-1 bg-background/80 backdrop-blur-sm p-2 rounded-2xl shadow-[inset_0px_-28px_24px_-16px_rgba(222,206,235,0.08)] mt-auto">
      <div class="flex items-center gap-1">
        <div
          class="border border-dark3/80 backdrop-blur-sm rounded-full p-1 size-12 flex items-center justify-center relative shadow-[inset_0px_0px_56px_-16px_rgba(28,28,41,0.4)]"
        >
          <InlineSvg
            :src="ticketIcon"
            unique-ids
            width="20"
          />
          <InlineSvg
            v-if="currencyIcon"
            unique-ids
            :src="currencyIcon"
            width="24"
            class="absolute -top-[3px] -left-[3px]"
          />
        </div>
        <span class="text-5xl leading-1 text-light1 -tracking-[3.36px]">{{ (ticketsCount || 0) }}</span>
      </div>
      <div class="rounded-[24px] p-0 relative flex overflow-hidden">
        <div class="badge-gradient" />

        <div class="px-2 py-0 rounded-[20px] backdrop-blur-xl text-sm leading-6 -tracking-[0.28px] font-semibold">
          <span class="text-sm leading-6 -tracking-[0.28px]">{{ t('common.myEntries') }} \ {{ formatNumberToUS(totalTicketsCount) }} {{ t('common.total') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import ticketIcon from '@/assets/icons/ticket.svg'
import InlineSvg from 'vue-inline-svg'
import { formatNumberToUS } from '@/composables/helpers.ts'
import { useTranslation } from '@/composables/use-i18n'

const { t } = useTranslation()

defineProps<{
    ticketsCount?: number
    totalTicketsCount: number
    currencyIcon: string
}>()


</script>
<style scoped>

.badge-gradient {
    position: absolute;
    top: -15px;
    right: -10px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    backdrop-filter: blur(8px);
    background: radial-gradient(
        circle at top right,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 255, 255, 0.90) 10px,
        rgba(255, 255, 255, 0.70) 20px,
        #5858F5 40px,
        color-mix(in srgb, #5858F5, transparent 30%) 50px,
        color-mix(in srgb, #5858F5, transparent 50%) 60px,
        rgba(38, 38, 56, 0.9) 70px,
        transparent 80%
    );
}
</style>