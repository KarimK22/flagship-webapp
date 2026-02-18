import {
  getCallsStatus,
  type GetCallsStatusReturnType,
  getCapabilities,
} from '@wagmi/core/experimental'
import { config, lingoMainnet } from '@/composables/reown.ts'
import { env } from '@/env.ts'
import { waitForTransactionReceipt } from '@wagmi/core'
import { useStatus } from '@/composables/contracts/status.ts'
import api from '@/services/api.ts'

export type Transaction = {
  type: 'calls'
  id: string
} | {
  type: 'transaction'
  hash: `0x${string}`
}

export const useTransaction = () => {
  const { updateStatus } = useStatus()

  async function supportsPaymaster(): Promise<boolean> {
    try {
      const chainId = lingoMainnet.id
      const capabilities = await getCapabilities(config)
      return Boolean(capabilities[chainId]?.paymasterService?.supported)
    } catch (e) {
      console.error(e)
      return false
    }
  }

  const checkCallStatus = (callStatus: GetCallsStatusReturnType) => {
    const isConfirmed = callStatus.status === 'CONFIRMED'
    const someReverted = callStatus.receipts?.some(r => r.status === 'reverted')
    if (isConfirmed && someReverted) {
      /* TODO: decode logs and throw error with the decoded data */
      throw new Error('Call reverted')
    }
  }

  async function waitForTransaction({ notifyBackend, transaction }: { transaction: Transaction, notifyBackend: boolean }): Promise<string[]> {
    await updateStatus('waitForTransaction', 'global', { loading: true })
    if (transaction.type === 'transaction') {
      await waitForTransactionReceipt(config, { hash: transaction.hash })
      if (notifyBackend) {
        await api.checkTransactions([transaction.hash])
      }
      await updateStatus('waitForTransaction', 'global', { success: true })
      return [transaction.hash]
    }
    while (true) {
      try {
        const callStatus = await getCallsStatus(config, {
          id: transaction.id,
        })
        if (callStatus.status === 'CONFIRMED') {
          checkCallStatus(callStatus)
          const txHashes = callStatus.receipts?.map(r => r.transactionHash) ?? []
          if (notifyBackend && txHashes.length > 0) {
            await api.checkTransactions(txHashes)
          }
          await updateStatus('waitForTransaction', 'global', { success: true })
          return callStatus.receipts?.map(r => r.transactionHash) ?? []
        }
      } catch (e) {
        /* NOTE: This should stop the loop */
        if (e instanceof Error && e.message === 'Call reverted') {
          await updateStatus('waitForTransaction', 'global', { success: false, error: true, loading: false })
          throw e
        }
      }
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  const paymasterCapabilities = {
    paymasterService: {
      url: `https://paymaster-api.reown.com/${lingoMainnet.id}/rpc?projectId=${env.reown.projectId}`,
    },
  }

  return { supportsPaymaster, paymasterCapabilities, waitForTransaction }
}
