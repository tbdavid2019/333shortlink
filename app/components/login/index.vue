<script setup>
import { AlertCircle, Fingerprint, KeyRound, LoaderCircle } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { prepareRequestOptions, serializePasskeyCredential } from '~/utils/passkey'

const { t } = useI18n()
const token = ref('')
const passkeySupported = ref(false)
const passkeyLoading = ref(false)
const tokenLoading = ref(false)
const passkeyError = ref('')
const { previewMode } = useRuntimeConfig().public

onMounted(() => {
  passkeySupported.value = window.isSecureContext
    && 'PublicKeyCredential' in window
    && !!navigator.credentials
})

async function signInWithPasskey() {
  if (!passkeySupported.value || passkeyLoading.value)
    return

  passkeyLoading.value = true
  passkeyError.value = ''
  try {
    const { requestId, options } = await $fetch('/api/passkey/login/options')
    const credential = await navigator.credentials.get({
      publicKey: prepareRequestOptions(options),
    })
    if (!(credential instanceof PublicKeyCredential))
      throw new Error('No passkey response')

    await $fetch('/api/passkey/login/verify', {
      method: 'POST',
      body: { requestId, credential: serializePasskeyCredential(credential) },
      credentials: 'same-origin',
    })
    localStorage.removeItem('SinkSiteToken')
    await navigateTo('/dashboard/links')
  }
  catch (error) {
    passkeyError.value = error?.statusCode === 404
      ? t('login.passkey_unregistered')
      : t('login.passkey_failed')
  }
  finally {
    passkeyLoading.value = false
  }
}

async function signInWithToken() {
  if (!token.value || tokenLoading.value)
    return

  tokenLoading.value = true
  try {
    localStorage.setItem('SinkSiteToken', token.value)
    await useAPI('/api/verify')
    await navigateTo('/dashboard/links')
  }
  catch (error) {
    console.error(error)
    toast.error(t('login.failed'))
  }
  finally {
    tokenLoading.value = false
  }
}
</script>

<template>
  <section class="w-full max-w-md">
    <div
      class="
        mb-8 flex items-center gap-3
        lg:hidden
      "
    >
      <span class="flex size-11 items-center justify-center rounded-xl bg-black">
        <img src="/sink.png" alt="" class="size-6">
      </span>
      <div>
        <p class="text-sm font-semibold tracking-wide text-foreground">
          {{ $t('login.brand') }}
        </p>
        <p class="text-xs text-muted-foreground">
          {{ $t('login.admin_access') }}
        </p>
      </div>
    </div>

    <div
      class="
        rounded-2xl border border-border/80 bg-card p-6
        sm:p-9
      "
    >
      <div class="mb-8">
        <div
          class="
            mb-6 hidden size-12 items-center justify-center rounded-xl
            bg-emerald-700 text-white
            lg:flex
          "
        >
          <Fingerprint class="size-6" />
        </div>
        <h1 class="text-3xl font-semibold tracking-tight text-foreground">
          {{ $t('login.title') }}
        </h1>
        <p class="mt-2 text-sm leading-6 text-muted-foreground">
          {{ $t('login.description') }}
        </p>
      </div>

      <div class="space-y-4">
        <Button
          class="
            h-12 w-full rounded-lg bg-emerald-700 text-sm font-semibold
            text-white transition
            hover:bg-emerald-800
            disabled:cursor-not-allowed disabled:opacity-60
          "
          :disabled="!passkeySupported || passkeyLoading"
          @click="signInWithPasskey"
        >
          <LoaderCircle v-if="passkeyLoading" class="mr-2 size-4 animate-spin" />
          <Fingerprint v-else class="mr-2 size-4" />
          {{ passkeyLoading ? $t('login.passkey_waiting') : $t('login.passkey_action') }}
        </Button>

        <p
          v-if="!passkeySupported" class="
            text-xs leading-5 text-muted-foreground
          "
        >
          {{ $t('login.passkey_unsupported') }}
        </p>
        <p
          v-if="passkeyError" role="alert" class="
            rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3
            text-sm text-destructive
          "
        >
          {{ passkeyError }}
        </p>

        <details class="group rounded-xl border border-border/80">
          <summary
            class="
              flex cursor-pointer list-none items-center justify-between gap-3
              px-4 py-3 text-sm font-medium text-foreground
            "
          >
            <span>{{ $t('login.token_heading') }}</span>
            <KeyRound
              class="
                size-4 text-muted-foreground transition-transform
                group-open:rotate-45
              "
            />
          </summary>
          <div class="space-y-3 border-t border-border/80 p-4">
            <p class="text-xs leading-5 text-muted-foreground">
              {{ $t('login.token_description') }}
            </p>
            <form class="space-y-3" @submit.prevent="signInWithToken">
              <input
                v-model="token"
                name="site-token"
                type="password"
                autocomplete="current-password"
                required
                :placeholder="$t('login.token_placeholder')"
                class="
                  h-11 w-full rounded-lg border border-input bg-background px-4
                  text-sm text-foreground transition outline-none
                  placeholder:text-muted-foreground/70
                  focus-visible:border-emerald-600 focus-visible:ring-4
                  focus-visible:ring-emerald-600/10
                "
              >
              <Alert v-if="previewMode">
                <AlertCircle class="size-4" />
                <AlertTitle>{{ $t('login.tips') }}</AlertTitle>
                <AlertDescription>
                  {{ $t('login.preview_token') }} <code
                    class="
                      font-mono text-green-600
                      dark:text-green-400
                    "
                  >SinkCool</code>.
                </AlertDescription>
              </Alert>
              <Button type="submit" variant="outline" class="h-11 w-full" :disabled="tokenLoading || !token">
                <LoaderCircle
                  v-if="tokenLoading" class="mr-2 size-4 animate-spin"
                />
                {{ $t('login.submit') }}
              </Button>
            </form>
          </div>
        </details>
      </div>
    </div>
  </section>
</template>
