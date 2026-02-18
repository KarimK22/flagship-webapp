<template>
  <BaseModal
    :model-value="modelValue"
    class="p-4 overflow-auto"
    @update:model-value="(val: boolean) => emit('update:modelValue', val)"
  >
    <div
      :style="{ backgroundImage: `url(${raffleImage})` }"
      class="absolute top-0 left-0 w-full h-full bg-contain bg-top bg-no-repeat z-1"
    />
    <div
      class="text-white rounded-2xl relative overflow-hidden flex flex-col w-full z-2"
    >
      <RaffleCardContent
        :raffle="raffle"
        :my-raffle-status="myRaffleStatus"
        :show-share="true"
        class="mb-4 flex-1 [&_.base-header,&_.title-section]:mx-0!"
        :hide-stats="requiredBadge"
      />
      <RaffleEnterForm
        v-if="!!accountAddress && !requiredBadge"
        :raffle="raffle"
        :my-raffle-status="myRaffleStatus"
        @enter="handleEnter"
        @get-extra-tickets="emit('openExtraTicketsModal')"
      />
      <div v-else>
        <BalanceBadge
          v-if="!requiredBadge"
          color="#5858F5"
          class="z-10 bg-sosiska/[24%] transition-all duration-300 w-auto mr-auto inline-flex mb-4"
        >
          {{ formatNumberToUS(raffle.metadata.ticketsCount) }} {{ $t('components.raffleEnterModal.entries') }}
        </BalanceBadge>
        <div class="text-base leading-5 font-semibold -tracking-[0.64px] text-light1 mb-4 transition-opacity duration-300">
          <span class="mr-1">{{ raffle.description }}</span>
        </div>
        <div class="flex flex-col justify-center items-center">
          <RequireBadgeBlock
            v-if="requiredBadge && accountAddress"
            :required-badge="raffle.metadata.requires?.badgeId || 0"
          />
          <GlowButton
            v-else
            :color="EButtonColor.BLUE"
            class="w-full"
            @click.stop.prevent="connect"
          >
            {{ $t('components.raffleEnterModal.logInToEnter') }}
          </GlowButton>
        </div>
      </div>
    </div>
  </BaseModal>
</template>
<script setup lang="ts">
import type { Raffle, RaffleStatus } from '@/services/api.ts'
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import RaffleCardContent from '@/components/rewards/raffles/RaffleCardContent.vue'
import RaffleEnterForm from '@/components/rewards/raffles/RaffleEnterForm.vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button.ts'
import { computed, ref, watch } from 'vue'
import backgroundImage from '@/assets/images/dummies/raffle-card-test.png'
import { formatNumberToUS } from '@/composables/helpers.ts'
import BalanceBadge from '@/components/user-balance/BalanceBadge.vue'
import { useEmailModal } from '@/composables/use-email-modal'
import mixpanel from 'mixpanel-browser'
import { useStakes } from '@/composables/contracts/stakes'
import { useGetMe } from '@/composables/get-me'
import { useWalletConnect } from '@/composables/wallet/use-wallet-connect'
import RequireBadgeBlock from './RequireBadgeBlock.vue'
import { useMyBadges } from '@/composables/my-badges'
import { useUpsellModals } from '@/composables/upsell-modals'
import { DateTime } from 'luxon'

const { showFreePowerMilesPromoModal, freePowerMilesPromoVariant, freePowerMilesPromoEndDate } = useUpsellModals()
const { totalPowerMiles } = useStakes()
const { badges } = useMyBadges()
const props = withDefaults(defineProps<{
  modelValue: boolean
  raffle: Raffle
  myRaffleStatus?: RaffleStatus
}>(), {
  modelValue: false,
  myRaffleStatus: undefined,
})

const requiredBadge = computed(() => {
  const requiredBadgeId = props.raffle.metadata.requires?.badgeId || 0

  if (!requiredBadgeId) return false
  const badge = badges.value.find((badge) => badge.id === requiredBadgeId)
  return !badge?.isClaimed
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'openExtraTicketsModal'): void
}>()

const { connect } = useWalletConnect()
const { showEmailModal } = useEmailModal()

function handleEnter(data: {
  userEntered: boolean
  isEligibleForStakeGrant: boolean
  timestamp: number
}) {
  result.value = data
}

const result = ref({
  userEntered: false,
  isEligibleForStakeGrant: false,
  timestamp: 0,
})

watch(result, (val) => {
  if (val.isEligibleForStakeGrant) {
    setTimeout(() => {
      emit('update:modelValue', false)
      showFreePowerMilesPromoModal.value = true
      freePowerMilesPromoVariant.value = 'grant_power_miles'
      freePowerMilesPromoEndDate.value = DateTime.fromMillis(val.timestamp).plus({ minutes: 10 })
    }, 2000)
  }
})

const { accountAddress } = useGetMe()

const raffleImage = computed(() => {
  return props.raffle.imageUrl || backgroundImage
})
const celebrityRaffle = computed(() => props.raffle.ticketPrice === 0)
watch(() => props.modelValue, (val) => {
  if (!val && result.value.userEntered) {
    if (celebrityRaffle.value) {
      // emit('openExtraTicketsModal')
    } else {
      showEmailModal()
    }
    result.value.userEntered = false
  } else {
    mixpanel.track('Raffle Popup View', {
      raffleId: props.raffle.id,
      powerBalance: totalPowerMiles.value,
    })
  }
})
</script>
<style scoped></style>