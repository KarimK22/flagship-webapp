<template>
  <div
    class=" bg-dark2 text-white p-2 rounded-2xl relative overflow-hidden w-[288px] h-[512px] flex flex-col bg-cover bg-center mx-auto"
    :style="{ backgroundImage: `url(${experienceImage})` }"
  >
    <div class="flex items-center justify-between gap-2 mt-4 mx-2 transition-transform duration-300 ease-in-out">
      <div class="text-purple-gray text-xl leading-8 -tracking-[0.6px] transition-all duration-300 ease-in-out">
        {{ topTitle }}
      </div>
      <div
        v-if="isActive(experience) && !experienceClaimed"
        class="text-purple-gray text-xl leading-8 -tracking-[0.6px] transition-all duration-300"
      >
        {{ t('common.endsIn') }} <span class="transition-all duration-200">{{ formatTimeLeft }}</span>
      </div>
    </div>

    <!-- Title Section -->
    <div class="mb-8 mx-2 transition-all duration-500 ease-out">
      <h1 class="text-[32px] leading-8 font-normal -tracking-[1.6px] transition-all duration-300">
        <span
          v-if="experience.name"
          class="transition-opacity duration-300"
        >
          {{ experience.name.split(' ').slice(0, -1).join(' ') }}
          <span class="whitespace-nowrap transition-all duration-300">
            {{ experience.name.split(' ').slice(-1)[0].trim() }}
            <span class="inline-flex bg-sosiska/[88%] backdrop-blur-[2px] px-2 py-1 ml-1 rounded-[80px] h-10 min-w-[47px] text-xl leading-8 -tracking-[1px] align-top transition-all duration-300 hover:scale-105">
              <span class="mx-auto font-normal transition-transform duration-200">X{{ experience.quantity }}</span>
            </span>
          </span>
        </span>
      </h1>
      <!--		Share Section-->
      <IconButtonWrapper
        class="mt-2"
        :src="linkGradientIcon"
        :text-on-hover="t('common.copyLink')"
        :text-on-click="t('common.copied')"
        @click="copyExperienceLink"
      />
    </div>
    <div class="mb-6 mx-5 mt-auto">
      <GlowButton
        :color="EButtonColor.BLUE"
        class="w-full"
        :class="{ 'bg-dark3': buttonDisabled }"
        :disabled="buttonDisabled"
        @click="handleEnter"
      >
        {{ buttonLabel }}
      </GlowButton>
    </div>

    <ExperienceClaimModal
      v-model="showModal"
      :experience="experience"
      :experience-claimed="experienceClaimed"
      @claimed="emit('claimed')"
    />
  </div>
</template>

<script lang="ts" setup>
import type { ExclusiveEvent } from '@/services/api.ts'
import { computed, onMounted, ref } from 'vue'
import { EButtonColor } from '@/types/shared/button.ts'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import backgroundImage from '@/assets/images/dummies/raffle-card-test.png'
import { useRoute, useRouter } from 'vue-router'
import linkGradientIcon from '@/assets/icons/gradient-link.svg'
import IconButtonWrapper from '@/components/IconButtonWrapper.vue'
import { useGetMyReferrals } from '@/composables/get-my-referrals.ts'
import ExperienceClaimModal from '@/components/rewards/experiences/ExperienceClaimModal.vue'
import { useExperiences } from '@/composables/experiences.ts'
import { formatDateWithOrdinal } from '@/composables/helpers'
import { useTranslation } from '@/composables/use-i18n'

const { t } = useTranslation()

const props = defineProps<{
	experience: ExclusiveEvent
	experienceClaimed: boolean
}>()

const emit = defineEmits<{
	(e: 'claimed'): void
}>()

const route = useRoute()
const router = useRouter()
const showModal = ref(route.query.experienceId === props.experience.id || false)
const { isActive, isFuture } = useExperiences()

const formatTimeLeft = computed(() => {
  const now = new Date()
  const end = new Date(props.experience.endDate)
  const diff = end.getTime() - now.getTime()

  if (diff <= 0) return t('common.ended')

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) {
    return `${days}d`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
})

const handleEnter = () => {
  if (!isActive(props.experience)) return
  showModal.value = true
}

const experienceImage = computed(() => {
  return props.experience.imageUrl || backgroundImage
})

const buttonDisabled = computed(() => {
  return props.experienceClaimed || isFuture(props.experience) || props.experience.quantity <= props.experience.claimed || !isActive(props.experience)
})

const buttonLabel = computed(() => {
  if (props.experienceClaimed) {
    return t('common.enjoyYourExperience')
  }

  if (isFuture(props.experience)) {
    return t('common.comingSoon')
  }

  if (props.experience.quantity <= props.experience.claimed) {
    return t('common.outOfStock')
  }

  if (isActive(props.experience)) {
    const endDate = new Date(props.experience.endDate)
    return `${t('common.claimUntil')} ${formatDateWithOrdinal(endDate)}`
  }

  return t('common.claim')
})

const topTitle = computed(() => {
  if (props.experienceClaimed) {
    return t('common.congratsYouClaimedIt')
  }

  return t('common.firstInFirstOut')
})

const { data } = useGetMyReferrals()
const copyExperienceLink = () => {
  navigator.clipboard.writeText(window.location.origin + '/rewards?tab=experiences&experienceId=' + props.experience.id + '&ref=' + data.value.referralCode)
}
onMounted(() => {
  if (route.query.experienceId === props.experience.id) {
    showModal.value = true
  }
  router.replace({ query: { ...route.query, experienceId: undefined } })
})
</script>

<style scoped>
.badge-gradient {
	position: absolute;
	top: -15px;
	right: -10px;
	width: 100px;
	height: 100px;
	border-radius: 50%;
	backdrop-filter: blur(8px);
	background: radial-gradient(circle at top right,
	rgba(255, 255, 255, 1) 0%,
	rgba(255, 255, 255, 0.90) 10px,
	rgba(255, 255, 255, 0.70) 20px,
	#5858F5 40px,
	color-mix(in srgb, #5858F5, transparent 30%) 50px,
	color-mix(in srgb, #5858F5, transparent 50%) 60px,
	rgba(38, 38, 56, 0.9) 70px,
	transparent 80%);
}
</style>