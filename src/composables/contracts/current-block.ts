import { getBlockNumber } from '@wagmi/core'
import { onMounted, ref } from 'vue'
import { config } from '../reown'

/*
 * This composable is used to get the current block number
 * Depends on the config to get the chain id
*/
export const useCurrentBlock = () => {
  const blockNumber = ref(0n)

  onMounted(() => {
    const interval = setInterval(async () => {
      blockNumber.value = await getBlockNumber(config, {
        cacheTime: 2_000,
      })
    }, 2000)
    return () => clearInterval(interval)
  })

  return { blockNumber }
}
