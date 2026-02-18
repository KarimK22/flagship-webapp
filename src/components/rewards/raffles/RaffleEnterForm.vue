<template>
  <!-- Upsell Modal -->
  <RaffleUpsellModal
    v-model="showUpsellModal"
    :raffle-id="raffle.id"
    :ticket-count="testTicketCount"
    :initial-user-tickets="upsellInitialUserTickets"
    :initial-state="testInitialState"
    @boost-accepted="handleBoostAccepted"
    @boost-declined="handleBoostDeclined"
  />

  <div
    class="flex flex-col justify-end z-20 relative"
    :class="{ 'min-h-[174px]': enterStatus }"
  >
    <Transition name="fade" mode="out-in" appear>
      <RaffleEnterStatus
        v-if="enterStatus && !elementOnly"
        :status="enterStatus"
        :ticket-price="raffle.ticketPrice"
        :can-get-extra="canGetMoreTickets"
        :max-per-user="raffle.maxTicketsPerUser || undefined"
        :user-entries="userTicketsCount"
        :extra-tickets-count="extraTicketsCount"
        class="transition-all duration-300 absolute bottom-0"
        @share="shareOnX"
        @timer-complete="resetForm"
        @get-extra-tickets="emit('getExtraTickets')"
      />
    </Transition>
    <div
      class="mx-2"
      :class="{ 'opacity-0 -z-10 hidden': enterStatus && !elementOnly }"
    >
      <!--  Questions  -->
      <TransitionGroup name="list" tag="div" appear>
        <BaseInput
          v-for="questions in raffle.metadata.participationQuestions"
          :key="questions.question"
          v-model="answers[questions.question]"
          :label="questions.question"
          :required="true"
          :type="
            questions.validations.some((v) => v.type === 'email')
              ? 'email'
              : 'text'
          "
          class="w-full flex-1 mb-4 transition-all duration-300"
          :placeholder="t('common.typeHere')"
        />
      </TransitionGroup>

      <!--  Description  -->
      <div
        class="text-base leading-5 font-semibold -tracking-[0.64px] text-light1 mb-2 transition-opacity duration-300"
      >
        <span class="mr-1">{{ raffle.description }}</span>
        <BalanceBadge
          v-if="raffle.ticketPrice > 0 && !elementOnly"
          color="#FF7847"
          class="w-auto inline-flex"
        >
          <template #icon>
            <InlineSvg :src="powerIcon" width="24" height="24" unique-ids />
          </template>
          <span
            >{{ t('common.youHave') }}
            {{ formatNumberToUS(totalPowerMiles) }}</span
          >
        </BalanceBadge>
      </div>

      <!-- Ticket Amount Input -->
      <Transition name="slide-fade" appear>
        <RaffleEnterInput
          v-if="raffle.ticketPrice > 0 && !elementOnly && !simpleRaffle"
          v-model="amount"
          :max-tickets="max"
          class="transition-all duration-300"
        />
      </Transition>

      <!--  Buy Button  -->
      <div class="px-3 mt-8">
        <GlowButton
          v-if="elementOnly"
          :color="EButtonColor.BLUE"
          class="mb-6 w-full flex-1 flex items-center justify-center gap-1 leading-6 text-[#FF9D5C] transition-all duration-300 hover:scale-[1.02]"
          @click="goToHome"
        >
          <span>{{ $t('components.raffleEnterForm.unlockElement') }}</span>
        </GlowButton>
        <GlowButton
          v-else
          :color="EButtonColor.ORANGE"
          class="mb-6 w-full flex-1 flex items-center justify-center gap-1 leading-6 text-[#FF9D5C] transition-all duration-300 hover:scale-[1.02]"
          :loading="buyLoader"
          @click="handleEnter"
        >
          <span v-if="raffle.ticketPrice === 0">{{
            $t('components.raffleEnterForm.enterNow')
          }}</span>
          <div v-else class="flex items-center justify-center gap-1 z-10">
            <span v-if="simpleRaffle">{{
              $t('components.raffleEnterForm.enterFor', {
                amount: formatNumberToUS(amount * raffle.ticketPrice),
              })
            }}</span>
            <span v-else>{{
              $t('components.raffleEnterForm.buyFor', {
                amount: formatNumberToUS(amount * raffle.ticketPrice),
              })
            }}</span>
            <InlineSvg :src="powerIcon" class="size-6" unique-ids />
          </div>
        </GlowButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import powerIcon from '@/assets/images/game/power.svg'
