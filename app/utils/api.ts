import { defu } from 'defu'
import { toast } from 'vue-sonner'

export function useAPI(api: string, options?: Parameters<typeof $fetch>[1]): Promise<unknown> {
  const token = localStorage.getItem('SinkSiteToken')
  const headers: Record<string, string> = {}
  if (token)
    headers.Authorization = `Bearer ${token}`

  const fetchOptions = defu(options || {}, {
    credentials: 'same-origin' as RequestCredentials,
    headers,
  }) as Parameters<typeof $fetch>[1]

  return $fetch(api, fetchOptions).catch((error) => {
    if (error?.status === 401) {
      localStorage.removeItem('SinkSiteToken')
      navigateTo('/dashboard/login')
    }
    if (error?.data?.statusMessage) {
      toast(error?.data?.statusMessage)
    }
    return Promise.reject(error)
  })
}
