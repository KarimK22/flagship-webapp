<template>
  <div
    class="mx-auto bg-dark2 text-white p-4 rounded-2xl relative overflow-hidden w-[288px] h-[512px] flex flex-col bg-cover bg-center"
    :class="{ 'grayscale pointer-events-none': airdrop.isFinished, 'pointer-events-none [&>*]:grayscale': airdropDisabled }"
    :style="{ backgroundImage: `url(${airdropImage})` }"
  >
    <div class="flex items-center justify-between gap-2 mt-2 select-none">
      <div class="text-purple-gray text-xl leading-8 -tracking-[0.6px]">
        {{ t('common.dontMissOut') }}
      </div>
    </div>
    <h1 class="text-lavender text-[32px] font-medium leading-8 -tracking-[1.28px]">
      {{ props.airdrop.name }}
    </h1>
    <div class="mt-auto w-full flex flex-col">
      <div v-if="airdrop.prizeAmount">
        <p class="text-purple-gray text-xl font-normal leading-8 tracking-[-0.6px]">
          {{ airdrop.prizeName }}
        </p>
        <p class="text-lavender text-5xl font-medium leading-10 tracking-[-2.4px]">
          {{ airdrop.prizeAmount }}
        </p>
      </div>
      <BaseButton
        v-if="airdropDisabled || airdrop.isFinished"
        class="mt-6 mb-4 mx-3"
        variant="classic"
        size="classic"
        :disabled="true"
      >
        {{ airdrop.isFinished ? t('common.finished') : t('common.comingSoon') }}
      </BaseButton>
      <GlowButton
        v-else
        :color="EButtonColor.BLUE"
        class="mt-6 mb-4 mx-3"
        @click.stop="handleOpenAirdropCardModal()"
      >
        {{ t('common.checkEligibility') }}
      </GlowButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import backgroundImage from '@/assets/images/dummies/raffle-card-test.png'
import type { Airdrop } from '@/const/airdrops.ts'
import { DateTime } from 'luxon'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { BaseButton } from '@/components/ui/button'
import { EButtonColor } from '@/types/shared/button.ts'
import mixpanel from 'mixpanel-browser'
import { useAirdrops } from '@/composables/airdrops.ts'
import { useTranslation } from '@/composables/use-i18n'

const { t } = useTranslation()
const { clickedAirdrop, showAirdropCardModal } = useAirdrops()
const props = defineProps<{
    airdrop: Airdrop
}>()

const handleOpenAirdropCardModal = () => {
  clickedAirdrop.value = props.airdrop
  showAirdropCardModal.value = true
  mixpanel.track('Airdrop Details Popup View', {
    partner: props.airdrop.name,
  })
}

const airdropImage = computed(() => {
  return props.airdrop.imageUrl || backgroundImage
})

const airdropDisabled = computed(() => {
  return !props.airdrop.startDate || DateTime.now() < DateTime.fromISO(props.airdrop.startDate)
})

</script>

<style scoped>

</style>