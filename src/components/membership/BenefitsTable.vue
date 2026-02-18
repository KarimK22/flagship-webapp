<template>
  <div class="border border-dark3 rounded-2xl flex flex-col relative overflow-auto flex-1">
    <table class="min-w-full border-collapse text-lavender">
      <thead>
        <tr>
          <th class="sticky left-0 bg-[var(--color-background)] z-10 border-r-1! border-dark3!">
            <div class="flex items-end justify-start gap-2 min-w-[175px] md:min-w-[430px] w-full h-[180px] md:h-[256px] pl-8">
              <span class="text-2xl md:text-[32px] font-light tracking-[-1.6px]">{{ t('membership.benefitsTable.powerMiles') }}</span>
            </div>
          </th>
          <th class="p-0">
            <div
              :style="{ backgroundImage: `url(${normalTableBg})` }"
              class="flex flex-col items-center justify-center gap-1 w-[175px] md:w-[280px] h-[180px] md:h-[256px] bg-cover bg-no-repeat bg-top"
            >
              <img
                :src="normalBadge"
                alt="normal badge"
                class="w-[100px] h-[94px] md:w-[122px] md:h-[116px]"
              >
              <span class="whitespace-pre-line text-xl md:text-[32px] font-light leading-4 md:leading-8 tracking-[-1.6px]">
                {{ t('membership.benefitsTable.normalStaker.title') }}
              </span>
              <span class="text-sm md:text-xl font-light text-purple-gray tracking-[-0.6px]">
                {{ t('membership.benefitsTable.normalStaker.description') }}
              </span>
            </div>
          </th>
          <th class="p-0">
            <div
              :style="{ backgroundImage: `url(${silverTableBg})` }"
              class="flex flex-col items-center justify-center gap-1 w-[175px] md:w-[280px] h-[180px] md:h-[256px] bg-cover bg-no-repeat bg-center"
            >
              <img
                :src="silverBadge"
                alt="silver badge"
                class="w-[100px] h-[94px] md:w-[122px] md:h-[116px]"
              >
              <span class="whitespace-pre-line text-xl md:text-[32px] font-light leading-4 md:leading-8 tracking-[-1.6px]">
                {{ t('membership.benefitsTable.silverStaker.title') }}
              </span>
              <span class="text-sm md:text-xl font-light text-purple-gray tracking-[-0.6px]">
                {{ t('membership.benefitsTable.silverStaker.description') }}
              </span>
            </div>
          </th>
          <th class="p-0">
            <div
              :style="{ backgroundImage: `url(${goldTableBg})` }"
              class="flex flex-col items-center justify-center gap-1 w-[175px] md:w-[280px] h-[180px] md:h-[256px] bg-cover bg-no-repeat bg-top"
            >
              <img
                :src="goldBadge"
                alt="gold badge"
                class="w-[100px] h-[94px] md:w-[122px] md:h-[116px]"
              >
              <span class="whitespace-pre-line text-xl md:text-[32px] font-light leading-4 md:leading-8 tracking-[-1.6px]">
                <BadgeTitle
                  :text="t('membership.whale')"
                  :text-color="'#FF9D5C'"
                  :light-color="'#FFBC70'"
                  vertical-align="bottom"
                  :letter-spacing="-1.6"
                  :font-weight="400"
                  :font-size="isSmallScreen ? 24 : 32"
                  class="h-4 md:h-5 z-1 [&>svg]:w-full md:[&>svg]:h-9 [&>svg]:h-7 inline-block"
                  :view-box="`0 0 200 ${isSmallScreen ? 24 : 34}`"
                  variant="top-light-cover"
                  :blur-layers="[{ value: 0.5, opacity: 1 }, { value: 1, opacity: 1 }, { value: 1, opacity: 1 }]"
                /> <br> {{ t('membership.benefitsTable.goldStaker.title').replace('Whale ', '') }}
              </span>
              <span class="text-sm md:text-xl font-light text-purple-gray tracking-[-0.6px]">
                {{ t('membership.benefitsTable.goldStaker.description') }}
              </span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in benefits"
          :key="index"
          class="h-[72px] border-y-1 border-dark3 [&:last-child]:border-none!"
          :class="{ '[&>td:not(:last-child)]:border-r-1 [&>td:not(:last-child)]:border-dark3': !row.isTitle }"
        >
          <td class="sticky left-0 z-10 bg-[var(--color-background)]">
            <div class="flex items-start justify-start pl-8 relative">
              <span
                class="text-base md:text-xl text-purple-gray tracking-[-0.6px] break-words whitespace-pre-line leading-4"
                :class="{ 'text-lavender! text-2xl! md:text-[32px]! tracking-[-1.6px] leading-6 absolute top-1/2 -translate-y-1/2 w-[300px]': row.isTitle }"
              >{{ row.description }}</span>
            </div>
          </td>
          <td class="">
            <div class="flex items-center justify-center">
              <InlineSvg
                v-if="row.normalStaker"
                :src="checkIcon"
                class="size-10"
              />
            </div>
          </td>
          <td class="gap-1 border-none!">
            <div class="flex items-center justify-center">
              <InlineSvg
                v-if="row.silverStaker"
                :src="checkIcon"
                class="size-10"
              />
            </div>
          </td>
          <td
            :style="{ backgroundImage: `url(${goldTableTitle})` }"
            class="gap-2 bg-cover bg-no-repeat bg-center"
          >
            <div class="flex items-center justify-center">
              <InlineSvg
                v-if="row.goldStaker"
                :src="checkIcon"
                class="size-10 [&>g>rect]:stroke-[#ff78474f] [&>path]:stroke-[#FFBC70]"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { useTranslation } from '@/composables/use-i18n'
