<template>
  <BaseSheet v-model:open="openModel">
    <template #default="buttonProps">
      <SheetTrigger as-child>
        <slot
          name="trigger"
          v-bind="buttonProps"
        />
      </SheetTrigger>

      <SheetContent
        side="right"
        class="min-w-full min-[800px]:min-w-[800px] border-none bg-background pt-16 px-8 pb-8 overflow-y-auto"
      >
        <template #close>
          <SheetClose
            class="absolute right-8 top-8 text-light1 rounded-full size-10 bg-dark2 cursor-pointer hover:bg-dark3 hover:text-lavender flex items-center justify-center"
          >
            <X
              class="text-light1"
              :size="24"
            />
          </SheetClose>
        </template>

        <h2 class="text-lavender text-[56px] font-normal leading-10 tracking-[-2.8px] mb-4">
          {{ t('components.elementsSheet.yourElements') }}
        </h2>

        <ElementsList />
      </SheetContent>
    </template>
  </BaseSheet>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { BaseSheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import ElementsList from '@/components/rewards/ElementsList.vue'
import { useTranslation } from '@/composables/use-i18n'

const { t } = useTranslation()

const openModel = defineModel<boolean>('open', {
  required: true,
})
</script>