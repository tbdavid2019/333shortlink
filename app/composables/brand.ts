import { computed } from 'vue'

export function useSiteBrand() {
  const appConfig = useAppConfig()
  let requestURL: ReturnType<typeof useRequestURL> | null = null
  try {
    requestURL = useRequestURL()
  }
  catch {
    // ignore context outside nuxt request
  }

  return computed(() => {
    if (import.meta.client && typeof window !== 'undefined' && window.location.host) {
      const host = window.location.host.split(':')[0]
      if (host && host !== 'localhost' && host !== '127.0.0.1') {
        return host
      }
    }
    const host = requestURL?.host?.split(':')[0]
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      return host
    }
    return appConfig.title || '333shortlink'
  })
}
