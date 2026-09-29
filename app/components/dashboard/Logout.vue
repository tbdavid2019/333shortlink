<script setup>
import { LogOut } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

async function logOut() {
  const token = localStorage.getItem('SinkSiteToken')
  try {
    await $fetch('/api/passkey/logout', {
      method: 'POST',
      credentials: 'same-origin',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
    localStorage.removeItem('SinkSiteToken')
    await navigateTo('/dashboard/login')
  }
  catch {
    toast.error('Could not sign out. Please try again.')
  }
}
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <LogOut
        class="h-4 w-4 cursor-pointer"
      />
    </AlertDialogTrigger>
    <AlertDialogContent
      class="
        max-h-[95svh] max-w-[95svw] grid-rows-[auto_minmax(0,1fr)_auto]
        md:max-w-lg
      "
    >
      <AlertDialogHeader>
        <AlertDialogTitle>{{ $t('logout.title') }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ $t('logout.confirm') }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{{ $t('common.cancel') }}</AlertDialogCancel>
        <AlertDialogAction @click="logOut">
          {{ $t('logout.action') }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
