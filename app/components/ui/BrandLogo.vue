<script setup lang="ts">
import BrandLogo from '../BrandLogo.vue'

interface Props {
  size?: number | string
  badge?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 24,
  badge: false,
})
</script>

<template>
  <BrandLogo :size="size" :badge="badge" />
</template>