import checkIcon from '@/assets/images/membership/check.svg'
import goldTableBg from '@/assets/images/membership/gold-table-bg.png'
import silverTableBg from '@/assets/images/membership/silver-table-bg.png'
import normalTableBg from '@/assets/images/membership/default-table-bg.png'
import normalBadge from '@/assets/images/membership/default-badge.png'
import silverBadge from '@/assets/images/membership/silver-badge.png'
import goldBadge from '@/assets/images/membership/gold-badge.png'
import goldTableTitle from '@/assets/images/membership/gold-table-tile.png'
import BadgeTitle from '@/components/rewards/badges/BadgeTitle.vue'
import { useMediaQuery } from '@vueuse/core'

const { t } = useTranslation()
const isSmallScreen = useMediaQuery('(max-width: 768px)')

const benefits = [
  {
    description: t('membership.benefitsTable.benefits.earnPowerMiles'),
    normalStaker: true,
    silverStaker: true,
    goldStaker: true,
    isTitle: false,
  },
  {
    description: t('membership.benefitsTable.benefits.bonusPowerMiles'),
    normalStaker: false,
    silverStaker: true,
    goldStaker: true,
    isTitle: false,
  },
  {
    description: t('membership.benefitsTable.benefits.powerMilesBoost'),
    normalStaker: false,
    silverStaker: false,
    goldStaker: true,
    isTitle: false,
  },
  {
    description: t('membership.benefitsTable.benefits.raffleAccess'),
    normalStaker: false,
    silverStaker: false,
    goldStaker: false,
    isTitle: true,
  },
  {
    description: t('membership.benefitsTable.benefits.enterDailyRaffles'),
    normalStaker: true,
    silverStaker: true,
    goldStaker: true,
    isTitle: false,
  },
  {
    description: t('membership.benefitsTable.benefits.premiumRaffles'),
    normalStaker: false,
    silverStaker: true,
    goldStaker: true,
    isTitle: false,
  },
  {
    description: t('membership.benefitsTable.benefits.whaleRaffles'),
    normalStaker: false,
    silverStaker: false,
    goldStaker: true,
    isTitle: false,
  },
  {
    description: t('membership.benefitsTable.benefits.airdropAccess'),
    normalStaker: false,
    silverStaker: false,
    goldStaker: false,
    isTitle: true,
  },
  {
    description: t('membership.benefitsTable.benefits.someAirdrops'),
    normalStaker: true,
    silverStaker: true,
    goldStaker: true,
    isTitle: false,
  },
  {
    description: t('membership.benefitsTable.benefits.guaranteedAirdrops'),
    normalStaker: false,
    silverStaker: true,
    goldStaker: true,
    isTitle: false,
  },
  {
    description: t('membership.benefitsTable.benefits.whaleAirdropPool'),
    normalStaker: false,
    silverStaker: false,
    goldStaker: true,
    isTitle: false,
  },
  {
    description: t('membership.benefitsTable.benefits.element6Benefits'),
    normalStaker: false,
    silverStaker: false,
    goldStaker: false,
    isTitle: true,
  },
  {
    description: t('membership.benefitsTable.benefits.upTo45APY'),
    normalStaker: true,
    silverStaker: true,
    goldStaker: true,
    isTitle: false,
  },
  {
    description: t('membership.benefitsTable.benefits.shareInAirdrops'),
    normalStaker: true,
    silverStaker: true,
    goldStaker: true,
    isTitle: false,
  },
  {
    description: t('membership.benefitsTable.benefits.luxuryCarTicket'),
    normalStaker: true,
    silverStaker: true,
    goldStaker: true,
    isTitle: false,
  },
  {
    description: t('membership.benefitsTable.benefits.discordBenefits'),
    normalStaker: false,
    silverStaker: false,
    goldStaker: false,
    isTitle: true,
  },
  {
    description: t('membership.benefitsTable.benefits.exclusiveRole'),
    normalStaker: false,
    silverStaker: true,
    goldStaker: true,
    isTitle: false,
  },
  {
    description: t('membership.benefitsTable.benefits.whaleBadge'),
    normalStaker: false,
    silverStaker: false,
    goldStaker: true,
    isTitle: false,
  },
  {
    description: t('membership.benefitsTable.benefits.privateChannel'),
    normalStaker: false,
    silverStaker: false,
    goldStaker: true,
    isTitle: false,
  },
  {
    description: t('membership.benefitsTable.benefits.vipExclusives'),
    normalStaker: false,
    silverStaker: false,
    goldStaker: false,
    isTitle: true,
  },
  {
    description: t('membership.benefitsTable.benefits.irlEvents'),
    normalStaker: false,
    silverStaker: false,
    goldStaker: true,
    isTitle: false,
  },
  {
    description: t('membership.benefitsTable.benefits.bidOnItems'),
    normalStaker: false,
    silverStaker: false,
    goldStaker: true,
    isTitle: false,
  },
  {
    description: t('membership.benefitsTable.benefits.voteOnRewards'),
    normalStaker: false,
    silverStaker: false,
    goldStaker: true,
    isTitle: false,
  },
]
</script>
<style scoped>
</style>