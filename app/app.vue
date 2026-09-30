<script setup>
const { description, image, twitter } = useAppConfig()
const requestURL = useRequestURL()
const siteBrand = useSiteBrand()

const siteUrl = computed(() => {
  if (import.meta.client && typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin
  }
  const origin = requestURL?.origin
  if (origin && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
    return origin
  }
  const host = requestURL?.host
  if (host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
    const proto = requestURL?.protocol || 'https:'
    return `${proto}//${host}`
  }
  return `https://${siteBrand.value.includes('.') ? siteBrand.value : 'aiurl.tw'}`
})

const absoluteOgImage = computed(() => {
  const base = siteUrl.value || 'https://aiurl.tw'
  const img = image || '/banner.png'
  return img.startsWith('http') ? img : `${base.replace(/\/$/, '')}${img.startsWith('/') ? '' : '/'}${img}`
})

const seoTitle = computed(() => `${siteBrand.value} — 現代化極速開源短網址服務 | 隱私安全・即時分析・客製跳轉`)

const seoDescription = computed(() =>
  description && description.length > 20
    ? description
    : '現代化極速開源短網址服務。支援生物識別 Passkey 免密登入、即時訪客統計與全球地理分析、自定義中轉過渡跳轉頁面與開放 API，輕量高效且保障隱私。',
)

const twitterUsername = twitter ? twitter.replace('https://x.com/', '').replace('@', '') : ''

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  ogType: 'website',
  ogTitle: seoTitle,
  ogSiteName: siteBrand,
  ogDescription: seoDescription,
  ogImage: absoluteOgImage,
  ogImageSecureUrl: absoluteOgImage,
  ogImageType: 'image/png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: computed(() => `${siteBrand.value} — 現代化極速開源短網址服務`),
  ogUrl: siteUrl,
  ogLocale: 'zh_TW',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: absoluteOgImage,
  twitterCard: 'summary_large_image',
  twitterSite: twitterUsername ? `@${twitterUsername}` : undefined,
  twitterCreator: twitterUsername ? `@${twitterUsername}` : undefined,
})

useHead({
  htmlAttrs: {
    lang: 'zh-TW',
  },
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=5',
      tagPosition: 'head',
    },
    {
      name: 'theme-color',
      content: '#10b981',
    },
    {
      name: 'model-context-protocol',
      content: '/mcp',
    },
  ],
  link: [
    {
      rel: 'model-context',
      type: 'application/json',
      href: '/mcp',
    },
    {
      rel: 'help',
      type: 'text/markdown',
      href: '/llms.txt',
      title: 'LLMs.txt',
    },
    {
      rel: 'alternate',
      type: 'text/markdown',
      href: '/llms.txt',
      title: 'LLMs.txt',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/icon-192.png',
    },
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/favicon.svg',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
    },
    {
      rel: 'canonical',
      href: siteUrl,
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
    },
  ],
  script: [
    {
      'type': 'module',
      'src': '/.webmcp/bridge.js',
      'data-mcp-url': '/mcp',
    },
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': siteBrand.value,
        'description': description,
        ...(siteUrl.value ? { url: siteUrl.value } : {}),
      })),
    },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator color="#000" />
    <NuxtPage />
    <Toaster />
  </NuxtLayout>
</template>
