import { describe, expect, it } from 'vitest'
import { fetch } from './utils'

describe('lLMs.txt standard endpoints', () => {
  it('serves /llms.txt with correct content-type and content', async () => {
    const res = await fetch('/llms.txt')
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toMatch(/text\/(plain|markdown)/)
    const text = await res.text()
    expect(text).toContain('# 333shortlink')
    expect(text).toContain('shorten_url')
    expect(text).toContain('/llms-full.txt')
  })

  it('serves /llms-full.txt with correct content-type and content', async () => {
    const res = await fetch('/llms-full.txt')
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toMatch(/text\/(plain|markdown)/)
    const text = await res.text()
    expect(text).toContain('# 333shortlink — Full Documentation for LLMs')
    expect(text).toContain('Model Context Protocol')
  })
})
