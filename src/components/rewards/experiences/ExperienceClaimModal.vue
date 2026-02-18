<template>
  <BaseModal
    :model-value="modelValue"
    class="p-0"
    @update:model-value="(val: boolean) => emit('update:modelValue', val)"
  >
    <div
      class="bg-dark2 text-white p-4 rounded-2xl relative overflow-hidden sm:w-[420px] min-h-[620px] flex flex-col bg-contain bg-top bg-no-repeat"
      :style="{ backgroundImage: `url(${raffleImage})` }"
    >
      <!-- Title Section -->
      <div class="mb-8 mt-2 transition-all duration-500 ease-out min-h-[428px]">
        <div class="text-purple-gray text-xl leading-8 -tracking-[0.6px] transition-all duration-300 ease-in-out">
          {{ t('components.experienceClaimModal.firstInFirstOut') }}
        </div>
        <h1 class="text-5xl leading-10 font-medium -tracking-[2.4px] transition-all duration-300">
          <span
            v-if="experience.name"
            class="transition-opacity duration-300"
          >
            {{ experience.name.split(' ').slice(0, -1).join(' ') }}
            <span class="whitespace-nowrap transition-all duration-300">
              {{ experience.name.split(' ').slice(-1)[0].trim() }}
              <span
                v-if="!experienceClaimed"
                class="inline-flex bg-sosiska/[88%] backdrop-blur-[2px] px-2 py-1 ml-1 rounded-[80px] h-10 min-w-[47px] text-xl leading-8 -tracking-[1px] align-top transition-all duration-300 hover:scale-105"
              >
                <span class="mx-auto font-normal transition-transform duration-200">X{{ experience.quantity }}</span>
              </span>
            </span>
          </span>
        </h1>
        <!--		Share Section-->
        <IconButtonWrapper
          v-if="!experienceClaimed"
          class="mt-2"
          :src="linkGradientIcon"
          :text-on-hover="t('common.copyLink')"
          :text-on-click="t('common.copied')"
          @click="copyExperienceLink"
        />
      </div>
      <!--			ClaimForm-->
      <ExperienceClaimForm
        v-if="isConnected && isUserEligibleForExperience(experience)"
        :experience="experience"
        :experience-claimed="experienceClaimed"
        @claimed="userClaimed = true"
      />
      <div
        v-else
        class="mt-auto"
      >
        <div class="text-sm leading-4 font-semibold -tracking-[0.42px] text-lavender my-4 transition-opacity duration-300">
          <span class="mr-1">{{ experience.description }}</span>
        </div>
        <div
          v-if="!isConnected"
          class="mx-5 mb-6"
        >
          <GlowButton
            :color="EButtonColor.BLUE"
            class="w-full"
            @click.stop.prevent="connect"
          >
            {{ t('components.experienceClaimModal.loginToClaim') }}
          </GlowButton>
        </div>
        <ExperienceEligibleStatus
          v-else
          class="w-[calc(100%+16px)] -ml-2 -mb-2"
          :min-level="experience.minLevel"
          :min-amount="experience.minAmountStaked"
        />
      </div>
    </div>
  </BaseModal>
</template>
<script setup lang="ts">
import type { ExclusiveEvent } from '@/services/api.ts'
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button.ts'
import { computed, ref, watch } from 'vue'
import backgroundImage from '@/assets/images/dummies/raffle-card-test.png'
import linkGradientIcon from '@/assets/icons/gradient-link.svg'
import IconButtonWrapper from '@/components/IconButtonWrapper.vue'
import { useGetMyReferrals } from '@/composables/get-my-referrals.ts'
import { useExperiences } from '@/composables/experiences.ts'
import ExperienceClaimForm from '@/components/rewards/experiences/ExperienceClaimForm.vue'
import ExperienceEligibleStatus from '@/components/rewards/experiences/ExperienceEligibleStatus.vue'
import mixpanel from 'mixpanel-browser'
import { useGetMe } from '@/composables/get-me'
import { useWalletConnect } from '@/composables/wallet/use-wallet-connect'
import { useTranslation } from '@/composables/use-i18n'

const props = withDefaults(defineProps<{
	modelValue: boolean
	experience: ExclusiveEvent
	experienceClaimed: boolean
}>(), {
  modelValue: false,
})

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void
	(e: 'claimed'): void
}>()

const { isConnected } = useGetMe()
const { connect } = useWalletConnect()
const { isUserEligibleForExperience, refetchExperiences } = useExperiences()
const userClaimed = ref(false)
const raffleImage = computed(() => {
  return props.experience.imageUrl || backgroundImage
})

const { t } = useTranslation()

watch(()=> props.modelValue, (val) => {
  if (!val){
    if (userClaimed.value) {
      emit('claimed')
    }
    refetchExperiences()
    userClaimed.value = false
  } else {
    mixpanel.track('Experience Popup View', {
      experienceId: props.experience.id,
      tier: props.experience.minLevel,
    })
  }
})

const { data } = useGetMyReferrals()
const copyExperienceLink = () => {
  navigator.clipboard.writeText(window.location.origin + '/rewards?tab=experiences&experienceId=' + props.experience.id + '&ref=' + data.value.referralCode)
}
</script>
<style scoped>

</style>