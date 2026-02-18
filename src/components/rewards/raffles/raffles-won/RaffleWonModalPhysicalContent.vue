<template>
  <div class="flex flex-col gap-2 mt-auto mb-2">
    <div class="flex items-center justify-between">
      <p
        v-if="!rafflesSubmittedSuccessfully"
        class="text-base font-semibold text-lavender tracking-[0.16px]"
      >
        {{ $t('components.raffleWonModalPhysicalContent.submitEmailToClaim') }}
      </p>
      <RaffleWinners
        v-if="!hideWinnersButton"
        class="ml-auto"
        @click="emit('showAllWinners')"
      />
    </div>
    <div
      v-if="rafflesSubmittedSuccessfully === null"
      class="flex items-center justify-end gap-1 min-h-[58px]"
    >
      <BaseInput
        v-model="userEmail"
        type="email"
        class="w-full flex-1"
        :placeholder="$t('components.raffleWonModalPhysicalContent.enterYourEmail')"
      />
      <GlowButton
        :color="EButtonColor.BLUE"
        variant="lightinBlue"
        class="select-none"
        @click="handleClaim"
      >
        {{ $t('components.raffleWonModalPhysicalContent.claim') }}
      </GlowButton>
    </div>
    <div
      v-else
      class="flex flex-col justify-end min-h-[58px]"
    >
      <div
        v-if="rafflesSubmittedSuccessfully"
        class="flex items-center gap-1.5 ml-0.5 text-xl leading-8"
      >
        <span>🥳</span>
        <div class="text-purple-gray text-xl leading-8 -tracking-[0.6px] select-none">
          {{ $t('components.raffleWonModalPhysicalContent.congratulations') }}
        </div>
      </div>
      <p class="text-sm leading-6 font-semibold tracking-[0.42px] text-lavender">
        {{ raffleSubmitMessage }}
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">

import { unclaimedRaffleStatusCopy, useRaffles } from '@/composables/raffles.ts'
import { ref } from 'vue'
import type { RaffleStatus } from '@/services/api.ts'
import { BaseInput } from '@/components/ui/input'
import RaffleWinners from '@/components/rewards/raffles/raffles-won/RaffleWinners.vue'
import { EButtonColor } from '@/types/shared/button.ts'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { useGetMe } from '@/composables/get-me'
import { useUpdateEmail } from '@/composables/update-email.ts'
import { useTranslation } from '@/composables/use-i18n'

const props = defineProps<{
    raffleId: string
    prizeSubmittedData?: RaffleStatus['prizeSubmittedData']
    hideWinnersButton?: boolean
    doNotRequireClaim?: boolean
}>()

const emit = defineEmits<{
    (e: 'hide'): void
    (e: 'showAllWinners'): void
}>()

const { submitRafflePrizeData } = useRaffles()
const { meData } = useGetMe()
const { t } = useTranslation()
const userEmail = ref(meData.value?.email || '')
const showCongrats = ref(false)
const rafflesSubmittedSuccessfully = ref<boolean | null>(
  props.prizeSubmittedData?.email || meData.value?.email ? true : null,
)
const raffleSubmitMessage = ref<string | null>(
  props.prizeSubmittedData?.email || meData.value?.email ? t('components.raffleWonModalPhysicalContent.detailsEmailedSoon') : null,
)
const { updateEmail, currentEmail } = useUpdateEmail()
async function handleClaim () {
  try {
    if (!props.doNotRequireClaim) {
      await submitRafflePrizeData(props.raffleId, userEmail.value)
    }
    if (!currentEmail) {
      await updateEmail(userEmail.value)
    }
    rafflesSubmittedSuccessfully.value = true
    raffleSubmitMessage.value = t('components.raffleWonModalPhysicalContent.detailsEmailedSoon')
    showCongrats.value = true
    setTimeout(() => {
      emit('hide')
      unclaimedRaffleStatusCopy.value = null
    }, 2000)
  } catch (_e) {
    rafflesSubmittedSuccessfully.value = false
    raffleSubmitMessage.value = t('components.raffleWonModalPhysicalContent.somethingWentWrong')
  }
}
</script>