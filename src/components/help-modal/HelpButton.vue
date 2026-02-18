<template>
  <span
    class="h-6 w-6 rounded-full bg-[#0C0C14] flex items-center justify-center z-30 cursor-pointer"
    role="button"
    aria-label="Help"
    :onclick="handleClick"
  >
    <template v-if="text">
      {{ text }}
    </template>
    <template v-else-if="isButton">
      <GlowButton
        :color="EButtonColor.ORANGE"
        @click="handleClick"
      >
        <slot />
      </GlowButton>
    </template>
    <template v-else>
      <slot />
    </template>
    <HelpModal
      :model-value="showHelpModal"
      :help-type="helpType"
      :current-level="currentLevel"
      @update:model-value="toggleHelpModal"
    />
  </span>
</template>

<script setup lang="ts">
import HelpModal from '@/components/help-modal/HelpModal.vue'
import { modalsEventsContexts } from '@/const/mixpanel-maps'
import { EButtonColor } from '@/types/shared/button'
import { EHelpType } from '@/types/staking'
import mixpanel from 'mixpanel-browser'
import { ref } from 'vue'
import GlowButton from '../ui/button/GlowButton.vue'

const props = withDefaults(
  defineProps<{
		helpType: EHelpType
		text?: string
		currentLevel?: number
		context?: string
		isButton?: boolean
	}>(),
  {
    text: '',
    currentLevel: 0,
    context: '',
    isButton: false,
  },
)

const emit = defineEmits<{
	(e: 'click'): void
}>()

const showHelpModal = ref(false)

const toggleHelpModal = (val: boolean) => {
  showHelpModal.value = val
}

const handleClick = () => {
  emit('click')
  toggleHelpModal(true)
  const key = props.helpType as keyof typeof modalsEventsContexts
  const event = modalsEventsContexts[key]
  if (event) {
    mixpanel.track(event, {
      entryPoint: props.context,
    })
  }
}
</script>
