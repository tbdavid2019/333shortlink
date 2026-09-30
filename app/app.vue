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

const { locale, t } = useI18n()

const seoTitle = computed(() => {
  const suffix = t('seo.title')
  return `${siteBrand.value} — ${suffix}`
})

const seoDescription = computed(() => {
  if (description && description.length > 20 && !description.includes('Cloudflare') && !description.includes('AI')) {
    return description
  }
  return t('seo.description')
})

const ogLocale = computed(() => {
  const map = {
    'en-US': 'en_US',
    'zh-TW': 'zh_TW',
    'zh-CN': 'zh_CN',
    'fr-FR': 'fr_FR',
    'de-DE': 'de_DE',
    'vi-VN': 'vi_VN',
  }
  return map[locale.value] || 'en_US'
})

const htmlLang = computed(() => locale.value || 'en-US')

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
  ogImageAlt: computed(() => `${siteBrand.value} — ${t('seo.title')}`),
  ogUrl: siteUrl,
  ogLocale,
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: absoluteOgImage,
  twitterCard: 'summary_large_image',
  twitterSite: twitterUsername ? `@${twitterUsername}` : undefined,
  twitterCreator: twitterUsername ? `@${twitterUsername}` : undefined,
})

useHead({
  htmlAttrs: {
    lang: htmlLang,
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
