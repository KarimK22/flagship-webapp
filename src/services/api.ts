import { apiToken } from '@/composables/auth'
import { callApi } from '@/services/call-api'
import { Beneficiary } from '@/types/beneficiary.ts'
import type { Snapshot } from '@/types/snapshot.ts'
import { LOCK_DURATION_ID } from '@/types/staking.ts'
import { RAFFLE_ERROR_CODE } from '@/types/shared/error-codes.ts'
import type { GachaAsteroidPrize } from '@/types/shared/gacha-game.ts'
import type { Activity } from '@/types/shared/activity'
import { ACTIVITY_TYPE } from '@/types/shared/activity'
import type { LockConfig } from '@/types/lock-config'
import type { ReferralDataResponse } from '@/types/referral-data'
import { PRIZE_TYPE } from '@/types/shared/raffle-prize.ts'
import type { BADGE_ID } from '@/types/shared/badge.ts'
import type { Airdrop } from '@/const/airdrops.ts'
import type { Address } from 'viem'
import type {
  InitiateBoostResponse,
  RaffleBoostOffer,
  RaffleBoostStatus,
} from '@/types/raffle-boost.ts'

export enum RAFFLE_PRIZE_TYPE {
  VOUCHERS = 'vouchers',
  PHYSICAL = 'physical',
  NONE = 'none',
}

export enum RAFFLE_TAG {
  HIGHLIGHTED = 'highlighted',
}

export type BuyRaffleTicketsResponse =
  | { success: true; newTotalPower: string; isEligibleForStakeGrant: boolean }
  | {
      success: false
      error: string
      errorCode?: RAFFLE_ERROR_CODE
    }

export type RaffleWonPrize =
  | { type: RAFFLE_PRIZE_TYPE.PHYSICAL; name: string }
  | {
      type: RAFFLE_PRIZE_TYPE.VOUCHERS
      code: string
      amount: number
      id: number
    }
  | { type: RAFFLE_PRIZE_TYPE.NONE }

export type Raffle = {
  id: string
  title: string
  description: string
  imageUrl: string
  startDate: string
  endDate: string
  concludedAt: string
  ticketPrice: number
  maxTicketsPerUser: number | null
  prizes: {
    name: string
    description: string
    imageUrl: string
    count: number
    type: RAFFLE_PRIZE_TYPE
    id: number
    isBigPrize: boolean
  }[]
  metadata: {
    requires?: {
      badgeId?: number
    }
    banner?: {
      title: string
      startDate: string
      endDate: string
    }
    ticketsCount: number
    isConcluded: boolean
    tags: RAFFLE_TAG
    participationQuestions: {
      question: string
      validations: { type: 'code' | 'email' }[]
    }[]
    extraTickets: {
      onStake?: {
        minAmount: number
        canRepeat: boolean
        ticketsCountByDuration: Partial<Record<LOCK_DURATION_ID, number>>
      }
    }
    participantsCount: number
    web3Seed: {
      transactionHash: string
      value: string
    } | null
  }
  hasElement: boolean
}

export type RaffleStatus = {
  ticketsCount: number
  extraTicketsCount: number
  wonPrizeV2: RaffleWonPrize | null
  submission: { email: string } | null
  prizeSubmittedData: Record<string, string> | null
  raffleSubmittedData: Record<string, string> | null
}

export type Stake = {
  id: string
  amount: string
  lingoPrice: string
  timestamp: number
  lockDurationId: LOCK_DURATION_ID
  unlockBlock: number
  unlockTimestamp: number
  unlockDurationBlocks: number
  boost: number
  lockPowerBoost: number
  dailyPower: number
  dailyPowerWithBoost: number
  baseDailyPower: number
  description: string
  imageUrl: string
}

export type RecentClaim = {
  prizeName: string
  prizeImage: string
  walletAddress: Address
  timestamp: number
}

export type ExclusiveEvent = {
  id: string
  name: string
  startDate: string
  endDate: string
  description: string
  imageUrl: string
  quantity: number
  claimed: number
  minLevel: number
  minAmountStaked: number
  minLockDurationBlocks: number
}

export type ExclusiveEventClaim = {
  walletAddress: string
  eventId: string
  timestamp: string
}

