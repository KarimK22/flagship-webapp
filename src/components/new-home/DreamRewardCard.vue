<template>
  <section class="px-6 md:px-16 lg:px-24 mt-10">
    <div class="relative bg-[rgba(14,14,26,0.8)] border border-[#262638] rounded-2xl p-6 md:p-8 backdrop-blur-sm overflow-hidden">
      <!-- Background glow -->
      <div class="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(201,92,255,0.1)_0%,transparent_70%)] pointer-events-none" />
      <div class="absolute bottom-0 left-1/3 w-[200px] h-[200px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(51,51,255,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div class="relative flex flex-col md:flex-row items-center gap-6">
        <!-- Left: Title & Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-sm text-purple-gray font-medium">Dream Reward</span>
            <span class="text-sm text-[#FFBC70] font-semibold">·</span>
            <span class="text-sm text-[#FFBC70] font-bold">${{ value.toLocaleString() }}</span>
          </div>
          <h3 class="text-2xl md:text-3xl font-bold text-lavender leading-tight">
            {{ title }}
          </h3>
          <!-- Countdown -->
          <div class="flex items-center gap-2 mt-4">
            <span class="text-sm text-purple-gray">Drawing in</span>
            <span class="bg-[#1a1a3e] border border-[#262638] rounded-lg px-3 py-1 text-sm text-lavender font-semibold">{{ daysLeft }}d</span>
            <span class="bg-[#1a1a3e] border border-[#262638] rounded-lg px-3 py-1 text-sm text-lavender font-semibold">{{ hoursLeft }}h</span>
          </div>
        </div>

        <!-- Center: Image -->
        <div class="flex-shrink-0 w-[200px] h-[160px] md:w-[260px] md:h-[200px] flex items-center justify-center">
          <div class="relative w-full h-full flex items-center justify-center">
            <!-- Placeholder glow behind image -->
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,92,255,0.15)_0%,rgba(51,51,255,0.08)_50%,transparent_70%)] rounded-lg" />
            <img
              v-if="imageUrl"
              :src="imageUrl"
              :alt="title"
              class="relative max-w-full max-h-full object-contain z-10"
            >
            <!-- Fallback if no image -->
            <div
              v-else
              class="relative z-10 text-6xl"
            >
              🖥️
            </div>
          </div>
        </div>

        <!-- Right: Dream Score Ring -->
        <div class="flex flex-col items-center">
          <div class="relative w-[120px] h-[120px]">
            <svg
              viewBox="0 0 120 120"
              class="w-full h-full -rotate-90"
            >
              <defs>
                <linearGradient
                  id="scoreGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop
                    offset="0%"
                    stop-color="#C95CFF"
                  />
                  <stop
                    offset="100%"
                    stop-color="#3333FF"
                  />
                </linearGradient>
              </defs>
              <!-- Background track -->
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#1a1a3e"
                stroke-width="6"
              />
              <!-- Progress arc -->
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="url(#scoreGradient)"
                stroke-width="6"
                stroke-linecap="round"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="circumference - (circumference * progress)"
              />
            </svg>
            <!-- Score text -->
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-2xl font-bold text-lavender">{{ score.toLocaleString() }}</span>
              <span class="text-[10px] text-purple-gray leading-tight">Your Dream Score</span>
            </div>
          </div>
          <button class="mt-3 bg-gradient-to-r from-[#FF7847] to-[#FFBC70] text-white font-semibold rounded-full px-5 py-1.5 text-sm hover:opacity-90 transition-opacity">
            Boost!
          </button>
          <!-- Rank -->
          <p class="text-xs text-purple-gray mt-2">
            #{{ rank }} place of {{ totalParticipants }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  value: number
  score: number
  maxScore: number
  rank: number
  totalParticipants: number
  daysLeft: number
  hoursLeft: number
  imageUrl?: string
}>()

const circumference = 2 * Math.PI * 52
const progress = computed(() => Math.min(props.score / props.maxScore, 1))
</script>
