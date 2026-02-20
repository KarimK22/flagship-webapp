<template>
  <section class="relative px-6 md:px-16 lg:px-24 py-20 overflow-hidden">
    <!-- Background glow -->
    <div class="absolute inset-0 pointer-events-none">
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(51,51,255,0.08)_0%,transparent_70%)]"
      />
    </div>

    <div class="relative max-w-5xl mx-auto">
      <div class="flex flex-col lg:flex-row items-center gap-12">
        <!-- Left: Wheel -->
        <div class="flex-shrink-0">
          <div class="relative w-[300px] h-[300px] md:w-[380px] md:h-[380px]">
            <!-- Outer glow ring -->
            <div
              class="absolute -inset-4 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(201,92,255,0.12)_0%,transparent_60%)]"
            />

            <!-- Wheel -->
            <svg
              viewBox="0 0 400 400"
              class="w-full h-full"
              :style="{ transform: `rotate(${wheelRotation}deg)`, transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none' }"
            >
              <defs>
                <linearGradient
                  v-for="(seg, i) in segmentColors"
                  :id="`seg-${i}`"
                  :key="i"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" :stop-color="seg.from" />
                  <stop offset="100%" :stop-color="seg.to" />
                </linearGradient>
              </defs>

              <!-- Outer ring -->
              <circle
                cx="200"
                cy="200"
                r="195"
                fill="none"
                stroke="#3a3a6e"
                stroke-width="3"
              />

              <!-- Segments -->
              <g
                v-for="(prize, i) in prizes"
                :key="i"
              >
                <path
                  :d="getSectionPath(i, prizes.length, 190)"
                  :fill="`url(#seg-${i % segmentColors.length})`"
                  stroke="#4a4a7e"
                  stroke-width="1.5"
                />
                <text
                  :transform="getTextTransform(i, prizes.length, 190)"
                  fill="#ffffff"
                  font-size="14"
                  font-weight="700"
                  text-anchor="middle"
                  style="text-shadow: 0 1px 3px rgba(0,0,0,0.5)"
                >
                  {{ prize }}
                </text>
              </g>

              <!-- Center -->
              <circle
                cx="200"
                cy="200"
                r="45"
                fill="#0C0C14"
                stroke="#3333FF"
                stroke-width="3"
              />
              <text
                x="200"
                y="205"
                fill="#C95CFF"
                font-size="15"
                font-weight="bold"
                text-anchor="middle"
              >
                LINGO
              </text>
            </svg>

            <!-- Pointer — larger and more prominent -->
            <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
              <div class="relative">
                <div
                  class="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[26px] border-t-[#FF7847] drop-shadow-[0_0_8px_rgba(255,120,71,0.6)]"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Info + CTA -->
        <div class="flex-1 text-center lg:text-left">
          <h2 class="text-3xl md:text-4xl font-bold text-lavender mb-4">
            Spin & Win<br>Guaranteed!
          </h2>
          <p class="text-purple-gray text-lg mb-6 max-w-md mx-auto lg:mx-0">
            Every stake earns you daily wheel spins. Every spin wins a prize — no
            empty slots. From Powermiles to premium rewards.
          </p>

          <!-- What you can win -->
          <div class="flex flex-wrap gap-3 mb-8 justify-center lg:justify-start">
            <span
              v-for="reward in rewardTypes"
              :key="reward"
              class="bg-[#1a1a3e] border border-[#262638] rounded-full px-4 py-2 text-sm text-lavender font-medium"
            >
              {{ reward }}
            </span>
          </div>

          <!-- Spin CTA -->
          <div class="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <button
              class="bg-gradient-to-r from-[#FF7847] to-[#FFBC70] text-white font-bold rounded-full px-8 py-3 text-base hover:opacity-90 transition-opacity shadow-[0_0_30px_rgba(255,120,71,0.25)]"
              :disabled="isSpinning"
              @click="handleSpin"
            >
              {{ isSpinning ? 'Spinning...' : 'Spin Now!' }}
            </button>
            <div class="flex items-center gap-2 bg-[rgba(14,14,26,0.8)] border border-[#262638] rounded-full px-4 py-2">
              <span class="text-3xl font-bold text-lavender">8</span>
              <span class="text-sm text-purple-gray">Spins<br>Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const prizes = ['$25 LINGO', 'Powermiles', '$50 USDC', 'Raffle Entry', '$25 LINGO', 'Powermiles']
const rewardTypes = ['USDC', 'Powermiles', 'Raffle Entries', 'LINGO Tokens', 'Premium Prizes']

const segmentColors = [
  { from: '#2a1540', to: '#1a0e2e' },  // deep purple
  { from: '#1a2a4a', to: '#0e1a3a' },  // deep blue
  { from: '#2a2a1e', to: '#1a1a0e' },  // deep amber
  { from: '#1a3a2a', to: '#0e2a1a' },  // deep teal
  { from: '#3a1a2a', to: '#2a0e1a' },  // deep rose
  { from: '#1a1a4a', to: '#0e0e3a' },  // deep indigo
]

const wheelRotation = ref(0)
const isSpinning = ref(false)

function handleSpin() {
  if (isSpinning.value) return
  isSpinning.value = true
  wheelRotation.value += 360 * 6 + Math.floor(Math.random() * 360)
  setTimeout(() => {
    isSpinning.value = false
  }, 4200)
}

function getSectionPath(index: number, total: number, radius: number): string {
  const angle = (2 * Math.PI) / total
  const startAngle = angle * index - Math.PI / 2
  const endAngle = startAngle + angle
  const cx = 200
  const cy = 200
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
  const cx = 200
  const cy = 200
  const textR = radius * 0.65
  const x = cx + textR * Math.cos(midAngle)
  const y = cy + textR * Math.sin(midAngle)
  const rotation = (midAngle * 180) / Math.PI + 90
  return `translate(${x}, ${y}) rotate(${rotation})`
}
</script>
