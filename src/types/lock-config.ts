import type { LOCK_DURATION_ID } from '@/types/staking'

export type LockConfig = {
	tiers: Record<string, number>
	airdropWalletsCount: number
	walletAddresses: string[]
	lockDurations: Record<LOCK_DURATION_ID, { lockDurationBlocks: number; boost: number; index: number }>
	power: {
		base: number
		decimalCount: number
	},
}

export enum LockDurationToDescription {
	threeMonths = 'for 3 months',
	sixMonths = 'for 6 months',
	twelveMonths = 'for 12 months',
	oneMonth = 'for 1 month',
	noLock = '',
}

export enum LockDurationToDays {
	threeMonths = 90,
	sixMonths = 180,
	twelveMonths = 365,
	oneMonth = 30,
	noLock = 0,
}
