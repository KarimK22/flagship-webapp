<template>
  <div
    v-if="topNotifications.length > 0"
    class="w-full opacity-0 h-0 mb-0 container relative [&>*]:transition-[top,transform,left,scale] [&>*]:duration-300 [&>*]:ease-in-out [&>:nth-child(1),&>:nth-child(2),&>:nth-child(3)]:absolute [&>:nth-child(2),&>:nth-child(3)]:-z-10 [&>:nth-child(1),&>:nth-child(2),&>:nth-child(3)]:left-6 [&>:nth-child(2)]:top-[-20px] [&>:nth-child(1)]:scale-100 [&>:nth-child(1)]:top-[0px] [&>:nth-child(2)]:scale-90 [&>:nth-child(3)]:top-[-10px] [&>:nth-child(3)]:scale-95"
    :class="{ 'opacity-100 h-28 md:h-[72px] mb-2 sm:mb-6': isConnected }"
  >
    <TransitionGroup
      name="activity-fade"
    >
      <div
        v-for="notification in topNotifications"
        :key="notification.id"
        class="w-[calc(100%-48px)]"
      >
        <BaseBanner
          :id="notification.id"
          :title="notification.title"
          :cta-button="notification.button!"
          @cta-button-click="handleCtaButtonClick(notification)"
          @close="handleClose(notification)"
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import BaseBanner from '@/components/rewards/BaseBanner.vue'
import { useGetMe } from '@/composables/get-me'
import { notifications, useNotifications } from '@/composables/notifications'
import {computed} from 'vue'

const { readNotification } = useNotifications()
const { isConnected } = useGetMe()
const topNotifications = computed(() => notifications.value.filter((n) => !n.read).slice(0, 3))

function handleCtaButtonClick(notification: {
  id: number | string
  action?: () => void
}) {
  notification.action?.()
  setTimeout(() => {
    readNotification(notification.id)
  }, 1000)
}

const handleClose = (notification: {
  id: number | string
  onClose?: () => void
}) => {
  notification.onClose?.()
  setTimeout(() => {
    readNotification(notification.id)
  }, 1000)
}
</script>

<style scoped>
.activity-fade-enter-active,
.activity-fade-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.activity-fade-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.activity-fade-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.activity-fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}
</style>