export type Prize =
  | { type: PRIZE_TYPE.PHYSICAL; name: string }
  | { type: PRIZE_TYPE.VOUCHERS; amount: number }

export type Winner = {
  walletAddress: string
  prize: Prize
}

type WinnersResponse = {
  winners: Winner[]
}

export type Testimonial = {
  id: string
  username: string
  userHandle: string
  text: string
  postedOn: string
  url: string
  image: string
}

export type SpinPrize = {
  id: string
  wheelId: string
  name: string
  description: string
  image: string
  probability: number
  order: number
  type: string
  voucherAmount: number
  imageOnWheel: string
}

export type Spin = {
  id: string
  userId: string
  prize: SpinPrize
  timestamp: string
  voucherCode: string
}

export type Wheel = {
  id: string
  title: string
  lockDuration: LOCK_DURATION_ID
  lockAmountEligibility: number
  prizes: SpinPrize[]
}

export type WheelsResponse = {
  wheels: Wheel[]
}

export type StakingWheelPrize = {
  id: string
  wheelId: string
  name: string
  description: string
  image: string
  imageOnWheel: string
  probability: number
  order: number
  type: string
  lingoAmount: number | null
  powerAmount: number | null
  voucherAmount: number | null
}

export type TieredStakingWheelPrize = {
  id: string
  wheelId: string
  name: string
  description: string
  image: string
  imageOnWheel: string
  probability: number
  order: number
  type: string
  lingoAmount: number | null
  powerAmount: number | null
  voucherAmount: number | null
}

export type TieredStakingWheel = {
  id: string
  title: string
  wheelType: string
  lockDuration: LOCK_DURATION_ID
  lockAmountEligibility: number
  startDate: string
  endDate: string
  maxSpins: number | null
  prizes: TieredStakingWheelPrize[]
  userEligibility?: TieredStakingWheelUserEligibility | null
}

export type TieredStakingWheelUserEligibility = {
  eligible: boolean
  calculatedSpins: number
  spinsUsedThisMonth: number
  remainingSpins: number
  currentStakedValueUsd: number
  requiredStakedValueUsd: number
  meetsStakingRequirement: boolean
  stakesByLockDuration: Partial<Record<LOCK_DURATION_ID, number>>
}

export type TieredStakingWheelLockMultipliers = Record<LOCK_DURATION_ID, number>

export type TieredStakingWheelsResponse = {
  wheels: TieredStakingWheel[]
  isAuthenticated: boolean
  lockMultipliers: TieredStakingWheelLockMultipliers
}

export type TieredStakingWheelSpin = {
  id: string
  userId: string
  prize: TieredStakingWheelPrize
  timestamp: string
  voucherCode: string | null
  stakeHash: string | null
  txHash: string | null
}

export type TieredStakingWheelSpinsHistoryResponse = {
  total: number
  items: TieredStakingWheelSpin[]
}

export type StakingWheelUserEligibility = {
  eligible: boolean
  remainingSpins: number
  spinsUsed: string
  totalEligibleSpins: number
}

export type StakingWheel = {
  id: string
  title: string
  startDate: string
  endDate: string
  lockDuration: LOCK_DURATION_ID
  lockAmountEligibility: number
  maxSpins: number
  isStakingWheel: boolean
  prizes: StakingWheelPrize[]
  userEligibility?: StakingWheelUserEligibility | null
}

export type StakingWheelsResponse = {
  wheels: StakingWheel[]
  isAuthenticated: boolean
}

export type StakingWheelEligibilityResponse = {
  eligible: boolean
  remainingSpins: number
}

export type StakingWheelSpin = {
  id: string
  userId: string
  prize: StakingWheelPrize
  timestamp: string
  voucherCode: string | null
  stakeHash: string | null
  txHash: string | null
}

export type StakingWheelSpinsHistoryResponse = {
  total: number
  items: StakingWheelSpin[]
}

export type LeaderboardWinners = {
  walletAddress: string
  prizeId: string
}

export type LeaderboardPrizes = {
  id: string
  name: string
  description: string
  image: string
  prizeType: string
  order: number
}

export type LeaderboardUserPrize = {
  prize: LeaderboardPrizes
  leaderboard: LeaderboardDetails
}

