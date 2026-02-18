import { LOCK_DURATION_ID } from '@/types/staking.ts'
import { transactionError, useStatus } from '@/composables/contracts/status.ts'
import { readContract, writeContract } from '@wagmi/core'
import { config } from '@/composables/reown.ts'
import stakingContractDefinition from '@/abi/TokenStaking.json'
import { parseEther } from 'viem'
import { env } from '@/env.ts'
import { useApproval } from '@/composables/contracts/approval.ts'
import { useConfig } from '@/composables/config.ts'
import { sendCalls } from '@wagmi/core/experimental'
import { type Transaction, useTransaction } from '@/composables/contracts/transactions.ts'
import tokenContractDefinition from '@/abi/LingoToken.json'
import { useGetMe } from '../get-me'

export const useStaking = () => {
  const { accountAddress } = useGetMe()
  const { lockConfig } = useConfig()
  const { updateStatus, handleTransactionError } = useStatus()
  const { approve, isApproved, amountToApprove } = useApproval()
  const { supportsPaymaster, paymasterCapabilities, waitForTransaction } = useTransaction()

  async function stake(amount: number | string | null, lockingPeriod: LOCK_DURATION_ID) {
    transactionError.value = {
      text: null,
      value: null,
    }
    try {
      if (!amount || !lockingPeriod) {
        throw new Error('Amount and lock period are required')
      }

      const shouldUsePaymaster = await supportsPaymaster()

      const durationIndex = lockConfig.value.lockDurations[lockingPeriod].index
      const expectedDuration = lockConfig.value.lockDurations[lockingPeriod].lockDurationBlocks

      async function doTx(): Promise<Transaction> {
        if (shouldUsePaymaster) {
          const id = await sendCalls(config, {
            calls: [
              ...(await isApproved() ? [] : [
                {
                  abi: tokenContractDefinition.abi,
                  functionName: 'approve',
                  args: [env.contracts.base.stakingAddress, amountToApprove],
                  to: env.contracts.base.tokenAddress,
                },
              ]),
              {
                abi: stakingContractDefinition.abi,
                functionName: 'stake',
                args: [parseEther(String(amount)), durationIndex, expectedDuration, accountAddress.value],
                to: env.contracts.base.stakingAddress,
              },
            ],
            capabilities: paymasterCapabilities,
          })

          await updateStatus('stake', 'global', { loading: true, success: false, error: false })

          return {
            type: 'calls',
            id,
          }
        }

        await updateStatus('stake', 'global', { loading: true, success: false, error: false })

        const approval = await approve()

        if (!approval) {
          throw new Error('Approval failed')
        }

        const txHash = await writeContract(config, {
          abi: stakingContractDefinition.abi,
          functionName: 'stake',
          args: [parseEther(String(amount)), durationIndex, expectedDuration, accountAddress.value],
          address: env.contracts.base.stakingAddress,
        })
        return {
          type: 'transaction',
          hash: txHash,
        }
      }

      const transaction = await doTx()

      await waitForTransaction({ transaction, notifyBackend: true })
      await updateStatus('stake', 'global', { success: true })

      return true
    } catch (error) {
      console.error('Error in stake:', error)
      await updateStatus('stake', 'global', { error: true })
      handleTransactionError(error)
      return false
    } finally {
      await updateStatus('stake', 'global', { loading: false })
    }
  }

  async function getStakes() {
    return await readContract(config, {
      abi: stakingContractDefinition.abi,
      functionName: 'getStakes',
      args: [accountAddress.value],
      address: env.contracts.base.stakingAddress,
    }) as [{ amount: bigint, unlockBlock: bigint }]
  }

  async function unstake(amount: number | string, unlockBlock: string) {
    transactionError.value = {
      text: null,
      value: null,
    }
    try {
      const stakes = await getStakes()
      if (!stakes) {
        throw new Error('No stakes found')
      }
      const index = stakes.findIndex(s => {
        return s.amount === parseEther(String(amount)) && s.unlockBlock === BigInt(unlockBlock)
      })
      if (index === -1) {
        throw new Error('Stake not found')
      }

      async function doTx(): Promise<Transaction> {
        if (await supportsPaymaster()) {
          const id = await sendCalls(config, {
            calls: [
              {
                abi: stakingContractDefinition.abi,
                functionName: 'unstake',
                args: [index],
                to: env.contracts.base.stakingAddress,
              },
            ],
            capabilities: paymasterCapabilities,
          })
          await updateStatus('unstake', 'global', { loading: true, success: false, error: false })
          return { type: 'calls', id }
        }
        await updateStatus('unstake', 'global', { loading: true, success: false, error: false })
        const txHash = await writeContract(config, {
          abi: stakingContractDefinition.abi,
          functionName: 'unstake',
          args: [index],
          address: env.contracts.base.stakingAddress,
        })
        return { type: 'transaction', hash: txHash }
      }

      const transaction = await doTx()

      await waitForTransaction({ transaction, notifyBackend: true })
      await updateStatus('unstake', 'global', { success: true })
      return true
    } catch (error) {
      await updateStatus('unstake', 'global', { error: true })
      handleTransactionError(error)
      console.error('Error in unstake:', error)
      return false
    } finally {
      await updateStatus('unstake', 'global', { loading: false })
    }
  }

  async function renewStake(amount: number | string, lockingPeriod: LOCK_DURATION_ID, unlockBlock: string) {

    transactionError.value = {
      text: null,
      value: null,
    }
    try {
      const shouldUsePaymaster = await supportsPaymaster()
      if (!shouldUsePaymaster) {

        await updateStatus('stake', 'global', { loading: true, success: false, error: false })
        await updateStatus('approveStaking', 'global', { loading: true, success: false, error: false })
        await updateStatus('unstake', 'global', { loading: true, success: false, error: false })
        await updateStatus('renew', 'global', { loading: true, success: false, error: false })

        const unstakeResponse = await unstake(amount, unlockBlock)
        if (!unstakeResponse) {
          await updateStatus('unstake', 'global', { error: true })
          throw new Error('Unstake failed')
        }
        await updateStatus('unstake', 'global', { success: true })
        const stakeResponse = await stake(amount, lockingPeriod)
        if (!stakeResponse) {
          await updateStatus('stake', 'global', { error: true })
          throw new Error('Stake failed')
        }
      } else {
        const stakes = await getStakes()
        if (!stakes) {
          throw new Error('No stakes found')
        }
        const index = stakes.findIndex(s => {
          return s.amount === parseEther(String(amount)) && s.unlockBlock === BigInt(unlockBlock)
        })
        const durationIndex = lockConfig.value.lockDurations[lockingPeriod].index
        const expectedDuration = lockConfig.value.lockDurations[lockingPeriod].lockDurationBlocks
        const id = await sendCalls(config, {
          calls: [
            {
              abi: stakingContractDefinition.abi,
              functionName: 'unstake',
              args: [index],
              to: env.contracts.base.stakingAddress,
            },
            ...(await isApproved() ? [] : [
              {
                abi: tokenContractDefinition.abi,
                functionName: 'approve',
                args: [env.contracts.base.stakingAddress, amountToApprove],
                to: env.contracts.base.tokenAddress,
              },
            ]),
            {
              abi: stakingContractDefinition.abi,
              functionName: 'stake',
              args: [parseEther(String(amount)), durationIndex, expectedDuration, accountAddress.value],
              to: env.contracts.base.stakingAddress,
            },
          ],
          capabilities: paymasterCapabilities,
        })
        const transaction: Transaction = {
          type: 'calls',
          id,
        }
        await waitForTransaction({ transaction, notifyBackend: true })
      }

      await updateStatus('stake', 'global', { success: true })
      await updateStatus('renew', 'global', { success: true })
      return true
    } catch (error) {
      await updateStatus('renew', 'global', { error: true })
      handleTransactionError(error)
      console.error('Error in renewStake:', error)
      return false
    } finally {
      await updateStatus('unstake', 'global', { loading: false })
      await updateStatus('stake', 'global', { loading: false })
      await updateStatus('renew', 'global', { loading: false })
    }
  }

  return {
    stake,
    unstake,
    renewStake,
  }
}
