<template>
  <div class="flex flex-col gap-2 md:gap-4 w-full md:w-full">
    <div class="flex flex-col md:flex-row items-left gap-3 md:gap-4">
      <h1 class="text-lavender text-5xl leading-10 font-medium tracking-[-2.4px]">
        {{ t('modals.helpModal.myLevel.title') }}
      </h1>
      <p
        class="text-purple-gray w-full md:w-auto text-sm md:text-base self-baseline leading-6 tracking-[0.14px] bg-[rgba(38,38,56,0.4)] inset-shadow-[0px_-4px_16px_-2px_rgba(222,206,235,0.08)] rounded-2xl md:rounded-[80px] py-2 px-3.5 align-bottom inline-block"
      >
        {{ t('modals.helpModal.myLevel.description') }}
      </p>
    </div>
    <div class="flex flex-col md:flex-row-reverse items-center justify-center">
      <div
        v-for="level in levelsInfo"
        :key="level.id"
        class="flex flex-row-reverse md:flex-col gap-0 md:gap-2 lg:gap-4 justify-center items-center"
      >
        <div
          class="!size-32 lg:!size-48 self-center"
          :class="{ '!size-48 lg:!size-80 md:!size-48': currentLevel === level.value }"
        >
          <Transition name="fade">
            <div
              v-if="level.imageUrl"
              class="relative"
            >
              <InlineSvg
                v-if="currentLevel === level.value"
                :src="shade"
                class="absolute scale-50 md:scale-100 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                unique-ids
              />
              <img
                :src="level.imageUrl"
                alt="Level Medal"
                class="w-full h-full"
                width="352"
                height="352"
              >
            </div>
          </Transition>
        </div>
        <div class="flex flex-row-reverse w-34 h-40 md:h-auto md:flex-col text-lavender justify-between items-center md:w-full">
          <span class="text-purple-gray whitespace-nowrap w-16 md:w-auto text-xs md:text-sm font-semibold tracking-[0.42px]">
            {{ level.description }}
          </span>
          <div class="flex flex-col md:flex-row h-full md:w-full md:h-6 justify-center items-center">
            <InlineSvg
              :src="powerMilesIcon"
              class="size-6"
            />
            <div
              class="flex flex-col h-full md:flex-row md:w-full justify-between items-center -mt-2 md:mt-0 -mb-[7px] md:mb-0 md:-mr-1.5 md:ml-[-7px]"
              :class="{ '-mt-3 md:!-ml-3.5': currentLevel === level.value }"
            >
              <InlineSvg
                :src="starIcon"
                class="!size-4 z-10"
                :class="{ '!size-8': currentLevel === level.value }"
                unique-ids
              />
              <div
                class="light-line"
                :class="{ 'active-line': currentLevel === level.value }"
              />
              <InlineSvg
                :src="starIcon"
                class="!size-4 z-10"
                :class="{ '!size-8': currentLevel === level.value }"
                unique-ids
              />
            </div>
          </div>
          <span class="text-[#D4C5EB] text-right md:text-left whitespace-nowrap w-18 md:w-auto text-sm md:text-[20px] tracking-[-0.2px]">
            >{{ formatNumberToUS(level.minValue) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import powerMilesIcon from '@/assets/images/bolt.svg'
import starIcon from '@/assets/icons/star.svg'
import shade from '@/assets/images/medals/shade.svg'
import InlineSvg from 'vue-inline-svg'
import { formatNumberToUS } from '@/composables/helpers.ts'
import { useUserLevel } from '@/composables/user-level'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { levelsInfo } = useUserLevel()

defineProps<{
	currentLevel?: number
}>()
</script>

<style scoped>
.light-line {
	position: relative;
	width: 100%;
	&::before {
		content: '';
		pointer-events: none;
		position: absolute;
		top: -0.5px;
		left: -6px;
		width: calc(100% + 12px);
		height: 1px;
		background-color: #d4c5eb;
		box-shadow: 0px 0px 2px 0px var(--color-purple-gray), 0px 0px 4px 0px #d4c5eb, 0px 0px 6px 0px #d4c5eb;
	}
}

.light-line.active-line::before {
	left: -12px;
	width: calc(100% + 24px);
	background-color: #d4c5eb;
	box-shadow: 0px 0px 2px 0px #ff7847, 0px 0px 4px 0px #d4c5eb, 0px 0px 6px 0px #ffbc70, 0px 0px 8px 0px #ffbc70, 0px 0px 12px 0px #ffbc70;
}

@media (max-width: 768px) {
	.light-line {
		height: 100%;
		width: 1px;
		&::before {
			top: -6px;
			left: -0.5px;
			width: 1px;
			height: calc(100% + 12px);
		}
	}

	.light-line.active-line::before {
		height: calc(100% + 24px);
		width: 1px;
		top: -12px;
		left: -0.5px;
	}
}
</style>