export type LeaderboardUserPrizesResponse = {
  items: LeaderboardUserPrize[]
}

interface LeaderboardSummary {
  id: string
  title: string
  startDate: string
  endDate: string
  prizes: LeaderboardPrizes[]
  winners: LeaderboardWinners[]
}

interface LeaderboardsResponse {
  leaderboards: LeaderboardSummary[]
}

interface LeaderboardDetails {
  id: string
  title: string
  startDate: string
  endDate: string
}

interface TopTrader {
  rank: number
  walletAddress: string
  userId: string
  tradedVolume: number
  pullsCount: number
  prize: string
}

interface TopTradersResponse {
  total: number
  items: TopTrader[]
}

export type TaskProgress = {
  taskId: string
  name: string
  description: string | null
  powerMilesReward: number
  requirement: string
  config: Record<string, unknown> | null
  completed: boolean
  claimed: boolean
  startDate: string
  endDate: string
  redirectionLink: string | null
  imageUrl?: string | null
}

export type TasksResponse = {
  tasks: TaskProgress[]
  isAuthenticated: boolean
  error?: string
}

export type TaskHistoryItem = {
  id: string
  taskId: string
  taskName: string
  claimedAt: string
  powerMilesEarned: number
  imageUrl?: string | null
}

export type TasksHistoryResponse = {
  history: TaskHistoryItem[]
}

export type TasksMultiplierResponse = {
  stakedAmountUsd: number
  bonusMultiplier: number
  lingoBalance: number
  stakedLingoAmount: number
}

export type ClaimTaskResponse = {
  success: boolean
  powerMilesEarned?: number
  error?: string
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly metadata?: Record<string, unknown>,
  ) {
    super(message)
  }
}

export class Api {
  private async fetch<T>(input: {
    path: string
    body?: object
    method: 'POST' | 'DELETE' | 'GET'
  }): Promise<T> {
    return await callApi({
      ...input,
      path: `/api${input.path}`,
      headers: {
        Authorization: `Bearer ${apiToken.value}`,
      },
    })
  }

  public async getMerkleProof(beneficiary: Beneficiary) {
    return await this.fetch<{ proof: string[] }>({
      path: '/staking/merkle-proof',
      method: 'POST',
      body: {
        beneficiary,
      },
    })
  }

  public async getStakes() {
    return await this.fetch<{
      stakes: Stake[]
      powers: { total: string } & Record<string, string>
      referral: {
        count: number
        power: string
      }
      powerConfig: {
        oneLingoBaseDailyPower: number
        manualBoost: { amount: number; expiresAt: string } | null
        lastPowerMileGenerationTimestamp: number
      }
    }>({
      path: '/staking/stakes',
      method: 'POST',
    })
  }

  public async startStakingUpgrade({ amount }: { amount: string }) {
    return await this.fetch<{
      success: boolean
      error?: string
    }>({
      path: '/staking/upgrade/start',
      method: 'POST',
      body: { amount },
    })
  }

  public async submitRafflePrizeData({
    raffleId,
    email,
  }: {
    raffleId: string
    email?: string
  }) {
    return await this.fetch<{ prize: RaffleWonPrize | null }>({
      path: `/raffles/${raffleId}/submit-prize-data`,
      method: 'POST',
      body: { email },
    })
  }

  public async getUserStatusForRaffles() {
    return await this.fetch<{
      me: Record<string, RaffleStatus>
    }>({
      path: `/raffles/me`,
      method: 'GET',
    })
  }

  public async getAirdrops() {
    return await this.fetch<{
      airdrops: Airdrop[]
    }>({
      path: `/airdrops`,
      method: 'GET',
    })
  }

  public async claimAirdrop({ airdropId }: { airdropId: string }) {
    return await this.fetch<{ success: boolean; message: string }>({
      path: `/airdrops/claim`,
      method: 'POST',
      body: { airdropId },
    })
  }

  public async getMyAirdropClaims() {
    return await this.fetch<{
      claims: { airdropId: string; timestamp: string }[]
    }>({
      path: `/airdrops/claims/me`,
      method: 'GET',
    })
  }

  public async getMe() {
    return await this.fetch<{
      me: {
        profile: { referralCode: string }
        boost: { amount: number; expiresAt: string | null } | null
        email?: string
        createdAt: string
      }
    }>({
      path: `/users/me`,
      method: 'GET',
    })
  }

