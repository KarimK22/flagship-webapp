<template>
  <BaseModal
    :model-value="modelValue"
    class="p-4 pt-8 gap-0 !rounded-2xl max-sm:w-full h-auto"
    @update:model-value="updateModelValue"
  >
    <!-- Content (with higher z-index) -->
    <template #header>
      <div class="max-w-[340px]">
        <h1 class="text-lavender text-4.5xl font-normal leading-8 tracking-[-2px]">
          {{ $t('components.firstStakeModal.title') }}
        </h1>
      </div>
    </template>
    <div class="mt-2 max-w-[360px] z-100">
      <ul class="mt-6">
        <li
          class="text-[#6D6D8F] text-xl font-normal leading-6 tracking-[-0.6px] list-disc ml-8"
          v-html="$t('components.firstStakeModal.firstStep')"
        />
        <li
          class="text-[#6D6D8F] text-xl font-normal leading-6 tracking-[-0.6px] list-disc ml-8"
          v-html="$t('components.firstStakeModal.secondStep')"
        />
        <li
          class="text-[#6D6D8F] text-xl font-normal leading-6 tracking-[-0.6px] list-disc ml-8"
          v-html="$t('components.firstStakeModal.thirdStep')"
        />
      </ul>
      <div class="flex flex-col gap-2 mt-4">
        <span class="text-xl text-purple-gray font-normal tracking-[0.6px] leading-6">
          {{ $t('components.firstStakeModal.yourReferralLink') }}
        </span>
        <div class="w-full text-lavender italic h-12 p-4 flex items-center justify-between rounded-2xl bg-[rgba(38,38,56,0.40)] [&:hover]:bg-[rgba(38,38,56,0.60)] cursor-pointer inset-shadow-[0_0_48px_-16px_#595978]">
          {{ referralLink }}
        </div>
      </div>
    </div>
    <template #footer>
      <GlowButton
        :color="EButtonColor.BLUE"
        class="w-full mt-8"
        @click="copyReferralLink"
      >
        <span>{{ isCopied ? $t('components.firstStakeModal.copied') : $t('components.firstStakeModal.copyLink') }}</span>
      </GlowButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/ui/dialog/BaseModal.vue'
import { EButtonColor } from '@/types/shared/button'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { useGetMyReferrals } from '@/composables/get-my-referrals'
import { computed, onMounted, ref } from 'vue'
import mixpanel from 'mixpanel-browser'
import { useFirstStakeModal } from '@/composables/use-first-stake-modal'

defineProps<{
	modelValue: boolean
}>()

const { data, claimFirstStakeReward } = useGetMyReferrals()
const isCopied = ref(false)
const referralLink = computed(() => {
  const origin = window.location.origin
  return `${origin}/?ref=${data.value.referralCode}`
})
const { setCurrentAccountValue } = useFirstStakeModal()
const copyReferralLink = () => {
  mixpanel.track('Referral Link Copied')
  navigator.clipboard.writeText(referralLink.value)
  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, 2000)
}

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void
}>()

const updateModelValue = (val: boolean) => {
  emit('update:modelValue', val)
  setCurrentAccountValue(false)
}

onMounted(() => {
  claimFirstStakeReward(50)
})
</script>
