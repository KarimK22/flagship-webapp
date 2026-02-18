<template>
  <BaseModal
    :model-value="modelValue"
    class="ticket-simulator-modal p-0 overflow-auto"
    @update:model-value="(val: boolean) => emit('update:modelValue', val)"
  >
    <div class="relative z-10 p-6 pt-8 flex flex-col gap-6">
      <!-- Header -->
      <div>
        <h2 class="text-2xl font-bold text-lavender -tracking-[0.96px]">
          Ticket Simulator
        </h2>
        <p class="text-sm text-purple-gray mt-1">
          See how many raffle tickets you can earn by staking LINGO
        </p>
      </div>

      <!-- LINGO Amount Section -->
      <div class="flex flex-col gap-3">
        <label class="text-sm font-semibold text-purple-gray uppercase tracking-wider">
          LINGO Amount
        </label>
        <!-- Input -->
        <div class="flex items-center gap-3 bg-background/60 border border-dark3/60 rounded-2xl px-4 py-3">
          <img
            :src="lingoIcon"
            alt="LINGO"
            class="w-8 h-8"
          >
          <input
            v-model.number="lingoAmount"
            type="number"
            min="100"
            class="bg-transparent text-2xl font-bold text-lavender outline-none flex-1 w-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="1000"
          >
          <span class="text-sm text-purple-gray whitespace-nowrap">
            ≈ ${{ usdValue }}
          </span>
        </div>
        <!-- Quick amounts -->
        <div class="flex gap-2">
          <button
            v-for="amount in quickAmounts"
            :key="amount"
            class="rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200"
            :class="lingoAmount === amount
              ? 'bg-sosiska text-lavender'
              : 'bg-background/40 text-purple-gray border border-dark3/40 hover:border-purple-gray/40'"
            @click="lingoAmount = amount"
          >
            {{ formatNumberToUS(amount) }}
          </button>
        </div>
      </div>

      <!-- Lock Duration Section -->
      <div class="flex flex-col gap-3">
        <label class="text-sm font-semibold text-purple-gray uppercase tracking-wider">
          Lock Duration
        </label>
        <div class="flex gap-2">
          <button
            v-for="duration in lockDurations"
            :key="duration.value"
            class="flex-1 rounded-full px-3 py-2.5 text-sm font-semibold transition-all duration-200"
            :class="selectedDuration === duration.value
              ? 'bg-sosiska text-lavender'
              : 'bg-background/40 text-purple-gray border border-dark3/40 hover:border-purple-gray/40'"
            @click="selectedDuration = duration.value"
          >
            {{ duration.label }}
          </button>
        </div>
      </div>

      <!-- Ticket Estimate Breakdown -->
      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold text-purple-gray uppercase tracking-wider mb-2">
          Your Ticket Estimate
        </label>

        <!-- Base tickets -->
        <div class="flex items-center gap-3 py-3 px-1 border-b border-dark3/30">
          <div class="w-10 h-10 rounded-xl bg-[#FF4D6A]/10 flex items-center justify-center flex-shrink-0">
            <InlineSvg
              :src="ticketIcon"
              unique-ids
              width="18"
              class="text-[#FF4D6A]"
            />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-lavender">
              Base tickets
            </p>
            <p class="text-xs text-purple-gray">
              $0.01 per ticket
            </p>
          </div>
          <span class="text-xl font-bold text-lavender tabular-nums">
            {{ formatNumberToUS(baseTickets) }}
          </span>
        </div>

        <!-- Bulk bonus -->
        <div class="flex items-center gap-3 py-3 px-1 border-b border-dark3/30">
          <div class="w-10 h-10 rounded-xl bg-[#FFB547]/10 flex items-center justify-center flex-shrink-0">
            <span class="text-lg">📦</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-lavender">
              Bulk bonus <span class="text-sosiska">+{{ bulkBonusPercent }}%</span>
            </p>
            <p class="text-xs text-purple-gray">
              {{ bulkTier }}
            </p>
          </div>
          <span class="text-xl font-bold text-lavender tabular-nums">
            {{ formatNumberToUS(afterBulkBonus) }}
          </span>
        </div>

        <!-- New User Bonus (greyed out - not applicable for existing users) -->
        <div class="flex items-center gap-3 py-3 px-1 border-b border-dark3/30 opacity-40">
          <div class="w-10 h-10 rounded-xl bg-sosiska/10 flex items-center justify-center flex-shrink-0">
            <span class="text-xs font-bold text-sosiska bg-sosiska/20 rounded px-1">NEW</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-lavender">
              New User Bonus
            </p>
            <p class="text-xs text-purple-gray">
              Available for first-time stakers
            </p>
          </div>
          <span class="text-xl font-bold text-lavender tabular-nums">
            {{ formatNumberToUS(afterBulkBonus) }}
          </span>
        </div>

        <!-- Lock Duration Bonus -->
        <div class="flex items-center gap-3 py-3 px-1 border-b border-dark3/30">
          <div class="w-10 h-10 rounded-xl bg-[#FF9D5C]/10 flex items-center justify-center flex-shrink-0">
            <span class="text-lg">🔒</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-lavender">
              Lock Duration Bonus <span class="text-sosiska">+{{ lockBonusPercent }}%</span>
            </p>
            <p class="text-xs text-purple-gray">
              {{ selectedDurationLabel }}
            </p>
          </div>
          <span class="text-xl font-bold text-lavender tabular-nums">
            {{ formatNumberToUS(afterLockBonus) }}
          </span>
        </div>

        <!-- Early Bird Bonus -->
        <div class="flex items-center gap-3 py-3 px-3 rounded-2xl bg-[#FFB547]/[0.06] border border-[#FFB547]/10">
          <div class="w-10 h-10 rounded-xl bg-[#FFB547]/10 flex items-center justify-center flex-shrink-0">
            <span class="text-lg">👋</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-lavender">
              Early Bird Bonus <span class="text-green-400">+25%</span>
            </p>
            <p class="text-xs text-purple-gray">
              First 3 stakers get +25%
            </p>
          </div>
          <span class="text-xl font-bold text-lavender tabular-nums">
            {{ formatNumberToUS(totalTickets) }}
          </span>
        </div>
      </div>

      <!-- Total Result -->
      <div class="bg-sosiska/[0.08] border border-sosiska/20 rounded-2xl px-6 py-4 flex items-center justify-center gap-3">
        <InlineSvg
          :src="ticketIcon"
          unique-ids
          width="28"
          class="text-[#FF4D6A]"
        />
        <span class="text-2xl font-bold text-lavender -tracking-[0.96px]">
          ~{{ formatNumberToUS(totalTickets) }} tickets
        </span>
      </div>

      <!-- View Referral Progress Button -->
      <GlowButton
        :color="EButtonColor.BLUE"
        class="w-full !h-12"
        @click="handleViewReferralProgress"
      >
        View Referral Progress
      </GlowButton>

      <!-- CTA Button -->
      <GlowButton
        :color="EButtonColor.BLUE"
        class="w-full !h-12"
        @click="handleBuyLingo"
      >
        Buy LINGO with credit card
      </GlowButton>

      <p class="text-center text-xs text-purple-gray -mt-3">
        You need {{ formatNumberToUS(lingoAmount) }} LINGO to stake this amount
      </p>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import InlineSvg from 'vue-inline-svg'
