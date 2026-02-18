import { reactive, ref } from 'vue'
import { ContractFunctionExecutionError } from 'viem'
import { ConnectorNotConnectedError } from '@wagmi/core'

export const status = reactive<
  Record<
    string,
    Record<string, { loading: boolean; success: boolean; error: boolean }>
  >
>({
  claimTokens: {},
  claimAndStake: {},
  approveStaking: {},
  stake: {},
  unstake: {},
  renew: {},
  claimCustom: {},
  claimAndStakeCustom: {},
  waitForTransaction: {},
  mintBadge: {},
  claimInvestorsKOL: {},
  claimAndStakeInvestorsKOL: {},
  claimAPY: {},
  claimAndStakeAPY: {},
})
export const transactionError = ref<{ value: string | null, text: string | null }>({
  value: null,
  text: null,
})

export const useStatus = () => {
  async function updateStatus(action: keyof typeof status, vestingType: string, state: Partial<{
        loading: boolean,
        success: boolean,
        error: boolean
    }>) {
    if (!status[action][vestingType]) {
      status[action][vestingType] = { loading: false, success: false, error: false }
    }
    Object.assign(status[action][vestingType], state)
  }

  function handleTransactionError(error: unknown) {
    if (error instanceof Error) {
      if (error instanceof ContractFunctionExecutionError && error.message.includes('0xe450d38c')) {
        transactionError.value = error.functionName === 'claim' ? {
          text: 'Currently, there aren’t enough tokens in the contract to complete your request. We’re on it! Try again shortly.',
          value: error.message,
        } : {
          text: 'The amount you\'re trying to stake exceeds your current balance. Please update the amount and try again.',
          value: error.message,
        }
      } else if (error instanceof ConnectorNotConnectedError || error.message.includes('account has not been authorized by the user')) {
        transactionError.value = {
          text: 'The wallet connection has been lost. Please reconnect and try again.',
          value: error.message,
        }
      } else if (error.message.includes('User rejected')) {
        transactionError.value = {
          text: 'The transaction was rejected by the user. Please try again.',
          value: error.message,
        }
      } else if (error.message.includes('Pop up window failed to open')) {
        transactionError.value = {
          text: 'Failed to open the browser pop-up for transaction confirmation. Please enable pop-ups and try again.',
          value: error.message,
        }
      } else {
        transactionError.value = {
          text: '',
          value: error.message,
        }
      }
    }
  }

  return {
    updateStatus,
    handleTransactionError,
  }
}