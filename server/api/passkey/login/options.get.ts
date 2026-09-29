import { setResponseHeader } from 'h3'
import { createAuthenticationOptions } from '../../../utils/passkey'

export default eventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store')
  return createAuthenticationOptions(event)
})
