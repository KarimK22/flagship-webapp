<template>
  <BaseModal
    :model-value="showFreePowerMilesPromoModal"
    :style="{
      'background-image': `url(${config.bg})`,
    }"
    class="bg-cover bg-center bg-no-repeat flex flex-col justify-between gap-0 px-4 py-8 pb-6 min-h-[540px] md:min-h-[640px] !rounded-2xl"
    @update:model-value="updateModelValue"
  >
    <div class="flex flex-col w-full gap-4 z-10 text-lavender pt-3 md:pt-0">
      <h2 class="text-[40px] leading-8 font-normal tracking-[-2.8px] md:tracking-[-2px]">
        {{ config.title }}
      </h2>
      <span class="text-xl md:text-[20px] leading-5 tracking-[-0.8px]">
        {{ t('modals.freePowerMiles.stakeFor6Months') }} <strong class="font-bold">$50 {{ t('modals.freePowerMiles.inLingo') }}</strong> {{ t('modals.freePowerMiles.for6Months') }}
        <span
          v-if="freePowerMilesPromoVariant === 'basic'"
          class="whitespace-pre-line"
        >
          {{ t('modals.freePowerMiles.skipTheWait') }} <strong class="font-bold">{{ t('modals.freePowerMiles.freeAsteroids') }}</strong> {{ t('modals.freePowerMiles.instantly') }}
        </span>
        <span
          v-else
          class="whitespace-pre-line"
        >
          {{ t('modals.freePowerMiles.getPowerMiles') }} <strong class="font-bold">{{ t('modals.freePowerMiles.powerMiles') }}</strong> {{ t('modals.freePowerMiles.instantlyToBoost') }}
        </span>
      </span>
      <div
        v-if="freePowerMilesPromoEndDate"
        class="flex gap-1 items-center"
      >
        <span class="text-sm tracking-[-0.28px]">
          <i>{{ t('modals.discord.validFor') }}</i>
        </span>
        <CountersBox
          :theme="config.theme"
          :end-date="freePowerMilesPromoEndDate"
          @finished="showFreePowerMilesPromoModal = false"
        />
      </div>
    </div>
    <div class="h-full" />

    <div class="p-2 pb-0 w-full h-fit flex flex-col gap-6 items-center justify-center">
      <span class="text-lavender text-xl md:text-[20px] leading-5 tracking-[-0.8px]">
        {{ t('modals.freePowerMiles.important') }}
      </span>
      <GlowButton
        :color="EButtonColor.BLUE"
        class="w-full"
        @click="goToStake"
      >
        <span>
          {{ config.cta }}
        </span>
      </GlowButton>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import asteroidUpsellBg from '@/assets/images/free-smash-bg.png'
import ticketsBg from '@/assets/images/tickets-bg.png'
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import { EButtonColor } from '@/types/shared/button'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import mixpanel from 'mixpanel-browser'
import { LingoRouteName } from '@/router/routes'
import { useLingoPrice } from '@/composables/contracts/lingo-price'
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUpsellModals } from '@/composables/upsell-modals'
import CountersBox from './CountersBox.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { showFreePowerMilesPromoModal, freePowerMilesPromoVariant, freePowerMilesPromoEndDate } = useUpsellModals()

const { price } = useLingoPrice()
const router = useRouter()

const configMap = {
  basic: {
    title: t('modals.freePowerMiles.instantAsteroidsBonus'),
    cta: t('modals.freePowerMiles.stakeToClaim'),
    openEvent: 'Asteroid Upsell Popup View',
    eventEntryPoint: 'asteroidUpsellPopup',
    usdAmount: 50,
    bg: asteroidUpsellBg,
    theme: '',
  },
  grant_power_miles: {
    title: t('modals.freePowerMiles.get5EntriesInstantly'),
    cta: t('modals.freePowerMiles.upgradeAnd5xChances'),
    openEvent: 'Raffle Upsell Popup View',
    eventEntryPoint: 'raffleUpsellPopup',
    usdAmount: 50,
    bg: ticketsBg,
    theme: 'blue',
  },
}

const config = computed(() => configMap[freePowerMilesPromoVariant.value])

watch(() => showFreePowerMilesPromoModal.value, (val) => {
  if (val) {
    mixpanel.track(config.value.openEvent)
  }
}, { immediate: true })

function goToStake() {
  mixpanel.track('Staking Started', {
    entryPoint: config.value.eventEntryPoint,
  })
  const usdAmount = config.value.usdAmount
  const lingoAmount = Math.ceil(usdAmount / price.value)
  showFreePowerMilesPromoModal.value = false
  router.push({ name: LingoRouteName.STAKING_NEW, query: { presetAmount: lingoAmount.toString() } })
}

const updateModelValue = () => {
  showFreePowerMilesPromoModal.value = false
}
</script>

<style scoped>
.gradient-bg {
  height: 64px;
  width: 80px;
  overflow: hidden;
  border-radius: 12px;
  position: relative;
  background: radial-gradient(ellipse 188px 40px at center top,
      rgba(212, 197, 235, 0.56) 0%,
      rgba(212, 197, 235, 0) 70%),
    radial-gradient(ellipse 256px 32px at center 20px,
      rgba(38, 38, 56, 0.45) 0%,
      rgba(38, 38, 56, 0) 80%);
  /* Add some blur effect if needed */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 11px;
    transform: translate(-50%, -50%);
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    background: #0b0b13c0;
    overflow: hidden;
    mix-blend-mode: plus-lighter;
  }
}

.gradient-bg-sosika {
    background: radial-gradient(ellipse 188px 40px at center top,
          rgba(88, 88, 245, 0.56) 0%,
          rgba(212, 197, 235, 0) 70%),
        radial-gradient(ellipse 256px 32px at center 20px,
          rgba(38, 38, 56, 0.45) 0%,
          rgba(38, 38, 56, 0) 80%);
}
</style>