  public async getBadges(): Promise<
    { id: BADGE_ID; createdAt: Date; isOld: boolean }[]
    > {
    const { badges } = await this.fetch<{
      badges: { id: BADGE_ID; createdAt: string }[]
    }>({
      path: `/badges/me`,
      method: 'GET',
    })
    const isOld = (date: string) => {
      const claimDate = new Date(date)
      /* 23.05.2025 is the date when the criterias for the badges were changed */
      const oldFrom = new Date('2025-05-23')
      return claimDate.getTime() < oldFrom.getTime()
    }

    return badges.map((b) => ({
      ...b,
      createdAt: new Date(b.createdAt),
      isOld: isOld(b.createdAt),
    }))
  }

  public async getMintBadgeSignature({ badgeId }: { badgeId: BADGE_ID }) {
    return await this.fetch<{
      signature: `0x${string}`
    }>({
      path: `/badges/mint/signature`,
      method: 'POST',
      body: {
        badgeId: badgeId,
      },
    })
  }

  public async getMyReferrals() {
    return await this.fetch<ReferralDataResponse>({
      path: `/users/me/referrals`,
      method: 'GET',
    })
  }

  public async getRaffles() {
    return await this.fetch<{ raffles: Raffle[] }>({
      path: `/raffles`,
      method: 'GET',
    })
  }

  public async getFinishedRaffles({
    limit,
    offset,
  }: {
    limit: number
    offset: number
  }) {
    return await this.fetch<{ items: Raffle[]; total: number }>({
      path: `/raffles/finished?limit=${limit}&offset=${offset}`,
      method: 'GET',
    })
  }

  public async getWonRaffles({
    limit,
    offset,
  }: {
    limit: number
    offset: number
  }) {
    return await this.fetch<{ items: Raffle[]; total: number }>({
      path: `/raffles/won?limit=${limit}&offset=${offset}`,
      method: 'GET',
    })
  }

  public async getUnclaimedRaffles({
    limit,
    offset,
  }: {
    limit: number
    offset: number
  }) {
    return await this.fetch<{ items: Raffle[]; total: number }>({
      path: `/raffles/won/unclaimed?limit=${limit}&offset=${offset}`,
      method: 'GET',
    })
  }

  public async getRaffleBanner() {
    return await this.fetch<Raffle>({
      path: `/raffles/banner`,
      method: 'GET',
    })
  }

  public async getMyGachaElementsV2() {
    return await this.fetch<{ elements: Record<number, number> }>({
      path: `/gacha-game/me/elements-v2`,
      method: 'GET',
    })
  }

  public async buyRaffleTickets({
    raffleId,
    count,
    userData,
  }: {
    raffleId: string
    count: number
    userData?: Record<string, string>
  }) {
    return await this.fetch<BuyRaffleTicketsResponse>({
      path: `/raffles/${raffleId}/buy-tickets`,
      method: 'POST',
      body: { count, userData },
    })
  }

  public async getLingoPrice() {
    return await this.fetch<{ price: number; changePercentage24h: number }>({
      path: '/coin/price',
      method: 'GET',
    })
  }

  public async getConfig() {
    return await this.fetch<LockConfig>({
      path: '/staking/config',
      method: 'GET',
    })
  }

  public async getSnapshotV2() {
    return await this.fetch<{ snapshot: Snapshot | null }>({
      path: '/staking/snapshot',
      method: 'GET',
    })
  }

  public async getQuote(
    amount: number,
    currency: string,
    convertedCurrency: string,
    blockchain: string,
    quoteCurrency: string,
  ) {
    return await this.fetch<{
      data: { payment_method: string; converted_amount: string }[]
    }>({
      path: '/ramp/buy/quote',
      method: 'POST',
      body: {
        amount,
        currency,
        converted_currency: convertedCurrency,
        blockchain,
        quote_currency: quoteCurrency,
      },
    })
  }

  public async checkTransaction(txHash: string) {
    await this.fetch<{ success: boolean }>({
      path: '/staking/check-tx',
      method: 'POST',
      body: {
        txHash,
      },
    })
  }

