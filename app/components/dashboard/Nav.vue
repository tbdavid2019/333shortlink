<script setup>
const route = useRoute()

const activeNav = computed(() => {
  if (route.path.startsWith('/dashboard/settings'))
    return '/dashboard/settings'
  return route.path
})
</script>

<template>
  <section class="flex justify-between">
    <Tabs
      v-if="route.path !== '/dashboard/link'"
      :model-value="activeNav"
      @update:model-value="navigateTo"
    >
      <TabsList>
        <TabsTrigger
          value="/dashboard/links"
        >
          {{ $t('nav.links') }}
        </TabsTrigger>
        <TabsTrigger value="/dashboard/analysis">
          {{ $t('nav.analysis') }}
        </TabsTrigger>
        <TabsTrigger value="/dashboard/realtime">
          {{ $t('nav.realtime') }}
        </TabsTrigger>
        <TabsTrigger value="/dashboard/settings">
          {{ $t('nav.settings') }}
        </TabsTrigger>
      </TabsList>
    </Tabs>
    <slot name="left" />
    <div>
      <slot />
    </div>
  </section>
</template>
