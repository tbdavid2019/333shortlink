<script setup>
import { Check, Languages } from 'lucide-vue-next'

const { locale, setLocale, locales } = useI18n()
const cookie = useCookie('sink_i18n_redirected', { maxAge: 60 * 60 * 24 * 365, path: '/' })

const currentLocaleObj = computed(() => locales.value.find(l => l.code === locale.value))

const currentLabel = computed(() => {
  if (locale.value === 'en-US')
    return 'En'
  if (locale.value === 'zh-TW')
    return '繁體'
  if (locale.value === 'zh-CN')
    return '简体'
  if (locale.value === 'fr-FR')
    return 'Fr'
  if (locale.value === 'de-DE')
    return 'De'
  if (locale.value === 'vi-VN')
    return 'Vi'
  return currentLocaleObj.value?.name || locale.value
})

async function selectLocale(code) {
  cookie.value = code
  await setLocale(code)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        size="sm"
        class="
          h-9 gap-1.5 px-2.5 text-xs font-medium text-muted-foreground
          hover:text-foreground
        "
      >
        <Languages class="size-4" />
        <span>{{ currentLabel }}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      class="w-40"
    >
      <DropdownMenuItem
        v-for="l in locales"
        :key="l.code"
        class="flex cursor-pointer items-center justify-between text-xs"
        @click="selectLocale(l.code)"
      >
        <span class="flex items-center gap-2">
          <span>{{ l.emoji }}</span>
          <span :class="{ 'font-semibold text-foreground': l.code === locale }">{{ l.name }}</span>
        </span>
        <Check v-if="l.code === locale" class="size-3.5 text-emerald-600" />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