  public async checkTransactions(transactionHashes: string[]) {
    await this.fetch<{ success: boolean }>({
      path: '/staking/check-transactions',
      method: 'POST',
      body: {
        transactionHashes,
      },
    })
  }

  public async getIslandCampaignSignature() {
    return await this.fetch<{
      signature: `0x${string}` | null
      amount: number
    }>({
      path: '/token/launch-island-campaign/signature',
      method: 'POST',
    })
  }

  public async getIslandCampaignAmount() {
    return await this.fetch<{ amounts: { firstClass: number; dream: number } }>(
      {
        path: '/token/launch-island-campaign/tokens',
        method: 'GET',
      },
    )
  }

  public async lastClaims() {
    return await this.fetch<Record<Beneficiary, number>>({
      path: '/token/last-claims',
      method: 'GET',
    })
  }

  public async claimedLingo(beneficiary: Beneficiary) {
    await this.fetch({
      path: '/token/claimed',
      method: 'POST',
      body: {
        beneficiary,
      },
    })
  }

  public async smashAsteroid() {
    return await this.fetch<
      | { success: false }
      | {
          success: true
          prize: GachaAsteroidPrize
          isEligibleForStakeGrant: boolean
        }
    >({
      path: '/gacha-game/smash-asteroid',
      method: 'POST',
    })
  }

  public async getAutoSmashStatus() {
    return await this.fetch<{ unlocked: boolean; enabled: boolean }>({
      path: '/gacha-game/auto-smash/status',
      method: 'GET',
    })
  }

  public async getAutoSmashEligibility() {
    return await this.fetch<{
      eligible: boolean
      lingoAmount: string
      lingoPrice: string
      usdAmount: string
      alreadyPurchased: boolean
      contractAddress: string
    }>({
      path: '/gacha-game/auto-smash/check-eligibility',
      method: 'GET',
    })
  }

  public async initiateAutoSmashPurchase() {
    return await this.fetch<{
      purchaseId: string
      lingoAmount: string
      contractAddress: string
    }>({
      path: '/gacha-game/auto-smash/initiate-purchase',
      method: 'POST',
    })
  }

  public async confirmAutoSmashPurchase({
    purchaseId,
    txHash,
  }: {
    purchaseId: string
    txHash: string
  }) {
    return await this.fetch<{ success: boolean }>({
      path: '/gacha-game/auto-smash/confirm-purchase',
      method: 'POST',
      body: { purchaseId, txHash },
    })
  }

  public async toggleAutoSmash(enabled: boolean) {
    return await this.fetch<{ success: boolean }>({
      path: '/gacha-game/auto-smash/toggle',
      method: 'POST',
      body: { enabled },
    })
  }

  public async getUserActivities({
    pageSize,
    types,
    pageToken,
  }: {
    pageSize: number
    types: ACTIVITY_TYPE[]
    pageToken?: string
  }) {
    const response = await this.fetch<{
      items: Activity<string>[]
      meta: { nextPageToken: string | null }
    }>({
      path: '/users/me/activities',
      method: 'POST',
      body: {
        pageSize,
        types,
        pageToken: pageToken ?? null,
      },
    })

    const updatedResponse = response.items.map((item) => ({
      ...item,
      timestamp: new Date(item.timestamp),
    }))

    return {
      items: updatedResponse,
      meta: response.meta,
    } satisfies {
      items: Activity[]
      meta: { nextPageToken: string | null }
    }
  }

  public async updateUserEmail(email: string) {
    return await this.fetch<{ success: boolean }>({
      path: '/users/me/email',
      method: 'POST',
      body: {
        email: email,
      },
    })
  }

  public async getRaffleWinners(raffleId: string) {
    return await this.fetch<{ winners: string[] }>({
      path: `/raffles/${raffleId}/winners`,
      method: 'GET',
    })
  }

  public async getRaffleWinnersV2(raffleId: string) {
    return await this.fetch<WinnersResponse>({
      path: `/raffles/${raffleId}/winners-v2`,
      method: 'GET',
    })
  }

  public async getRecentClaims() {
    return await this.fetch<{ recentClaims: RecentClaim[] }>({
      path: '/raffles/recent-claims-v2',
      method: 'GET',
    })
  }

