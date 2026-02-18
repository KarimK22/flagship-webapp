import type { Stake } from '@/services/api'
import { LOCK_DURATION_ID } from '@/types/staking'

/**
 * Checks if a stake is locked based on the current timestamp
 *
 * @param stake - The stake object to check
 * @returns {boolean} True if the stake is locked, false otherwise
 */
export function isStakeLocked(stake: Stake) {
  const currentTimestamp = (new Date().getTime()/1000)
  return currentTimestamp < stake.unlockTimestamp
}

/**
 * Calculates the average base APY for user's stakes
 *
 * Formula: average_apy = average_base_apy + apy_boost
 *
 * Where:
 * average_base_apy = Σ(base_apy * stake_amount) / total_staked_amount
 *
 * Base APY Rates:
 * ---------------
 * | Lock Period | Rate |
 * |-------------|------|
 * | Unlocked    |  5%  |
 * | 3 months    | 10%  |
 * | 6 months    | 20%  |
 * | 12 months   | 30%  |
 *
 * APY Boost (Element 6s):
 * ----------------------
 * | Elements    | Boost |
 * |-------------|-------|
 * | 5-9         |  5%   |
 * | 10-14       | 10%   |
 * | ≥15         | 15%   |
 *
 * @param stakes {Stake[]} - Array of user's stake positions
 * @returns {number} The calculated average APY including boost
 */
function getAverageBaseApy(stakes: Stake[]) {
  if (stakes.length === 0) return 0
  const boostPerLockTypeMap = {
    [LOCK_DURATION_ID.NO_LOCK]: 0.05,
    [LOCK_DURATION_ID.ONE_MONTH]: 0.05,
    [LOCK_DURATION_ID.THREE_MONTHS]: 0.1,
    [LOCK_DURATION_ID.SIX_MONTHS]: 0.2,
    [LOCK_DURATION_ID.TWELVE_MONTHS]: 0.3,
  }
  let totalStakeAmount = 0
  let sumOfBoosts = 0
  stakes.forEach((stake) => {
    const isLocked = isStakeLocked(stake)
    const boost = isLocked ? boostPerLockTypeMap[stake.lockDurationId] : 0.05
    totalStakeAmount += Number(stake.amount)
    sumOfBoosts += Number(stake.amount) * boost
  })
  const averageBaseApy = sumOfBoosts / totalStakeAmount
  return averageBaseApy
}

export { getAverageBaseApy }