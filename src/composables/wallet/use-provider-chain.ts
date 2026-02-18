import { ref } from 'vue'
import { appkit } from '../reown'

const fallback = 1

const providerChain = ref(fallback)

appkit.subscribeNetwork((value) => {
  providerChain.value = value.chainId
    ? parseInt(value.chainId.toString(), 10)
    : fallback
})

export const useProviderChain = () => {
  return {
    chainId: providerChain,
  }
}
