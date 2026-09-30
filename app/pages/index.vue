<script setup>
definePageMeta({ layout: 'auth' })

const siteBrand = useSiteBrand()

useSeoMeta({
  title: computed(() => `${siteBrand.value} — 現代化極速開源短網址服務 | 隱私安全・即時分析・WebMCP`),
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
})
</script>

<template>
  <main class="flex h-full items-center justify-center">
    <Login />
  </main>
</template>
