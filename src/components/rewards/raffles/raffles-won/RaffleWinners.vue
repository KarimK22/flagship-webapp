<template>
  <div>
    <div class="flex items-center gap-1 cursor-pointer">
      <p class="text-purple-gray text-sm leading-6 font-semibold tracking-[0.28px]">
        {{ $t('components.raffleWinners.allWinners') }}
      </p>
      <div class="size-6 bg-dark3 rounded-full flex items-center justify-center">
        <InlineSvg
          :src="eye"
          class="w-4"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import eye from '@/assets/icons/eye.svg'

</script>