import { EHelpType, LOCK_DURATION_ID, TRANSACTION_TYPE } from '@/types/staking'

export const wizardEventContexts = {
  [TRANSACTION_TYPE.STAKE]: 'stakingWizard',
  [TRANSACTION_TYPE.RENEW]: 'upgradeWizard',
  [TRANSACTION_TYPE.UNSTAKE]: 'claimWizard',
  [TRANSACTION_TYPE.CLAIM_TOKENS]: 'claimWizard',
  [TRANSACTION_TYPE.CLAIM_AND_STAKE]: 'claimAndStakeWizard',
  [TRANSACTION_TYPE.CLAIM_APY]: 'claimAPYWizard',
  [TRANSACTION_TYPE.CLAIM_AND_STAKE_APY]: 'claimAndStakeAPYWizard',
}

export const modalsEventsContexts = {
  [EHelpType.HOW_POWER_MILES_WORK]: 'Power Miles Info Pop-up View',
  [EHelpType.WHAT_REWARDS_CAN_I_WIN]: 'Rewards Info Pop-up View',
  [EHelpType.MY_LEVEL_INFO]: 'Level Info Pop-up View',
}

export const stakeEventsContexts = {
  [TRANSACTION_TYPE.STAKE]: 'Staking',
  [TRANSACTION_TYPE.RENEW]: 'Upgrade',
  [TRANSACTION_TYPE.UNSTAKE]: 'Unstake',
  [TRANSACTION_TYPE.CLAIM_TOKENS]: 'Instant Claim',
  [TRANSACTION_TYPE.CLAIM_AND_STAKE]: 'Claim Extra',
  [TRANSACTION_TYPE.CLAIM_APY]: 'Instant Claim APY',
  [TRANSACTION_TYPE.CLAIM_AND_STAKE_APY]: 'Claim Extra APY',
}

export const lockDurationEventsContexts = {
  [LOCK_DURATION_ID.ONE_MONTH]: '30',
  [LOCK_DURATION_ID.THREE_MONTHS]: '90',
  [LOCK_DURATION_ID.SIX_MONTHS]: '180',
  [LOCK_DURATION_ID.TWELVE_MONTHS]: '365',
  [LOCK_DURATION_ID.NO_LOCK]: 'No Lock',
}

export const lockDurationToMonths = {
  [LOCK_DURATION_ID.ONE_MONTH]: '1',
  [LOCK_DURATION_ID.THREE_MONTHS]: '3',
  [LOCK_DURATION_ID.SIX_MONTHS]: '6',
  [LOCK_DURATION_ID.TWELVE_MONTHS]: '12',
  [LOCK_DURATION_ID.NO_LOCK]: '0',
}

export const rewardsEventsTabs = {
  rewards: 'Rewards',
  raffle: 'Raffles',
  airdrop: 'Airdrop',
  experiences: 'Experiences',
  spin: 'Spins',
  trading: 'Trading',
  staking: 'Staking',
  tasks: 'Tasks',
  wheels: 'Wheels',
}

export const shareOnXEventsContexts = {
  [TRANSACTION_TYPE.CLAIM_TOKENS]: 'claimSuccess',
  [TRANSACTION_TYPE.CLAIM_AND_STAKE]: 'claimSuccess',
  [TRANSACTION_TYPE.CLAIM_APY]: 'claimSuccess',
  [TRANSACTION_TYPE.CLAIM_AND_STAKE_APY]: 'claimSuccess',
  [TRANSACTION_TYPE.STAKE]: 'stakeSuccess',
  [TRANSACTION_TYPE.RENEW]: 'upgradeSuccess',
  [TRANSACTION_TYPE.UNSTAKE]: 'claimSuccess',
}
