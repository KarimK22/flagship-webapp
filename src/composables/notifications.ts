import { ref } from 'vue'

export const notifications = ref<Notification[]>([])

export interface Notification {
  id: number | string
  title: string
  message?: string
  button: string
  type: 'raffle' | 'airdrop' | 'badge' | 'other'
  action?: () => void
  icon?: string | null
  onClose?: () => void
  read?: boolean
}

export function useNotifications() {
  const addNotification = (notification: Notification) => {
    // check if notification with the same id already exists
    const existingNotification = notifications.value.find((n) => n.id === notification.id)
    if (existingNotification) {
      return existingNotification.id
    }

    notifications.value.push(notification)

    return notification.id
  }

  const removeNotification = (id: number | string) => {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index > -1) {
      if (notifications.value[index]?.onClose) {
        notifications.value[index].onClose()
      }
      notifications.value.splice(index, 1)
    }
  }

  const readNotification = (id: number | string) => {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index > -1) {
      notifications.value[index].read = true
    }
  }

  const clearAll = () => {
    notifications.value = []
  }

  const clearType = (type: 'raffle' | 'airdrop' | 'badge' | 'other') => {
    notifications.value = notifications.value.filter((n) => n.type !== type)
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    readNotification,
    clearAll,
    clearType,
  }
}
