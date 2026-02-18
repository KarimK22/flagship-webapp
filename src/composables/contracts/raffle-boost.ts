import { computed, ref } from 'vue'
import { readContract, writeContract } from '@wagmi/core'
import { config } from '@/composables/reown'
import tokenABI from '@/abi/LingoToken.json'
import api from '@/services/api'
import { useGetMe } from '@/composables/get-me'
import { useTransaction } from '@/composables/contracts/transactions'
import type { RaffleBoostOffer, RaffleBoostStatus } from '@/types/raffle-boost'

export type BoostState =
  | 'idle'
  | 'checking-balance'
  | 'fetching-offer'
  | 'initiating'
  | 'approving'
  | 'transferring'
  | 'polling'
  | 'success'
  | 'error'

export const useRaffleBoost = () => {
  const state = ref<BoostState>('idle')
  const error = ref<string | null>(null)
  const boostOffer = ref<RaffleBoostOffer | null>(null)
  const boostStatus = ref<RaffleBoostStatus | null>(null)
  const currentBoostId = ref<string | null>(null)

  const { isConnected, accountAddress } = useGetMe()
  const { waitForTransaction } = useTransaction()

  const isProcessing = computed(
    () =>
      state.value !== 'idle' &&
      state.value !== 'success' &&
      state.value !== 'error'
  )

  /**
   * Check user's token balance (USDT/USDC)
   */
  async function checkTokenBalance(tokenAddress: string): Promise<bigint> {
    try {
      const balance = (await readContract(config, {
        abi: tokenABI.abi,
        functionName: 'balanceOf',
        args: [accountAddress.value],
        address: tokenAddress as `0x${string}`,
      })) as bigint

      return balance
    } catch (e) {
      console.error('[RAFFLE-BOOST] Failed to check token balance', e)
      return BigInt(0)
    }
  }

  /**
   * Get boost offer details from API
   */
  async function fetchBoostOffer(
    raffleId: string
  ): Promise<RaffleBoostOffer | null> {
    try {
      state.value = 'fetching-offer'
      const offer = await api.getBoostOffer({ raffleId })
      boostOffer.value = offer
      return offer
    } catch (e) {
      console.error('[RAFFLE-BOOST] Failed to fetch boost offer', e)
      error.value = 'Failed to fetch boost offer'
      return null
    }
  }

  /**
   * Check token allowance for the recipient address
   */
  async function checkTokenAllowance(
    recipientAddress: string,
    tokenAddress: string
  ): Promise<bigint> {
    try {
      const allowance = (await readContract(config, {
        abi: tokenABI.abi,
        functionName: 'allowance',
        args: [accountAddress.value, recipientAddress],
        address: tokenAddress as `0x${string}`,
      })) as bigint

      return allowance
    } catch (e) {
      console.error('[RAFFLE-BOOST] Failed to check token allowance', e)
      return BigInt(0)
    }
  }

  /**
   * Approve token spending (USDC/USDT)
   */
  async function approveToken(
    recipientAddress: string,
    amount: bigint,
    tokenAddress: string
  ): Promise<boolean> {
    try {
      state.value = 'approving'

      // Check current allowance
      const currentAllowance = await checkTokenAllowance(
        recipientAddress,
        tokenAddress
      )

      // If allowance is sufficient, skip approval
      if (currentAllowance >= amount) {
        return true
      }

      // Request approval
      const txHash = await writeContract(config, {
        abi: tokenABI.abi,
        functionName: 'approve',
        args: [recipientAddress, amount],
        address: tokenAddress as `0x${string}`,
      })

      // Wait for approval transaction to be mined
      await waitForTransaction({
        transaction: { type: 'transaction', hash: txHash },
        notifyBackend: false,
      })

      return true
    } catch (e: unknown) {
      console.error('[RAFFLE-BOOST] Approval failed', e)
      error.value = parseTxError(e)
      return false
    }
  }

  /**
   * Execute token transfer (USDC/USDT)
   */
  async function executeTokenTransfer(
    recipientAddress: string,
    amount: bigint,
    tokenAddress: string
  ): Promise<string | null> {
    try {
      state.value = 'transferring'

      console.log('[RAFFLE-BOOST] Executing transfer:', {
        to: recipientAddress,
        amount: amount.toString(),
        tokenContract: tokenAddress,
      })

      const txHash = await writeContract(config, {
        abi: tokenABI.abi,
        functionName: 'transfer',
        args: [recipientAddress, amount],
        address: tokenAddress as `0x${string}`,
      })

      // Wait for transfer transaction to be mined
      await waitForTransaction({
        transaction: { type: 'transaction', hash: txHash },
        notifyBackend: false,
      })

      return txHash
    } catch (e: unknown) {
      console.error('[RAFFLE-BOOST] Transfer failed', e)
      error.value = parseTxError(e)
      return null
    }
  }

  /**
   * Poll boost status until completed or timeout
   */
  async function pollBoostStatus(
    raffleId: string,
    maxAttempts = 15
  ): Promise<RaffleBoostStatus | null> {
    state.value = 'polling'

    let attempts = 0
    const delays = [1000, 2000, 4000, 8000, 8000, 8000] // Exponential backoff up to 8s

    while (attempts < maxAttempts) {
      try {
        const status = await api.getBoostStatus({ raffleId })
        boostStatus.value = status

        if (status.status === 'completed') {
          return status
        }

        if (status.status === 'failed' || status.status === 'expired') {
          error.value = status.error || `Boost ${status.status}`
          return status
        }

        // Wait before next poll
        const delay = delays[Math.min(attempts, delays.length - 1)]
        await new Promise((resolve) => setTimeout(resolve, delay))
        attempts++
      } catch (e) {
        console.error('[RAFFLE-BOOST] Failed to poll boost status', e)
        attempts++
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }

    error.value = 'Boost verification timed out'
    return null
  }

  /**
   * Main function to execute boost purchase
   */
  async function executeBoosPurchase(
    raffleId: string,
    ticketCount: number
  ): Promise<boolean> {
    if (!isConnected.value) {
      error.value = 'Wallet not connected'
      return false
    }

    if (!ticketCount || ticketCount <= 0) {
      error.value = 'Invalid ticket count'
      return false
    }

    state.value = 'idle'
    error.value = null
    currentBoostId.value = null

    try {
      // 1. Fetch boost offer to get pricing and payment details
      state.value = 'fetching-offer'
      const offer = await fetchBoostOffer(raffleId)
      if (
        !offer ||
        !offer.acceptedTokens ||
        offer.acceptedTokens.length === 0
      ) {
        error.value = 'Boost offer not available'
        state.value = 'error'
        return false
      }

      if (offer.pricePerTicketUsd <= 0) {
        error.value = 'Invalid boost pricing'
        state.value = 'error'
        return false
      }

      // 2. Initiate boost purchase with user-specified ticket count
      state.value = 'initiating'
      console.log('[RAFFLE-BOOST] Initiating boost with tickets:', ticketCount)
      const initResponse = await api.initiateBoost({ raffleId, ticketCount })
      currentBoostId.value = initResponse.purchaseId

      // Store purchaseId in localStorage for recovery
      localStorage.setItem('pendingBoostId', initResponse.purchaseId)
      localStorage.setItem('pendingBoostRaffleId', raffleId)

      // 3. Use USDC (first accepted token - filter for USDC only)
      const usdcToken = initResponse.acceptedTokens.find(
        (t) => t.symbol === 'USDC'
      )
      if (!usdcToken) {
        error.value = 'USDC not available for payment'
        state.value = 'error'
        return false
      }

      // All payment details come from initResponse
      const amount = BigInt(initResponse.amount) // Already in correct decimals!
      const recipientAddress = initResponse.treasureWalletAddress

      console.log('[RAFFLE-BOOST] Payment details from initResponse:', {
        recipientAddress,
        amount: initResponse.amount,
        totalPriceUsd: initResponse.totalPriceUsd,
        tokenAddress: usdcToken.address,
        tokenSymbol: usdcToken.symbol,
      })

      // 4. Check USDC balance
      state.value = 'checking-balance'
      const balance = await checkTokenBalance(usdcToken.address)
      if (balance < amount) {
        error.value = `Insufficient ${usdcToken.symbol} balance. Required: ${initResponse.totalPriceUsd} USD`
        state.value = 'error'
        return false
      }

      // 5. Approve USDC spending
      const approved = await approveToken(
        recipientAddress,
        amount,
        usdcToken.address
      )
      if (!approved) {
        state.value = 'error'
        return false
      }

      // 6. Execute USDC transfer
      const txHash = await executeTokenTransfer(
        recipientAddress,
        amount,
        usdcToken.address
      )
      if (!txHash) {
        state.value = 'error'
        return false
      }

      // 7. Poll for completion status
      const finalStatus = await pollBoostStatus(raffleId)

      if (finalStatus?.status === 'completed') {
        state.value = 'success'
        // Clear pending boost from localStorage
        localStorage.removeItem('pendingBoostId')
        localStorage.removeItem('pendingBoostRaffleId')
        return true
      } else {
        state.value = 'error'
        return false
      }
    } catch (e: unknown) {
      console.error('[RAFFLE-BOOST] Purchase failed', e)
      error.value = parseTxError(e)
      state.value = 'error'
      return false
    }
  }

  /**
   * Reset state to idle
   */
  function reset() {
    state.value = 'idle'
    error.value = null
    boostOffer.value = null
    boostStatus.value = null
    currentBoostId.value = null
  }

  /**
   * Check for pending boost in localStorage
   */
  function checkPendingBoost(): { boostId: string; raffleId: string } | null {
    const boostId = localStorage.getItem('pendingBoostId')
    const raffleId = localStorage.getItem('pendingBoostRaffleId')

    if (boostId && raffleId) {
      return { boostId, raffleId }
    }

    return null
  }

  /**
   * Resume pending boost (poll for status)
   */
  async function resumePendingBoost(): Promise<boolean> {
    const pending = checkPendingBoost()
    if (!pending) return false

    try {
      currentBoostId.value = pending.boostId
      const finalStatus = await pollBoostStatus(pending.raffleId)

      if (finalStatus?.status === 'completed') {
        state.value = 'success'
        localStorage.removeItem('pendingBoostId')
        localStorage.removeItem('pendingBoostRaffleId')
        return true
      } else if (
        finalStatus?.status === 'failed' ||
        finalStatus?.status === 'expired'
      ) {
        state.value = 'error'
        localStorage.removeItem('pendingBoostId')
        localStorage.removeItem('pendingBoostRaffleId')
        return false
      }

      return false
    } catch (e) {
      console.error('[RAFFLE-BOOST] Failed to resume pending boost', e)
      return false
    }
  }

  /**
   * Parse transaction error into user-friendly message
   */
  function parseTxError(e: unknown): string {
    if (!e || typeof e !== 'object') {
      return 'Transaction failed'
    }

    const err = e as Record<string, unknown>

    if (err.code === 4001) {
      return 'Transaction cancelled'
    }

    if (err.shortMessage && typeof err.shortMessage === 'string') {
      return err.shortMessage
    }

    if (err.message && typeof err.message === 'string') {
      return err.message
    }

    return 'Unexpected transaction error'
  }

  return {
    // State
    state,
    error,
    isProcessing,
    boostOffer,
    boostStatus,
    currentBoostId,

    // Methods
    fetchBoostOffer,
    executeBoosPurchase,
    reset,
    checkPendingBoost,
    resumePendingBoost,
  }
}
