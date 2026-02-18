<template>
  <div
    class="w-[356px] rounded-2xl border border-white/10 bg-gray-900/50 p-4 backdrop-blur-sm overflow-hidden relative shadow-[-2px_-2px_10px_rgba(255,255,255,0.1)]"
  >
    <div>
      <div class="flex items-center gap-2 mb-2">
        <UserAvatar
          :wallet-address="walletAddress"
          class="size-8"
        />

        <span
          v-if="walletAddress"
          class="text-sm text-gray-400"
        >{{ transformedAddress }}</span>
      </div>

      <div class="flex items-center justify-between">
        <div>
          <p class="text-light1 text-3xl md:text-[40px] tracking-tighter-x1 leading-6 md:leading-[32px] max-w-[70%] line-clamp-2">
            {{ $t('components.claimCard.claimed') }} {{ prizeName }}
          </p>
        </div>
      </div>

      <p
        v-if="concludedAtFormatted"
        class="absolute top-5 z-20 right-4 text-sm font-semibold text-lavender px-2 py-1 bg-sosiska/45 backdrop-blur-[4px] rounded-4xl"
      >
        {{ concludedAtFormatted }}
      </p>
    </div>

    <img
      v-if="prizeImage"
      :src="prizeImage"
      :alt="prizeName"
      class="absolute top-0 right-0 block w-[40%] h-full object-cover"
      :style="{ maskImage: `linear-gradient(to right, transparent 0%, black 50%)` }"
    >
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import UserAvatar from '@/components/UserAvatar.vue'
import type { RecentClaim } from '@/services/api'
import { DateTime } from 'luxon'
import { formatWalletAddress } from '@/composables/helpers.ts'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps<RecentClaim>()

const concludedAtFormatted = computed(() => {
  if (!props.timestamp) return ''

  const timestamp = +props.timestamp

  const now = DateTime.now()
  const concludedAtDate = DateTime.fromSeconds(timestamp)
  const diffMinutes = Math.round(Math.abs(now.diff(concludedAtDate, 'minutes').minutes))
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 1) return t('components.claimCard.justNow')
  if (diffMinutes === 1) return t('components.claimCard.oneMinuteAgo')
  if (diffMinutes < 60) return t('components.claimCard.minutesAgo', { minutes: diffMinutes })
  if (diffHours === 1) return t('components.claimCard.oneHourAgo')
  if (diffHours < 24) return t('components.claimCard.hoursAgo', { hours: diffHours })
  if (diffDays === 1) return t('components.claimCard.oneDayAgo')
  return t('components.claimCard.daysAgo', { days: diffDays })
})
const transformedAddress = computed(() => formatWalletAddress(props.walletAddress || ''))
</script>
