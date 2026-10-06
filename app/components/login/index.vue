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
  <section
    class="
      w-full max-w-lg
      xl:max-w-xl
    "
  >
    <div
      class="
        mb-8 flex items-center gap-4
        lg:hidden
      "
    >
      <span
        class="
          flex size-14 items-center justify-center overflow-hidden rounded-2xl
          shadow-sm ring-1 ring-border
        "
      >
        <BrandLogo :badge="true" :size="56" />
      </span>
      <div>
        <p class="text-xl font-black tracking-tight text-foreground">
          {{ copy.brand }}
        </p>
        <p class="text-sm font-semibold text-muted-foreground">
          {{ copy.adminAccess }}
        </p>
      </div>
    </div>

    <div
      class="
        rounded-3xl border border-border/80 bg-card p-8 shadow-2xl
        sm:p-12
      "
    >
      <div class="mb-9">
        <div
          class="
            mb-6 hidden size-14 items-center justify-center rounded-2xl
            bg-[#4a5f23] text-white shadow-md ring-1 ring-black/5
            lg:flex
          "
        >
          <Fingerprint class="size-7" />
        </div>
        <h1
          class="
            text-3xl font-black tracking-tight text-balance text-foreground
            sm:text-4xl
            lg:text-[2.6rem] lg:leading-tight
          "
        >
          {{ copy.title }}
        </h1>
        <p
          class="
            mt-3.5 text-base leading-relaxed text-muted-foreground
            sm:text-lg
          "
        >
          {{ copy.description }}
        </p>
      </div>

      <div class="space-y-5">
        <Button
          class="
            h-14 w-full rounded-2xl bg-[#4a5f23] text-base font-bold
            tracking-wide text-white shadow-md transition
            hover:bg-[#3d4f1c]
            active:scale-[0.99]
            disabled:cursor-not-allowed disabled:opacity-60
            sm:h-16 sm:text-lg
          "
          :disabled="!passkeySupported || passkeyLoading"
          @click="signInWithPasskey"
        >
          <LoaderCircle v-if="passkeyLoading" class="mr-2.5 size-5 animate-spin" />
          <Fingerprint
            v-else class="
              mr-2.5 size-5
              sm:size-6
            "
          />
          {{ passkeyLoading ? copy.passkeyWaiting : copy.passkeyAction }}
        </Button>

        <p
          v-if="!passkeySupported" class="
            text-sm leading-relaxed text-muted-foreground
            sm:text-base
          "
        >
          {{ copy.passkeyUnsupported }}
        </p>
        <p
          v-if="passkeyError" role="alert" class="
            rounded-xl border border-destructive/20 bg-destructive/5 px-5 py-4
            text-base text-destructive
          "
        >
          {{ passkeyError }}
        </p>

        <details class="group rounded-2xl border border-border/80">
          <summary
            class="
              flex cursor-pointer list-none items-center justify-between gap-3
              px-5 py-4 text-base font-bold text-foreground
              sm:text-lg
            "
          >
            <span>{{ copy.tokenHeading }}</span>
            <KeyRound
              class="
                size-5 text-muted-foreground transition-transform
                group-open:rotate-45
              "
            />
          </summary>
          <div
            class="
              space-y-4 border-t border-border/80 p-5
              sm:p-6
            "
          >
            <p
              class="
                text-sm leading-relaxed text-muted-foreground
                sm:text-base
              "
            >
              {{ copy.tokenDescription }}
            </p>
            <form class="space-y-4" @submit.prevent="signInWithToken">
              <input
                v-model="token"
                name="site-token"
                type="password"
                autocomplete="current-password"
                required
                :placeholder="copy.tokenPlaceholder"
                class="
                  h-13 w-full rounded-xl border border-input bg-background px-4
                  text-base text-foreground transition outline-none
                  placeholder:text-muted-foreground/70
                  focus-visible:border-[#5a742b] focus-visible:ring-4
                  focus-visible:ring-[#5a742b]/15
                  sm:h-14 sm:px-5 sm:text-lg
                "
              >
              <Alert v-if="previewMode">
                <AlertCircle class="size-5" />
                <AlertTitle class="text-base font-bold">
                  {{ copy.tips }}
                </AlertTitle>
                <AlertDescription
                  class="
                    text-sm
                    sm:text-base
                  "
                >
                  {{ copy.previewToken }} <code
                    class="
                      rounded bg-muted px-2 py-0.5 font-mono text-sm font-bold
                      text-[#4a5f23]
                      dark:text-[#a8cb6c]
                    "
                  >SinkCool</code>.
                </AlertDescription>
              </Alert>
              <Button
                type="submit"
                variant="outline"
                class="
                  h-13 w-full rounded-xl text-base font-bold
                  sm:h-14 sm:text-lg
                "
                :disabled="tokenLoading || !token"
              >
                <LoaderCircle
                  v-if="tokenLoading" class="mr-2.5 size-5 animate-spin"
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
