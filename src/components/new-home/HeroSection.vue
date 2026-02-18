<template>
  <section class="relative px-6 md:px-16 lg:px-24 pb-8">
    <!-- Background glow effects -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(51,51,255,0.12)_0%,transparent_70%)]" />
      <div class="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(201,92,255,0.08)_0%,transparent_70%)]" />
    </div>

    <!-- Top row: Welcome + Spins Ready -->
    <div class="relative flex items-start justify-between mb-8">
      <div>
        <p class="text-purple-gray text-lg font-medium">Welcome Back,</p>
        <h2 class="text-2xl md:text-3xl font-bold text-lavender">
          <span class="text-orange-400">🔥</span> {{ username }}!
        </h2>
      </div>
      <div class="flex flex-col items-center bg-[rgba(14,14,26,0.8)] border border-[#262638] rounded-2xl px-6 py-4 backdrop-blur-sm">
        <span class="text-4xl font-bold text-lavender">{{ spinsReady }}</span>
        <span class="text-sm text-purple-gray">Spins Ready</span>
      </div>
    </div>

    <!-- Wheel Area -->
    <div class="relative flex flex-col items-center">
      <!-- Wheel Visual -->
      <div class="relative w-[320px] h-[320px] md:w-[420px] md:h-[420px]">
        <!-- Outer ring -->
        <div class="absolute inset-0 rounded-full border-2 border-[#262638]" />
        <!-- Wheel segments -->
        <svg
          viewBox="0 0 420 420"
          class="w-full h-full"
          :style="{ transform: `rotate(${wheelRotation}deg)`, transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none' }"
        >
          <defs>
            <linearGradient
              id="wheelGradient1"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stop-color="#1a1a3e"
              />
              <stop
                offset="100%"
                stop-color="#0C0C14"
              />
            </linearGradient>
            <linearGradient
              id="wheelGradient2"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stop-color="#1e1e4a"
              />
              <stop
                offset="100%"
                stop-color="#12122a"
              />
            </linearGradient>
          </defs>
          <!-- Wheel sections -->
          <g
            v-for="(prize, i) in wheelPrizes"
            :key="i"
          >
            <path
              :d="getWheelSectionPath(i, wheelPrizes.length, 200)"
              :fill="i % 2 === 0 ? 'url(#wheelGradient1)' : 'url(#wheelGradient2)'"
              stroke="#2a2a5e"
              stroke-width="1"
            />
            <text
              :transform="getTextTransform(i, wheelPrizes.length, 200)"
              fill="#e0d4f0"
              font-size="14"
              font-weight="600"
              text-anchor="middle"
            >
              {{ prize }}
            </text>
          </g>
          <!-- Center circle -->
          <circle
            cx="210"
            cy="210"
            r="50"
            fill="#0C0C14"
            stroke="#3333FF"
            stroke-width="2"
          />
          <!-- Center Lingo logo placeholder -->
          <text
            x="210"
            y="215"
            fill="#C95CFF"
            font-size="16"
            font-weight="bold"
            text-anchor="middle"
          >
            LINGO
          </text>
        </svg>
        <!-- Wheel pointer (top) -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
          <div class="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-[#FF7847]" />
        </div>
      </div>

      <!-- Daily Spins Badge -->
      <div class="flex items-center gap-2 mt-6 mb-3">
        <span class="text-purple-gray text-sm font-medium">Daily Spins</span>
        <span class="bg-[rgba(14,14,26,0.8)] border border-[#262638] rounded-full px-3 py-1 text-xs text-lavender font-semibold">
          DAY {{ dayStreak }}
        </span>
      </div>

      <!-- Heading -->
      <h1 class="text-3xl md:text-5xl font-bold text-lavender text-center mb-6 tracking-tight leading-tight">
        Spin & Win<br>Guaranteed!
      </h1>

      <!-- Claim Powermiles -->
      <div class="flex items-center gap-3 bg-[rgba(14,14,26,0.8)] border border-[#262638] rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
        <span class="text-sm text-purple-gray">Claim Your Powermiles</span>
        <div class="flex items-center gap-2">
          <div class="w-5 h-5 rounded-full bg-gradient-to-br from-[#FF7847] to-[#FFBC70] flex items-center justify-center">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M6 1L7.5 4.5L11 6L7.5 7.5L6 11L4.5 7.5L1 6L4.5 4.5L6 1Z"
                fill="white"
              />
            </svg>
          </div>
          <span class="text-lavender font-bold text-lg">+{{ claimablePowermiles }}</span>
        </div>
        <button class="bg-gradient-to-r from-[#FF7847] to-[#FFBC70] text-white font-semibold rounded-full px-4 py-1.5 text-sm hover:opacity-90 transition-opacity">
          Claim Now!
        </button>
      </div>

      <!-- Spin Button -->
      <button
        class="bg-gradient-to-r from-[#FF7847] to-[#FFBC70] text-white font-bold rounded-full px-10 py-3 text-lg hover:opacity-90 transition-opacity shadow-[0_0_30px_rgba(255,120,71,0.3)]"
        @click="handleSpin"
      >
        Spin Now!
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  username: string
  spinsReady: number
  dayStreak: number
  claimablePowermiles: number
  wheelPrizes: string[]
}>()

const wheelRotation = ref(0)
const isSpinning = ref(false)

function handleSpin() {
  if (isSpinning.value) return
  isSpinning.value = true
  const extraRotation = 360 * 6 + Math.floor(Math.random() * 360)
  wheelRotation.value += extraRotation
  setTimeout(() => {
    isSpinning.value = false
  }, 4200)
}

function getWheelSectionPath(index: number, total: number, radius: number): string {
  const angle = (2 * Math.PI) / total
  const startAngle = angle * index - Math.PI / 2
  const endAngle = startAngle + angle
  const cx = 210
  const cy = 210
  const x1 = cx + radius * Math.cos(startAngle)
  const y1 = cy + radius * Math.sin(startAngle)
  const x2 = cx + radius * Math.cos(endAngle)
  const y2 = cy + radius * Math.sin(endAngle)
  const largeArc = angle > Math.PI ? 1 : 0
  return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
}

function getTextTransform(index: number, total: number, radius: number): string {
  const angle = (2 * Math.PI) / total
  const midAngle = angle * index + angle / 2 - Math.PI / 2
  const cx = 210
  const cy = 210
  const textR = radius * 0.65
  const x = cx + textR * Math.cos(midAngle)
  const y = cy + textR * Math.sin(midAngle)
  const rotation = (midAngle * 180) / Math.PI + 90
  return `translate(${x}, ${y}) rotate(${rotation})`
}
</script>
