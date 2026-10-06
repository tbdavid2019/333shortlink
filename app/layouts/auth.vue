<script setup>
import { ArrowRight, Chrome, ExternalLink } from 'lucide-vue-next'
import BrandLogo from '~/components/BrandLogo.vue'
import { useLoginCopy } from '~/utils/login-copy'

const copy = useLoginCopy()
const displayHost = useSiteBrand()

const exampleShortUrl = computed(() => `${displayHost.value}/104`)
const extensionUrl = 'https://chromewebstore.google.com/detail/tabs-url-copy-%E5%BF%AB%E9%80%9F%E5%A4%A7%E9%87%8F%E8%A4%87%E8%A3%BD%E5%88%86%E9%A0%81%E7%B6%B2%E5%9D%80/lfhdpmaolmbejolceggollfelmhbmmkb'
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
          relative hidden overflow-hidden bg-[#102c28] p-10 text-white
          lg:flex lg:flex-col lg:justify-between
          xl:p-14
        "
      >
        <div class="flex items-center gap-3">
          <span
            class="
              flex size-11 items-center justify-center overflow-hidden
              rounded-xl
            "
          >
            <BrandLogo :badge="true" :size="38" />
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

        <div class="max-w-xl space-y-6 py-8">
          <div>
            <h2
              class="
                text-3xl leading-[1.15] font-semibold tracking-tight
                xl:text-4xl
              "
            >
              {{ copy.workspaceTitle }}
            </h2>
            <p class="mt-4 max-w-md text-base leading-7 text-emerald-50/70">
              {{ copy.workspaceDescription }}
            </p>
          </div>

          <div
            class="
              max-w-md rounded-xl border border-white/10 bg-white/[0.06] p-4
            "
          >
            <p
              class="
                mb-3 text-[11px] font-medium tracking-[0.16em]
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

          <!-- Chrome Extension Promotion Card -->
          <a
            :href="extensionUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="
              group block max-w-md rounded-xl border border-emerald-400/20
              bg-emerald-950/40 p-4 backdrop-blur-sm transition-all duration-200
              hover:border-emerald-400/40 hover:bg-emerald-950/60
            "
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-2.5">
                <span
                  class="
                    flex size-8 shrink-0 items-center justify-center rounded-lg
                    border border-emerald-400/30 bg-emerald-500/10
                    text-emerald-300 transition-transform duration-200
                    group-hover:scale-105
                  "
                >
                  <Chrome class="size-4" />
                </span>
                <div>
                  <div class="flex items-center gap-1.5">
                    <span class="text-xs font-semibold tracking-wide text-white">
                      {{ copy.extTitle }}
                    </span>
                    <span
                      class="
                        rounded bg-emerald-400/15 px-1.5 py-0.5 text-[10px]
                        font-medium text-emerald-300
                      "
                    >
                      {{ copy.extBadge }}
                    </span>
                  </div>
                  <p class="text-[11px] text-emerald-100/65">
                    {{ copy.extSubtitle }}
                  </p>
                </div>
              </div>
              <ExternalLink
                class="
                  size-4 shrink-0 text-emerald-300/60 transition-colors
                  group-hover:text-emerald-200
                "
              />
            </div>
            <p class="mt-2.5 text-xs leading-relaxed text-emerald-100/70">
              {{ copy.extDesc }}
            </p>
          </a>
        </div>

        <div class="space-y-2 text-xs text-emerald-50/60">
          <p>
            {{ copy.footer }}
          </p>
          <p class="border-t border-white/10 pt-2">
            {{ copy.techProvider }}
            <a
              href="https://david888.com"
              target="_blank"
              rel="noopener noreferrer"
              class="
                font-medium text-emerald-300 underline-offset-2
                transition-colors
                hover:text-emerald-100 hover:underline
              "
            >
              david888.com
            </a>
          </p>
        </div>
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
        <div
          class="
            p-4 text-center text-xs text-muted-foreground
            lg:hidden
          "
        >
          {{ copy.techProvider }}
          <a
            href="https://david888.com"
            target="_blank"
            rel="noopener noreferrer"
            class="
              font-medium text-foreground underline-offset-2
              hover:underline
            "
          >
            david888.com
          </a>
        </div>
      </section>
    </div>
  </main>
</template>
