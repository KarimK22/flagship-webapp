import { useLocalStorage } from '@vueuse/core'
import { useGetMe } from './get-me'
import { computed } from 'vue'

export const useFirstStakeModal = () => {
  const { accountAddress } = useGetMe()
  const showFirstStakeModalLS = useLocalStorage<Record<string, boolean>>('show-first-stake-modal', {})

  const showFirstStakeModal = computed(() => {
    if (!accountAddress.value) return false
    return showFirstStakeModalLS.value[accountAddress.value] ?? false
  })

  const setCurrentAccountValue = (value: boolean) => {
    if (!accountAddress.value) return
    showFirstStakeModalLS.value[accountAddress.value] = value
  }

  return {
    showFirstStakeModal,
    setCurrentAccountValue,
  }
}