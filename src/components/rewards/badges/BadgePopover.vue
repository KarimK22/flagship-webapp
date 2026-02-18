<template>
  <div class="w-52 h-auto rounded-2xl p-4">
    <div class="contents">
      <div class="blur-[1px] absolute top-0 left-0 w-full h-full">
        <div class="gradient-border p-[1px]" />
      </div>
      <div class="blur-[1px] absolute top-0 left-0 w-full h-full">
        <div class="gradient-border light p-[1px]" />
      </div>
      <div class="blur-[24px] opacity-40 absolute top-0 left-0 w-full h-full">
        <div class="gradient-border p-[2px]" />
      </div>
      <div class="blur-[16px] opacity-64 absolute top-0 left-0 w-full h-full">
        <div class="gradient-border p-[2px]" />
      </div>
      <div class="blur-[6px] opacity-80 absolute top-0 left-0 w-full h-full">
        <div class="gradient-border p-[2px]" />
      </div>
    </div>
    <div class="left-0 top-0 absolute backdrop-blur-[32px] bg-[rgba(11,11,19,0.88)] rounded-2xl w-full h-full">
      <div class="w-full h-full left-0 top-0 absolute rounded-2xl shadow-[inset_0px_-28px_24px_0px_rgba(222,206,235,0.08)] mix-blend-plus-lighter" />
      <div class="w-full h-full left-0 top-0 absolute opacity-66 mix-blend-color-dodge bg-[radial-gradient(ellipse_111.80%_343.56%_at_100.00%_50.00%,_#C95CFF_0%,_rgba(201,_92,_255,_0)_64%)] rounded-2xl" />
    </div>

    <div class="flex flex-col gap-2">
      <BadgeTitle
        :text="badge.name"
        text-color="#D4C5EB"
        :letter-spacing="-3.36"
        :font-weight="400"
        :font-size="48"
        align="left"
        variant="top-light"
        class="h-10 z-1 [&>svg]:w-full [&>svg]:h-10"
        :view-box="`0 0 200 40`"
        :blur-layers="[{ value: 1.3, opacity: 0.6 }, { value: 2, opacity: 0.8 }, { value: 3, opacity: 0.9 }]"
      />

      <span class="text-[#D4C5EB] text-sm font-semibold leading-4 z-1 opacity-88 -tracking-[0.28px]">
        {{ $t(`badgesDescription.${badge.description}`) }}
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Badge } from '@/const/badges'
import BadgeTitle from '@/components/rewards/badges/BadgeTitle.vue'

defineProps<{
  badge: Badge
}>()
</script>

<style scoped>
.gradient-border {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: linear-gradient(to right,
      transparent 0%,
      transparent 40%,
      #c95cff 100%);
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  background-clip: border-box;
  box-sizing: border-box;
}

</style>