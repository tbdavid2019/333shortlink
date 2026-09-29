import { setResponseHeader } from 'h3'
import { clearPasskeySession } from '../../utils/passkey'

export default eventHandler((event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store')
  clearPasskeySession(event)
  return { authenticated: false }
})
