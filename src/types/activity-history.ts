import { type Activity, ACTIVITY_TYPE } from '@/types/shared/activity'
import { TimeObject } from './time-object'
import smashAsteroid from '@/assets/images/activities/smash-asteroid.png'
import { formatNumberToUS } from '@/composables/helpers'
import type { Raffle, Stake } from '@/services/api'
import { h } from 'vue'
import powerIcon from '@/assets/images/bolt.svg'
import { PRIZE_TYPE, type WonPrize } from '@/types/shared/raffle-prize.ts'
import { GACHA_ASTEROID_PRIZE_TYPE, type GachaAsteroidPrize } from '@/types/shared/gacha-game.ts'
import { LockDurationToDescription } from './lock-config'
import { elementImageMap } from '@/const/asteroid.ts'

export class ActivityHistory {
  activity: Activity
  public isStakeView: boolean = false
  timeObject: TimeObject
  public relatedRaffle: Raffle | null | undefined = null
  /* Note: Probably we also need the related stake */
  public relatedStake: Stake | null = null
  private t: (key: string, params?: Record<string, string | number>) => string

  constructor(activity: Activity, translationFn?: (key: string, params?: Record<string, string | number>) => string) {
    this.activity = activity
    this.timeObject = TimeObject.fromMillis(activity.timestamp.getTime())
    this.t = translationFn || ((key: string) => key)
  }

  get type(): ACTIVITY_TYPE {
    return this.activity.type
  }

  get timestamp(): Date {
    return this.activity.timestamp
  }

  get userId(): string {
    return this.activity.userId
  }

  get metadata(): Activity['metadata'] {
    return this.activity.metadata
  }

  get isSmashAsteroid(): boolean {
    return this.activity.type === ACTIVITY_TYPE.SMASH_ASTEROID
  }

  get isAutoSmashed(): boolean {
    return (
      this.activity.type === ACTIVITY_TYPE.SMASH_ASTEROID &&
      Boolean((this.activity.metadata)?.autoSmashed)
    )
  }

  /**
	 * Add a power icon to the text
	 * @param text - The text to add the power icon to
	 * @param match - The string to match and replace with the power icon
	 * @param delimiter - The delimiter to use between the text and the power icon
	 * @returns Vue VNode
	 */
  textWithPowerIcon(text: string, match: string = '_POWER_', delimiter: string = ' ') {
    const splitedText = text.split(delimiter)
    const powerIconVNode = h('i', {
      style: { backgroundImage: `url(${powerIcon})` },
      class: 'size-6 rounded-full inline-block align-top',
    })

    const nodes = splitedText.reduce((acc: (typeof powerIconVNode | string)[], curr: string) => {
      if (curr.includes(match)) {
        return [...acc, powerIconVNode, delimiter]
      }
      return [...acc, curr, delimiter]
    }, [])

    return h('span', nodes)
  }

