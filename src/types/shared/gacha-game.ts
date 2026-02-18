export enum GACHA_ASTEROID_PRIZE_TYPE {
  ELEMENT = 'element',
  POWER_MILES = 'powerMiles',
}

export type GachaAsteroidPrize =
  { type: GACHA_ASTEROID_PRIZE_TYPE.ELEMENT, elementId: number, raffleId: string | null } |
  { type: GACHA_ASTEROID_PRIZE_TYPE.POWER_MILES, amount: number }
