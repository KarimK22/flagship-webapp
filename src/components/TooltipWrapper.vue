<script setup lang="ts">
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger class="w-full h-full">
        <slot />
      </TooltipTrigger>
      <TooltipContent>
        <slot name="content" />
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>