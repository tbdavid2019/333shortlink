import { cloudflareTest } from '@cloudflare/vitest-plugin'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => ({
  plugins: [cloudflareTest({
    wrangler: {
      configPath: './wrangler.test.jsonc',
    },
    miniflare: {
      cf: true,
    },
  })],
  test: {
    include: ['tests/**/*.spec.ts'],
    env: loadEnv(mode, process.cwd(), ''),
    globalSetup: './tests/setup.ts',
    onUnhandledError(error) {
      if (error.message.includes('URL must use http:// or https://'))
        return false
    },
  },
}))
