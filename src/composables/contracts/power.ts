import { LOCK_DURATION_ID } from '@/types/staking.ts'
import { onMounted, ref } from 'vue'
import { getBlockNumber } from '@wagmi/core'
import { config } from '@/composables/reown.ts'
import { useConfig } from '@/composables/config.ts'

export const usePowerContract = () => {

  const blockNumber = ref<bigint>(BigInt('0'))
  const { lockConfig } = useConfig()

  const fetchBlockNumber = async () => {
    blockNumber.value = await getBlockNumber(config)
  }

  function calculatePowerPerDay(coins: number, lockDuration: LOCK_DURATION_ID) {
    const base = lockConfig.value.power.base
    const decimalCount = lockConfig.value.power.decimalCount

    const lockData = lockConfig.value.lockDurations[lockDuration]
    if (!lockData) {
      throw new Error(`Invalid lock duration: ${lockDuration}`)
    }
    const boost = lockData.boost
    return (coins * base * (1 + boost) * 24) / Math.pow(10, decimalCount)
  }

  onMounted(async () => {
    await fetchBlockNumber()
  })

  return {
    calculatePowerPerDay,
    blockNumber,
  }
}