  public async getExclusiveEvents() {
    return await this.fetch<{ exclusiveEvents: ExclusiveEvent[] }>({
      path: '/exclusive-events',
      method: 'GET',
    })
  }

  public async claimExclusiveEvent({ eventId }: { eventId: string }) {
    return await this.fetch<
      { success: true } | { success: false; error: string }
    >({
      path: `/exclusive-events/${eventId}/claim`,
      method: 'POST',
      body: {
        eventId,
      },
    })
  }

  public async getUserExclusiveClaimedEvents() {
    return await this.fetch<{ claims: ExclusiveEventClaim[] }>({
      path: '/exclusive-events/me',
      method: 'GET',
    })
  }

  public async getExclusiveClaimedEventClaimers({
    eventId,
  }: {
    eventId: string
  }) {
    return await this.fetch<{ claimers: ExclusiveEventClaim[] }>({
      path: `/exclusive-events/${eventId}/claimers`,
      method: 'GET',
    })
  }

  public async claimApyEarnings() {
    return await this.fetch<
      | { success: false }
      | { success: true; claimedAmount: string; claimId: string }
    >({
      path: '/apy/claim-earnings',
      method: 'POST',
    })
  }

  public async getApyEarningClaims() {
    const { claims } = await this.fetch<{
      claims: { id: string; amount: string; txHash: string }[]
    }>({
      path: '/apy/claims',
      method: 'GET',
    })

    return claims
  }

  public async generateApyEarningClaimSignature({
    claimId,
  }: {
    claimId: string
  }) {
    return await this.fetch<
      | { signature: `0x${string}`; error: null }
      | { signature: null; error: string }
    >({
      path: '/apy/generate-signature',
      method: 'POST',
      body: {
        claimId,
      },
    })
  }

  public async markClaimAsDone({
    claimId,
    txHash,
  }: {
    claimId: string
    txHash: string
  }) {
    return await this.fetch<{ success: boolean; claimedAmount: number }>({
      path: '/apy/mark-claim-as-done',
      method: 'POST',
      body: {
        claimId,
        txHash,
      },
    })
  }

  public async getApyInfoForUser() {
    return await this.fetch<{
      totalEarnings: number
      amountEarnedSinceLastClaim: number
      averageApy: number
      lastClaimTimestamp: string
      elementUnlockTimestamp: string
    }>({
      path: '/apy/me',
      method: 'GET',
    })
  }

  public async getTestimonials() {
    return await this.fetch<{ testimonials: Testimonial[] }>({
      path: '/testimonials',
      method: 'GET',
    })
  }

  public async discordConnect({
    code,
    redirectUri,
  }: {
    code: string
    redirectUri: string
  }) {
    return await this.fetch<{ success: boolean }>({
      path: '/users/me/discord',
      method: 'POST',
      body: {
        code: code,
        redirectUri: redirectUri,
      },
    })
  }

  public async discordDisconnect() {
    await this.fetch({
      path: '/users/me/discord',
      method: 'DELETE',
    })
  }

  public async getDiscordInfo() {
    return await this.fetch<{
      discord: {
        username: string
        roles: { name: string; powerMiles: number }[]
      } | null
    }>({
      path: '/users/me/discord',
      method: 'GET',
    })
  }

  public async getWheels() {
    return await this.fetch<WheelsResponse>({
      path: '/wheels',
      method: 'GET',
    })
  }

  public async wheelSpin({ wheelId }: { wheelId?: string }) {
    return await this.fetch<{
      id: string
      prize: SpinPrize
      userId: string
      timestamp: string
    }>({
      path: `/wheels/${wheelId}/spins/spin`,
      method: 'POST',
    })
  }

  public async getWheelSpinCount({ wheelId }: { wheelId?: string }) {
    return await this.fetch<{ count: number }>({
      path: `/wheels/${wheelId}/spins/count`,
      method: 'GET',
    })
  }

  public async getWheelSpinsHistory({
    limit,
    offset,
  }: {
    limit: number
    offset: number
  }) {
    return await this.fetch<{
      total: number
      items: Spin[]
    }>({
      path: `/wheels/spins/history?limit=${limit}&offset=${offset}`,
      method: 'GET',
    })
  }

