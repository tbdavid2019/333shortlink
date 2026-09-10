import { describe, expect, it } from 'vitest'
import { appendTimeFilter } from '../server/utils/query-filter'
import { SqlBricks } from '../server/utils/sql-bricks'

describe('appendTimeFilter', () => {
  it('uses an inclusive closed interval for startAt and endAt', () => {
    const sql = SqlBricks.select('*').from('analytics')

    appendTimeFilter(sql, {
      startAt: 1788192000,
      endAt: 1788969599,
    })

    expect(sql.toString()).toContain('timestamp >= toDateTime(1788192000)')
    expect(sql.toString()).toContain('timestamp <= toDateTime(1788969599)')
  })
})