import InlineSvg from 'vue-inline-svg'
import BalanceBadge from '@/components/user-balance/BalanceBadge.vue'
import api, { type Raffle, type RaffleStatus } from '@/services/api.ts'
import { prefilledRaffle, useRaffles } from '@/composables/raffles.ts'
import { computed, onMounted, ref, watch } from 'vue'
import { BaseInput } from '@/components/ui/input'
import RaffleEnterInput from './RaffleEnterInput.vue'
import RaffleEnterStatus from './RaffleEnterStatus.vue'
import { useStakes } from '@/composables/contracts/stakes.ts'
import { formatNumberToUS } from '@/composables/helpers.ts'
import { tweets } from '@/const/tweets.ts'
import { useGetMe } from '@/composables/get-me.ts'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button.ts'
import { useRouter } from 'vue-router'
import { LingoRouteName } from '@/router/routes.ts'
import mixpanel from 'mixpanel-browser'
import { useUpdateEmail } from '@/composables/update-email.ts'
import { LOCK_DURATION_ID } from '@/types/staking'
import { useTranslation } from '@/composables/use-i18n'
import RaffleUpsellModal from './RaffleUpsellModal.vue'

const props = withDefaults(
  defineProps<{
    raffle: Raffle
    myRaffleStatus?: RaffleStatus
  }>(),
  {
    modelValue: false,
    myRaffleStatus: undefined,
  }
)

const emit = defineEmits<{
  (
    e: 'enter',
    data: {
      userEntered: boolean
      isEligibleForStakeGrant: boolean
      timestamp: number
    }
  ): void
  (e: 'getExtraTickets'): void
}>()

const { totalPowerMiles } = useStakes()
const { currentEmail, validateEmail, updateEmail } = useUpdateEmail()
const { t } = useTranslation()

const amount = ref<number>(1)
// Using string | number type to handle both string and number inputs
const answers = ref<Record<string, string | number>>({})

const enterStatus = ref<
  | 'success'
  | 'error'
  | 'insufficient'
  | 'maxEntries'
  | 'maxPerUser'
  | 'invalidCode'
  | 'invalidEmail'
  | null
>(null)

// Upsell modal state
const showUpsellModal = ref(false)
const testTicketCount = ref(10)
const testInitialState = ref<
  'idle' | 'processing' | 'loading' | 'success' | 'error'
>('idle')
const hasHandledBoostResult = ref(false)
const pendingEmitData = ref<{
  userEntered: boolean
  isEligibleForStakeGrant: boolean
  timestamp: number
} | null>(null)
const celebrityRaffle = computed(() => props.raffle.ticketPrice === 0)
const extraTicketsConfig = computed(
  () => props.raffle.metadata.extraTickets || {}
)
const extraTicketsCanRepeat = computed(
  () => extraTicketsConfig.value.onStake?.canRepeat || false
)
const extraTicketsCount = computed(
  () =>
    extraTicketsConfig.value.onStake?.ticketsCountByDuration?.[
      LOCK_DURATION_ID.TWELVE_MONTHS
    ] || 0
)

// Initialize enterStatus based on conditions
if (props.raffle.maxTicketsPerUser === props.myRaffleStatus?.ticketsCount) {
  enterStatus.value = 'maxEntries'
} else if (
  props.raffle.ticketPrice > 0 &&
  totalPowerMiles.value < props.raffle.ticketPrice
) {
  enterStatus.value = 'insufficient'
}

const buyLoader = ref<boolean>(false)

const simpleRaffle = computed(() => {
  return (
    props.raffle.maxTicketsPerUser &&
    props.raffle.maxTicketsPerUser == 1 &&
    props.raffle.ticketPrice > 0
  )
})

const max = computed(() => {
  return Math.floor(Number(totalPowerMiles.value) / props.raffle.ticketPrice)
})

const { buyRaffles, refetchMyRafflesStatus, refetchRaffles } = useRaffles()
const { refetchMyStakes } = useStakes()

