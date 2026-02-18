import { type GachaAsteroidPrize } from './gacha-game'
import { LOCK_DURATION_ID } from './staking'
import type { WonPrize } from '@/types/shared/raffle-prize.ts'

export enum ACTIVITY_TYPE {
  STAKE = 'stake',
  UNSTAKE = 'unstake',
  SMASH_ASTEROID = 'smashAsteroid',
  PURCHASE_RAFFLE_TICKET = 'purchaseRaffleTicket',
  RECEIVE_EXTRA_RAFFLE_TICKET = 'receiveExtraRaffleTicket',
  WIN_RAFFLE_PRIZE = 'winRafflePrize',
}

export type Activity<TimestampType = Date> = { timestamp: TimestampType, userId: string } & (
  {
    type: ACTIVITY_TYPE.STAKE
    metadata: { stakeId: string, amount: string, lockDurationId: LOCK_DURATION_ID, lingoPrice: string }
  } | {
  type: ACTIVITY_TYPE.UNSTAKE
  metadata: { stakeId: string, amount: string }
} | {
  type: ACTIVITY_TYPE.PURCHASE_RAFFLE_TICKET
  metadata: { raffleId: string, ticketsCount: number, powerAmount: number, powerTransactionId: string }
} | {
  type: ACTIVITY_TYPE.RECEIVE_EXTRA_RAFFLE_TICKET
  metadata: { raffleId: string, ticketsCount: number, stakeId: string }
} | {
  type: ACTIVITY_TYPE.WIN_RAFFLE_PRIZE
  metadata: { raffleId: string, prize: WonPrize }
} | {
  type: ACTIVITY_TYPE.SMASH_ASTEROID
  metadata: { autoSmashed: boolean, powerTransactionId: string, prize: GachaAsteroidPrize }
}
  )
