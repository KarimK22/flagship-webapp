<template>
  <div class="bg-[rgba(14,14,26,0.8)] border border-[#262638] rounded-2xl p-5 backdrop-blur-sm">
    <h3 class="text-base font-semibold text-lavender mb-4">Trading Boosts</h3>
    <div class="grid grid-cols-3 gap-3">
      <div
        v-for="(boost, i) in boosts"
        :key="i"
        class="bg-[#14141F] border border-[#262638] rounded-2xl p-4 flex flex-col cursor-pointer hover:border-[#3a3a5e] transition-colors relative min-h-[120px]"
      >
        <!-- Toggle circle at top-right -->
        <div
          class="absolute top-3 right-3 w-7 h-7 rounded-full border-2 flex items-center justify-center"
          :class="boost.active ? 'border-[#FFBC70] bg-[rgba(255,188,112,0.1)]' : 'border-[#262638] bg-[#262638]'"
        >
          <div
            v-if="boost.active"
            class="w-2.5 h-2.5 rounded-full bg-[#FFBC70]"
          />
        </div>
        <!-- Value -->
        <span class="text-3xl font-bold text-lavender mt-auto">{{ boost.value }}</span>
        <!-- Label -->
        <span class="text-xs text-purple-gray leading-tight mt-1">{{ boost.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  boosts: Array<{
    value: string
    label: string
    active: boolean
  }>
}>()
</script>