const handleEnter = async () => {
  try {
    buyLoader.value = true

    if (
      props.raffle.maxTicketsPerUser &&
      amount.value > props.raffle.maxTicketsPerUser
    ) {
      enterStatus.value = 'maxPerUser'
      return
    }
    // Validate email fields
    for (const question of props.raffle.metadata.participationQuestions) {
      if (question.validations.some((v) => v.type === 'email')) {
        const email = answers.value[question.question] as string
        if (!validateEmail(String(email))) {
          enterStatus.value = 'invalidEmail'
          return
        } else {
          if (!currentEmail || currentEmail !== email) {
            await updateEmail(email)
          }
        }
      }
    }

    const requiredPowerMiles = amount.value * props.raffle.ticketPrice
    if (requiredPowerMiles > Number(totalPowerMiles.value)) {
      enterStatus.value = 'error'
      return
    }
    if (celebrityRaffle.value) {
      amount.value = props.raffle.maxTicketsPerUser || 1
    }

    // Ensure all answers are strings before sending
    const stringAnswers: Record<string, string> = {}
    Object.entries(answers.value).forEach(([key, value]) => {
      stringAnswers[key] = String(value)
    })
    const timestamp = Date.now()
    const buyResponse = await buyRaffles(
      props.raffle.id,
      amount.value,
      stringAnswers
    )
    if (buyResponse.success) {
      mixpanel.track('Raffle Ticket Purchased', {
        raffleId: props.raffle.id,
        qty: amount.value,
      })

      await refetchMyStakes()
      await refetchMyRafflesStatus()
      await refetchRaffles()

      // Check and show upsell modal BEFORE emitting and showing success status
      let shouldShowUpsellModal = false
      try {
        console.log(
          '[RAFFLE-UPSELL] Checking boost offer for raffle:',
          props.raffle.id
        )
        const boostOffer = await api.getBoostOffer({
          raffleId: props.raffle.id,
        })
        console.log('[RAFFLE-UPSELL] Boost offer response:', boostOffer)

        // Check if offer is available and valid
        const isAvailable =
          boostOffer &&
          boostOffer.pricePerTicketUsd > 0 &&
          boostOffer.acceptedTokens &&
          boostOffer.acceptedTokens.length > 0 &&
          boostOffer.treasureWalletAddress

        console.log('[RAFFLE-UPSELL] Is available:', isAvailable, {
          pricePerTicketUsd: boostOffer?.pricePerTicketUsd,
          currentTickets: boostOffer?.currentTickets,
          hasTokens: boostOffer?.acceptedTokens?.length > 0,
          hasTreasureWallet: !!boostOffer?.treasureWalletAddress,
        })

        if (isAvailable) {
          console.log(
            '[RAFFLE-UPSELL] Opening upsell modal with purchased tickets:',
            amount.value
          )
          // Reset boost result handler flag for a new modal session
          hasHandledBoostResult.value = false
          testTicketCount.value = amount.value
          testInitialState.value = 'idle'
          showUpsellModal.value = true
          shouldShowUpsellModal = true
        } else {
          console.log('[RAFFLE-UPSELL] Boost not available or invalid offer')
        }
      } catch (error) {
        console.error('[RAFFLE-UPSELL] Failed to check boost offer:', error)
      }

      // If upsell modal is shown, delay the emit and success status
      // until after the modal is closed (handled in boost handlers)
      if (!shouldShowUpsellModal) {
        emit('enter', {
          userEntered: true,
          isEligibleForStakeGrant: buyResponse.isEligibleForStakeGrant,
          timestamp,
        })
        enterStatus.value = 'success'
      } else {
        // Store the data to emit later when modal closes
        pendingEmitData.value = {
          userEntered: true,
          isEligibleForStakeGrant: buyResponse.isEligibleForStakeGrant,
          timestamp,
        }
      }

      setTimeout(() => {
        if (celebrityRaffle.value) {
          emit('getExtraTickets')
        }
      }, 2000)
    } else {
      if (buyResponse.errorCode === 'invalidCode') {
        enterStatus.value = 'invalidCode'
      } else if (
        buyResponse.error ===
        'You have reached the maximum allowed tickets count'
      ) {
        enterStatus.value = 'maxEntries'
      } else {
        enterStatus.value = 'error'
      }
    }
  } catch (error) {
    enterStatus.value = 'error'
    console.error('Failed to enter raffle:', error)
  } finally {
    buyLoader.value = false
  }
}

const resetForm = () => {
  enterStatus.value = null
}
const { referralCode } = useGetMe()
function shareOnX() {
  mixpanel.track('Share On X Started', {
    entryPoint: 'raffleEnter',
  })
  const randomTweet =
    tweets.raffleEntered[
      Math.floor(Math.random() * tweets.raffleEntered.length)
    ]
  const urlWithReferral = `app.lingocoin.io/rewards?ref=${referralCode.value}`
  const tweet = randomTweet
    .replace('[reward]', props.raffle.prizes[0].name)
    .replace('app.lingocoin.io/rewards', urlWithReferral)
  const tweetText = encodeURIComponent(tweet).replace(/%20/g, '+')
  window.open(`https://x.com/intent/post?text=${tweetText}`, '_blank')
}

