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
          relative hidden overflow-hidden bg-[#18210e] p-10 text-white
          lg:flex lg:flex-col lg:justify-between
          xl:p-14
        "
      >
        <div class="flex items-center gap-3.5">
          <span
            class="
              flex size-11 items-center justify-center overflow-hidden
              rounded-xl shadow-md ring-1 ring-white/10
            "
          >
            <BrandLogo :badge="true" :size="44" />
          </span>
          <div>
            <p class="text-base font-bold tracking-tight text-white">
              {{ copy.brand }}
            </p>
            <p class="text-xs font-medium text-[#d5e3c2]/70">
              {{ copy.adminAccess }}
            </p>
          </div>
        </div>

        <div class="max-w-xl space-y-6 py-8">
          <div>
            <h2
              class="
                text-3xl leading-[1.22] font-extrabold tracking-tight
                text-balance text-white
                xl:text-4xl xl:leading-[1.18]
              "
            >
              {{ copy.workspaceTitle }}
            </h2>
            <p
              class="mt-4 max-w-md text-base leading-relaxed text-[#dbe8cb]/85"
            >
              {{ copy.workspaceDescription }}
            </p>
          </div>

          <div
            class="
              max-w-md rounded-2xl border border-white/10 bg-white/[0.05] p-5
              backdrop-blur-sm
            "
          >
            <p
              class="
                mb-3 text-[11px] font-bold tracking-[0.16em] text-[#cde49e]
                uppercase
              "
            >
              {{ copy.samplePath }}
            </p>
            <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div class="min-w-0">
                <p class="mb-1 text-[11px] font-medium text-[#d5e3c2]/65">
                  {{ copy.originalUrl }}
                </p>
                <p
                  class="
                    truncate font-mono text-xs font-semibold tracking-tight
                    text-white/95
                    sm:text-sm
                  "
                >
                  example.com/launch
                </p>
              </div>
              <ArrowRight class="size-4 shrink-0 text-[#cde49e]" />
              <div class="min-w-0">
                <p class="mb-1 text-[11px] font-medium text-[#d5e3c2]/65">
                  {{ copy.shortUrl }}
                </p>
                <p
                  class="
                    truncate font-mono text-xs font-bold tracking-tight
                    text-[#cde49e]
                    sm:text-sm
                  "
                >
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
              group block max-w-md rounded-2xl border border-[#8fa85b]/30
              bg-[#242e15]/55 p-4.5 backdrop-blur-sm transition-all duration-200
              hover:border-[#a4c06b]/50 hover:bg-[#2c3819]/75 hover:shadow-lg
              hover:shadow-black/20
            "
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <span
                  class="
                    flex size-9 shrink-0 items-center justify-center rounded-xl
                    border border-[#8fa85b]/40 bg-[#5c732b]/25 text-[#cde49e]
                    transition-transform duration-200
                    group-hover:scale-105
                  "
                >
                  <Chrome class="size-4.5" />
                </span>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-bold tracking-normal text-white">
                      {{ copy.extTitle }}
                    </span>
                    <span
                      class="
                        rounded-md bg-[#8fa85b]/25 px-2 py-0.5 text-[10px]
                        font-bold tracking-wide text-[#d9edb2]
                      "
                    >
                      {{ copy.extBadge }}
                    </span>
                  </div>
                  <p class="mt-0.5 text-xs font-medium text-[#d5e3c2]/75">
                    {{ copy.extSubtitle }}
                  </p>
                </div>
              </div>
              <ExternalLink
                class="
                  size-4 shrink-0 text-[#cde49e]/60 transition-colors
                  group-hover:text-[#cde49e]
                "
              />
            </div>
            <p class="mt-3 text-xs leading-relaxed text-[#dbe8cb]/85">
              {{ copy.extDesc }}
            </p>
          </a>
        </div>

        <div class="space-y-2 text-xs text-[#d5e3c2]/70">
          <p class="leading-relaxed">
            {{ copy.footer }}
          </p>
          <p class="border-t border-white/10 pt-3">
            {{ copy.techProvider }}
            <a
              href="https://david888.com"
              target="_blank"
              rel="noopener noreferrer"
              class="
                font-semibold text-[#cde49e] underline-offset-4
                transition-colors
                hover:text-white hover:underline
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
