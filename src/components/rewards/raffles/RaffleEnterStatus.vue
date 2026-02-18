<template>
  <div
    class="flex flex-col items-center justify-center rounded-2xl backdrop-blur-md bg-dark2/80 border overflow-hidden w-full"
    :class="status === 'success' || status === 'maxEntries' ? 'border-green1/[16%]' : 'border-orange1/[16%]'"
  >
    <div
      v-if="status === 'success'"
      class="pl-6 pb-6 pt-2 pr-2"
    >
      <IconWrapper
        variant="green"
        position="right"
        :with-borders="false"
        class="!absolute right-[6%] top-[13%]"
      />

      <div class="flex items-center justify-between w-full mb-4">
        <h3 class="text-purple-gray text-xl leading-8 -tracking-[0.6px]">
          {{ $t('components.raffleEnterStatus.congrats') }}
        </h3>
        <BaseButton
          variant="darkBg"
          size="classic"
          class="flex items-center gap-2"
          @click="emit('share')"
        >
          <InlineSvg :src="gradientX" />
          <span>{{ $t('components.raffleEnterStatus.share') }}</span>
        </BaseButton>
      </div>
      <p class="text-3xl leading-7 font-medium text-lavender -tracking-[1.28px] max-w-[90%]">
        <span v-html="$t('components.raffleEnterStatus.successfullyEntered')" />
      </p>
    </div>
    <div
      v-if="status === 'maxEntries'"
      :class="canGetExtra ? 'p-6' : 'pl-6 pb-6 pt-2 pr-2'"
    >
      <IconWrapper
        variant="green"
        position="right"
        :with-borders="false"
        class="!absolute right-[6%] top-[13%]"
      />

      <div
        v-if="!canGetExtra"
        class="flex items-center justify-between w-full mb-4"
      >
        <h3 class="text-purple-gray text-xl leading-8 -tracking-[0.6px]">
          {{ $t('components.raffleEnterStatus.congrats') }}
        </h3>
        <BaseButton
          variant="darkBg"
          size="classic"
          class="flex items-center gap-2"
          @click="emit('share')"
        >
          <InlineSvg
            :src="gradientX"
            unique-ids
          />
          <span>{{ $t('components.raffleEnterStatus.share') }}</span>
        </BaseButton>
      </div>
      <p
        class="text-3xl leading-7 font-medium text-lavender -tracking-[1.28px] max-w-[90%]"
        :class="{ 'mb-4': canGetExtra }"
      >
        <span v-html="$t('components.raffleEnterStatus.youGotEntries', { entries: userEntries === 1 ? '1 entry' : `${userEntries} entries` })" />
      </p>
      <GlowButton
        v-if="canGetExtra"
        :color="EButtonColor.ORANGE"
        class="w-full leading-6"
        @click="emit('getExtraTickets')"
      >
        <span v-if="extraTicketsCount > 0">{{ $t('components.raffleEnterStatus.xYourChances', { count: extraTicketsCount }) }}</span>
        <span v-else>{{ $t('components.raffleEnterStatus.getMore') }}</span>
      </GlowButton>
    </div>
    <div
      v-else-if="status === 'error'"
      class="p-6"
    >
      <IconWrapper
        variant="orange"
        position="right"
        :with-borders="false"
        class="!absolute right-[6%] top-[13%]"
      />

      <h3 class="text-3xl leading-7 font-medium text-lavender -tracking-[1.28px] mb-4 max-w-[85%]">
        <span v-html="$t('components.raffleEnterStatus.notEnoughPowerMiles')" />
      </h3>

      <div class="text-purple-gray text-xl leading-8 -tracking-[0.6px]">
        {{ $t('components.raffleEnterStatus.closeIn') }} <span class="text-light1">{{ Math.ceil(timeLeft) }}...</span>
      </div>

      <!-- Progress Line -->
      <div
        class="h-[3px] bg-gradient-to-l from-[#FF9D5C] to-[#FF9D5C]/0 transition-all duration-100 ease-linear  absolute bottom-0 rounded-2xl left-0"
        :style="{ width: `${(timeLeft / 3) * 100}%` }"
      />
    </div>
    <div
      v-else-if="status === 'insufficient'"
      class="p-6"
    >
      <IconWrapper
        variant="orange"
        position="right"
        :with-borders="false"
        class="!absolute right-[6%] top-[13%]"
      />

      <h3 class="text-3xl leading-7 font-medium text-lavender -tracking-[1.28px] mb-4">
        {{ $t('components.raffleEnterStatus.needAtLeast') }} <span class="text-orange2">{{ ticketPrice }} {{ ticketPrice === 1 ? $t('components.raffleEnterStatus.powerMile') : $t('components.raffleEnterStatus.powerMiles') }}</span> {{ $t('components.raffleEnterStatus.toBuyTicket') }}
      </h3>

      <GlowButton
        :color="EButtonColor.ORANGE"
        class="w-full leading-6"
        @click="getMoreMiles"
      >
        <span class="flex items-center justify-center gap-1 ">
          <span class="text-orange2">{{ $t('components.raffleEnterStatus.getMore') }}</span>
          <InlineSvg
            :src="powerIcon"
            class="size-6"
            unique-ids
          />
        </span>
      </GlowButton>
    </div>
    <div
      v-else-if="status === 'invalidCode'"
      class="p-6 w-full"
    >
      <IconWrapper
        variant="orange"
        position="right"
        :with-borders="false"
        class="!absolute right-[6%] top-[13%]"
      />

      <h3 class="text-3xl leading-7 font-medium text-lavender -tracking-[1.28px] mb-4 max-w-[85%]">
        <span v-html="$t('components.raffleEnterStatus.incorrectCode')" />
      </h3>

      <div class="text-purple-gray text-xl leading-8 -tracking-[0.6px]">
        {{ $t('components.raffleEnterStatus.closeIn') }} <span class="text-light1">{{ Math.ceil(timeLeft) }}...</span>
      </div>

      <!-- Progress Line -->
      <div
        class="h-[3px] bg-gradient-to-l from-[#FF9D5C] to-[#FF9D5C]/0 transition-all duration-100 ease-linear  absolute bottom-0 rounded-2xl left-0"
        :style="{ width: `${(timeLeft / 3) * 100}%` }"
      />
    </div>
    <div
      v-else-if="status === 'invalidEmail'"
      class="p-6 w-full"
    >
      <IconWrapper
        variant="orange"
        position="right"
        :with-borders="false"
        class="!absolute right-[6%] top-[13%]"
      />

      <h3 class="text-3xl leading-7 font-medium text-lavender -tracking-[1.28px] mb-4 max-w-[85%]">
        <span v-html="$t('components.raffleEnterStatus.invalidEmail')" />
      </h3>

      <div class="text-purple-gray text-xl leading-8 -tracking-[0.6px]">
        {{ $t('components.raffleEnterStatus.closeIn') }} <span class="text-light1">{{ Math.ceil(timeLeft) }}...</span>
      </div>

      <!-- Progress Line -->
      <div
        class="h-[3px] bg-gradient-to-l from-[#FF9D5C] to-[#FF9D5C]/0 transition-all duration-100 ease-linear  absolute bottom-0 rounded-2xl left-0"
        :style="{ width: `${(timeLeft / 3) * 100}%` }"
      />
    </div>
    <div
      v-else-if="status === 'maxPerUser'"
      class="p-6 w-full"
    >
      <IconWrapper
        variant="orange"
        position="right"
        :with-borders="false"
        class="!absolute right-[6%] top-[13%]"
      />

      <h3 class="text-3xl leading-7 font-medium text-lavender -tracking-[1.28px] mb-4 max-w-[85%]">
        <span v-html="$t('components.raffleEnterStatus.onlyBuyMax', { max: maxPerUser })" />
      </h3>

      <div class="text-purple-gray text-xl leading-8 -tracking-[0.6px]">
        {{ $t('components.raffleEnterStatus.closeIn') }} <span class="text-light1">{{ Math.ceil(timeLeft) }}...</span>
      </div>

      <!-- Progress Line -->
      <div
        class="h-[3px] bg-gradient-to-l from-[#FF9D5C] to-[#FF9D5C]/0 transition-all duration-100 ease-linear  absolute bottom-0 rounded-2xl left-0"
        :style="{ width: `${(timeLeft / 3) * 100}%` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { BaseButton } from '@/components/ui/button'
