import { computed } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import api, {
  type ClaimTaskResponse,
  type TasksHistoryResponse,
  type TasksMultiplierResponse,
  type TasksResponse,
} from '@/services/api'
import { useGetMe } from '@/composables/get-me'

const tasksQueryKey = 'tasks'
const tasksHistoryQueryKey = 'tasksHistory'
const tasksMultiplierQueryKey = 'tasksMultiplier'

export const useTasks = () => {
  const { isAuthenticated, accountAddress } = useGetMe()

  const tasksQuery = useQuery<TasksResponse>({
    queryKey: [tasksQueryKey, accountAddress],
    queryFn: () => api.getTasks(),
    enabled: () => Boolean(isAuthenticated.value),
    initialData: { tasks: [], isAuthenticated: false },
    refetchOnWindowFocus: false,
  })

  const tasks = computed(() => tasksQuery.data.value?.tasks ?? [])

  return {
    ...tasksQuery,
    tasks,
  }
}

export const useTasksHistory = () => {
  const { isAuthenticated, accountAddress } = useGetMe()

  return useQuery<TasksHistoryResponse>({
    queryKey: [tasksHistoryQueryKey, accountAddress],
    queryFn: () => api.getTasksHistory(),
    enabled: () => Boolean(isAuthenticated.value),
    initialData: { history: [] },
    refetchOnWindowFocus: false,
  })
}

export const useTasksMultiplier = () => {
  const { isAuthenticated, accountAddress } = useGetMe()

  return useQuery<TasksMultiplierResponse>({
    queryKey: [tasksMultiplierQueryKey, accountAddress],
    queryFn: () => api.getTasksMultiplier(),
    enabled: () => Boolean(isAuthenticated.value),
    initialData: {
      stakedAmountUsd: 0,
      bonusMultiplier: 1,
      lingoBalance: 0,
      stakedLingoAmount: 0,
    },
    refetchOnWindowFocus: false,
  })
}

export const useTaskActions = () => {
  const queryClient = useQueryClient()

  const claimTaskMutation = useMutation({
    mutationKey: ['claimTask'],
    mutationFn: async ({ taskId }: { taskId: string }): Promise<ClaimTaskResponse> => {
      return await api.claimTask({ taskId })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tasksQueryKey] })
      queryClient.invalidateQueries({ queryKey: [tasksHistoryQueryKey] })
      queryClient.invalidateQueries({ queryKey: [tasksMultiplierQueryKey] })
      queryClient.invalidateQueries({ queryKey: ['myStakes'] })
    },
  })

  const redirectionClickedMutation = useMutation({
    mutationKey: ['taskRedirectionClicked'],
    mutationFn: async ({ taskId }: { taskId: string }) => {
      return await api.markTaskRedirectionClicked({ taskId })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tasksQueryKey] })
    },
  })

  return {
    claimTaskMutation,
    redirectionClickedMutation,
  }
}
