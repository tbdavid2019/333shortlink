<script setup>
definePageMeta({ layout: 'auth' })

const siteBrand = useSiteBrand()
const { t } = useI18n()

useSeoMeta({
  title: computed(() => `${siteBrand.value} — ${t('seo.title')}`),
  description: computed(() => t('seo.description')),
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
})
</script>

<template>
  <main class="flex h-full items-center justify-center">
    <Login />
  </main>
</template>
