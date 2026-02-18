import { useQuery } from '@tanstack/vue-query'
import { useUrlSearchParams } from '@vueuse/core'
import { useGetMeQueryKey } from './get-me'
import { watchEffect } from 'vue'

export const useClickIdPostback = () => {
  const params = useUrlSearchParams('history')

  const meQuery = useQuery({
    queryKey: useGetMeQueryKey,
  })

  const unwatch = watchEffect(() => {
    if (meQuery.data.value && typeof params.click_id === 'string') {
      sendClickIdPostback(params.click_id)

      unwatch()
    }
  })
}

const sendClickIdPostback = async (clickId: string) => {
  const path = `https://cmaffs-postback.org/direct/?cm_cid=${clickId}&conv_type=4&adv_id=233`

  await fetch(path, {
    method: 'GET',
  })
}
