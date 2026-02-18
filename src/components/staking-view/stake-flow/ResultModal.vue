<template>
  <div>
    <BaseModal
      v-if="resultModalType"
      :model-value="modelValue"
      class="p-4 gap-0 !rounded-2xl w-[96vw] md:w-[420px] !max-w-[none] max-h-[96vh] md:max-h-[90%] h-auto"
      description=" "
      :show-close-button="isError"
      :class="{ 'pt-5': isSuccess }"
      @update:model-value="closeAndClear"
    >
      <!-- Content (with higher z-index) -->
      <template #header>
        <div class="relative z-10 flex flex-col h-full">
          <!-- BaseHeader Section -->
          <div class="flex flex-col text-left">
            <div class="flex items-center justify-between w-full">
              <IconWrapper
                v-if="isSuccess"
                variant="purple"
                position="left"
                :with-borders="true"
              >
                <InlineSvg
                  :src="lingoIcon"
                  class="size-10"
                  unique-ids
                />
              </IconWrapper>
              <BaseButton
                v-if="isSuccess"
                variant="classic"
                size="classic"
                class="flex items-center gap-1 md:gap-2"
                @click="() => shareOnX(props.transactionType)"
              >
                <InlineSvg :src="gradientX" />
                <span>{{ t('staking.stakingFlow.resultModal.share') }}</span>
              </BaseButton>
            </div>
            <h1
              v-if="isSuccess"
              class="text-lavender text-4xl md:text-5.5xl leading-10 font-normal tracking-[-2.24px] select-none pl-8 -mt-3"
            >
              {{ t('staking.stakingFlow.resultModal.congrats') }}
            </h1>
            <div
              v-if="isError"
              class="flex flex-col gap-2 mt-2"
            >
              <h1 class="text-[#FF7847] text-[32px] leading-7 font-medium tracking-[-1.28px] select-none">
                {{ t('staking.stakingFlow.resultModal.oops') }}
              </h1>
              <h1 class="text-lavender text-[32px] leading-7 font-medium tracking-[-1.28px] select-none">
                {{ t('staking.stakingFlow.resultModal.somethingWentWrong') }}
              </h1>
            </div>
          </div>
        </div>
      </template>
      <template #description>
        <div
          class="w-full pb-0 pt-2 text-purple-gray text-[20px] leading-5 tracking-[-0.6px]"
          :class="{ 'px-8': isSuccess }"
        >
          <span
            v-if="isSuccess"
            class="text-lavender"
          >{{ successMessage }}</span>
          <span v-else-if="isError && errorMessage === 'discord'">
            {{ t('staking.stakingFlow.resultModal.discordMessage') }}
          </span>
          <span v-else-if="isError">
            {{ errorMessage }}
          </span>
        </div>
      </template>
      <template #footer>
        <div class="flex p-4 w-full">
          <GlowButton
            v-if="isSuccess"
            :color="EButtonColor.BLUE"
            class="flex items-center w-full gap-2"
            @click="goToDashboard"
          >
            <span>{{ t('staking.stakingFlow.resultModal.continueToDashboard') }}</span>
          </GlowButton>
          <GlowButton
            v-if="isError"
            :color="EButtonColor.BLUE"
            class="flex items-center w-full gap-2"
            @click="handleRetryWithCurrentStatus"
          >
            <span>{{ t('staking.stakingFlow.resultModal.retry') }}</span>
          </GlowButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>
<script setup lang="ts">
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import { BaseButton } from '@/components/ui/button'
import gradientX from '@/assets/icons/gradient-x.svg'
import lingoIcon from '@/assets/images/game/points-processed.svg'
import InlineSvg from 'vue-inline-svg'
import IconWrapper from '@/components/icon-wrapper/IconWrapper.vue'
import { LingoRouteName } from '@/router/routes'
import { status, transactionError, useStatus } from '@/composables/contracts/status'
import { computed } from 'vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import { TRANSACTION_TYPE } from '@/types/staking'
import { useRoute, useRouter } from 'vue-router'
import { tweets } from '@/const/tweets.ts'
import { useGetMe } from '@/composables/get-me.ts'
import mixpanel from 'mixpanel-browser'
import { shareOnXEventsContexts } from '@/const/mixpanel-maps'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const route = useRoute()
const { updateStatus } = useStatus()
const props = defineProps<{
	modelValue: boolean
	transactionType: TRANSACTION_TYPE
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void
	(e: 'retryTransaction'): void
}>()

