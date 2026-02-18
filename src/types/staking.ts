import type { TimeObject } from './time-object'

export enum LOCK_DURATION_ID {
  NO_LOCK = 'noLock',
  ONE_MONTH = 'oneMonth',
  THREE_MONTHS = 'threeMonths',
  SIX_MONTHS = 'sixMonths',
  TWELVE_MONTHS = 'twelveMonths',
}

export enum TRANSACTION_TYPE {
    CLAIM_TOKENS = 'claimTokens',
    CLAIM_AND_STAKE = 'claimAndStake',
    STAKE = 'stake',
    UNSTAKE = 'unstake',
    RENEW = 'renew',
    CLAIM_APY = 'claimAPY',
    CLAIM_AND_STAKE_APY = 'claimAndStakeAPY',
}

export interface HoldingTableRow {
	id: string
	timestamp: number
	lockDurationId: LOCK_DURATION_ID
	token: string
	amount: string
	dailyPower: number
	power: string
	boost: number
	baseDailyPower: number
	remainingTime: TimeObject
	amountInFiat: string
}

export interface HoldingTableGroup {
	lockDurationId: LOCK_DURATION_ID
	rows: HoldingTableRow[]
	totalAmount: number
	totalAmountInFiat: number
	totalPower: number
	totalDailyPower: number
	boost: number
	latestTimestamp: number
}

export enum EHelpType {
	HOW_POWER_MILES_WORK = 'how-power-miles-work',
	WHAT_REWARDS_CAN_I_WIN = 'what-rewards-can-i-win',
	MY_LEVEL_INFO = 'my-level-info',
	APY_PLAN_AND_EARN_NONSTOP = 'apy-plan-and-earn-nonstop',
	APY_WHAT_IS_APY = 'apy-what-is-apy',
	APY_BOOST_YOUR_APY = 'apy-boost-your-apy',
	ELEMENTS = 'elements',
	WHEEL_INFO = 'wheel-info',
	TIERED_WHEEL_INFO = 'tiered-wheel-info',
}

export enum EUpsellSteps {
	BUY_SELECTOR = 'buy-selector',
	BUY_SUCCESS = 'buy-success',
	STAKE_SUCCESS = 'stake-success',
}
