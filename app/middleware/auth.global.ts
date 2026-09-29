export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server)
    return

  const token = window.localStorage.getItem('SinkSiteToken')
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined

  const isAuthRoute = to.path === '/' || to.path === '/dashboard/login'
  const isDashboardRoute = to.path.startsWith('/dashboard')

  if (!isAuthRoute && !isDashboardRoute)
    return

  let authenticated = false
  try {
    await $fetch('/api/verify', { headers, credentials: 'same-origin' })
    authenticated = true
  }
  catch {
    authenticated = false
  }

  if (isAuthRoute && authenticated)
    return navigateTo('/dashboard')

  if (isDashboardRoute && to.path !== '/dashboard/login' && !authenticated)
    return navigateTo('/dashboard/login')
})
