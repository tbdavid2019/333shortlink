<script setup>
import { ArrowRight } from 'lucide-vue-next'
import { useLoginCopy } from '~/utils/login-copy'

const copy = useLoginCopy()
const displayHost = useSiteBrand()

const exampleShortUrl = computed(() => `${displayHost.value}/104`)
</script>

<template>
  <main class="min-h-[100dvh] bg-background text-foreground">
    <div
      class="
        grid min-h-[100dvh]
        lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]
      "
    >
      <aside
        class="
          relative hidden overflow-hidden bg-[#102c28] p-12 text-white
          lg:flex lg:flex-col lg:justify-between
          xl:p-16
        "
      >
        <div class="flex items-center gap-3">
          <span
            class="
              flex size-11 items-center justify-center overflow-hidden
              rounded-xl
            "
          >
            <UiBrandLogo :badge="true" :size="38" />
          </span>
          <div>
            <p class="text-sm font-semibold tracking-wide">
              {{ copy.brand }}
            </p>
            <p class="text-xs text-emerald-100/65">
              {{ copy.adminAccess }}
            </p>
          </div>
        </div>

        <div class="max-w-xl py-16">
          <h2
            class="
              text-4xl leading-[1.12] font-semibold tracking-tight
              xl:text-5xl
            "
          >
            {{ copy.workspaceTitle }}
          </h2>
          <p class="mt-6 max-w-md text-base leading-7 text-emerald-50/70">
            {{ copy.workspaceDescription }}
          </p>

          <div
            class="
              mt-12 max-w-md rounded-xl border border-white/10 bg-white/[0.06]
              p-5
            "
          >
            <p
              class="
                mb-4 text-[11px] font-medium tracking-[0.16em]
                text-emerald-100/55 uppercase
              "
            >
              {{ copy.samplePath }}
            </p>
            <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div class="min-w-0">
                <p class="mb-1 text-[11px] text-emerald-100/55">
                  {{ copy.originalUrl }}
                </p>
                <p class="truncate text-sm font-medium text-white">
                  example.com/launch
                </p>
              </div>
              <ArrowRight class="size-4 text-emerald-300" />
              <div class="min-w-0">
                <p class="mb-1 text-[11px] text-emerald-100/55">
                  {{ copy.shortUrl }}
                </p>
                <p class="truncate text-sm font-medium text-emerald-200">
                  {{ exampleShortUrl }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <p class="text-xs text-emerald-50/55">
          {{ copy.footer }}
        </p>
      </aside>

      <section class="relative flex min-h-[100dvh] flex-col">
        <div
          class="
            flex items-center justify-end gap-1 px-5 pt-5
            sm:px-8
            lg:px-10
          "
        >
          <SwitchLanguage />
          <SwitchTheme />
        </div>
        <div
          class="
            flex flex-1 items-center justify-center px-5 py-10
            sm:px-8
            lg:px-12
          "
        >
          <slot />
        </div>
      </section>
    </div>
  </main>
</template>
