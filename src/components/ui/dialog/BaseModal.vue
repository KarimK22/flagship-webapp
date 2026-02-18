<template>
  <!-- TODO: maybe we can use v-model instead, and move the classes that control responsiveness as well -->
  <BaseDialog
    :open="modelValue"
    @update:open="(val: boolean) => emit('update:modelValue', val)"
  >
    <DialogContent
      class="base-modal-content max-h-[90%] xs:h-auto max-w-full xs:max-w-[420px] border-0 rounded-2xl bg-dark2/80 shadow-inner shadow-background/80 outline-none overflow-x-hidden before:content-[''] before:absolute before:inset-0 before:bg-no-repeat before:bg-top-center before:bg-contain"
      v-bind="$attrs"
      :show-close-button="showCloseButton"
      @open-auto-focus.prevent
    >
      <template
        v-if="showCloseButton"
        #close
      >
        <DialogClose

          aria-label="Close"
          as="button"
          class="absolute top-4 right-4 z-20 outline-none"
        >
          <div
            class="flex items-center justify-center size-10 rounded-full bg-light1/[0.02%] cursor-pointer backdrop-blur-[2px] shadow-[inset_0px_-28px_24px_-16px_rgba(222,206,235,0.08)] hover:shadow-[inset_0px_-28px_24px_-16px_rgba(222,206,235,0.20)]"
          >
            <X class="size-5 text-purple-gray" />
          </div>
          <span class="sr-only">close</span>
        </DialogClose>
      </template>

      <DialogHeader v-if="$slots.header">
        <slot name="header" />
      </DialogHeader>

      <DialogTitle v-show="title">
        {{ title }}
      </DialogTitle>

      <DialogDescription
        v-show="description"
        class="z-10"
      >
        <slot name="description">
          {{ description }}
        </slot>
      </DialogDescription>

      <slot />

      <DialogFooter
        v-if="$slots.footer"
        class="w-auto"
      >
        <slot name="footer" />
      </DialogFooter>
    </DialogContent>
  </BaseDialog>
</template>

<script setup lang="ts">
import {
  BaseDialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog/index.ts'
import { X } from 'lucide-vue-next'

withDefaults(
  defineProps<{
		modelValue: boolean
		title?: string
		description?: string
		showCloseButton?: boolean
	}>(),
  {
    title: undefined,
    description: undefined,
    showCloseButton: true,
  },
)

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void
}>()
</script>
