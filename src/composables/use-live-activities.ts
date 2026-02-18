import { computed, ref } from 'vue'
import { faker } from '@faker-js/faker'

export type LiveActivity = {
  user: string
  prize: string
  id: string
  duration: number
}

const prizes = [
  'an iPhone Giveaway Ticket',
  'a Rolex Giveaway Ticket',
  'a Vacation Giveaway Ticket',
  '$10',
  '$100',
  'a Car Giveaway Ticket',
  '500 Power Miles',
]
let interval: NodeJS.Timeout | null = null

const buildMockActivity = () => {
  const username = faker.internet.email()
  return {
    user: username.toLowerCase().split('@')[0],
    prize: prizes[Math.floor(Math.random() * prizes.length)],
    duration: 8000,
  }
}

export const useLiveActivities = () => {
  const activities = ref<LiveActivity[]>([])
  const nextId = ref(1)

  const addActivity = (activity: Omit<LiveActivity, 'id'>) => {
    const newActivity: LiveActivity = {
      ...activity,
      id: `activity-${nextId.value++}`,
    }

    activities.value.unshift(newActivity)

    // Keep only the latest 10 activities
    if (activities.value.length > 10) {
      activities.value = activities.value.slice(0, 10)
    }

    return newActivity
  }

  const removeActivity = (id: string) => {
    const index = activities.value.findIndex(activity => activity.id === id)
    if (index > -1) {
      activities.value.splice(index, 1)
    }
  }

  const clearAllActivities = () => {
    activities.value = []
  }

  const startMocking = () => {
    if (interval) return

    interval = setInterval(() => {
      const shouldAdd = Math.random() < 0.4
      if (shouldAdd) {
        const activityData = buildMockActivity()
        const newActivity = addActivity(activityData)
        setTimeout(() => {
          removeActivity(newActivity.id)
        }, activityData.duration)
      }
    }, 2000)
  }

  const stopMocking = () => {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }

  return {
    activities: computed(() => activities.value),
    addActivity,
    removeActivity,
    clearAllActivities,
    startMocking,
    stopMocking,
  }
}