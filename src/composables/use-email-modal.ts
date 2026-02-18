import { ref } from 'vue'
import { useGetMe } from '@/composables/get-me'

const isEmailModalOpen = ref(false)

export function useEmailModal() {
  const { meData, isConnected } = useGetMe()

  const showEmailModal = () => {
    // Only show modal if user doesn't have an email
    if (isConnected.value && !meData.value?.email) {
      isEmailModalOpen.value = true
    }
  }

  const hideEmailModal = () => {
    isEmailModalOpen.value = false
  }

  return {
    isEmailModalOpen,
    showEmailModal,
    hideEmailModal,
  }
}
