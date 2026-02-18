import { computed, ref } from 'vue'
import { parseEther } from 'viem'
import { writeContract } from '@wagmi/core'
import { config } from '@/composables/reown'
import tokenABI from '@/abi/LingoToken.json'
import api from '@/services/api'
import { env } from '@/env'
import { useGetMe } from '@/composables/get-me'
import { useApproval } from '@/composables/contracts/approval'
import { useTransaction } from '@/composables/contracts/transactions'

export type AutoSmashState = 'LOCKED' | 'UNLOCKED_OFF' | 'UNLOCKED_ON'

type Status = { unlocked: boolean; enabled: boolean }
type Eligibility = {
  eligible: boolean
  lingoAmount: string
  lingoPrice: string
  usdAmount: string
  alreadyPurchased: boolean
  contractAddress: string
}

export const useAutoSmash = () => {
  const status = ref<Status | null>(null)
  const eligibility = ref<Eligibility | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const { isConnected } = useGetMe()
  const { approve } = useApproval()
  const { waitForTransaction } = useTransaction()

  const state = computed<AutoSmashState>(() => {
    if (!status.value?.unlocked) return 'LOCKED'
    return status.value.enabled ? 'UNLOCKED_ON' : 'UNLOCKED_OFF'
  })

  async function fetchStatus() {
    status.value = await api.getAutoSmashStatus()
  }

  async function checkEligibility() {
    eligibility.value = await api.getAutoSmashEligibility()
    return eligibility.value
  }

  async function unlockAutoSmash(): Promise<boolean> {
    if (!isConnected.value || loading.value) return false
    loading.value = true
    error.value = null

    try {
      const elig = await checkEligibility()
      if (!elig?.eligible) return false

      if (elig.alreadyPurchased) {
        await fetchStatus()
        return true
      }

      const { purchaseId, lingoAmount, contractAddress } =
        await api.initiateAutoSmashPurchase()

      const approved = await approve()
      if (!approved) throw new Error('Approval failed')

      const amount = parseEther(lingoAmount)

      const txHash = await writeContract(config, {
        abi: tokenABI.abi,
        functionName: 'transfer',
        args: [contractAddress, amount],
        address: env.contracts.base.tokenAddress,
      })

      await waitForTransaction({
        transaction: { type: 'transaction', hash: txHash },
        notifyBackend: false,
      })

      await api.confirmAutoSmashPurchase({ purchaseId, txHash })
      await fetchStatus()

      return true
    } catch (e: any) {
      console.error('[AUTO-SMASH] unlock failed', e)
      error.value = parseTxError(e)
      return false
    } finally {
      loading.value = false
    }
  }

  async function toggleAutoSmash() {
    if (!status.value) await fetchStatus()
    await api.toggleAutoSmash(!status.value!.enabled)
    await fetchStatus()
  }

  function parseTxError(e: unknown): string {
    if (!e || typeof e !== 'object') {
      return 'Transaction failed'
    }

    const err = e as any

    if (err.code === 4001) {
      return 'Transaction cancelled'
    }

    if (err.shortMessage) {
      return err.shortMessage
    }

    if (err.message) {
      return err.message
    }

    return 'Unexpected transaction error'
  }

  return {
    status,
    state,
    eligibility,
    loading,
    error,
    fetchStatus,
    checkEligibility,
    unlockAutoSmash,
    toggleAutoSmash,
  }
}