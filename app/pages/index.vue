<script setup>
definePageMeta({ layout: 'auth' })

const siteBrand = useSiteBrand()

useSeoMeta({
  title: siteBrand,
  robots: 'noindex, nofollow',
})
</script>

<template>
  <main class="flex h-full items-center justify-center">
    <Login />
  </main>
</template>
