import { DateTime } from 'luxon'

const TIME_FORMAT = `dd MMM yyyy t`

/**
 * A class that adapts luxon's DateTime to a more readable format.
 * Depends on luxon.
 *
 * @param dateTimeMillis - The time in milliseconds.
 * @returns A TimeObject object.
 * @example
 * const time = TimeObject.fromMillis(1716160555000);
 * console.log(time.remainingDays); // "1d"
 */
export class TimeObject {
  private dateTime: DateTime

  private constructor(dateTime: DateTime) {
    this.dateTime = dateTime
  }

  static fromMillis(dateTime: number) {
    return new TimeObject(DateTime.fromMillis(dateTime))
  }

  static fromSeconds(dateTime: number) {
    return new TimeObject(DateTime.fromSeconds(dateTime))
  }

  static fromDate(dateTime: Date) {
    return new TimeObject(DateTime.fromJSDate(dateTime))
  }

  get remainingTime() {
    const diff = this.dateTime.toSeconds() - DateTime.now().toSeconds()
    return diff
  }

  get isPast() {
    return 0 > this.remainingTime
  }

  get remainingDays() {
    if (this.isPast) {
      return '0d'
    }

    const days = Math.floor(this.remainingTime / (24 * 3600))
    return `${days}d`
  }

  get remainingHours() {
    if (this.isPast) {
      return '0h'
    }

    const totalSeconds = this.remainingTime
    const secondsAfterDays = totalSeconds % (24 * 3600)
    const hours = Math.floor(secondsAfterDays / 3600)
    return `${hours}h`
  }

  get remainingMinutes() {
    if (this.isPast) {
      return '0m'
    }

    const totalSeconds = this.remainingTime
    const secondsAfterDays = totalSeconds % (24 * 3600)
    const secondsAfterHours = secondsAfterDays % 3600
    const minutes = Math.floor(secondsAfterHours / 60)
    return `${minutes}m`
  }

  get formattedDate() {
    return this.dateTime.toFormat(TIME_FORMAT)
  }

  static format(dateTimeMillis: number) {
    return TimeObject.fromMillis(dateTimeMillis).formattedDate
  }
}