  public async getWheelEligibility({ wheelId }: { wheelId?: string }) {
    return await this.fetch<{ eligible: boolean }>({
      path: `/wheels/${wheelId}/eligibility`,
      method: 'GET',
    })
  }

  public async getTradingGachas() {
    return await this.fetch<{ gachas: any[] }>({
      path: '/trading-gacha',
      method: 'GET',
    })
  }

  public async getTradingGachaById({ gachaId }: { gachaId: string }) {
    return await this.fetch<any>({
      path: `/trading-gacha/${gachaId}`,
      method: 'GET',
    })
  }

  public async getTradingGachaPrize({ prizeId }: { prizeId: string }) {
    return await this.fetch<any>({
      path: `/trading-gacha/gacha-prizes/${prizeId}`,
      method: 'GET',
    })
  }

  public async getTradingGachaEligibility({ gachaId }: { gachaId: string }) {
    return await this.fetch<{ eligible: boolean }>({
      path: `/trading-gacha/${gachaId}/eligibility`,
      method: 'GET',
    })
  }

  public async getTradingGachaPullCount({ gachaId }: { gachaId: string }) {
    return await this.fetch<{ count: number; totalTradedVolume: number }>({
      path: `/trading-gacha/${gachaId}/pulls/count`,
      method: 'GET',
    })
  }

  public async executeTradingGachaPull({ gachaId }: { gachaId: string }) {
    return await this.fetch<any>({
      path: `/trading-gacha/${gachaId}/pulls/pull`,
      method: 'POST',
    })
  }

  public async getTradingGachaPullsHistory({
    limit,
    offset,
  }: {
    limit: number
    offset: number
  }) {
    return await this.fetch<{ total: number; items: any[] }>({
      path: `/trading-gacha/pulls/history?limit=${limit}&offset=${offset}`,
      method: 'GET',
    })
  }

  public async getStakingWheels() {
    return await this.fetch<StakingWheelsResponse>({
      path: `/staking-wheels`,
      method: 'GET',
    })
  }

  public async getStakingWheelById({ wheelId }: { wheelId: string }) {
    return await this.fetch<StakingWheel>({
      path: `/staking-wheels/${wheelId}`,
      method: 'GET',
    })
  }

  public async getStakingWheelPrizeById({ prizeId }: { prizeId: string }) {
    return await this.fetch<StakingWheelPrize>({
      path: `/staking-wheels/wheel-prizes/${prizeId}`,
      method: 'GET',
    })
  }

  public async getStakingWheelEligibility({ wheelId }: { wheelId: string }) {
    return await this.fetch<StakingWheelEligibilityResponse>({
      path: `/staking-wheels/${wheelId}/eligibility`,
      method: 'GET',
    })
  }

  public async spinStakingWheel({ wheelId }: { wheelId: string }) {
    return await this.fetch<StakingWheelSpin>({
      path: `/staking-wheels/${wheelId}/spin`,
      method: 'POST',
    })
  }

  public async getStakingWheelSpinsHistory({
    limit,
    offset,
  }: {
    limit: number
    offset: number
  }) {
    return await this.fetch<StakingWheelSpinsHistoryResponse>({
      path: `/staking-wheels/spins/history?limit=${limit}&offset=${offset}`,
      method: 'GET',
    })
  }

  public async getTieredStakingWheels() {
    return await this.fetch<TieredStakingWheelsResponse>({
      path: `/tiered-staking-wheels`,
      method: 'GET',
    })
  }

  public async getTieredStakingWheelsLockMultipliers() {
    return await this.fetch<{
      lockMultipliers: TieredStakingWheelLockMultipliers
    }>({
      path: `/tiered-staking-wheels/lock-multipliers`,
      method: 'GET',
    })
  }

  public async getTieredStakingWheelById({ wheelId }: { wheelId: string }) {
    return await this.fetch<TieredStakingWheel>({
      path: `/tiered-staking-wheels/${wheelId}`,
      method: 'GET',
    })
  }

  public async getTieredStakingWheelPrizeById({
    prizeId,
  }: {
    prizeId: string
  }) {
    return await this.fetch<TieredStakingWheelPrize>({
      path: `/tiered-staking-wheels/wheel-prizes/${prizeId}`,
      method: 'GET',
    })
  }

