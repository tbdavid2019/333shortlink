import { readValidatedBody } from 'h3'
import { z } from 'zod'
import { deletePasskey } from '../../../utils/passkey'

const RemoveSchema = z.object({
  id: z.string().regex(/^[\w-]{20,1400}$/),
})

export default eventHandler(async (event) => {
  const { id } = await readValidatedBody(event, RemoveSchema.parse)
  await deletePasskey(event, id)
  return { success: true }
})
