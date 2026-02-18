import { useLocalStorage, useUrlSearchParams } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import asteroid from '@/assets/images/home/asteroid.png'
import mysteryBox from '@/assets/images/home/mystery-box.png'
import rolexPrize from '@/assets/images/game/wheel/rolex.png'
import iphonePrize from '@/assets/images/game/wheel/iphone.png'
import mysteryBoxPrize from '@/assets/images/game/wheel/mystery-box.png'
import rolexPrizeBg from '@/assets/images/game/wheel/rolex-b.png'
import iphonePrizeBg from '@/assets/images/game/wheel/iphone-b.png'
import mysteryBoxPrizeBg from '@/assets/images/game/wheel/mystery-box-b.png'
import wheel from '@/assets/images/home/wheel.png'
import { DateTime } from 'luxon'
import { i18n } from '@/i18n'

export enum HomeVariants {
  asteroid = 'asteroid',
  mysteryBox = 'mystery-box',
  wheel = 'wheel',
  wheelIphone = 'wheel-iphone',
  wheelRolex = 'wheel-rolex',
  wheelLong = 'wheel-long',
  wheelNotifyMe = 'wheel-notify-me',
  wheel10x = 'wheel-10x',
  wheelLn = 'wheel-ln',
}

export enum PrizeTexts {
  wheelNotifyMe = 'wheel-notify-me',
  wheel10x = 'wheel-10x',
  default = 'default',
}

type Variant = {
  title: string // translation key
  CTA: string // translation key
  image: string
  claimHeadline: PrizeTexts
}

const variants: Record<HomeVariants, Variant> = {
  [HomeVariants.asteroid]: {
    title: i18n.global.t('home.dynamicHome.variants.asteroid.title'),
    CTA: i18n.global.t('home.dynamicHome.variants.asteroid.cta'),
    image: asteroid,
    claimHeadline: PrizeTexts.default,
  },
  [HomeVariants.mysteryBox]: {
    title: i18n.global.t('home.dynamicHome.variants.mysteryBox.title'),
    CTA: i18n.global.t('home.dynamicHome.variants.mysteryBox.cta'),
    image: mysteryBox,
    claimHeadline: PrizeTexts.default,
  },
  [HomeVariants.wheel]: {
    title: i18n.global.t('home.dynamicHome.variants.wheel.title'),
    CTA: i18n.global.t('home.dynamicHome.variants.wheel.cta'),
    image: wheel,
    claimHeadline: PrizeTexts.default,
  },
  [HomeVariants.wheelIphone]: {
    title: i18n.global.t('home.dynamicHome.variants.wheelIphone.title'),
    CTA: i18n.global.t('home.dynamicHome.variants.wheelIphone.cta'),
    image: wheel,
    claimHeadline: PrizeTexts.default,
  },
  [HomeVariants.wheelRolex]: {
    title: i18n.global.t('home.dynamicHome.variants.wheelRolex.title'),
    CTA: i18n.global.t('home.dynamicHome.variants.wheelRolex.cta'),
    image: wheel,
    claimHeadline: PrizeTexts.default,
  },
  [HomeVariants.wheelLong]: {
    title: i18n.global.t('home.dynamicHome.variants.wheelLong.title'),
    CTA: i18n.global.t('home.dynamicHome.variants.wheelLong.cta'),
    image: wheel,
    claimHeadline: PrizeTexts.default,
  },
  [HomeVariants.wheelNotifyMe]: {
    title: i18n.global.t('home.dynamicHome.variants.wheelNotifyMe.title'),
    CTA: i18n.global.t('home.dynamicHome.variants.wheelNotifyMe.cta'),
    image: wheel,
    claimHeadline: PrizeTexts.wheelNotifyMe,
  },
  [HomeVariants.wheel10x]: {
    title: i18n.global.t('home.dynamicHome.variants.wheel10x.title'),
    CTA: i18n.global.t('home.dynamicHome.variants.wheel10x.cta'),
    image: wheel,
    claimHeadline: PrizeTexts.wheel10x,
  },
  [HomeVariants.wheelLn]: {
    title: i18n.global.t('home.dynamicHome.variants.wheelLn.title'),
    CTA: i18n.global.t('home.dynamicHome.variants.wheelLn.cta'),
    image: wheel,
    claimHeadline: PrizeTexts.default,
  },
}

