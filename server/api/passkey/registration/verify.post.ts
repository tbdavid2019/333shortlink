import { readValidatedBody, setResponseHeader } from 'h3'
import { z } from 'zod'
import { consumeChallenge, parseCredential, savePasskey, verifyRegistration } from '../../../utils/passkey'

const RegistrationSchema = z.object({
  requestId: z.string().regex(/^[\w-]{20,32}$/),
  credential: z.unknown(),
})

export default eventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store')
  const body = await readValidatedBody(event, RegistrationSchema.parse)

  try {
    const challenge = await consumeChallenge(event, body.requestId, 'register')
    const credential = parseCredential(body.credential)
    const passkey = await verifyRegistration(event, challenge, credential, challenge.name || 'Passkey')
    await savePasskey(event, passkey)
    return { success: true, passkey: { id: passkey.id, name: passkey.name, createdAt: passkey.createdAt } }
  }
  catch (error) {
    console.error('Passkey registration verification failed:', error instanceof Error ? error.message : 'Unknown error')
    throw createError({ statusCode: 400, statusMessage: 'Could not verify this passkey. Start registration again.' })
  }
})