import ticketIcon from '@/assets/icons/ticket.svg'
import lingoIcon from '@/assets/images/lingo-icon.svg'
import { formatNumberToUS } from '@/composables/helpers'
import { useLingoPrice } from '@/composables/contracts/lingo-price'
import { LingoRouteName } from '@/router/routes'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const router = useRouter()
const { price } = useLingoPrice()

const lingoAmount = ref(1000)
const selectedDuration = ref(12)

const quickAmounts = [100, 500, 1000, 5000, 10000]
const lockDurations = [
  { value: 0, label: 'Flexible' },
  { value: 3, label: '3 Months' },
  { value: 6, label: '6 Months' },
  { value: 12, label: '12 Months' },
]

const usdValue = computed(() => {
  const p = price.value || 0.00785
  return (lingoAmount.value * p).toFixed(2)
})

const selectedDurationLabel = computed(() => {
  const d = lockDurations.find(d => d.value === selectedDuration.value)
  return d?.label || 'Flexible'
})

// Ticket calculation logic (mock — matches the design screenshot)
const baseTickets = computed(() => {
  // $0.01 per ticket, based on USD value
  const usd = parseFloat(usdValue.value)
  return Math.floor(usd / 0.01)
})

const bulkBonusPercent = computed(() => {
  const usd = parseFloat(usdValue.value)
  if (usd >= 50) return 200
  if (usd >= 25) return 150
  if (usd >= 10) return 125
  if (usd >= 5) return 100
  if (usd >= 1) return 50
  return 0
})

const bulkTier = computed(() => {
  const usd = parseFloat(usdValue.value)
  if (usd >= 50) return '$50+ tier'
  if (usd >= 25) return '$25+ tier'
  if (usd >= 10) return '$10+ tier'
  if (usd >= 5) return '$5+ tier'
  if (usd >= 1) return '$1+ tier'
  return 'Below minimum'
})

const afterBulkBonus = computed(() => {
  return Math.floor(baseTickets.value * (1 + bulkBonusPercent.value / 100))
})

const lockBonusPercent = computed(() => {
  if (selectedDuration.value >= 12) return 100
  if (selectedDuration.value >= 6) return 50
  if (selectedDuration.value >= 3) return 25
  return 0
})

const afterLockBonus = computed(() => {
  return Math.floor(afterBulkBonus.value * (1 + lockBonusPercent.value / 100))
})

const totalTickets = computed(() => {
  // Early bird +25%
  return Math.floor(afterLockBonus.value * 1.25)
})

const handleViewReferralProgress = () => {
  emit('update:modelValue', false)
  router.push({ name: LingoRouteName.REFERRALS })
}

const handleBuyLingo = () => {
  // TODO: integrate with actual buy flow
  window.open('https://app.lingocoin.io/staking', '_blank')
}
</script>

<style>
.ticket-simulator-modal.base-modal-content {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.ticket-simulator-modal.base-modal-content::-webkit-scrollbar {
  display: none;
}
</style>
