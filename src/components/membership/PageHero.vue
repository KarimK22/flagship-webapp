<script setup lang="ts">
import { useTranslation } from '@/composables/use-i18n'
import texture from '@/assets/images/membership/texture.png'
import pageBg from '@/assets/images/membership/page-bg.svg'
import BadgeTitle from '@/components/rewards/badges/BadgeTitle.vue'
import { useMediaQuery } from '@vueuse/core'
import { computed } from 'vue'
import { useGetMe } from '@/composables/get-me'
import { DateTime } from 'luxon'
import { useMyBadges } from '@/composables/my-badges'
import { BADGE_ID } from '@/types/shared/badge'
import { formatNumberToUS } from '@/composables/helpers'
import { useStakes } from '@/composables/contracts/stakes'
import { useMembershipAssets } from '@/composables/use-memebership-assets'

const { t } = useTranslation()
const isSmallScreen = useMediaQuery('(max-width: 768px)')
const { meData, loadingGetMe } = useGetMe()
const { badges } = useMyBadges()
const { totalStakedLingo } = useStakes()

const variant = computed(() => {
  if (badges.value.some((b) => b.isClaimed && b.id === BADGE_ID.WHALE)) return 'gold'
  if (badges.value.some((b) => b.isClaimed && b.id === BADGE_ID.ENJOYER)) return 'silver'
  return 'default'
})

const { properties, waves, stroke, fill, badge } = useMembershipAssets()

const holdings = computed(() => {
  return `${formatNumberToUS(totalStakedLingo.value)} LINGO`
})
const memberSince = computed(() => {
  if (!meData.value?.createdAt) return ''
  return DateTime.fromISO(meData.value.createdAt).toFormat('MMM yyyy')
})

</script>

