import { BADGE_ID } from '@/types/shared/badge'
import Believer from '@/assets/images/badges/Believer.png'
import Holder from '@/assets/images/badges/Holder.png'
import Enjoyer from '@/assets/images/badges/Enjoyer.png'
import Whale from '@/assets/images/badges/Whale.png'
import Whale2 from '@/assets/images/membership/gold-badge.png'
import Loyalty from '@/assets/images/badges/Loyalty.png'
import PrivateJet from '@/assets/images/badges/PrivateJet.png'

export type Badge = {
  id: BADGE_ID
  code: string
  image: string
  image2?: string
  name: string
  description: string
  isLocked: boolean
  isClaimed: boolean
  isClaimable: boolean
  oldDescription: string
}

const badgeEntries = Object.entries(BADGE_ID).filter(([key, _]) =>
  isNaN(Number(key)),
)

/* We override the badges data to handle exclusive UI on our site */
const badgesData = {
  [BADGE_ID.BELIEVER]: {
    id: BADGE_ID.BELIEVER,
    image: Believer,
    name: 'Believer',
    description:
      'believer',
    oldDescription: 'oldBeliever',
    isLocked: true,
    isClaimed: false,
    isClaimable: false,
  },
  [BADGE_ID.HOLDER]: {
    id: BADGE_ID.HOLDER,
    image: Holder,
    name: 'Holder',
    description:
      'holder',
    oldDescription:
      'oldHolder',
    isLocked: true,
    isClaimed: false,
    isClaimable: false,
  },
  [BADGE_ID.ENJOYER]: {
    id: BADGE_ID.ENJOYER,
    image: Enjoyer,
    name: 'Enjoyer',
    description:
      'enjoyer',
    oldDescription:
      'oldEnjoyer',
    isLocked: true,
    isClaimed: false,
    isClaimable: false,
  },
  [BADGE_ID.WHALE]: {
    id: BADGE_ID.WHALE,
    image: Whale,
    image2: Whale2,
    name: 'Whale',
    description:
      'whale',
    oldDescription:
      'oldWhale',
    isLocked: true,
    isClaimed: false,
    isClaimable: false,
  },
  [BADGE_ID.LOYALTY]: {
    id: BADGE_ID.LOYALTY,
    image: Loyalty,
    name: 'Loyalty',
    description:
      'loyalty',
    oldDescription:
      'oldLoyalty',
    isLocked: true,
    isClaimed: false,
    isClaimable: false,
  },
  [BADGE_ID.PRESALER]: {},
  [BADGE_ID.OG]: {},
  [BADGE_ID.MYTHICAL]: {},
  [BADGE_ID.EARLY]: {},
  [BADGE_ID.RAFFLE_WINNER]: {},
  [BADGE_ID.PRIVATE_JET]: {
    id: BADGE_ID.PRIVATE_JET,
    image: PrivateJet,
    name: 'Private Jet',
    description: 'privateJet',
  },
}

const availableBadges = [
  BADGE_ID.BELIEVER,
  BADGE_ID.HOLDER,
  BADGE_ID.ENJOYER,
  BADGE_ID.WHALE,
  BADGE_ID.LOYALTY,
  BADGE_ID.PRIVATE_JET,
]

export const badges: Badge[] = badgeEntries.map(([key, value]) => ({
  id: value as BADGE_ID,
  code: key,
  image: '',
  name: '',
  description: '',
  isLocked: true,
  isClaimed: false,
  isClaimable: false,
  oldDescription: '',
  ...badgesData[value as BADGE_ID],
})).filter((badge) => availableBadges.includes(badge.id))
