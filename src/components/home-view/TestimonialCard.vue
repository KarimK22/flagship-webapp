<template>
  <div
    class="w-[452px] cursor-pointer relative p-[1px] rounded-[17px] overflow-hidden bg-[rgba(38,38,56,1)]"
    @click="handleOpenTwitter"
  >
    <div class="rounded-xl overflow-hidden size-[136px] absolute top-0 left-0 blur-xl">
      <img
        :src="props.image"
        :alt="props.username"
        class="object-cover w-full h-full"
      >
    </div>
    <div
      class="w-full rounded-2xl p-2 bg-[rgba(38,38,56,0.50)] overflow-hidden relative shadow-[0px_0px_48px_-16px_#1C1C29_inset]"
    >
      <div class="flex items-start gap-2">
        <div class="rounded-xl overflow-hidden size-[136px] flex-shrink-0">
          <img
            :src="props.image"
            :alt="props.username"
            class="object-cover w-full h-full"
          >
        </div>
        <div class="flex flex-col p-2">
          <div class="flex items-center gap-2 mb-2 leading-8 text-base -tracking-tighter-x1 font-semibold">
            <img
              :src="`https://unavatar.io/twitter/${props.userHandle.replace('@', '')}`"
              :alt="props.username"
              class="size-8 rounded-full"
            >
            <div class="flex items-start gap-2 flex-wrap">
              <span
                class="text-sm text-lavender max-h-2"
              >{{ props.username }}</span>
              <span
                class="text-sm text-purple-gray"
              >{{ props.userHandle }} ‧ {{ DateTime.fromISO(props.postedOn).toFormat('MMM d') }}</span>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <p class="text-lavender text-xl tracking-tighter-x1 leading-6 max-w-[70%] line-clamp-3">
              {{ props.text }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Testimonial } from '@/services/api'
import { DateTime } from 'luxon'

const props = defineProps<Testimonial>()

const handleOpenTwitter = () => {
  window.open(props.url, '_blank')
}
</script>
