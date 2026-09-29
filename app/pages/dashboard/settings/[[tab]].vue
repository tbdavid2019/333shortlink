<script setup>
const route = useRoute()
const { t } = useI18n()

const tabNames = {
  seo: 'Site SEO',
  enterprise: 'Enterprise Panel',
  transition: 'Transition Page',
  security: 'Security',
}

const currentTab = computed(() => {
  const param = route.params.tab
  const rawParam = Array.isArray(param) ? param[0] : param
  if (rawParam && tabNames[rawParam.toLowerCase()])
    return rawParam.toLowerCase()
  const rawQuery = typeof route.query.tab === 'string' ? route.query.tab.toLowerCase() : ''
  if (rawQuery && tabNames[rawQuery])
    return rawQuery
  return ''
})

const subTitle = computed(() => {
  return currentTab.value ? tabNames[currentTab.value] : ''
})
</script>

<template>
  <main class="space-y-6">
    <DashboardBreadcrumb
      :title="t('nav.settings')"
      :sub-title="subTitle"
      sub-href="/dashboard/settings"
    />
    <DashboardSettings />
  </main>
</template>
