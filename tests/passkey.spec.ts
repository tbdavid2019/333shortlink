import { describe, expect, it } from 'vitest'
import { fetchWithAuth } from './utils'

describe('passkey registration & challenge flow', () => {
  it('generates registration options and properly parses challengeToken', async () => {
    const res = await fetchWithAuth('/api/passkey/registration/options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'MacBook Pro Touch ID' }),
    })

    expect(res.status).toBe(200)
    const data = await res.json() as { requestId: string, challengeToken: string, options: { challenge: string, rp: { id: string } } }
    expect(data.requestId).toBeDefined()
    expect(data.challengeToken).toBeDefined()
    expect(data.options.challenge).toBeDefined()

    const [payload, signature] = data.challengeToken.split('.')
    expect(payload).toBeTruthy()
    expect(signature).toBeTruthy()

    // Test verifying with invalid credential
    // Should fail with 400 'Invalid passkey response' rather than Base64URL or parse error
    const verifyRes = await fetchWithAuth('/api/passkey/registration/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestId: data.requestId,
        challengeToken: data.challengeToken,
        credential: { invalid: true },
      }),
    })

    expect(verifyRes.status).toBe(400)
    const errData = await verifyRes.json() as { statusMessage: string }
    expect(errData.statusMessage).toContain('Invalid passkey response')
    expect(errData.statusMessage).not.toContain('expired')
    expect(errData.statusMessage).not.toContain('Base64URL')
  })
})