import InlineSvg from 'vue-inline-svg'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import IconWrapper from '@/components/icon-wrapper/IconWrapper.vue'
import gradientX from '@/assets/icons/gradient-green-x.svg'
import powerIcon from '@/assets/images/game/power.svg'
import { useRouter } from 'vue-router'
import { LingoRouteName } from '@/router/routes.ts'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button.ts'

const props = withDefaults(defineProps<{
  status: 'success' | 'error' | 'insufficient' | 'maxEntries' | 'invalidCode' | 'invalidEmail' | 'maxPerUser'
  ticketPrice?: number
  maxPerUser?: number
  userEntries?: number
  extraTicketsCount?: number
  canGetExtra: boolean
}>(), { userEntries: 0, maxPerUser: 0, canGetExtra: false, status: 'success', ticketPrice: 0, extraTicketsCount: 0 })

const emit = defineEmits<{
  (e: 'share'): void
  (e: 'retry'): void
  (e: 'timer-complete'): void
  (e: 'getExtraTickets'): void
}>()

const timeLeft = ref(3)
let timer: number | null = null

const startTimer = () => {
  if (timer) cancelAnimationFrame(timer)
  timeLeft.value = 3
  const startTime = Date.now()

  const animate = () => {
    const currentTime = Date.now()
    const elapsed = (currentTime - startTime) / 1000 // Convert to seconds

    if (elapsed < 3) {
      timeLeft.value = 3 - elapsed
      timer = requestAnimationFrame(animate)
    } else {
      timeLeft.value = 0
      emit('timer-complete')
    }
  }

  timer = requestAnimationFrame(animate)
}

watch(() => props.status, (newStatus) => {
  if (newStatus === 'error' || newStatus === 'invalidCode' || newStatus === 'invalidEmail' || newStatus === 'maxPerUser') {
    startTimer()
  } else if (timer) {
    cancelAnimationFrame(timer)
  }
}, { immediate: true })

onMounted(() => {
  if (props.status === 'error' || props.status === 'invalidCode' || props.status === 'invalidEmail' || props.status === 'maxPerUser') {
    startTimer()
  }
})

onUnmounted(() => {
  if (timer) {
    cancelAnimationFrame(timer)
  }
})
const router = useRouter()
const getMoreMiles = () => {
  router.push({ name: LingoRouteName.STAKING })
}

</script>
<style></style>