const elementOnly = computed(
  () => props.raffle.hasElement && props.raffle.maxTicketsPerUser === 0
)

const router = useRouter()
function goToHome() {
  router.push({ name: LingoRouteName.HOME })
}

const canGetMoreTickets = computed(() => {
  const canGetExtraTickets =
    props.myRaffleStatus?.extraTicketsCount === 0 || extraTicketsCanRepeat.value
  if (extraTicketsConfig.value.onStake && canGetExtraTickets) return true
  return false
})

onMounted(() => {
  if (
    prefilledRaffle.value.raffleId === props.raffle.id &&
    props.raffle?.metadata?.participationQuestions.length
  ) {
    answers.value[props.raffle.metadata.participationQuestions[0].question] =
      prefilledRaffle.value.raffleCode
  }
  // Pre-fill email fields with user's stored email
  if (currentEmail) {
    props.raffle.metadata.participationQuestions.forEach((question) => {
      if (question.validations.some((v) => v.type === 'email')) {
        answers.value[question.question] = currentEmail || ''
      }
    })
  }
})

const userTicketsCount = computed(() => {
  if (!props.myRaffleStatus) return 0
  return (
    props.myRaffleStatus.ticketsCount + props.myRaffleStatus.extraTicketsCount
  )
})

// Ticket count to show in upsell modal. Use current count from API (already includes the purchase we just made).
const upsellInitialUserTickets = computed(() => userTicketsCount.value)

// Treat closing the upsell modal via the close button / backdrop
// the same as explicitly declining the boost, so that we still
// emit the pending enter event and show the success status.
watch(
  () => showUpsellModal.value,
  (newVal, oldVal) => {
    if (
      !newVal &&
      oldVal &&
      pendingEmitData.value &&
      !hasHandledBoostResult.value
    ) {
      handleBoostDeclined()
    }
  }
)

watch(
  userTicketsCount,
  (newVal) => {
    const maxTicketsPerUser = props.raffle.maxTicketsPerUser || 0

    if (newVal >= maxTicketsPerUser) {
      if (extraTicketsCount.value && extraTicketsCanRepeat.value) {
        enterStatus.value = 'maxEntries'
      }
    }
  },
  { immediate: true }
)

// Upsell modal event handlers
async function handleBoostAccepted(data: {
  ticketCount: number
  multipliedTickets: number
  price: number
  txHash?: string
  boostId?: string
}) {
  console.log('Boost accepted:', data)

  // Mark that we've already handled the boost result for
  // this modal session so the close watcher doesn't fire again.
  hasHandledBoostResult.value = true

  // Log transaction details
  if (data.txHash) {
    console.log('Boost transaction hash:', data.txHash)
  }
  if (data.boostId) {
    console.log('Boost ID:', data.boostId)
  }

  // Track in analytics
  mixpanel.track('Raffle Boost Purchased', {
    raffleId: props.raffle.id,
    ticketCount: data.ticketCount,
    multipliedTickets: data.multipliedTickets,
    price: data.price,
    txHash: data.txHash,
  })

  // Refresh raffle data so the success screen and card show updated ticket count
  await refetchMyRafflesStatus()
  await refetchRaffles()

  // Emit pending data if exists (for staking popup flow)
  if (pendingEmitData.value) {
    emit('enter', pendingEmitData.value)
    pendingEmitData.value = null
  }

  // Show success status after boost purchase (counts are now up to date)
  enterStatus.value = 'success'
}

function handleBoostDeclined() {
  console.log('Boost declined')

  // Mark that we've already handled the boost result for
  // this modal session so the close watcher doesn't fire again.
  hasHandledBoostResult.value = true

  // Track in analytics
  mixpanel.track('Raffle Boost Declined', {
    raffleId: props.raffle.id,
    ticketCount: testTicketCount.value,
  })

  // Emit pending data if exists (for staking popup flow)
  if (pendingEmitData.value) {
    emit('enter', pendingEmitData.value)
    pendingEmitData.value = null
  }

  // Show success status after declining boost
  enterStatus.value = 'success'
}
</script>

<style scoped>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* List transition for form fields */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.list-move {
  transition: transform 0.3s ease;
}

/* Slide fade transition */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* Fix for the type error in v-model */
:deep(.base-input) input {
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

:deep(.base-input:focus-within) input {
  box-shadow: 0 0 0 2px rgba(255, 120, 71, 0.3);
}

/* Button hover effect */
button {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

button:active {
  transform: scale(0.98);
}
</style>
