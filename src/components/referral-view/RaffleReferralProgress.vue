<script setup lang="ts">
import { computed } from 'vue'
import type { RaffleReferralProgress } from '@/services/api'
import InlineSvg from 'vue-inline-svg'
import ticketIcon from '@/assets/icons/ticket.svg'

const props = defineProps<{
  progress: RaffleReferralProgress
}>()

const lastMilestoneCount = computed(() => {
  const milestones = props.progress.milestones
  return milestones.length > 0 ? milestones[milestones.length - 1].count : 1
})

const progressPercent = computed(() => {
  const referred = props.progress.referredCount
  const max = lastMilestoneCount.value
  return Math.min((referred / max) * 100, 100)
})

const milestonePosition = (count: number) => {
  return (count / lastMilestoneCount.value) * 100
}
</script>

<template>
  <div class="bg-dark2/80 border border-dark3/60 rounded-2xl p-5 overflow-hidden">
    <div class="flex flex-col gap-4">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h4 class="text-base font-bold text-lavender tracking-tight">
            Referral Progress
          </h4>
          <p class="text-sm text-purple-gray mt-0.5">
            Refer friends to earn bonus raffle tickets
          </p>
        </div>
        <div class="flex items-center gap-1.5 bg-[#60A5FA]/10 border border-[#60A5FA]/20 rounded-full px-3 py-1">
          <span class="text-sm font-bold text-[#60A5FA]">
            {{ progress.referredCount }}
          </span>
          <span class="text-xs text-[#60A5FA]/70">referred</span>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="relative pt-2 pb-6">
        <!-- Track -->
        <div class="relative h-3 bg-background/60 border border-dark3/40 rounded-full overflow-hidden">
          <!-- Fill -->
          <div
            class="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#60A5FA] to-[#34D399] transition-all duration-500"
            :style="{ width: `${progressPercent}%` }"
          />
        </div>

        <!-- Milestone Markers -->
        <div
          v-for="milestone in progress.milestones"
          :key="milestone.count"
          class="absolute top-0"
          :style="{ left: `${milestonePosition(milestone.count)}%`, transform: 'translateX(-50%)' }"
        >
          <!-- Dot -->
          <div
            class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
            :class="milestone.achieved
              ? 'bg-[#34D399] border-[#34D399]/50'
              : 'bg-dark2 border-dark3/60'"
          >
            <svg
              v-if="milestone.achieved"
              class="w-3 h-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="3"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <!-- Label -->
          <div class="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap flex flex-col items-center">
            <span
              class="text-xs font-semibold"
              :class="milestone.achieved ? 'text-[#34D399]' : 'text-purple-gray'"
            >
              {{ milestone.count }} friend{{ milestone.count > 1 ? 's' : '' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Milestones List -->
      <div class="flex flex-col gap-2 mt-2">
        <div
          v-for="milestone in progress.milestones"
          :key="milestone.count"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
          :class="milestone.achieved
            ? 'bg-[#34D399]/[0.06] border border-[#34D399]/10'
            : 'bg-background/30 border border-dark3/30'"
        >
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            :class="milestone.achieved ? 'bg-[#34D399]/10' : 'bg-dark3/20'"
          >
            <InlineSvg
              :src="ticketIcon"
              unique-ids
              width="14"
              :class="milestone.achieved ? 'text-[#34D399]' : 'text-purple-gray/50'"
            />
          </div>
          <div class="flex-1 min-w-0">
            <p
              class="text-sm font-semibold"
              :class="milestone.achieved ? 'text-lavender' : 'text-purple-gray'"
            >
              Refer {{ milestone.count }} friend{{ milestone.count > 1 ? 's' : '' }}
            </p>
          </div>
          <div class="flex items-center gap-1">
            <span
              class="text-sm font-bold"
              :class="milestone.achieved ? 'text-[#34D399]' : 'text-purple-gray/60'"
            >
              +{{ milestone.tickets }}
            </span>
            <span
              class="text-xs"
              :class="milestone.achieved ? 'text-[#34D399]/70' : 'text-purple-gray/40'"
            >
              tickets
            </span>
          </div>
        </div>
      </div>

      <!-- Next milestone hint -->
      <div
        v-if="progress.nextMilestone"
        class="text-center text-xs text-purple-gray"
      >
        {{ progress.nextMilestone.count - progress.referredCount }} more referral{{ (progress.nextMilestone.count - progress.referredCount) > 1 ? 's' : '' }} to unlock +{{ progress.nextMilestone.tickets }} tickets
      </div>
    </div>
  </div>
</template>
