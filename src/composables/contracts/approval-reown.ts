import { parseEther } from 'viem'
import { writeContract } from '@wagmi/core'
import { config } from '@/composables/reown.ts'
import tokenContractDefinition from '@/abi/LingoToken.json'
import { env } from '@/env.ts'
import { status, transactionError, useStatus } from '@/composables/contracts/status.ts'
import { sendCalls } from '@wagmi/core/experimental'
import { useTransaction } from '@/composables/contracts/transactions.ts'

export const useApprovalReown = () => {
  const { updateStatus, handleTransactionError } = useStatus()
  const { waitForTransaction } = useTransaction()
  const minAllowance = parseEther('1000000000')

  const { supportsPaymaster, paymasterCapabilities } = useTransaction()

  async function doTx(amount: bigint): Promise<`0x${string}`> {
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

      return id as `0x${string}`
    }
    return await writeContract(config, {
      abi: tokenContractDefinition.abi,
      functionName: 'approve',
      args: [env.contracts.base.stakingAddress, amount],
      address: env.contracts.base.tokenAddress,
    })
  }

  async function approveStaking(amount: bigint) {

    try {
      await updateStatus('approveStaking', 'global', { loading: true, success: false, error: false })

      const txHash = await doTx(amount)
      if (txHash) return false
      await waitForTransaction({
        transaction: { type: 'transaction', hash: txHash },
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

  // async function getAllowance() {
  //   try {
  //     return await readContract(config, {
  //       abi: tokenContractDefinition.abi,
  //       functionName: 'allowance',
  //       args: [walletConnected.value, env.contracts.base.stakingAddress],
  //       address: env.contracts.base.tokenAddress,
  //     }) as bigint
  //   } catch (error) {
  //     console.error('Failed to get allowance', error)
  //     return BigInt(0)
  //   }
  // }

  async function approve() {
    transactionError.value = {
      text: null,
      value: null,
    }
    if (status.approveStaking.global?.success) {
      return true
    }
    // const allowance = await getAllowance()
    // if (allowance >= minAllowance) {
    //   await updateStatus('approveStaking', 'global', { success: true })
    //   return true
    // }
    try {
      await approveStaking(minAllowance)
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
  }
}
