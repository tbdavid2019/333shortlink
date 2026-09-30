#!/usr/bin/env node
import { execSync } from 'node:child_process'

const args = process.argv.slice(2).filter(Boolean)

// Known zone map for convenience (optional)
const ZONE_MAP = {
  'glsoft.ai': 'c4232f264ead2791c645c74bc087507c',
  'aiurl.tw': 'a20c371ac217a96fe96bdfd4d8744c26',
}

const targets = args.length > 0
  ? args
  : Object.keys(ZONE_MAP)

for (const target of targets) {
  const zoneId = ZONE_MAP[target] || target
  console.log(`🧹 Purging cache for zone: ${target} (${zoneId})...`)
  try {
    execSync(`cf cache purge -z ${zoneId} --body '{"purge_everything": true}' -f`, { stdio: 'inherit' })
    console.log(`✅ Cache purged for ${target}`)
  }
  catch (error) {
    console.error(`⚠️ Failed to purge cache for ${target}:`, error.message)
  }
}
