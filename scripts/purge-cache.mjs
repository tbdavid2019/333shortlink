#!/usr/bin/env node
import { execSync } from 'node:child_process'

const args = process.argv.slice(2).filter(Boolean)

if (args.length === 0 && !process.env.CLOUDFLARE_ZONE_ID) {
  console.log('Usage: node scripts/purge-cache.mjs <zone-id-or-name> [more-zones...]')
  console.log('Or set CLOUDFLARE_ZONE_ID environment variable.')
  process.exit(0)
}

const targets = args.length > 0
  ? args
  : (process.env.CLOUDFLARE_ZONE_ID || '').split(',').map(s => s.trim()).filter(Boolean)

for (const target of targets) {
  console.log(`🧹 Purging cache for zone: ${target}...`)
  try {
    execSync(`cf cache purge -z ${target} --body '{"purge_everything": true}' -f`, { stdio: 'inherit' })
    console.log(`✅ Cache purged for ${target}`)
  }
  catch (error) {
    console.error(`⚠️ Failed to purge cache for ${target}:`, error.message)
  }
}
