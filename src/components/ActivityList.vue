<template>
  <div class="w-full">
    <div
      v-if="hasActivities"
      class="flex w-full flex-col gap-2 flex-1 max-md:justify-center max-md:items-center"
    >
      <TransitionGroup
        name="activity-fade"
        tag="div"
        class="flex flex-col gap-2 w-full"
        @after-enter="onAfterEnter"
      >
        <ActivityItemPlaceholder
          v-if="isLoading"
          :length="3"
        />
        <div
          v-for="(activity, key) in activities"
          v-else
          :ref="(el) => { activityListRef.push(el as Element) }"
          :key="key"
          class="flex gap-4"
          :class="{ 'cursor-pointer': itemsClickable }"
          @click="emit('activityClick', key)"
        >
          <div v-if="activity.referenceImageSrc !== undefined && activity.referenceImageSrc !== null">
            <div
              class="ref-image w-24 h-24 bg-white/20 rounded-2xl bg-cover bg-center bg-no-repeat"
              :class="imageClass"
              :style="{ backgroundImage: `url(${activity.referenceImageSrc})` }"
            />
          </div>
          <div
            class="flex flex-col justify-center w-full"
            :class="activity.buttonLabel ? 'gap-0.5': 'gap-1'"
          >
            <div class="flex gap-1 items-center justify-between">
              <span
                class="text-purple-gray text-sm"
                :class="activity.buttonLabel ? 'leading-6' : 'leading-8'"
              >
                {{ activity.title }}
              </span>
              <span
                v-if="activity.secondaryDescription"
                class="text-purple-gray text-sm leading-6 p-0 m-0 tracking-[0.14px]"
              >
                {{ activity.secondaryDescription }}
              </span>
            </div>

            <div class="text-purple text-xl leading-6 tracking-tighter-x1 relative">
              <component
                :is="activity.description"
                v-if="isVNode(activity.description)"
              />
              <span v-else>
                {{ activity.description }}
              </span>
            </div>
            <GlowButton
              v-if="activity.buttonLabel && activity.buttonAnimated"
              :color="EButtonColor.BLUE"
              class="min-w-[138px] self-start"
              @click="emit('actionButtonClick', key)"
            >
              {{ activity.buttonLabel }}
            </GlowButton>
            <div
              v-if="activity.buttonLabel && !activity.buttonAnimated && !activity.actionButton"
              class="self-start inline-flex items-center gap-2 cursor-pointer bg-dark1 pl-2 pr-1 rounded-full w-auto"
            >
              <p class="text-purple-gray text-sm leading-6 font-semibold tracking-[0.14px]">
                {{ activity.buttonLabel }}
              </p>
              <InlineSvg
                :src="eye"
                class="w-4"
              />
            </div>
          </div>
        </div>
        <ActivityItemPlaceholder
          v-if="isLoadingMore"
          :length="3"
        />
      </TransitionGroup>
    </div>
    <div
      v-else
      class="flex w-full flex-col gap-3 flex-1 justify-center items-center relative rounded-2xl h-[13rem]"
    >
      <CardBackground
        class="absolute top-0 left-0 w-full h-full"
        :variant="variant"
      />
      <GlowText
        :text="emptyText"
        :variant="variant"
        class="max-w-[328px]"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, isVNode, ref } from 'vue'
import GlowText from '@/components/glow-text/GlowText.vue'
import CardBackground from '@/components/textures/CardBackground.vue'
import ActivityItemPlaceholder from '@/components/ActivityItemPlaceholder.vue'
import type { ActivityItem } from '@/composables/contracts/activities-history.ts'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button.ts'
import eye from '@/assets/icons/eye.svg'

const activityListRef = ref<Element[]>([])
const props = withDefaults(
  defineProps<{
        activities: ActivityItem[]
        emptyText: string
        variant?: 'orange' | 'purple'
        isLoading?: boolean
        isLoadingMore?: boolean
        itemsClickable?: boolean
				imageClass?: string
    }>(),
  {
    variant: 'orange',
    isLoading: false,
    isLoadingMore: false,
    itemsClickable: false,
    imageClass: '',
  },
)

const emit = defineEmits<{
    (e: 'activityClick', index: number): void
    (e: 'actionButtonClick', index: number): void
    (e: 'transitionComplete'): void
}>()

const hasActivities = computed(() => props.activities.length > 0)

const onAfterEnter = () => {
  emit('transitionComplete')
}

const scrollToItem = (index: number) => {
  const item = activityListRef.value[index]
  if (item) {
    item.scrollIntoView({ behavior: 'smooth' })
  }
}

const scrollToLastActivity = () => {
  scrollToItem(activityListRef.value.length - 1)
}

defineExpose({
  scrollToLastActivity,
  scrollToItem,
})
</script>

<style scoped>
.activity-fade-enter-active,
.activity-fade-leave-active {
	transition: all 0.5s ease;
}

.activity-fade-enter-from {
	opacity: 0;
	transform: translateY(20px);
}

.activity-fade-leave-to {
	opacity: 0;
	transform: translateY(-20px);
}
</style>
