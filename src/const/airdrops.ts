import type { LOCK_DURATION_ID } from '@/types/staking'

export type Airdrop = {
  id: string
  name: string
  startDate?: string
  endDate?: string
  imageUrl: string
  prizeName: string
  prizeAmount?: string
  condition?: string
  description?: string
  wallets: string[]
  readyToClaim?: boolean
  claimingInstructions?: string
  isFinished?: boolean
  claimUrl?: string
  claimed?: boolean
  minAmount?: number
  minLockDurationId?: LOCK_DURATION_ID
}