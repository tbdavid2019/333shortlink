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
        <div class="flex items-center gap-4">
          <span
            class="
              flex size-14 items-center justify-center overflow-hidden
              rounded-2xl shadow-lg ring-1 ring-white/15
            "
          >
            <BrandLogo :badge="true" :size="56" />
          </span>
          <div>
            <p
              class="
                text-xl font-black tracking-tight text-white
                sm:text-2xl
              "
            >
              {{ copy.brand }}
            </p>
            <p
              class="
                text-xs font-semibold text-[#d5e3c2]/85
                sm:text-sm
              "
            >
              {{ copy.adminAccess }}
            </p>
          </div>
        </div>

        <div
          class="
            max-w-xl space-y-8 py-8
            xl:max-w-2xl xl:space-y-10
          "
        >
          <div>
            <h2
              class="
                text-4xl leading-[1.2] font-black tracking-tight text-balance
                text-white
                sm:text-5xl
                lg:text-5xl
                xl:text-6xl xl:leading-[1.15]
              "
            >
              {{ copy.workspaceTitle }}
            </h2>
            <p
              class="
                mt-5 max-w-xl text-lg leading-relaxed font-normal
                text-[#dbe8cb]/95
                sm:text-xl
                lg:text-2xl
              "
            >
              {{ copy.workspaceDescription }}
            </p>
          </div>

          <div
            class="
              max-w-xl rounded-2xl border border-white/15 bg-white/[0.06] p-6
              shadow-xl shadow-black/10 backdrop-blur-sm
              sm:p-7
              xl:max-w-2xl
            "
          >
            <p
              class="
                mb-4 text-xs font-bold tracking-[0.14em] text-[#cde49e]
                uppercase
                sm:text-sm
              "
            >
              {{ copy.samplePath }}
            </p>
            <div
              class="
                grid grid-cols-[1fr_auto_1fr] items-center gap-4
                sm:gap-6
              "
            >
              <div class="min-w-0">
                <p
                  class="
                    mb-1.5 text-xs font-medium text-[#d5e3c2]/75
                    sm:text-sm
                  "
                >
                  {{ copy.originalUrl }}
                </p>
                <p
                  class="
                    truncate font-mono text-sm font-semibold tracking-tight
                    text-white/95
                    sm:text-base
                  "
                >
                  example.com/launch
                </p>
              </div>
              <ArrowRight class="size-5 shrink-0 text-[#cde49e]" />
              <div class="min-w-0">
                <p
                  class="
                    mb-1.5 text-xs font-medium text-[#d5e3c2]/75
                    sm:text-sm
                  "
                >
                  {{ copy.shortUrl }}
                </p>
                <p
                  class="
                    truncate font-mono text-sm font-bold tracking-tight
                    text-[#cde49e]
                    sm:text-base
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
              group block max-w-xl rounded-2xl border border-[#8fa85b]/35
              bg-[#242e15]/65 p-6 backdrop-blur-sm transition-all duration-200
              hover:border-[#a4c06b]/60 hover:bg-[#2c3819]/85 hover:shadow-xl
              hover:shadow-black/25
              xl:max-w-2xl
            "
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-center gap-4">
                <span
                  class="
                    flex size-12 shrink-0 items-center justify-center
                    rounded-2xl border border-[#8fa85b]/40 bg-[#5c732b]/30
                    text-[#cde49e] transition-transform duration-200
                    group-hover:scale-105
                  "
                >
                  <Chrome class="size-6" />
                </span>
                <div>
                  <div class="flex items-center gap-2.5">
                    <span
                      class="
                        text-base font-bold tracking-normal text-white
                        sm:text-lg
                      "
                    >
                      {{ copy.extTitle }}
                    </span>
                    <span
                      class="
                        rounded-md bg-[#8fa85b]/30 px-2.5 py-0.5 text-xs
                        font-bold tracking-wide text-[#e1f5be]
                      "
                    >
                      {{ copy.extBadge }}
                    </span>
                  </div>
                  <p
                    class="
                      mt-1 text-sm font-medium text-[#d5e3c2]/85
                      sm:text-base
                    "
                  >
                    {{ copy.extSubtitle }}
                  </p>
                </div>
              </div>
              <ExternalLink
                class="
                  size-5 shrink-0 text-[#cde49e]/70 transition-colors
                  group-hover:text-[#cde49e]
                "
              />
            </div>
            <p
              class="
                mt-4 text-sm leading-relaxed text-[#dbe8cb]/95
                sm:text-base
              "
            >
              {{ copy.extDesc }}
            </p>
          </a>
        </div>

        <div
          class="
            space-y-3 text-sm text-[#d5e3c2]/80
            sm:text-base
          "
        >
          <p class="leading-relaxed">
            {{ copy.footer }}
          </p>
          <p class="border-t border-white/15 pt-4">
            {{ copy.techProvider }}
            <a
              href="https://david888.com"
              target="_blank"
              rel="noopener noreferrer"
              class="
                font-bold text-[#cde49e] underline-offset-4 transition-colors
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
            flex items-center justify-end gap-1 px-6 pt-6
            sm:px-10
            lg:px-12
          "
        >
          <SwitchLanguage />
          <SwitchTheme />
        </div>
        <div
          class="
            flex flex-1 items-center justify-center px-6 py-12
            sm:px-10
            lg:px-14
          "
        >
          <slot />
        </div>
        <div
          class="
            p-5 text-center text-sm font-medium text-muted-foreground
            lg:hidden
          "
        >
          {{ copy.techProvider }}
          <a
            href="https://david888.com"
            target="_blank"
            rel="noopener noreferrer"
            class="
              font-semibold text-foreground underline-offset-2
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