<template>
  <div
    v-if="!loadingGetMe && totalStakedLingo > 0"
    class="container h-[760px] relative"
  >
    <InlineSvg
      :src="pageBg"
      unique-id="page-bg"
      :style="{
        '--color': properties.lightColor,
      }"
      :class="{
        '[&>.left-light]:hidden! [&>.right-light]:-translate-x-[230px]': variant === 'default',
      }"
      class="absolute hidden md:block top-[-240px] left-1/2 -translate-x-1/2 w-[100vw] h-[1200px]"
    />
    <div class="flex flex-col gap-12 h-[488px]">
      <div class="flex flex-col gap-0 items-center">
        <h1
          v-if="variant === 'default'"
          class="text-6xl md:text-8xl text-lavender tracking-[-3.84px] leading-18 text-center"
          v-html="t('components.pageHero.normalStaker')"
        >
        </h1>
        <h1
          v-else
          class="text-6xl md:text-8xl text-lavender tracking-[-3.84px] leading-16 md:leading-20 text-center"
        >
          {{ t('components.pageHero.youAre') }} {{ variant === 'silver' ? t('components.pageHero.articleAn') : t('components.pageHero.articleA') }} <BadgeTitle
            :text="properties.name"
            :text-color="properties.text"
            :light-color="properties.lightColor"
            align="left"
            vertical-align="bottom"
            :letter-spacing="-1.28"
            :font-weight="400"
            :font-size="96"
            class="h-24 z-1 [&>svg]:w-full [&>svg]:h-24 inline-block align-middle"
            :view-box="`0 0 ${properties.name.length * properties.letterSpacing} 100`"
            variant="top-light-cover"
            :blur-layers="properties.blurLayers"
          />
        </h1>
        <p
          v-if="variant === 'silver'"
          class="text-lavender text-[32px] tracking-[-1.28px] leading-8"
        >
          {{ t('components.pageHero.welcomeToLingoClub') }}
        </p>
        <p
          v-if="variant === 'gold'"
          class="text-lavender text-[32px] tracking-[-1.28px] leading-8"
          v-html="t('components.pageHero.welcomeToVIPClub')"
        >
        </p>
      </div>
      <div
        :style="{ backgroundImage: `url(${fill})`, backgroundSize: variant === 'default' ? '1600px 1000px' : '100% 100%' }"
        class="relative w-full h-[400px] md:w-[720px] md:h-[328px]  rounded-2xl bg-no-repeat bg-cover bg-center"
      >
        <img
          v-if="variant !== 'default'"
          :src="texture"
          class="absolute top-0 left-0 w-full h-full object-cover mix-blend-plus-darker rounded-2xl"
        >
        <div
          class="absolute top-0 left-0 w-full h-full rounded-t-2xl border-t-1 border-dark3"
          :class="{
            '': variant === 'default',
            'bg-[linear-gradient(180deg,#D4C5EB_0%,rgba(12,12,20,0.00)_88%)] opacity-40': variant === 'silver',
            'bg-[linear-gradient(180deg,#FFBC70_0%,rgba(12,12,20,0.00)_88%)] opacity-32': variant === 'gold',
          }"
        />
        <InlineSvg
          v-if="stroke"
          :src="stroke"
          unique-id="stroke-blur"
          class="absolute top-0 left-0 w-full h-auto md:w-[720px] md:h-[328px] blur-[3px]"
        />
        <InlineSvg
          v-if="stroke"
          :src="stroke"
          unique-id="stroke"
          class="absolute top-0 left-0 w-full h-auto md:w-[720px] md:h-[328px]"
        />
        <div class="flex flex-col md:flex-row justify-between items-center gap-0 absolute top-0 left-0 w-full h-[400px] md:w-[720px] md:h-[328px] z-10 p-8">
          <div class="flex flex-col gap-0 w-full text-center md:text-left">
            <span class="text-[32px] text-lavender tracking-[-1.6px] leading-8">
              {{ t('components.pageHero.holdings') }}
            </span>
            <BadgeTitle
              :text="holdings"
              :text-color="properties.text"
              :light-color="properties.lightColor"
              :align="isSmallScreen ? 'center' : 'left'"
              :letter-spacing="-1.28"
              :font-weight="400"
              :font-size="32"
              class="h-8 z-1 [&>svg]:w-full [&>svg]:h-8 inline-block md:flex"
              :view-box="`0 0 220 32`"
              variant="top-light-cover"
              :blur-layers="properties.blurLayers"
            />
          </div>

          <div class="flex-shrink-0 w-[190px] h-[180px] md:w-[244px] md:h-[232px] relative">
            <img
              :src="badge"
              class="w-full h-full object-cover absolute top-0 left-0 z-10"
            >
            <img
              :src="badge"
              class="w-full h-full object-cover absolute top-8 left-0 blur-[28px] opacity-32 mix-blend-plus-darker"
            >
            <img
              :src="badge"
              class="w-full h-full object-cover absolute -top-8 left-0 blur-[44px] opacity-24 mix-blend-plus-lighter"
            >
          </div>

          <div class="flex flex-col gap-0 text-center md:text-right w-full">
            <span class="text-[32px] text-lavender tracking-[-1.6px] leading-8">
              {{ t('components.pageHero.memberSince') }}
            </span>
            <BadgeTitle
              :text="memberSince"
              :text-color="properties.text"
              :light-color="properties.lightColor"
              :align="isSmallScreen ? 'center' : 'right'"
              :letter-spacing="-1.28"
              :font-weight="400"
              :font-size="32"
              class="h-8 z-1 [&>svg]:w-full [&>svg]:h-8 inline-block md:flex align-middle"
              :view-box="`0 0 220 32`"
              variant="top-light-cover"
              :blur-layers="properties.blurLayers"
            />
          </div>
        </div>
      </div>
    </div>
    <InlineSvg
      v-if="waves"
      :src="waves"
      unique-id="waves"
      class="absolute bottom-[-80px] md:bottom-[48px] left-1/2 -translate-x-1/2 min-w-[100vw]"
    />
  </div>
</template>