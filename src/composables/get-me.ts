import api from '@/services/api'

import mixpanel from 'mixpanel-browser'
import { useAppKitAccount } from '@reown/appkit/vue'
import { useQuery } from '@tanstack/vue-query'
import { computed, watch, watchEffect } from 'vue'
import { apiToken, loginProvider } from './auth'
import { getAddress } from 'viem'
import { DateTime } from 'luxon'
import initTallyForm, { TallyFormId } from '@/lib/tally'
// import { useDynamicHome } from '@/composables/dynamic-home'
import { isTgeUser } from '@/const/tge-users'
import { useScheduledForms } from './scheduled-forms'

export const useGetMeQueryKey = ['me']

let getMeQuery: ReturnType<typeof createGetMe> | null = null

const createGetMe = () => {
  const { openScheduledForm } = useScheduledForms()
  const account = useAppKitAccount()
  /* const { pendingActivity, isWheel } = useDynamicHome()

  const doNotHavePendingActivity = computed(
    () => !pendingActivity.value && !isWheel.value,
  ) */
  const isAuthenticated = computed(() => !!apiToken.value)

  const enabled = computed(
    () => !!account.value.address && isAuthenticated.value,
  )

  const meQuery = useQuery({
    queryKey: useGetMeQueryKey,
    queryFn: async () => {
      const now = DateTime.now()
      const data = await api.getMe()
      const createdAt = DateTime.fromISO(data.me.createdAt)
      const isNewMember = now.diff(createdAt, 'minutes').minutes < 5

      /* if (
        isNewMember &&
        account.value.address &&
        doNotHavePendingActivity.value
      ) {
        initTallyForm(account.value.address)
      } */
      openScheduledForm({ address: account.value.address })
      return {
        ...data,
        isNewMember,
      }
    },
    select: (data) => data.me,
    enabled,
    refetchOnWindowFocus: false,
  })

  const unwatch = watch(
    [() => meQuery.data.value, () => account.value.address],
    ([me, address]) => {
      if (address && me) {
        if (isTgeUser(address)) {
          initTallyForm(address, TallyFormId.TGE_USER)
        }
        unwatch()
      }
    },
    {
      immediate: true,
    },
  )

  watchEffect(() => {
    if (!meQuery.data.value) return

    const createdAt = DateTime.fromISO(meQuery.data.value.createdAt)

    const now = DateTime.now()

    if (now.diff(createdAt, 'minutes').minutes < 5) {
      mixpanel.track('New Account Registered', {
        provider: loginProvider.value,
        user_id: account.value.address,
      })
    }
  })

  const { refetch: refetchGetMe, isLoading: loadingGetMe } = meQuery

  const referralCode = computed(() => {
    return meQuery.data.value?.profile.referralCode ?? ''
  })

  const accountAddress = computed(() =>
    !!meQuery.data.value && account.value.address
      ? getAddress(account.value.address)
      : undefined,
  )

  const isConnected = computed(() => !!accountAddress.value)

  return {
    meData: meQuery.data,
    refetchGetMe,
    loadingGetMe,
    referralCode,
    isConnected,
    isAuthenticated,
    accountAddress,
  }
}

export const useGetMe = () => {
  if (!getMeQuery) {
    getMeQuery = createGetMe()
  }
  return getMeQuery
}
