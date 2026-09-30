#!/usr/bin/env node
import { execSync } from 'node:child_process'

const args = process.argv.slice(2).filter(Boolean)

if (args.length === 0 && !process.env.CLOUDFLARE_ZONE_ID) {
  console.log('Usage: node scripts/purge-cache.mjs <zone-id-or-name> [more-zones...]')
  console.log('Or set CLOUDFLARE_ZONE_ID environment variable.')
  process.exit(0)
}

let targets = args.length > 0
  ? args
  : (process.env.CLOUDFLARE_ZONE_ID || '').split(',').map(s => s.trim()).filter(Boolean)

if (targets.includes('all')) {
  try {
    const raw = execSync('cf zones list', { encoding: 'utf-8' })
    const zones = JSON.parse(raw)
    targets = zones.map(z => z.id)
  }
  catch {
    targets = targets.filter(t => t !== 'all')
  }
}

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
