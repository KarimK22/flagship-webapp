import { useLocalStorage } from '@vueuse/core'

export const showInfoModal = useLocalStorage('show-info-modal', false)