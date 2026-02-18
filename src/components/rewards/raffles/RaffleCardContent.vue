<template>
  <div class="relative z-10 flex flex-col h-full bg-contain bg-center bg-no-repeat transition-all duration-300 ease-in-out min-h-[416px]">
    <!-- BaseHeader Section -->
    <div class="flex base-header items-center gap-2 mt-4 mx-2 transition-transform duration-300 ease-in-out">
      <div class="bg-purple-gray text-lavender text-sm leading-6 font-semibold rounded-[80px] px-2 whitespace-nowrap transition-all duration-300">
        <span><span class="mr-1 duration-200">{{ formatNumberToUS(raffle.metadata.participantsCount) }}</span>{{ t('common.participants') }}</span>
      </div>
      <div
        v-if="isFuture(raffle)"
        class="text-purple-gray text-xl leading-8 -tracking-[0.6px] transition-all duration-300"
      >
        {{ t('common.opensIn') }} <span class="transition-all duration-200">{{ timeLeft }}</span>
      </div>
      <div
        v-else
        class="text-purple-gray text-[18px] leading-8 -tracking-[0.6px] transition-all duration-300"
      >
        {{ t('common.endsIn') }} <span class="transition-all duration-200">{{ timeLeft }}</span>
      </div>
    </div>
    <!-- Title Section -->
    <div class="mb-8 mx-2 transition-all duration-500 ease-out title-section">
      <h1 class="text-5xl leading-10 font-medium -tracking-[2.4px] transition-all duration-300">
        <span
          v-if="raffle.title"
          class="transition-opacity duration-300"
        >
          {{ raffle.title.split(' ').slice(0, -1).join(' ') }}
          <span class="whitespace-nowrap transition-all duration-300">
            {{ raffle.title.split(' ').slice(-1)[0].trim() }}
            <span class="inline-flex bg-sosiska/[88%] backdrop-blur-[2px] px-2 py-1 ml-1 rounded-[80px] h-10 min-w-[47px] text-xl leading-8 -tracking-[1px] align-top transition-all duration-300 hover:scale-105">
              <span class="mx-auto font-normal transition-transform duration-200">X{{ totalPrizesCount }}</span>
            </span>
          </span>
        </span>
      </h1>
      <!--		Share Section-->
      <IconButtonWrapper
        v-if="showShare"
        class="mt-2"
        :src="linkGradientIcon"
        :text-on-hover="t('common.copyLink')"
        :text-on-click="t('common.copied')"
        @click="copyRaffleLink"
      />
    </div>

    <!-- Stats Section -->
    <Transition
      name="fade"
      appear
    >
      <RaffleCardStats
        v-if="accountAddress && !hideStats"
        class="flex-1 mt-auto"
        :tickets-count="userTicketsCount"
        :total-tickets-count="raffle.metadata.ticketsCount"
        :currency-icon="currencyIcon"
        :class="[statsClass, 'transition-all duration-300']"
      />
    </Transition>
  </div>
</template>
<script setup lang="ts">
import RaffleCardStats from '@/components/rewards/raffles/RaffleCardStats.vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { Raffle, RaffleStatus } from '@/services/api.ts'
import elementIcon from '@/assets/icons/element-icon.svg'
import powerIcon from '@/assets/images/game/power.svg'
import { formatNumberToUS } from '@/composables/helpers.ts'
import linkGradientIcon from '@/assets/icons/gradient-link.svg'
import IconButtonWrapper from '@/components/IconButtonWrapper.vue'
import { useGetMyReferrals } from '@/composables/get-my-referrals.ts'
import { useRaffles } from '@/composables/raffles.ts'
import { useGetMe } from '@/composables/get-me'
import { useTranslation } from '@/composables/use-i18n'

const { t } = useTranslation()

const props = withDefaults(defineProps<{
    raffle: Raffle
    myRaffleStatus?: RaffleStatus
    statsClass?: string
		showShare?: boolean
    hideStats?: boolean
}>(), {
  myRaffleStatus: undefined,
  statsClass: '',
  showShare: false,
  hideStats: false,
})

const { isFuture } = useRaffles()

const { accountAddress } = useGetMe()

const timeLeft = ref('')
const interval = ref<NodeJS.Timeout>()

const updateTimeLeft = () => {
  const now = new Date()
  const targetDate = isFuture(props.raffle) ? new Date(props.raffle.startDate) : new Date(props.raffle.endDate)
  const diff = targetDate.getTime() - now.getTime()

  if (diff <= 0) {
    timeLeft.value = t('common.ended')
    if (interval.value) {
      clearInterval(interval.value)
    }
    return
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) {
    timeLeft.value = `${days}d ${hours}h`
  } else if (hours > 0) {
    timeLeft.value = `${hours}h ${minutes}m`
  } else {
    timeLeft.value = `${minutes}m`
  }
}

onMounted(() => {
  updateTimeLeft()
  interval.value = setInterval(updateTimeLeft, 1000)
})

onUnmounted(() => {
  if (interval.value) {
    clearInterval(interval.value)
  }
})

const totalPrizesCount = computed(() => {
  return props.raffle.prizes
    .filter(prize => prize.isBigPrize)
    .reduce((acc, prize) => acc + prize.count, 0)
})

const currencyIcon = computed(() => {
  if (!props.raffle.hasElement) {
    return powerIcon
  } else {
    return props.raffle.maxTicketsPerUser === 0 ? elementIcon : ''
  }
})

const userTicketsCount = computed(() => {
  if (!props.myRaffleStatus) return 0
  return props.myRaffleStatus.ticketsCount + props.myRaffleStatus.extraTicketsCount
})

const { data } = useGetMyReferrals()

const copyRaffleLink = () => {
  navigator.clipboard.writeText(window.location.origin + '/rewards?tab=raffle&raffleId=' + props.raffle.id + '&ref=' + data.value.referralCode)
}
</script>

<style scoped>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Hover effects */
.bg-purple-gray {
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.bg-purple-gray:hover {
  background-color: rgba(var(--color-purple-gray-rgb), 0.9);
}

/* Card content transitions */
:deep(.raffle-card-stats) {
  transition: all 0.3s ease-in-out;
}

/* Add subtle animation for the entire card on hover */
@keyframes subtle-pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.005);
  }
  100% {
    transform: scale(1);
  }
}

.relative:hover {
  animation: subtle-pulse 2s infinite ease-in-out;
}
</style>