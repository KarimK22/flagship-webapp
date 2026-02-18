import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useMyBadges } from '@/composables/my-badges'
import { BADGE_ID } from '@/types/shared/badge'

export const useMembershipAssets = () => {
  const { badges } = useMyBadges()

  const variant = computed(() => {
    if (badges.value.some((b) => b.isClaimed && b.id === BADGE_ID.WHALE))
      return 'gold'
    if (badges.value.some((b) => b.isClaimed && b.id === BADGE_ID.ENJOYER))
      return 'silver'
    return 'default'
  })

  const isComponentMounted = ref(true)

  onBeforeUnmount(() => {
    isComponentMounted.value = false
  })

  const getAssetsUrls = async (variant: 'default' | 'silver' | 'gold') => {
    if (!isComponentMounted.value) {
      throw new Error('Component unmounted')
    }

    const [wavesAsset, strokeAsset, fillAsset, badgeAsset] = await Promise.all([
      import(`@/assets/images/membership/waves-${variant}.svg`),
      import(`@/assets/images/membership/strok-${variant}.svg`),
      import(`@/assets/images/membership/fill-${variant}.png`),
      import(`@/assets/images/membership/${variant}-badge.png`),
    ])

    if (!isComponentMounted.value) {
      throw new Error('Component unmounted during asset loading')
    }

    return {
      wavesAsset,
      strokeAsset,
      fillAsset,
      badgeAsset,
    }
  }

  const variantProperties = {
    default: {
      text: '#F1E6FA',
      lightColor: '#F1E6FA',
      blurLayers: [],
      name: 'Normal',
      letterSpacing: 0,
    },
    silver: {
      text: '#9A9AB8',
      lightColor: '#F1E6FA',
      blurLayers: [
        { value: 0.5, opacity: 1 },
        { value: 1, opacity: 1 },
        { value: 1, opacity: 1 },
      ],
      name: 'Enjoyer',
      letterSpacing: 38,
    },
    gold: {
      text: '#FF9D5C',
      lightColor: '#FFBC70',
      blurLayers: [
        { value: 0.5, opacity: 1 },
        { value: 1, opacity: 1 },
        { value: 1, opacity: 1 },
      ],
      name: 'Whale',
      letterSpacing: 48,
    },
  }

  const waves = ref<string>()
  const stroke = ref<string>()
  const fill = ref<string>()
  const badge = ref<string>()
  const properties = computed(() => variantProperties[variant.value])

  watch(
    variant,
    async (current, previous) => {
      if (current === previous) return
      if (!isComponentMounted.value) return

      const { wavesAsset, strokeAsset, fillAsset, badgeAsset } =
         await getAssetsUrls(current)

      if (!isComponentMounted.value) return

      waves.value = wavesAsset.default
      stroke.value = strokeAsset.default
      fill.value = fillAsset.default
      badge.value = badgeAsset.default
    },
    { immediate: true },
  )

  return {
    waves,
    stroke,
    fill,
    badge,
    properties,
  }
}
