export enum PRIZE_TYPE {
  VOUCHERS = 'vouchers',
  PHYSICAL = 'physical',
  NONE = 'none',
}

export type WonPrize = { id: number, type: PRIZE_TYPE.PHYSICAL, name: string } | {
  id: number
  type: PRIZE_TYPE.VOUCHERS,
  code: string
  amount: number
} | { type: PRIZE_TYPE.NONE }
