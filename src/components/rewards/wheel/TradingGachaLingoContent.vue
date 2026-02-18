<template>
  <div class="flex flex-col gap-2 mt-auto mb-2">
    <!-- Header (same design rules as Physical/Voucher) -->
    <div
      v-if="!txHash"
      class="flex flex-col justify-end min-h-[58px]"
    >
      <p
        class="text-base font-semibold text-lavender tracking-[0.16px]"
      >
        {{ statusTitle }}
      </p>
      <div class="text-purple-gray text-sm leading-6 font-semibold tracking-[0.42px]">
        {{ statusBody }}
      </div>
    </div>

    <div
      v-else
      class="flex flex-col justify-end min-h-[58px]"
    >
      <div class="flex items-center gap-1.5 ml-0.5 text-xl leading-8">
        <span>🎉</span>
        <div class="text-purple-gray text-xl leading-8 -tracking-[0.6px] select-none">
          {{ t('rewards.tradingGacha.transactionConfirmed') }}
        </div>
      </div>

      <p class="text-sm leading-6 font-semibold tracking-[0.42px] text-lavender break-all">
        {{ t('rewards.tradingGacha.hash') }}:
        {{ txHash }}
      </p>

      <GlowButton
        :color="EButtonColor.BLUE"
        variant="lightinBlue"
        class="mt-3 w-fit px-4"
        @click="openExplorer"
      >
        {{ t('rewards.tradingGacha.viewOnExplorer') }}
      </GlowButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import api from '@/services/api'
import { useTranslation } from '@/composables/use-i18n'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button.ts'

const props = defineProps<{
  id: string,
  source: 'trading' | 'staking' | 'tiered'
}>()

const txHash = ref<string | null>(null)
const { t } = useTranslation()
const pollTimer = ref<number | null>(null)
const pollAttempts = ref(0)
const pollErrorAttempts = ref(0)
const pollState = ref<'pending' | 'timeout' | 'error'>('pending')
const MAX_POLL_ATTEMPTS = 8
const MAX_ERROR_RETRIES = 3
const HISTORY_LIMIT = 200
const BASE_POLL_DELAY_MS = 2500
const ERROR_POLL_DELAY_MS = 4000

function openExplorer() {
  if (!txHash.value) return
  window.open(`https://basescan.org/tx/${txHash.value}`, '_blank')
}

function stopPolling() {
  if (pollTimer.value) {
    clearTimeout(pollTimer.value)
    pollTimer.value = null
  }
}

const statusTitle = computed(() => {
  if (pollState.value === 'timeout') return t('rewards.tradingGacha.transactionDelayed')
  if (pollState.value === 'error') return t('rewards.tradingGacha.transactionError')
  return t('rewards.tradingGacha.transactionProcessing')
})

const statusBody = computed(() => {
  if (pollState.value === 'timeout') return t('rewards.tradingGacha.transactionDelayedBody')
  if (pollState.value === 'error') return t('rewards.tradingGacha.transactionErrorBody')
  return `${t('rewards.tradingGacha.pleaseWait')}…`
})

function scheduleNextPoll(delayMs = BASE_POLL_DELAY_MS) {
  pollTimer.value = window.setTimeout(() => {
    pollTx()
  }, delayMs)
}

async function pollTx() {
  if (!props.id) {
    pollState.value = 'error'
    stopPolling()
    return
  }

  if (pollAttempts.value >= MAX_POLL_ATTEMPTS) {
    console.warn('Max polling attempts reached for pullId:', props.id)
    pollState.value = 'timeout'
    stopPolling()
    return
  }

  pollAttempts.value++

  try {
    const history =
      props.source === 'trading'
        ? await api.getTradingGachaPullsHistory({ limit: HISTORY_LIMIT, offset: 0 })
        : props.source === 'tiered'
          ? await api.getTieredStakingWheelSpinsHistory({ limit: HISTORY_LIMIT, offset: 0 })
          : await api.getStakingWheelSpinsHistory({ limit: HISTORY_LIMIT, offset: 0 })

    const found = history.items.find((i: { id: string; txHash?: string | null }) => i.id === props.id)

    if (found?.txHash) {
      txHash.value = found.txHash
      stopPolling()
      return
    }

    pollErrorAttempts.value = 0
    scheduleNextPoll()
  } catch (error) {
    console.error('Error polling tx:', error)
    pollErrorAttempts.value += 1
    if (pollErrorAttempts.value >= MAX_ERROR_RETRIES) {
      pollState.value = 'error'
      stopPolling()
      return
    }
    scheduleNextPoll(ERROR_POLL_DELAY_MS)
  }
}

function startPolling() {
  stopPolling()
  pollAttempts.value = 0
  pollErrorAttempts.value = 0
  pollState.value = 'pending'
  txHash.value = null
  if (!props.id) {
    pollState.value = 'error'
    return
  }
  pollTx()
}

watch(
  () => [props.id, props.source],
  () => startPolling(),
  { immediate: true },
)

onUnmounted(() => {
  stopPolling()
})
</script>
