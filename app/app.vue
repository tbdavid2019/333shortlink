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
  return undefined
})
const twitterUsername = twitter ? twitter.replace('https://x.com/', '') : ''

useSeoMeta({
  title: computed(() => `${siteBrand.value} - ${description}`),
  description,
  ogType: 'website',
  ogTitle: siteBrand,
  ogSiteName: siteBrand,
  ogDescription: description,
  ogImage: image,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: siteBrand,
  ogUrl: siteUrl,
  ogLocale: 'zh_TW',
  twitterTitle: siteBrand,
  twitterDescription: description,
  twitterImage: image,
  twitterCard: 'summary_large_image',
  twitterSite: twitterUsername ? `@${twitterUsername}` : undefined,
})

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
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
