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
        class="min-w-full min-[800px]:min-w-[800px] border-none bg-background pt-16 px-[24.9999px] pb-8"
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

        <div class="flex flex-col gap-8 md:gap-18">
          <div class="px-[7px] flex items-end justify-between">
            <h2 class="text-lavender text-[42px] md:text-[56px] font-normal leading-10 tracking-[-2.8px] mb-4 break-words max-w-[280px]">
              {{ t('components.badgesSheet.yourAchievementBadges') }}
            </h2>
            <div class="flex items-center justify-center min-w-20 h-16 opacity-90 rounded-[48px] shadow-[inset_0px_0px_56px_-16px_rgba(28,28,41,0.40)] border border-gray-800">
              <span class="text-lavender text-[32px] font-normal leading-12 tracking-[-1.28px]">
                {{ earnedBadges }}<span class="text-purple-gray text-[20px] font-normal leading-8 tracking-[-0.6px]">/{{ maxBadges }}</span>
              </span>
            </div>
          </div>
          <div class="block overflow-scroll md:overflow-visible h-[calc(100vh-14.5rem)] md:h-full">
            <div class="flex flex-wrap justify-center md:justify-start">
              <BadgeObject
                v-for="badge in badges"
                :key="badge.id"
                :badge="badge"
                @handle-receive="() => handleReceive(badge)"
              />
            </div>
          </div>
        </div>
        <BadgeProgressModal
          :model-value="isProgressMintModalOpen"
          @update:model-value="isProgressMintModalOpen = false"
        />
        <BadgeMintModal
          :model-value="isMintModalOpen"
          @update:model-value="isMintModalOpen = false"
        />
      </SheetContent>
    </template>
  </BaseSheet>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { BaseSheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import BadgeObject from '@/components/rewards/badges/BadgeObject.vue'
import { useMyBadges } from '@/composables/my-badges'
import BadgeMintModal from '@/components/rewards/badges/BadgeMintModal.vue'
import BadgeProgressModal from './BadgeProgressModal.vue'
import { computed } from 'vue'
import { useTranslation } from '@/composables/use-i18n'

const { t } = useTranslation()

const openModel = defineModel<boolean>('open', {
  required: true,
})

const { badges, isMintModalOpen, isProgressMintModalOpen, handleReceive } = useMyBadges()

const maxBadges = computed(() => {
  return badges.value.length
})

const earnedBadges = computed(() => {
  return badges.value.filter((badge) => badge.isClaimed).length
})

</script>