  public async spinTieredStakingWheel({ wheelId }: { wheelId: string }) {
    return await this.fetch<TieredStakingWheelSpin>({
      path: `/tiered-staking-wheels/${wheelId}/spin`,
      method: 'POST',
    })
  }

  public async getTieredStakingWheelSpinsHistory({
    limit,
    offset,
  }: {
    limit: number
    offset: number
  }) {
    return await this.fetch<TieredStakingWheelSpinsHistoryResponse>({
      path: `/tiered-staking-wheels/spins/history?limit=${limit}&offset=${offset}`,
      method: 'GET',
    })
  }

  public async getTasks() {
    return await this.fetch<TasksResponse>({
      path: `/tasks`,
      method: 'GET',
    })
  }

  public async getTaskById({ taskId }: { taskId: string }) {
    return await this.fetch<TaskProgress>({
      path: `/tasks/${taskId}`,
      method: 'GET',
    })
  }

  public async getTasksMultiplier() {
    return await this.fetch<TasksMultiplierResponse>({
      path: `/tasks/me/multiplier`,
      method: 'GET',
    })
  }

  public async getTasksHistory() {
    return await this.fetch<TasksHistoryResponse>({
      path: `/tasks/me/history`,
      method: 'GET',
    })
  }

  public async claimTask({ taskId }: { taskId: string }) {
    return await this.fetch<ClaimTaskResponse>({
      path: `/tasks/${taskId}/claim`,
      method: 'POST',
    })
  }

  public async markTaskRedirectionClicked({ taskId }: { taskId: string }) {
    return await this.fetch<{ success: boolean }>({
      path: `/tasks/${taskId}/redirection-clicked`,
      method: 'POST',
    })
  }

  public async getPTScores({ gachaId }: { gachaId: string }) {
    return await this.fetch<{
      gachaId: string
      userId: string
      tiers: {
        tier: string
        prizes: {
          id: string
          name: string
          baseProbability: number
          boostedProbability: number
        }[]
        ptScore: number
        ptScoreThreshold: number
        PtRelativeProbIncrease: number
      }[]
    }>({
      path: `/trading-gacha/${gachaId}/pt-scores`,
      method: 'GET',
    })
  }

  public async getFirstStakeReward({
    referralBonusPowerMiles,
  }: {
    referralBonusPowerMiles: number
  }) {
    return await this.fetch<{ success: boolean }>({
      path: '/users/me/referral-bonus-power-miles',
      method: 'POST',
      body: {
        referralBonusPowerMiles,
      },
    })
  }

  public async getLeaderboards() {
    return await this.fetch<LeaderboardsResponse>({
      path: `/leaderboards`,
      method: 'GET',
    })
  }

  public async getLeaderboardById(id: string) {
    return await this.fetch<LeaderboardDetails>({
      path: `/leaderboards/${id}`,
      method: 'GET',
    })
  }

  public async getUserLeaderboardPrizes() {
    return await this.fetch<LeaderboardUserPrizesResponse>({
      path: `/leaderboards/me/won-prizes-history`,
      method: 'GET',
    })
  }

  public async getTopTraders({
    leaderboardId,
    limit,
    offset,
  }: {
    leaderboardId: string
    limit: number
    offset: number
  }) {
    return await this.fetch<TopTradersResponse>({
      path: `/leaderboards/${leaderboardId}/top-traders?limit=${limit}&offset=${offset}`,
      method: 'GET',
    })
  }

  // Raffle Boost API methods
  public async getBoostOffer({ raffleId }: { raffleId: string }) {
    return await this.fetch<RaffleBoostOffer>({
      path: `/raffles/${raffleId}/boost-offer`,
      method: 'GET',
    })
  }

  public async initiateBoost({
    raffleId,
    ticketCount,
  }: {
    raffleId: string
    ticketCount: number
  }) {
    return await this.fetch<InitiateBoostResponse>({
      path: `/raffles/${raffleId}/boost/initiate`,
      method: 'POST',
      body: { ticketCount },
    })
  }

  public async getBoostStatus({ raffleId }: { raffleId: string }) {
    return await this.fetch<RaffleBoostStatus>({
      path: `/raffles/${raffleId}/boost/status`,
      method: 'GET',
    })
  }
}

export default new Api()
