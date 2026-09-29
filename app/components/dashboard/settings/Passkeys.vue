<script setup>
import { Fingerprint, KeyRound, LoaderCircle, Plus, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { prepareCreationOptions, serializePasskeyCredential } from '~/utils/passkey'

const passkeys = ref([])
const passkeyName = ref('')
const supported = ref(false)
const loading = ref(true)
const adding = ref(false)
const removing = ref('')
const removeDialogOpen = ref(false)
const passkeyToRemove = ref(null)

async function loadPasskeys() {
  loading.value = true
  try {
    passkeys.value = await useAPI('/api/passkey/credentials')
  }
  catch (error) {
    console.error('Failed to load passkeys:', error)
    toast.error('Failed to load passkeys')
  }
  finally {
    loading.value = false
  }
}

async function addPasskey() {
  if (!passkeyName.value.trim() || adding.value)
    return

  adding.value = true
  try {
    const { requestId, options } = await useAPI('/api/passkey/registration/options', {
      method: 'POST',
      body: { name: passkeyName.value.trim() },
    })
    const credential = await navigator.credentials.create({
      publicKey: prepareCreationOptions(options),
    })
    if (!(credential instanceof PublicKeyCredential))
      throw new Error('No passkey was created')

    await useAPI('/api/passkey/registration/verify', {
      method: 'POST',
      body: {
        requestId,
        credential: serializePasskeyCredential(credential),
      },
    })
    passkeyName.value = ''
    toast.success('Passkey added')
    await loadPasskeys()
  }
  catch (error) {
    toast.error(error?.data?.statusMessage || 'Passkey registration was cancelled or failed')
  }
  finally {
    adding.value = false
  }
}

function requestRemovePasskey(passkey) {
  passkeyToRemove.value = passkey
  removeDialogOpen.value = true
}

async function removePasskey() {
  const passkey = passkeyToRemove.value
  if (!passkey)
    return

  removing.value = passkey.id
  try {
    await useAPI('/api/passkey/credentials/remove', {
      method: 'POST',
      body: { id: passkey.id },
    })
    toast.success('Passkey removed')
    await loadPasskeys()
  }
  catch (error) {
    console.error('Passkey removal failed:', error)
    toast.error(error?.data?.statusMessage || 'Failed to remove passkey')
  }
  finally {
    removing.value = ''
  }
}

onMounted(() => {
  supported.value = window.isSecureContext && 'PublicKeyCredential' in window && !!navigator.credentials
  loadPasskeys()
})
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <div class="flex items-start gap-3">
          <span
            class="
              flex size-10 shrink-0 items-center justify-center rounded-xl
              bg-emerald-100 text-emerald-800
              dark:bg-emerald-950 dark:text-emerald-300
            "
          >
            <Fingerprint class="size-5" />
          </span>
          <div>
            <CardTitle>Passkeys</CardTitle>
            <CardDescription class="mt-1">
              Sign in with Touch ID, Face ID, Windows Hello, or a passkey stored by your password manager.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent class="space-y-5">
        <div
          v-if="!supported" class="
            rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3
            text-sm text-muted-foreground
          "
        >
          Passkeys need a supported browser and a secure HTTPS connection. Localhost is supported for development.
        </div>

        <form
          class="
            flex flex-col gap-3
            sm:flex-row
          " @submit.prevent="addPasskey"
        >
          <Input
            v-model="passkeyName"
            class="
              h-11
              sm:max-w-sm
            "
            maxlength="80"
            placeholder="Name this device (for example, MacBook Touch ID)"
            aria-label="Passkey device name"
            required
          />
          <Button type="submit" class="h-11 shrink-0" :disabled="!supported || adding || !passkeyName.trim()">
            <LoaderCircle v-if="adding" class="mr-2 size-4 animate-spin" />
            <Plus v-else class="mr-2 size-4" />
            Add passkey
          </Button>
        </form>

        <div
          class="
            rounded-lg bg-muted/60 px-4 py-3 text-sm leading-6
            text-muted-foreground
          "
        >
          Register once for each browser or device you use. Your existing Site Token remains available for API integrations and fallback sign-in.
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle class="text-base">
          Registered devices
        </CardTitle>
        <CardDescription>Remove a device here if you no longer use it.</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          v-if="loading" class="
            flex items-center gap-2 py-4 text-sm text-muted-foreground
          "
        >
          <LoaderCircle class="size-4 animate-spin" />
          Loading passkeys…
        </div>
        <div
          v-else-if="!passkeys.length" class="
            rounded-lg border border-dashed px-4 py-8 text-center
          "
        >
          <KeyRound class="mx-auto mb-3 size-5 text-muted-foreground" />
          <p class="text-sm font-medium">
            No passkeys registered
          </p>
          <p class="mt-1 text-sm text-muted-foreground">
            Add a device above to enable passwordless sign-in.
          </p>
        </div>
        <ul v-else class="divide-y divide-border">
          <li
            v-for="passkey in passkeys" :key="passkey.id" class="
              flex items-center justify-between gap-4 py-4
              first:pt-0
              last:pb-0
            "
          >
            <div class="flex min-w-0 items-center gap-3">
              <span
                class="
                  flex size-9 shrink-0 items-center justify-center rounded-lg
                  bg-muted
                "
              >
                <Fingerprint class="size-4 text-muted-foreground" />
              </span>
              <div class="min-w-0">
                <p class="truncate text-sm font-medium">
                  {{ passkey.name }}
                </p>
                <p class="text-xs text-muted-foreground">
                  Added {{ new Date(passkey.createdAt).toLocaleDateString() }}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              class="
                text-muted-foreground
                hover:text-destructive
              "
              :disabled="removing === passkey.id"
              :aria-label="`Remove ${passkey.name}`"
              @click="requestRemovePasskey(passkey)"
            >
              <LoaderCircle
                v-if="removing === passkey.id" class="size-4 animate-spin"
              />
              <Trash2 v-else class="size-4" />
            </Button>
          </li>
        </ul>
      </CardContent>
    </Card>

    <AlertDialog v-model:open="removeDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove this passkey?</AlertDialogTitle>
          <AlertDialogDescription>
            {{ passkeyToRemove?.name }} will no longer sign in to this dashboard. Your Site Token still works for sign-in and API integrations.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep passkey</AlertDialogCancel>
          <AlertDialogAction @click="removePasskey">
            Remove passkey
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
