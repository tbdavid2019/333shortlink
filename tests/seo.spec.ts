import { describe, expect, it } from 'vitest'
import { fetch } from './utils'

describe('sEO & Meta Tags', () => {
  it('serves homepage with correct canonical, og:url, and indexable robots directives', async () => {
    const res = await fetch('/')
    expect(res.status).toBe(200)

    const html = await res.text()
    expect(html).toContain('rel="canonical"')
    expect(html).toContain('property="og:url"')
    expect(html).toContain('property="og:image"')
    expect(html).toContain('content="index, follow')
    expect(html).not.toContain('content="noindex, nofollow"')
    expect(html).toContain('現代化極速開源短網址服務')
  })
})
