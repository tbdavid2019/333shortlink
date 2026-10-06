<script setup>
import { AlertCircle, Fingerprint, KeyRound, LoaderCircle } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import BrandLogo from '~/components/BrandLogo.vue'
import { useLoginCopy } from '~/utils/login-copy'
import { prepareRequestOptions, serializePasskeyCredential } from '~/utils/passkey'

const copy = useLoginCopy()
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
    const { requestId, challengeToken, options } = await $fetch('/api/passkey/login/options')
    const credential = await navigator.credentials.get({
      publicKey: prepareRequestOptions(options),
    })
    if (!(credential instanceof PublicKeyCredential))
      throw new Error('No passkey response')

    await $fetch('/api/passkey/login/verify', {
      method: 'POST',
      body: { requestId, challengeToken, credential: serializePasskeyCredential(credential) },
      credentials: 'same-origin',
    })
    localStorage.removeItem('SinkSiteToken')
    await navigateTo('/dashboard/links')
  }
  catch (error) {
    passkeyError.value = error?.statusCode === 404
      ? copy.value.passkeyUnregistered
      : copy.value.passkeyFailed
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
    toast.error(copy.value.tokenFailed)
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
        mb-8 flex items-center gap-3.5
        lg:hidden
      "
    >
      <span
        class="
          flex size-11 items-center justify-center overflow-hidden rounded-xl
          shadow-sm ring-1 ring-border
        "
      >
        <BrandLogo :badge="true" :size="44" />
      </span>
      <div>
        <p class="text-base font-bold tracking-tight text-foreground">
          {{ copy.brand }}
        </p>
        <p class="text-xs font-medium text-muted-foreground">
          {{ copy.adminAccess }}
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
            bg-[#4a5f23] text-white shadow-sm ring-1 ring-black/5
            lg:flex
          "
        >
          <Fingerprint class="size-6" />
        </div>
        <h1
          class="
            text-2xl font-bold tracking-tight text-balance text-foreground
            sm:text-3xl sm:leading-tight
          "
        >
          {{ copy.title }}
        </h1>
        <p class="mt-2.5 text-sm leading-relaxed text-muted-foreground">
          {{ copy.description }}
        </p>
      </div>

      <div class="space-y-4">
        <Button
          class="
            h-12 w-full rounded-xl bg-[#4a5f23] text-sm font-semibold
            tracking-wide text-white shadow-sm transition
            hover:bg-[#3d4f1c]
            active:scale-[0.99]
            disabled:cursor-not-allowed disabled:opacity-60
          "
          :disabled="!passkeySupported || passkeyLoading"
          @click="signInWithPasskey"
        >
          <LoaderCircle v-if="passkeyLoading" class="mr-2 size-4 animate-spin" />
          <Fingerprint v-else class="mr-2 size-4" />
          {{ passkeyLoading ? copy.passkeyWaiting : copy.passkeyAction }}
        </Button>

        <p
          v-if="!passkeySupported" class="
            text-xs leading-5 text-muted-foreground
          "
        >
          {{ copy.passkeyUnsupported }}
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
            <span>{{ copy.tokenHeading }}</span>
            <KeyRound
              class="
                size-4 text-muted-foreground transition-transform
                group-open:rotate-45
              "
            />
          </summary>
          <div class="space-y-3 border-t border-border/80 p-4">
            <p class="text-xs leading-5 text-muted-foreground">
              {{ copy.tokenDescription }}
            </p>
            <form class="space-y-3" @submit.prevent="signInWithToken">
              <input
                v-model="token"
                name="site-token"
                type="password"
                autocomplete="current-password"
                required
                :placeholder="copy.tokenPlaceholder"
                class="
                  h-11 w-full rounded-lg border border-input bg-background px-4
                  text-sm text-foreground transition outline-none
                  placeholder:text-muted-foreground/70
                  focus-visible:border-[#5a742b] focus-visible:ring-4
                  focus-visible:ring-[#5a742b]/15
                "
              >
              <Alert v-if="previewMode">
                <AlertCircle class="size-4" />
                <AlertTitle>{{ copy.tips }}</AlertTitle>
                <AlertDescription>
                  {{ copy.previewToken }} <code
                    class="
                      rounded bg-muted px-1.5 py-0.5 font-mono text-xs
                      font-semibold text-[#4a5f23]
                      dark:text-[#a8cb6c]
                    "
                  >SinkCool</code>.
                </AlertDescription>
              </Alert>
              <Button type="submit" variant="outline" class="h-11 w-full" :disabled="tokenLoading || !token">
                <LoaderCircle
                  v-if="tokenLoading" class="mr-2 size-4 animate-spin"
                />
                {{ copy.tokenSubmit }}
              </Button>
            </form>
          </div>
        </details>
      </div>
    </div>
  </section>
</template>
