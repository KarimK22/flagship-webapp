import api from '@/services/api.ts'
import { writeContract } from '@wagmi/core'
import { config } from '@/composables/reown.ts'
import vestingContractDefinition from '@/abi/TokenVesting.json'
import { beneficiaryMapping } from '@/types/beneficiary.ts'
import { parseEther } from 'viem'
import { env } from '@/env.ts'
import { LOCK_DURATION_ID } from '@/types/staking.ts'
import { useBalance } from '@/composables/contracts/balance.ts'
import { transactionError, useStatus } from '@/composables/contracts/status.ts'
import { useApproval } from '@/composables/contracts/approval.ts'
import { useClaimCustom } from '@/composables/contracts/claim-custom.ts'
import { useConfig } from '@/composables/config.ts'
import { useTransaction } from '@/composables/contracts/transactions.ts'
import { useLastClaims } from '@/composables/contracts/last-claims'
import { useInvestorsKOL } from '@/composables/contracts/claim-investorsKOL'

export const useClaiming = () => {
  const { lockConfig } = useConfig()
  const { claimableAllocationTypes } = useBalance()
  const { updateStatus, handleTransactionError } = useStatus()
  const { waitForTransaction } = useTransaction()
  const { approve } = useApproval()
  const { fetchLastClaims } = useLastClaims()
  const { claimInvestorsKOL, claimAndStakeInvestorsKOL, releasablePools } = useInvestorsKOL()

  async function claimTokens(vestingType: string) {
    try {
      await updateStatus('claimTokens', vestingType, { loading: true, success: false, error: false })

      if (!claimableAllocationTypes.value) {
        throw new Error('No claimable allocation types')
      }

      const beneficiaryType = beneficiaryMapping[vestingType]
      const { proof } = await api.getMerkleProof(beneficiaryType)

      const txHash = await writeContract(config, {
        abi: vestingContractDefinition.abi,
        functionName: 'claimTokens',
        args: [proof, beneficiaryType, parseEther(String(claimableAllocationTypes.value[vestingType]))],
        address: env.contracts.base.vestingAddress,
      })

      await waitForTransaction({
        transaction: { type: 'transaction', hash: txHash },
        notifyBackend: false,
      })

      await updateStatus('claimTokens', vestingType, { success: true })
      await api.claimedLingo(beneficiaryType)
      await fetchLastClaims()
      return true
    } catch (error) {
      console.error('Error in claimTokens:', error)
      await updateStatus('claimTokens', vestingType, { error: true })
      handleTransactionError(error)
      return false
    } finally {
      await updateStatus('claimTokens', vestingType, { loading: false })
    }
  }

  const { claimCustom, totalCustomClaimableBalance, claimAndStakeCustom } = useClaimCustom()

  async function claimAll(): Promise<boolean> {
    if (totalCustomClaimableBalance.value > 0) {
      await updateStatus('claimCustom', 'global', { loading: true, success: false, error: false })
    }
    await updateStatus('claimTokens', 'global', { loading: true, success: false, error: false })

    // Initialize status for all investorsKOL pools that have releasable amount
    for (const pool of releasablePools.value) {
      await updateStatus('claimInvestorsKOL', pool.index.toString(), { loading: true, success: false, error: false })
    }

    try {
      if (claimableAllocationTypes.value) {
        for (const type of Object.keys(claimableAllocationTypes.value)) {
          const claimType = await claimTokens(type)
          if (!claimType) {
            throw new Error(`Claim failed ${type}`)
          }
        }
      }

      if (totalCustomClaimableBalance.value > 0) {
        const claimCustomResponse = await claimCustom()
        if (!claimCustomResponse) {
          throw new Error('Claim custom failed')
        }
      }

      // Add investorsKOL claims
      for (const pool of releasablePools.value) {
        const claimInvestorsKOLResponse = await claimInvestorsKOL(pool.index)
        if (!claimInvestorsKOLResponse) {
          await updateStatus('claimInvestorsKOL', pool.index.toString(), { error: true })
          throw new Error(`Claim investorsKOL failed for ${pool.name}`)
        }
        await updateStatus('claimInvestorsKOL', pool.index.toString(), { success: true })
      }

      await updateStatus('claimTokens', 'global', { success: true })
      return true
    } catch (error) {
      await updateStatus('claimTokens', 'global', { error: true })
      console.error('Error during claimAll:', error)
      return false
    } finally {
      await updateStatus('claimTokens', 'global', { loading: false })
      if (totalCustomClaimableBalance.value > 0) {
        await updateStatus('claimCustom', 'global', { loading: false })
      }
      // Reset loading state for all investorsKOL pools
      for (const pool of releasablePools.value) {
        await updateStatus('claimInvestorsKOL', pool.index.toString(), { loading: false })
      }
    }
  }

  //Staking
  async function claimAndStake(vestingType: string, lockingPeriod: LOCK_DURATION_ID) {
    transactionError.value = {
      text: null,
      value: null,
    }
    try {
      await updateStatus('claimAndStake', vestingType, { loading: true, success: false, error: false })
      if (!claimableAllocationTypes.value) {
        throw new Error('No claimable allocation types')
      }

      const approval = await approve()

      if (!approval) {
        throw new Error('Approval failed')
      }

      const beneficiaryType = beneficiaryMapping[vestingType]
      const { proof } = await api.getMerkleProof(beneficiaryType)

      const durationIndex = lockConfig.value.lockDurations[lockingPeriod].index
      const expectedDuration = lockConfig.value.lockDurations[lockingPeriod].lockDurationBlocks

      const txHash = await writeContract(config, {
        abi: vestingContractDefinition.abi,
        functionName: 'claimAndStakeTokens',
        args: [proof, beneficiaryType, parseEther(String(claimableAllocationTypes.value[vestingType])), durationIndex, expectedDuration],
        address: env.contracts.base.vestingAddress,
      })

      await waitForTransaction({
        transaction: { type: 'transaction', hash: txHash },
        notifyBackend: false,
      })
      await updateStatus('claimAndStake', vestingType, { success: true })
      await api.checkTransaction(txHash)
      await api.claimedLingo(beneficiaryType)
      await fetchLastClaims()
      return true
    } catch (error) {
      console.error('Error in claimAndStake:', error)
      await updateStatus('claimAndStake', vestingType, { error: true })
      handleTransactionError(error)
      return false
    } finally {
      await updateStatus('claimAndStake', vestingType, { loading: false })
    }
  }
  async function claimAndStakeAll(lockingPeriod: LOCK_DURATION_ID): Promise<boolean> {
    if (totalCustomClaimableBalance.value > 0) {
      await updateStatus('claimAndStakeCustom', 'global', { loading: true, success: false, error: false })
    }
    await updateStatus('claimAndStake', 'global', { loading: true, success: false, error: false })

    // Initialize status for all investorsKOL pools that have releasable amount
    for (const pool of releasablePools.value) {
      await updateStatus('claimAndStakeInvestorsKOL', pool.index.toString(), { loading: true, success: false, error: false })
    }

    try {
      if (claimableAllocationTypes.value) {
        for (const type of Object.keys(claimableAllocationTypes.value)) {
          const claimType = await claimAndStake(type, lockingPeriod)
          if (!claimType) {
            throw new Error(`Claim and stake failed ${type}`)
          }
        }
      }
      if (totalCustomClaimableBalance.value > 0) {
        const claimAndStakeCustomResponse = await claimAndStakeCustom(lockingPeriod)
        if (!claimAndStakeCustomResponse) {
          throw new Error('Claim and stake custom failed')
        }
      }

      // Add investorsKOL claims and stake
      for (const pool of releasablePools.value) {
        const claimAndStakeInvestorsKOLResponse = await claimAndStakeInvestorsKOL(pool.index, lockingPeriod)
        if (!claimAndStakeInvestorsKOLResponse) {
          await updateStatus('claimAndStakeInvestorsKOL', pool.index.toString(), { error: true })
          throw new Error(`Claim and stake investorsKOL failed for ${pool.name}`)
        }
        await updateStatus('claimAndStakeInvestorsKOL', pool.index.toString(), { success: true })
      }

      await updateStatus('claimAndStake', 'global', { success: true })
      return true
    } catch (error) {
      await updateStatus('claimAndStake', 'global', { error: true })
      console.error('Error during claim And Stake:', error)
      return false
    } finally {
      await updateStatus('claimAndStake', 'global', { loading: false })
      if (totalCustomClaimableBalance.value > 0) {
        await updateStatus('claimAndStakeCustom', 'global', { loading: false })
      }
      // Reset loading state for all investorsKOL pools
      for (const pool of releasablePools.value) {
        await updateStatus('claimAndStakeInvestorsKOL', pool.index.toString(), { loading: false })
      }
    }
  }

  return {
    claimTokens,
    claimAndStake,
    claimAll,
    claimAndStakeAll,
  }
}
