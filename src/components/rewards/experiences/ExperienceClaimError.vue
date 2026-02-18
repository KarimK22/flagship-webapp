<template>
  <div class="flex flex-col items-start justify-center p-6 rounded-2xl backdrop-blur-md bg-dark2/80 border overflow-hidden border-orange1/[16%]">
    <IconWrapper
      variant="orange"
      position="right"
      :with-borders="false"
      class="!absolute right-[6%] top-[13%]"
    />

    <h3 class="text-3xl leading-7 font-medium text-lavender -tracking-[1.28px] mb-4 max-w-[85%]">
      {{ errorMessage }}
    </h3>

    <div class="text-purple-gray text-xl leading-8 -tracking-[0.6px]">
      {{ t('components.experienceClaimError.closeIn', { time: Math.ceil(timeLeft) }) }}
    </div>

    <!-- Progress Line -->
    <div
      class="h-[3px] bg-gradient-to-l from-[#FF9D5C] to-[#FF9D5C]/0 transition-all duration-100 ease-linear  absolute bottom-0 rounded-2xl left-0"
      :style="{ width: `${(timeLeft / 3) * 100}%` }"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import IconWrapper from '@/components/icon-wrapper/IconWrapper.vue'
import { useTranslation } from '@/composables/use-i18n'

const props = defineProps<{
  errorMessage: string
}>()

const emit = defineEmits<{
  (e: 'timer-complete'): void
}>()

const timeLeft = ref(3)
let timer: number | null = null

const { t } = useTranslation()

watch(timeLeft, (newValue) => {
  if (newValue <= 0) {
    console.log('Timer completed')
    emit('timer-complete')
  }
})

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

onMounted(() => {
  if (props.errorMessage.length > 0) {
    startTimer()
  }
})

onUnmounted(() => {
  if (timer) {
    cancelAnimationFrame(timer)
  }
})
</script>
<style>

</style>