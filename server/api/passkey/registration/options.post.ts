import { readValidatedBody, setResponseHeader } from 'h3'
import { z } from 'zod'
import { createRegistrationOptions } from '../../../utils/passkey'

const RegistrationSchema = z.object({
  name: z.string().trim().min(1).max(80),
})

export default eventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store')
  const { name } = await readValidatedBody(event, RegistrationSchema.parse)
  return createRegistrationOptions(event, name)
})
