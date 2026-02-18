/**
 * Raffle Boost API Types
 *
 * Type definitions for the raffle boost feature that allows users to
 * multiply their raffle ticket entries by paying with USDT.
 */

/**
 * Token that can be used for boost payment
 */
export type AcceptedToken = {
  symbol: string // USDC, USDT, etc.
  address: string // Contract address
  decimals: number // Token decimals (6 for USDC/USDT)
}

/**
 * Response from GET /api/raffles/{raffleId}/boost-offer
 * Contains the boost offer details including pricing
 */
export type RaffleBoostOffer = {
  currentTickets: number // User's current ticket count
  pricePerTicketUsd: number // Price per ticket in USD (e.g., 2)
  treasureWalletAddress: string // Where to send payment
  acceptedTokens: AcceptedToken[] // Accepted payment tokens
}

/**
 * Request body for POST /api/raffles/{raffleId}/boost/initiate
 */
export type InitiateBoostRequest = {
  ticketCount: number // Number of tickets user wants to boost
}

/**
 * Response from POST /api/raffles/{raffleId}/boost/initiate
 * Contains payment details and boost session identifier
 */
export type InitiateBoostResponse = {
  purchaseId: string // Unique purchase ID
  treasureWalletAddress: string // Where to send payment
  totalPriceUsd: number // Total price in USD
  amount: string // Amount in token's smallest unit (e.g., 26000000 for 26 USDC)
  acceptedTokens: AcceptedToken[] // Accepted payment tokens
  expiresAt: string // ISO timestamp
}

/**
 * Response from GET /api/raffles/{raffleId}/boost/status
 * Current status of a boost purchase
 */
export type RaffleBoostStatus = {
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'expired'
  boostId: string
  txHash?: string
  originalTickets: number
  boostedTickets: number
  createdAt: string
  completedAt?: string
  error?: string
}
