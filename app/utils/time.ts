import type { DateValue } from '@internationalized/date'
import { fromAbsolute, fromDate, toCalendarDate } from '@internationalized/date'

export function getTimeZone() {
  if (typeof Intl === 'undefined')
    return 'Etc/UTC'

  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export function getLocale() {
  if (typeof Intl === 'undefined')
    return navigator.language

  return Intl.DateTimeFormat().resolvedOptions().locale
}

export function shortDate(unix = 0) {
  const shortDate = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'short',
  })
  return shortDate.format(unix * 1000)
}

export function longDate(unix = 0) {
  return new Date(unix * 1000).toLocaleString()
}

export function shortTime(unix = 0) {
  const shortTime = new Intl.DateTimeFormat(undefined, {
    timeStyle: 'short',
  })
  return shortTime.format(unix * 1000)
}

export type DateBoundary = 'start' | 'end'

export function date2unix(dateValue: DateValue | Date, type?: DateBoundary, timeZone = getTimeZone()) {
  const date = dateValue instanceof Date ? new Date(dateValue.getTime()) : dateValue.toDate(timeZone)
  if (!type)
    return Math.floor(date.getTime() / 1000)

  const zonedDate = fromDate(date, timeZone)
  const boundary = type === 'start'
    ? zonedDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    : zonedDate.set({ hour: 23, minute: 59, second: 59, millisecond: 999 })

  return Math.floor(boundary.toDate().getTime() / 1000)
}

export function unix2date(unix: number) {
  return toCalendarDate(fromAbsolute(unix * 1000, getTimeZone()))
}
