<template>
  <div class="container pb-12">
    <div class="mx-auto max-w-[760px]">
      <h2 class="mt-6 text-lavender text-[36px] font-normal leading-[40px] tracking-[-0.96px]">
        {{ t('components.tasks.title') }}
      </h2>

      <div
        v-if="showLoginPrompt"
        class="mt-6 flex flex-col items-start gap-4 rounded-2xl bg-dark2/80 px-6 py-5"
      >
        <p class="text-sm text-soft-gray">
          {{ t('components.tasks.loginRequired') }}
        </p>
      </div>

      <div
        v-else-if="showDiscordConnect"
        class="mt-6 flex flex-col items-start gap-4 rounded-2xl bg-dark2/80 px-6 py-5"
      >
        <p class="text-sm text-soft-gray">
          {{ t('components.tasks.discordRequired') }}
        </p>
        <GlowButton
          :color="EButtonColor.BLUE"
          class="min-w-[140px]"
          @click="connect"
        >
          {{ t('components.tasks.connectDiscord') }}
        </GlowButton>
      </div>

      <template v-else>
        <TasksBoostBar
          :staked-amount-usd="multiplier.stakedAmountUsd"
          :bonus-multiplier="multiplier.bonusMultiplier"
          :staked-lingo-amount="multiplier.stakedLingoAmount ?? 0"
        />

        <section class="mt-10">
          <h3 class="mb-7 text-soft-gray text-[30px] font-normal leading-7 tracking-[-0.6px]">
            {{ t('components.tasks.activeTitle') }}
          </h3>
          <div class="flex flex-col gap-4">
            <TaskCard
              v-for="task in tasks"
              :key="task.taskId"
              :task="task"
              :bonus-multiplier="multiplier.bonusMultiplier"
              :action-label="getTaskActionLabel(task)"
              :loading="pendingTaskId === task.taskId"
              :disabled="isTaskActionDisabled(task)"
              @action="handleTaskAction"
            />
            <p
              v-if="!tasksLoading && tasks.length === 0"
              class="text-sm text-purple-gray"
            >
              {{ t('components.tasks.emptyActive') }}
            </p>
          </div>
        </section>

        <section class="mt-12">
          <h3 class="mb-7 text-soft-gray text-[30px] font-normal leading-7 tracking-[-0.6px]">
            {{ t('components.tasks.completedTitle') }}
          </h3>
          <div class="flex flex-col gap-4">
            <CompletedTaskCard
              v-for="task in history"
              :key="task.id"
              :task="task"
            />
            <p
              v-if="!historyLoading && history.length === 0"
              class="text-sm text-purple-gray"
            >
              {{ t('components.tasks.emptyCompleted') }}
            </p>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTranslation } from '@/composables/use-i18n'
import { useTaskActions, useTasks, useTasksHistory, useTasksMultiplier } from '@/composables/use-tasks'
import { useDiscord } from '@/composables/use-discord'
import { useMyBadges } from '@/composables/my-badges'
import { useGetMe } from '@/composables/get-me'
import TaskCard from '@/components/rewards/tasks/TaskCard.vue'
import CompletedTaskCard from '@/components/rewards/tasks/CompletedTaskCard.vue'
import TasksBoostBar from '@/components/rewards/tasks/TasksBoostBar.vue'
import GlowButton from '@/components/ui/button/GlowButton.vue'
import { EButtonColor } from '@/types/shared/button'
import type { TaskProgress } from '@/services/api'

const { t } = useTranslation()
const { tasks, isLoading: tasksLoading } = useTasks()
const { data: historyData, isLoading: historyLoading } = useTasksHistory()
const { data: multiplierData } = useTasksMultiplier()
const { claimTaskMutation, redirectionClickedMutation } = useTaskActions()
const { connect, isConnected: isDiscordConnected, loadingDiscordStatus } = useDiscord()
const { isBadgesSheetOpen } = useMyBadges()
const { isAuthenticated } = useGetMe()

const pendingTaskId = ref<string | null>(null)

const history = computed(() => historyData.value?.history ?? [])
const showLoginPrompt = computed(() => !isAuthenticated.value)
const showDiscordConnect = computed(() => {
  return !showLoginPrompt.value && !loadingDiscordStatus.value && !isDiscordConnected.value
})
const multiplier = computed(() => multiplierData.value ?? {
  stakedAmountUsd: 0,
  bonusMultiplier: 1,
  stakedLingoAmount: 0,
})

const getTaskActionLabel = (task: TaskProgress) => {
  if (task.completed) return t('components.tasks.actions.claim')
  if (task.requirement === 'follow_twitter') return t('components.tasks.actions.follow')
  if (task.requirement === 'connect_discord') return t('components.tasks.actions.getNow')
  if (task.requirement === 'connect_email') return t('components.tasks.actions.connect')
  return t('components.tasks.actions.getNow')
}

const isTaskActionDisabled = (task: TaskProgress) => {
  if (task.completed) return false
  if (task.redirectionLink) return false
  if (task.requirement === 'connect_discord') return false
  if (task.requirement === 'get_first_badge') return false
  return true
}

const handleTaskAction = async (task: TaskProgress) => {
  if (pendingTaskId.value) return

  pendingTaskId.value = task.taskId
  try {
    if (task.completed) {
      await claimTaskMutation.mutateAsync({ taskId: task.taskId })
      return
    }

    if (task.requirement === 'get_first_badge') {
      isBadgesSheetOpen.value = true
      return
    }

    if (task.redirectionLink) {
      await redirectionClickedMutation.mutateAsync({ taskId: task.taskId })
      window.open(task.redirectionLink, '_blank')
      return
    }
  } finally {
    pendingTaskId.value = null
  }
}
</script>