  get description() {
    switch (this.activity.type) {
    case ACTIVITY_TYPE.PURCHASE_RAFFLE_TICKET: {
      const activityMetadata = this.activity.metadata
      const ticketsCount = activityMetadata.ticketsCount ?? 0
      const raffleName = this.relatedRaffle?.title ?? ''
      const ticketsLabel = ticketsCount === 1 ? this.t('common.activityHistory.ticket') : this.t('common.activityHistory.tickets')
      const text = this.t('common.activityHistory.purchaseRaffleTicket', {
        powerAmount: activityMetadata.powerAmount,
        raffleName,
        ticketsCount,
        ticketsLabel,
      })

      return this.textWithPowerIcon(text)
    }
    case ACTIVITY_TYPE.RECEIVE_EXTRA_RAFFLE_TICKET:
      return this.t('common.activityHistory.receiveExtraTicket')
    case ACTIVITY_TYPE.WIN_RAFFLE_PRIZE: {
      const prize = this.activity.metadata.prize
      let prizeName: string = ''
      if (prize.type === PRIZE_TYPE.PHYSICAL) {
        prizeName = prize.name
      }
      else if (prize.type === PRIZE_TYPE.VOUCHERS) {
        prizeName = `$${prize.amount} voucher`
      }
      return this.t('common.activityHistory.winRafflePrize', { prizeName })
    }
    case ACTIVITY_TYPE.SMASH_ASTEROID: {
      if (this.isStakeView) {
        return this.textWithPowerIcon(
          this.t('common.activityHistory.smashAsteroidStake'),
        )
      }

      const prize = this.activity.metadata.prize
      let baseText = ''

      if (prize.type === GACHA_ASTEROID_PRIZE_TYPE.ELEMENT) {
        const raffleName = this.relatedRaffle?.title ?? ''
        const rafflePrize = this.relatedRaffle
          ? this.t('common.activityHistory.andRaffleTicket', { raffleName })
          : ''

        baseText = this.t('common.activityHistory.smashAsteroidElement', {
          elementId: prize.elementId,
          rafflePrize,
        })
      }
      else if (prize.type === GACHA_ASTEROID_PRIZE_TYPE.POWER_MILES) {
        baseText = this.t('common.activityHistory.smashAsteroidPowerMiles', {
          amount: prize.amount,
        })
      }

      if (this.isAutoSmashed) {
        baseText += ` · ${this.t('common.activityHistory.autoSmashed')}`
      }

      return baseText
    }
    case ACTIVITY_TYPE.STAKE: {
      const amount = this.activity.metadata.amount ?? 0
      const price = this.activity.metadata.lingoPrice ?? 0
      const lockDuration = LockDurationToDescription[this.activity.metadata.lockDurationId] ?? ''
      const totalInFiat = Number(amount) * Number(price)
      const formattedAmount = formatNumberToUS(amount)
      const formattedTotalFiat = formatNumberToUS(totalInFiat)
      return this.t('common.activityHistory.stake', {
        amount: formattedAmount,
        totalFiat: formattedTotalFiat,
        lockDuration,
      })
    }
    case ACTIVITY_TYPE.UNSTAKE: {
      const amount = this.activity.metadata.amount ?? 0
      const formattedAmount = formatNumberToUS(amount)
      return this.t('common.activityHistory.unstake', { amount: formattedAmount })
    }
    default:
      return ''
    }
  }

  get referenceImageSrc() {
    switch (this.type) {
    case ACTIVITY_TYPE.PURCHASE_RAFFLE_TICKET:
      return this.relatedRaffle?.imageUrl
    case ACTIVITY_TYPE.RECEIVE_EXTRA_RAFFLE_TICKET:
    case ACTIVITY_TYPE.WIN_RAFFLE_PRIZE: {
      const activityPrize = (this.activity.metadata as { prize: WonPrize }).prize

      if (!activityPrize) {
        return  ''
      }

      if (activityPrize.type === PRIZE_TYPE.PHYSICAL) {
        const foundPrize = this.relatedRaffle?.prizes.find((prize) => {
          return prize.name === activityPrize.name
        })
        return foundPrize?.imageUrl ||''
      } else if (activityPrize.type === PRIZE_TYPE.VOUCHERS) {
        const foundPrize = this.relatedRaffle?.prizes.find((prize) => {
          return prize.id === activityPrize.id
        })
        return foundPrize?.imageUrl ||  ''
      } else {
        return ''
      }
    }
    case ACTIVITY_TYPE.SMASH_ASTEROID: {
      if (this.isStakeView) {
        return smashAsteroid
      }

      const prize = (this.activity.metadata as { prize: GachaAsteroidPrize }).prize
      if (prize.type === GACHA_ASTEROID_PRIZE_TYPE.ELEMENT) {
        return elementImageMap[prize.elementId as keyof typeof elementImageMap]
      }
      return smashAsteroid
    }
    }
  }
}
