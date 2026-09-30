<script setup>
import { NuxtLink } from '#components'

defineProps({
  title: {
    type: String,
    required: true,
  },
  subTitle: {
    type: String,
    default: '',
  },
  subHref: {
    type: String,
    default: '',
  },
})
const siteTitle = useSiteBrand()
</script>

<template>
  <Breadcrumb class="flex justify-between">
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/">
          {{ siteTitle }}
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink
          :as="NuxtLink"
          to="/dashboard"
        >
          {{ $t('dashboard.title') }}
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink
          v-if="subTitle"
          :as="NuxtLink"
          :to="subHref || '/dashboard/settings'"
        >
          {{ title }}
        </BreadcrumbLink>
        <BreadcrumbPage v-else>
          {{ title }}
        </BreadcrumbPage>
      </BreadcrumbItem>
      <template v-if="subTitle">
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{{ subTitle }}</BreadcrumbPage>
        </BreadcrumbItem>
      </template>
    </BreadcrumbList>

    <DashboardLogout />
  </Breadcrumb>
</template>
