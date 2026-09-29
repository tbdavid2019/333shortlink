import { setResponseHeader } from 'h3'
import { listPasskeys } from '../../utils/passkey'

export default eventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store')
  const credentials = await listPasskeys(event.context.cloudflare.env.KV)
  return credentials.map(({ id, name, transports, createdAt }) => ({ id, name, transports, createdAt }))
})
