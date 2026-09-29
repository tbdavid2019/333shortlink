import { readValidatedBody, setResponseHeader } from 'h3'
import { z } from 'zod'
import { consumeChallenge, parseCredential, setPasskeySession, verifyAuthentication } from '../../../utils/passkey'

const LoginSchema = z.object({
  requestId: z.string().regex(/^[\w-]{20,32}$/),
  credential: z.unknown(),
})

export default eventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store')
  const body = await readValidatedBody(event, LoginSchema.parse)

  try {
    const challenge = await consumeChallenge(event, body.requestId, 'authenticate')
    const credential = parseCredential(body.credential)
    await verifyAuthentication(event, challenge, credential)
    await setPasskeySession(event)
    return { authenticated: true }
  }
  catch {
    throw createError({ statusCode: 401, statusMessage: 'Passkey sign-in failed. Try again or use your Site Token.' })
  }
})
