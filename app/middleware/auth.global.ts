export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server)
    return

  const token = window.localStorage.getItem('SinkSiteToken')
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined

  if (!to.path.startsWith('/dashboard'))
    return

  let authenticated = false
  try {
    await $fetch('/api/verify', { headers, credentials: 'same-origin' })
    authenticated = true
  }
  catch {
    authenticated = false
  }

  if (to.path === '/dashboard/login' && authenticated)
    return navigateTo('/dashboard')

  if (to.path !== '/dashboard/login' && !authenticated)
    return navigateTo('/dashboard/login')
})