export enum StaticPrizes {
  iphone = 'iphone',
  rolex = 'rolex',
  mysteryBox = 'mystery-box',
}

export interface StaticPrize {
  wheelSection: number
  code: string
  image: string
  imageBg: string
  name: string // translation key
  claimedText: string // translation key
  actionText: string // translation key
  subText: string
  CTA: string // translation key
  claimed: boolean
  nameEn: string
}

const prizeTexts = {
  [PrizeTexts.wheelNotifyMe]: {
    actionText: i18n.global.t('home.dynamicHome.prizeTexts.wheelNotifyMe.actionText'),
    subText: i18n.global.t('home.dynamicHome.prizeTexts.wheelNotifyMe.subText'),
    CTA: i18n.global.t('home.dynamicHome.prizeTexts.wheelNotifyMe.cta'),
  },
  [PrizeTexts.wheel10x]: {
    actionText: i18n.global.t('home.dynamicHome.prizeTexts.wheel10x.actionText'),
    subText: i18n.global.t('home.dynamicHome.prizeTexts.wheel10x.subText'),
    CTA: i18n.global.t('home.dynamicHome.prizeTexts.wheel10x.cta'),
  },
  [PrizeTexts.default]: {
    subText: i18n.global.t('home.dynamicHome.prizeTexts.default.subText'),
  },
}

export const staticPrizesMap = {
  [StaticPrizes.iphone]: {
    ...prizeTexts[PrizeTexts.default],
    wheelSection: 5,
    code: '1',
    image: iphonePrize,
    imageBg: iphonePrizeBg,
    name: i18n.global.t('home.dynamicHome.prizes.iphone.name'),
    claimedText: i18n.global.t('home.dynamicHome.prizes.iphone.claimedText'),
    actionText: i18n.global.t('home.dynamicHome.prizes.iphone.actionText'),
    CTA: i18n.global.t('home.dynamicHome.prizes.iphone.cta'),
    claimed: false,
    nameEn: 'an iPhone Giveaway Ticket',
  },
  [StaticPrizes.rolex]: {
    ...prizeTexts[PrizeTexts.default],
    wheelSection: 6,
    code: '2',
    image: rolexPrize,
    imageBg: rolexPrizeBg,
    name: i18n.global.t('home.dynamicHome.prizes.rolex.name'),
    claimedText: i18n.global.t('home.dynamicHome.prizes.rolex.claimedText'),
    actionText: i18n.global.t('home.dynamicHome.prizes.rolex.actionText'),
    CTA: i18n.global.t('home.dynamicHome.prizes.rolex.cta'),
    claimed: false,
    nameEn: 'a Rolex Giveaway Ticket',
  },
  [StaticPrizes.mysteryBox]: {
    ...prizeTexts[PrizeTexts.default],
    wheelSection: 8,
    code: '3',
    image: mysteryBoxPrize,
    imageBg: mysteryBoxPrizeBg,
    name: i18n.global.t('home.dynamicHome.prizes.mysteryBox.name'),
    claimedText: i18n.global.t('home.dynamicHome.prizes.mysteryBox.claimedText'),
    actionText: i18n.global.t('home.dynamicHome.prizes.mysteryBox.actionText'),
    CTA: i18n.global.t('home.dynamicHome.prizes.mysteryBox.cta'),
    claimed: false,
    nameEn: 'a Mystery Box',
  },
}

const staticPrizesCodeMap = {
  '1': StaticPrizes.iphone,
  '2': StaticPrizes.rolex,
  '3': StaticPrizes.mysteryBox,
}

