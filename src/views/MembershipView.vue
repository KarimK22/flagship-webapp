<script setup lang="ts">
import BenefitsTable from '@/components/membership/BenefitsTable.vue'
import PageHero from '@/components/membership/PageHero.vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { useGetMe } from '@/composables/get-me'
import { useTranslation } from '@/composables/use-i18n'
import discordIcon from '@/assets/icons/orange-discord.svg'
import { useDiscord } from '@/composables/use-discord'

const { isConnected } = useGetMe()
const { isConnected: isDiscordConnected, joinDiscord } = useDiscord()
const { t } = useTranslation()
</script>

<template>
  <div class="mb-8 mt-4 md:mt-[88px] ">
    <PageHero
      v-if="isConnected"
    />
    <div class="container max-w-[1320px] mb-12">
      <div
        v-if="!isDiscordConnected && isConnected"
        class="flex flex-col items-center justify-center gap-4 mb-16 -mt-16"
      >
        <h3 class="text-[24px] md:text-[32px] text-lavender tracking-[-1.28px] leading-6 md:leading-8 text-center">
          {{ $t('membership.joinDiscord') }}
        </h3>
        <GlowButton
          class="w-[183px]"
          @click="joinDiscord"
        >
          <InlineSvg
            :src="discordIcon"
            class="size-6 mr-1"
          />
          {{ $t('membership.joinNow') }}
        </GlowButton>
      </div>
      <h2 class="text-[56px] md:text-[64px] text-lavender tracking-[-2.56px] leading-14 md:leading-20 text-center mb-8 md:mb-12">
        {{ t('membership.exploreBenefits') }}
      </h2>
      <BenefitsTable />
    </div>
  </div>
</template>