enum ResultModalType {
	SUCCESS = 'success',
	ERROR = 'error',
}

const resultModalType = computed(() => {
  const { global: currentGlobalStatus } = status[props.transactionType]

  const isSuccessOrError = (status: { success: boolean, error: boolean }) => {
    if (status?.success) {
      return ResultModalType.SUCCESS
    }
    if (status?.error) {
      return ResultModalType.ERROR
    }
    return null
  }

  return isSuccessOrError(currentGlobalStatus)
})

const isError = computed(() => {
  return resultModalType.value === ResultModalType.ERROR
})

const isSuccess = computed(() => {
  return resultModalType.value === ResultModalType.SUCCESS
})

const successMessage = computed(() => {
  switch (props.transactionType) {
  case TRANSACTION_TYPE.RENEW:
    return t('staking.stakingFlow.resultModal.lingoRenewed')
  case TRANSACTION_TYPE.UNSTAKE:
    return t('staking.stakingFlow.resultModal.lingoUnstaked')
  case TRANSACTION_TYPE.STAKE:
    return t('staking.stakingFlow.resultModal.lingoStaked')
  case TRANSACTION_TYPE.CLAIM_TOKENS:
    return t('staking.stakingFlow.resultModal.lingoClaimed')
  case TRANSACTION_TYPE.CLAIM_AND_STAKE:
    return t('staking.stakingFlow.resultModal.lingoClaimedAndStaked')
  default:
    return t('staking.stakingFlow.resultModal.transactionSuccessful')
  }
})

const errorMessage = computed(() => {
  if (isError.value && transactionError.value.text) {
    return transactionError.value.text
  }
  return 'discord'
})

const goToDashboard = () => {
  /* Clear the status */
  transactionError.value = {
    text: null,
    value: null,
  }
  updateStatus(props.transactionType, 'global', { loading: false, success: false, error: false })

  if (route.query.redirect === 'experiences') {
    router.push({
      name: LingoRouteName.REWARDS,
      query: {
        tab: 'experiences',
      },
    })
  } else {
    if (props.transactionType === TRANSACTION_TYPE.CLAIM_TOKENS || props.transactionType === TRANSACTION_TYPE.CLAIM_AND_STAKE) {
      router.push({
        name: LingoRouteName.CLAIM,
      })
    } else {
      router.push({
        name: LingoRouteName.STAKING,
      })
    }
  }

  emit('update:modelValue', false)
}

const closeAndClear = () => {
  /* Clear the status */
  transactionError.value = {
    text: null,
    value: null,
  }
  updateStatus(props.transactionType, 'global', { loading: false, success: false, error: false })
  updateStatus('waitForTransaction', 'global', { loading: false, success: false, error: false })
  emit('update:modelValue', false)
}

const handleRetryWithCurrentStatus = () => {
  /* Update the status to loading */
  updateStatus(props.transactionType, 'global', { ...status[props.transactionType].global, loading: true })
  updateStatus('waitForTransaction', 'global', { ...status['waitForTransaction'].global, loading: true })
  emit('retryTransaction')
}

function getTweetType(transactionType: TRANSACTION_TYPE): 'claim' {
  if (transactionType === 'claimTokens' || transactionType === 'claimAndStake') {
    return 'claim'
  }
  return 'claim'
}
const { referralCode } = useGetMe()

function shareOnX(transactionType: TRANSACTION_TYPE) {
  mixpanel.track('Share On X Started', {
    entryPoint: shareOnXEventsContexts[transactionType],
  })
  const tweetType = getTweetType(transactionType)
  const tweetText = encodeURIComponent(tweets[tweetType][Math.floor(Math.random() * tweets.claim.length)] + `\nhttps://app.lingocoin.io?ref=${referralCode.value}`).replace(/%20/g, '+')
  window.open(`https://x.com/intent/post?text=${tweetText}`, '_blank')
  redirect()
}

function redirect() {
  const redirectRoute = props.transactionType === 'claimTokens' ? LingoRouteName.CLAIM : LingoRouteName.STAKING
  router.push({ name: redirectRoute })
}

const { t } = useI18n()

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
