import { parseDate } from '@internationalized/date'
import { describe, expect, it } from 'vitest'
import { date2unix, getTimeZone } from '../app/utils/time'

describe('date2unix', () => {
  it('includes the full end date for a 9/1 through 9/9 range', () => {
    const timezone = getTimeZone()
    const startDate = parseDate('2026-09-01').toDate(timezone)
    const endDate = parseDate('2026-09-09').toDate(timezone)

    const startAt = date2unix(parseDate('2026-09-01'), 'start')
    const endAt = date2unix(parseDate('2026-09-09'), 'end')

    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(23, 59, 59, 999)

    expect(startAt).toBe(Math.floor(startDate.getTime() / 1000))
    expect(endAt).toBe(Math.floor(endDate.getTime() / 1000))
    expect(new Date(endAt * 1000).getTime()).toBeLessThanOrEqual(endDate.getTime())
  })

  it('does not mutate a Date supplied by the caller', () => {
    const input = new Date('2026-09-09T12:34:56.789Z')
    const original = input.getTime()

    date2unix(input, 'end')

    expect(input.getTime()).toBe(original)
  })
})
