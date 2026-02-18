import { parseEther } from 'viem'
import { readContract, writeContract } from '@wagmi/core'
import { config } from '@/composables/reown.ts'
import tokenContractDefinition from '@/abi/LingoToken.json'
import { env } from '@/env.ts'
import { status, transactionError, useStatus } from '@/composables/contracts/status.ts'
import { sendCalls } from '@wagmi/core/experimental'
import { type Transaction, useTransaction } from '@/composables/contracts/transactions.ts'
import { useGetMe } from '../get-me'

export const useApproval = () => {

  const { accountAddress } = useGetMe()

  const { updateStatus, handleTransactionError } = useStatus()
  const { supportsPaymaster, paymasterCapabilities, waitForTransaction } = useTransaction()

  const minAllowance = parseEther('1000000000')
  const amountToApprove = minAllowance * BigInt(100)

  async function approveStaking(amount: bigint) {
    async function doTx(): Promise<Transaction> {
      if (await supportsPaymaster()) {
        const id = await sendCalls(config, {
          calls: [
            {
              abi: tokenContractDefinition.abi,
              functionName: 'approve',
              args: [env.contracts.base.stakingAddress, amount],
              to: env.contracts.base.tokenAddress,
            },
          ],
          capabilities: paymasterCapabilities,
        })
        return {
          type: 'calls',
          id,
        }
      }
      const txHash = await writeContract(config, {
        abi: tokenContractDefinition.abi,
        functionName: 'approve',
        args: [env.contracts.base.stakingAddress, amount],
        address: env.contracts.base.tokenAddress,
      })
      return {
        type: 'transaction',
        hash: txHash,
      }
    }

    try {
      await updateStatus('approveStaking', 'global', { loading: true, success: false, error: false })
      const transaction = await doTx()
      await waitForTransaction({
        transaction: transaction,
        notifyBackend: false,
      })
      await updateStatus('approveStaking', 'global', { success: true })
      await updateStatus('approveStaking', 'global', { error: false })
      return true
    } catch (error) {
      await updateStatus('approveStaking', 'global', { error: true })
      console.error('Error in approveStaking:', error)
      return false
    } finally {
      await updateStatus('approveStaking', 'global', { loading: false })
    }
  }

  async function isApproved() {
    const allowance = await getAllowance()
    return allowance >= minAllowance

  }

  async function getAllowance() {
    try {
      return await readContract(config, {
        abi: tokenContractDefinition.abi,
        functionName: 'allowance',
        args: [accountAddress.value, env.contracts.base.stakingAddress],
        address: env.contracts.base.tokenAddress,
      }) as bigint
    } catch (error) {
      console.error('Failed to get allowance', error)
      return BigInt(0)
    }
  }

  async function approve() {
    transactionError.value = {
      text: null,
      value: null,
    }
    if (status.approveStaking.global?.success) {
      return true
    }
    if (await isApproved()) {
      await updateStatus('approveStaking', 'global', { success: true })
      return true
    }
    try {
      await updateStatus('approveStaking', 'global', { loading: true })
      await approveStaking(amountToApprove)
      return true
    } catch (error) {
      console.error('Error in approve:', error)
      await updateStatus('approveStaking', 'global', { error: true })
      handleTransactionError(error)
      return false
    } finally {
      await updateStatus('approveStaking', 'global', { loading: false })
    }
  }

  return {
    approve,
    isApproved,
    amountToApprove,
  }
}
