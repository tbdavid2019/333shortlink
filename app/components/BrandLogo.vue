<script setup lang="ts">
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
  <!-- Inline / Unbadged variant -->
  <svg
    v-if="!badge"
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 100 100"
    fill="none"
    class="shrink-0"
  >
    <text
      x="50"
      y="48"
      text-anchor="middle"
      fill="currentColor"
      font-family="system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang TC', 'Noto Sans TC', sans-serif"
      font-weight="900"
      font-size="40"
      letter-spacing="-0.5"
    >333</text>
    <text
      x="50.5"
      y="81"
      text-anchor="middle"
      fill="currentColor"
      font-family="system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang TC', 'Noto Sans TC', sans-serif"
      font-weight="800"
      font-size="26"
      letter-spacing="2"
    >短址</text>
  </svg>

  <!-- Badged squircle variant (Olive Green) -->
  <svg
    v-else
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 100 100"
    fill="none"
    class="shrink-0"
  >
    <defs>
      <linearGradient id="brandLogoOliveGrad" x1="15%" y1="0%" x2="85%" y2="100%">
        <stop offset="0%" stop-color="#668235" />
        <stop offset="48%" stop-color="#4c6224" />
        <stop offset="100%" stop-color="#303e16" />
      </linearGradient>
      <linearGradient id="brandLogoOliveBorder" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.35)" />
        <stop offset="100%" stop-color="rgba(255,255,255,0.06)" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="25" fill="url(#brandLogoOliveGrad)" />
    <rect
      x="0.75"
      y="0.75"
      width="98.5"
      height="98.5"
      rx="24.25"
      fill="none"
      stroke="url(#brandLogoOliveBorder)"
      stroke-width="1.5"
    />
    <text
      x="50"
      y="48"
      text-anchor="middle"
      fill="#ffffff"
      font-family="system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang TC', 'Noto Sans TC', sans-serif"
      font-weight="900"
      font-size="40"
      letter-spacing="-0.5"
    >333</text>
    <text
      x="50.5"
      y="81"
      text-anchor="middle"
      fill="#e7f2d5"
      font-family="system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang TC', 'Noto Sans TC', sans-serif"
      font-weight="800"
      font-size="26"
      letter-spacing="2"
    >短址</text>
  </svg>
</template>
