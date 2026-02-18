<template>
  <RewardInfoWidget
    variant="purple"
    :value="earnedBadges"
    :max-value="maxBadges"
  >
    <template #button>
      <BadgesSheet v-model:open="isBadgesSheetOpen">
        <template #trigger>
          <GlowButton
            class="w-full"
            :color="EButtonColor.BLUE"
          >
            {{ t('components.badgesWidget.yourBadges') }}
          </GlowButton>
        </template>
      </BadgesSheet>
    </template>
  </RewardInfoWidget>
</template>
<script setup lang="ts">
import { EButtonColor } from '@/types/shared/button.ts'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import BadgesSheet from '@/components/rewards/badges/BadgesSheet.vue'
import { computed } from 'vue'
import RewardInfoWidget from '@/components/rewards/RewardInfoWidget.vue'
import { useMyBadges } from '@/composables/my-badges'
import { useTranslation } from '@/composables/use-i18n'

const { t } = useTranslation()

const { isBadgesSheetOpen, badges } = useMyBadges()

const maxBadges = computed(() => {
  return badges.value.length
})

const earnedBadges = computed(() => {
  return badges.value.filter((badge) => badge.isClaimed).length
})
</script>