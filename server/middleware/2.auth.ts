import { getHeader, getRequestURL } from 'h3'
import { hasValidPasskeySession } from '../utils/passkey'

export default eventHandler(async (event) => {
  const token = getHeader(event, 'Authorization')?.replace(/^Bearer\s+/, '')

  if (event.path === '/api/passkey/login/options' || event.path === '/api/passkey/login/verify')
    return

  if (event.path.startsWith('/api/') && !event.path.startsWith('/api/_') && !event.path.startsWith('/api/public/') && !event.path.startsWith('/api/mcp') && !event.path.startsWith('/api/tracking/event')) {
    const configToken = useRuntimeConfig(event).siteToken || ''
    const validTokens = configToken.split(',').map(t => t.trim()).filter(Boolean)
    const hasValidToken = validTokens.includes(token || '')
    const hasPasskeySession = hasValidToken ? false : await hasValidPasskeySession(event)

    if (!hasValidToken && !hasPasskeySession) {
      throw createError({
        status: 401,
        statusText: 'Unauthorized',
      })
    }

    if (hasPasskeySession && !hasValidToken && !['GET', 'HEAD', 'OPTIONS'].includes(event.method)) {
      const origin = getHeader(event, 'origin')
      if (!origin || origin !== getRequestURL(event).origin)
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }
  }

  if (token && token.length < 8) {
    throw createError({
      status: 401,
      statusText: 'Token is too short',
    })
  }
})
