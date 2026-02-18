<template>
  <div class="mt-auto">
    <transition
      name="fade"
      mode="out-in"
    >
      <div
        v-if="experienceClaimed"
        key="claimed"
        class="flex flex-col justify-end"
      >
        <div class="flex items-center gap-1.5 ml-0.5 text-xl leading-8">
          <span>🥳</span>
          <div class="text-purple-gray text-xl leading-8 -tracking-[0.6px] select-none">
            {{ t('components.experienceClaimForm.congratulations') }}
          </div>
        </div>
        <p class="text-sm leading-6 font-semibold tracking-[0.42px] text-lavender">
          {{ t('components.experienceClaimForm.detailsEmailed') }}
        </p>
      </div>
      <div
        v-else
        key="not-claimed"
      >
        <div v-if="errorMessage.length === 0">
          <div v-if="!isOutOfStock">
            <p class="text-base font-semibold text-lavender tracking-[0.16px] mb-2">
              {{ t('components.experienceClaimForm.enterEmail') }}
            </p>
            <BaseInput
              v-model="userEmail"
              type="email"
              class="w-full flex-1"
              :placeholder="t('components.experienceClaimForm.emailPlaceholder')"
              :class="{ 'border-red-500': emailError }"
            />
          </div>
          <div class="text-sm leading-4 font-semibold -tracking-[0.42px] text-purple-gray my-4 transition-opacity duration-300">
            <span class="mr-1">{{ experience.description }}</span>
          </div>
          <div class="mx-5 mb-6">
            <GlowButton
              :color="EButtonColor.BLUE"
              class="w-full"
              :disabled="isLoading || isOutOfStock"
              @click="claimExperience"
            >
              {{ buttonLabel }}
            </GlowButton>
          </div>
        </div>
        <ExperienceClaimError
          v-else
          :error-message="errorMessage"
          @timer-complete="errorMessage = ''"
        />
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { useTranslation } from '@/composables/use-i18n'
import { EButtonColor } from '@/types/shared/button.ts'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { BaseInput } from '@/components/ui/input'

import { computed, onMounted, ref } from 'vue'
import api, { type ExclusiveEvent } from '@/services/api.ts'
import { useGetMe } from '@/composables/get-me.ts'
import { useExperiences } from '@/composables/experiences'
import mixpanel from 'mixpanel-browser'
import ExperienceClaimError from '@/components/rewards/experiences/ExperienceClaimError.vue'

const { t } = useTranslation()

const props = defineProps<{
	experienceClaimed: boolean
	experience: ExclusiveEvent
}>()

const emit = defineEmits<{
  (e: 'claimed'): void
}>()

const { meData, refetchGetMe } = useGetMe()
const { claimExclusiveEvent, isActive } = useExperiences()
const userEmail = ref(meData.value?.email || '')
const isLoading = ref(false)
const errorMessage = ref('')
const emailError = ref('')

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!userEmail.value) {
    emailError.value = t('components.experienceClaimForm.emailRequired')
    return false
  }
  if (!emailRegex.test(userEmail.value)) {
    emailError.value = t('components.experienceClaimForm.invalidEmail')
    return false
  }
  emailError.value = ''
  return true
}

async function claimExperience() {
  if (!validateEmail()) {
    errorMessage.value = emailError.value
    return
  }

  try {
    isLoading.value = true
    errorMessage.value = ''
    const response = await claimExclusiveEvent(props.experience.id)

    if (response.success) {
      emit('claimed')
      mixpanel.track('Experience Claimed', {
        experienceId: props.experience.id,
        tier: props.experience.minLevel,
      })
      if (meData.value?.email !== userEmail.value) {
        const response = await api.updateUserEmail(userEmail.value)

        if (response.success) {
          await refetchGetMe()
        }
      }
      userEmail.value = ''
    } else {
      if (response.error === 'Event not found or has finished.' && isActive(props.experience)) {
        errorMessage.value = t('components.experienceClaimForm.outOfStockMessage')
      } else {
        errorMessage.value = response.error
      }
    }
  } catch (err: unknown) {
    console.error('Failed to claim experience:', err)
    errorMessage.value = t('components.experienceClaimForm.unexpectedError')
  } finally {
    isLoading.value = false
  }
}
const isOutOfStock = computed(() => props.experience.quantity === props.experience.claimed)
const buttonLabel = ref(t('components.experienceClaimForm.claimNow'))
onMounted(() => {
  if (props.experience.quantity === props.experience.claimed) {
    buttonLabel.value = t('components.experienceClaimForm.outOfStock')
  }
})
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>