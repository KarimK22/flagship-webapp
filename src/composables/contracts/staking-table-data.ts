import { TimeObject } from '@/types/time-object'
import { useStakes } from '@/composables/contracts/stakes'
import { useConfig } from '@/composables/config'
import { computed } from 'vue'
import type { Stake } from '@/services/api'
import { LOCK_DURATION_ID } from '@/types/staking'
import type { HoldingTableGroup, HoldingTableRow } from '@/types/staking'
import { useLingoPrice } from '@/composables/contracts/lingo-price'
import { formatNumberToUS } from '@/composables/helpers'

export const useStakingTableData = () => {
  const { myStakes, myStakesList } = useStakes()
  const { lockConfig } = useConfig()
  const { price } = useLingoPrice()

  function getLockDuration(lockId: LOCK_DURATION_ID) {
    const map = lockConfig.value.lockDurations
    if (!map)
      return {
        lockDurationBlocks: 0,
        boost: 0,
      }
    return map[lockId]
  }

  const tableData = computed<HoldingTableRow[]>(() => {
    return myStakesList.value.map((stake: Stake) => {
      const lockDuration = getLockDuration(stake.lockDurationId)
      const dailyPower = stake.dailyPower
      const power = myStakes.value.powers[stake.id]
      const amountInFiat = formatNumberToUS(Number(stake.amount) * price.value)
      return {
        id: stake.id,
        timestamp: stake.timestamp,
        lockDurationId: stake.lockDurationId,
        token: 'LINGO',
        amount: stake.amount,
        dailyPower,
        power,
        boost: lockDuration.boost * 100,
        baseDailyPower: stake.baseDailyPower,
        remainingTime: TimeObject.fromSeconds(stake.unlockTimestamp),
        amountInFiat,
      }
    })
  })

  const groupedTableData = computed<HoldingTableGroup[]>(() => {
    const groups = new Map<LOCK_DURATION_ID, HoldingTableGroup>()
    const lockOrder = [
      LOCK_DURATION_ID.NO_LOCK,
      LOCK_DURATION_ID.THREE_MONTHS,
      LOCK_DURATION_ID.SIX_MONTHS,
      LOCK_DURATION_ID.TWELVE_MONTHS,
    ]

    tableData.value.forEach((row) => {
      const amountNumber = Number(row.amount)
      const amountInFiatNumber = amountNumber * price.value
      const powerNumber = Number(row.power)
      const dailyPowerNumber = row.dailyPower

      if (!groups.has(row.lockDurationId)) {
        groups.set(row.lockDurationId, {
          lockDurationId: row.lockDurationId,
          rows: [row],
          totalAmount: amountNumber,
          totalAmountInFiat: amountInFiatNumber,
          totalPower: powerNumber,
          totalDailyPower: dailyPowerNumber,
          boost: row.boost,
          latestTimestamp: row.timestamp,
        })
        return
      }

      const group = groups.get(row.lockDurationId)
      if (!group) return
      group.rows.push(row)
      group.totalAmount += amountNumber
      group.totalAmountInFiat += amountInFiatNumber
      group.totalPower += powerNumber
      group.totalDailyPower += dailyPowerNumber
      group.latestTimestamp = Math.max(group.latestTimestamp, row.timestamp)
    })

    return Array.from(groups.values())
      .map((group) => ({
        ...group,
        rows: group.rows.slice().sort((a, b) => b.timestamp - a.timestamp),
      }))
      .sort((a, b) => lockOrder.indexOf(a.lockDurationId) - lockOrder.indexOf(b.lockDurationId))
  })

  return { tableData, groupedTableData }
}