const VARIANT_PARAM = 'lp_var'
const CODE_PARAM = 'lp_code'
const pendingActivity = ref<boolean>(false)
const pendingClaim = ref<boolean>(false)
export const showLearnMoreWheel = ref<boolean>(false)
const persistentPrizeData = useLocalStorage<{
  prize: StaticPrize,
  timestamp: number,
  code: string,
} | null>('persistentPrizeData', null, {
  serializer: {
    read: (value: string) => JSON.parse(value),
    write: (value: { prize: StaticPrize; timestamp: number; code: string } | null) => JSON.stringify(value),
  },
})

let lastCode: keyof typeof staticPrizesCodeMap | null = null
const getRandomCode = () => {
  if (lastCode) {
    return lastCode
  }
  const codes = Object.keys(staticPrizesCodeMap)
  const randomCode = codes[Math.floor(Math.random() * codes.length)] as keyof typeof staticPrizesCodeMap
  lastCode = randomCode
  return randomCode
}

export const useDynamicHome = () => {
  const params = useUrlSearchParams('history')
  const variant = ref<HomeVariants>()

  const code = computed(() => {
    if (params[CODE_PARAM]) {
      return params[CODE_PARAM] as keyof typeof staticPrizesCodeMap
    }
    return getRandomCode()
  })

  const content = computed(() => {
    if (variant.value) {
      const variantKey = variant.value as keyof typeof variants
      const baseVariant = variants[variantKey]

      // Apply t() to translation keys
      const translatedTitle = baseVariant.title
      const translatedCTA = baseVariant.CTA

      return {
        ...baseVariant,
        title: translatedTitle,
        CTA: translatedCTA,
      }
    }
    return {} as Variant
  })

  const staticPrize = computed(() => {
    if (persistentPrizeData.value?.code) {
      return persistentPrizeData.value.prize
    }
    if (!variant.value) {
      return {} as StaticPrize
    }
    const prize = staticPrizesMap[staticPrizesCodeMap[code.value]] || {} as StaticPrize
    const texts = prizeTexts[content.value.claimHeadline]

    // Apply t() to translation keys
    const translatedPrize = {
      ...prize,
      name: prize.name,
      claimedText: prize.claimedText,
      actionText: prize.actionText,
      CTA: prize.CTA,
    }

    // Apply t() to prizeTexts as well, handling different structures
    if (texts && 'actionText' in texts) {
      translatedPrize.actionText = texts.actionText
    }
    if (texts && 'subText' in texts) {
      translatedPrize.subText = texts.subText
    }
    if (texts && 'CTA' in texts) {
      translatedPrize.CTA = texts.CTA
    }

    return translatedPrize
  })

  function resetVariant() {
    pendingActivity.value = false
    window.history.replaceState({}, '', window.location.pathname)
  }

  watch(
    () => params[VARIANT_PARAM] as HomeVariants,
    (current) => {
      variant.value = current
      if (current !== undefined && current in variants) {
        pendingActivity.value = true
      }
    },
    { immediate: true },
  )

  watch(persistentPrizeData, (current) => {
    if (current?.code) {
      const time = DateTime.fromMillis(current.timestamp)
      // check if the time is more than 10 minutes ago
      if (DateTime.now().diff(time).as('minutes') > 10) {
        console.log('Resetting prize data:', current)
        persistentPrizeData.value = null
      } else {
        pendingClaim.value = true
      }
    }
  }, { immediate: true })

  const isWheel = computed(() => {
    return [
      HomeVariants.wheel,
      HomeVariants.wheelLong,
      HomeVariants.wheelIphone,
      HomeVariants.wheelRolex,
      HomeVariants.wheelNotifyMe,
      HomeVariants.wheel10x,
      HomeVariants.wheelLn,
    ].includes(variant.value as HomeVariants)
  })

  return {
    content,
    variant,
    resetVariant,
    pendingActivity,
    staticPrize,
    pendingClaim,
    persistentPrizeData,
    code,
    isWheel,
    staticPrizesMap,
    showLearnMoreWheel,
  }
}