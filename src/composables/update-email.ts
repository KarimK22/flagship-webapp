import { ref } from 'vue'
import api from '@/services/api'
import { useGetMe } from '@/composables/get-me'

export function useUpdateEmail() {
  const { meData, refetchGetMe } = useGetMe()
  const isLoading = ref(false)
  const error = ref('')

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const updateEmail = async (email: string) => {
    if (!validateEmail(email)) {
      error.value = 'Please enter a valid email address'
      return { success: false }
    }

    try {
      isLoading.value = true
      error.value = ''
      const response = await api.updateUserEmail(email)

      if (response.success) {
        await refetchGetMe()
      }

      return response
    } catch (_err) {
      error.value = 'An unexpected error occurred. Please try again.'
      return { success: false }
    } finally {
      isLoading.value = false
    }
  }

  return {
    updateEmail,
    validateEmail,
    isLoading,
    emailError: error,
    currentEmail: meData.value?.email,
  }
}