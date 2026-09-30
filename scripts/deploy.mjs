#!/usr/bin/env node
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const cwd = process.cwd()
const rawArgs = process.argv.slice(2).map(a => a.trim()).filter(Boolean)

const isList = rawArgs.includes('--list') || rawArgs.includes('-l')
const isDryRun = rawArgs.includes('--dry-run') || rawArgs.includes('-d')
const isHelp = rawArgs.includes('--help') || rawArgs.includes('-h')
const targetArg = rawArgs.find(a => !a.startsWith('-'))

// Find all named local configs (wrangler.<site>.local.jsonc)
function findNamedLocalConfigs() {
  const files = fs.readdirSync(cwd)
  return files.filter(f =>
    f.startsWith('wrangler.')
    && f.includes('.local.')
    && !f.endsWith('.example.jsonc')
    && f !== 'wrangler.local.jsonc'
    && (f.endsWith('.jsonc') || f.endsWith('.json')),
  ).sort()
}

if (isHelp) {
  console.log(`
⚡ Sink Multi-Site Worker Deploy Tool

Usage:
  pnpm run deploy              Deploy default config (wrangler.local.jsonc or wrangler.jsonc)
  pnpm run deploy <target>     Deploy specific site (e.g. "david", "ai360", "site3")
  pnpm run deploy all          Deploy all detected local site configurations sequentially
  pnpm run deploy --list       List all detected local site configurations
  pnpm run deploy --dry-run    Verify configuration resolution without building or deploying
`)
  process.exit(0)
}

if (isList) {
  const namedConfigs = findNamedLocalConfigs()
  console.log(`\n📋 Detected Local Site Configurations:`)
  if (namedConfigs.length === 0) {
    console.log(`   (No wrangler.<site>.local.jsonc files found)`)
  }
  else {
    namedConfigs.forEach((f) => {
      const match = f.match(/^wrangler\.(.+)\.local\.jsonc?$/)
      const siteTag = match ? match[1] : f
      console.log(`   • ${siteTag.padEnd(16)} -> ${f}`)
    })
  }

  const defaultFile = fs.existsSync(path.join(cwd, 'wrangler.local.jsonc'))
    ? 'wrangler.local.jsonc'
    : 'wrangler.jsonc'
  console.log(`\nDefault configuration: ${defaultFile}`)
  console.log(`\nCommands:`)
  console.log(`  • pnpm run deploy <name>  -> Deploy a specific site`)
  console.log(`  • pnpm run deploy all     -> Deploy all configured sites sequentially\n`)
  process.exit(0)
}

function resolveConfigs(target) {
  if (!target || target === 'default') {
    if (process.env.WRANGLER_CONFIG) {
      return [process.env.WRANGLER_CONFIG]
    }
    if (fs.existsSync(path.join(cwd, 'wrangler.local.jsonc'))) {
      return ['wrangler.local.jsonc']
    }
    return ['wrangler.jsonc']
  }

  if (target === 'all') {
    const namedConfigs = findNamedLocalConfigs()
    if (namedConfigs.length > 0) {
      return namedConfigs
    }
    if (fs.existsSync(path.join(cwd, 'wrangler.local.jsonc'))) {
      return ['wrangler.local.jsonc']
    }
    return ['wrangler.jsonc']
  }

  // Target can be an exact path/filename or a site identifier
  if (fs.existsSync(path.join(cwd, target))) {
    return [target]
  }

  const candidateJsonc = `wrangler.${target}.local.jsonc`
  if (fs.existsSync(path.join(cwd, candidateJsonc))) {
    return [candidateJsonc]
  }

  const candidateJson = `wrangler.${target}.local.json`
  if (fs.existsSync(path.join(cwd, candidateJson))) {
    return [candidateJson]
  }

  console.error(`❌ Cannot find configuration file for target "${target}".`)
  console.error(`   Searched for: ${candidateJsonc} or ${target}`)
  const available = findNamedLocalConfigs()
  if (available.length > 0) {
    console.error(`   Available local configurations:`)
    available.forEach(f => console.error(`     - ${f}`))
    console.error(`   Run "pnpm run deploy <name>" using the identifier part.`)
  }
  else {
    console.error(`   Tip: Copy wrangler.local.example.jsonc to wrangler.${target}.local.jsonc and configure your KV ID.`)
  }
  process.exit(1)
}

const configs = resolveConfigs(targetArg)

if (isDryRun) {
  console.log(`\n🔍 [Dry Run] Target configuration(s) resolved:`)
  configs.forEach(c => console.log(`   - ${c}`))
  console.log(`\n(Build and deploy skipped)\n`)
  process.exit(0)
}

console.log(`📦 Building Nuxt Cloudflare Worker package (NITRO_PRESET=cloudflare-module)...`)
execSync('npm run build:worker', { stdio: 'inherit', cwd })

console.log(`\n🚀 Deploying to ${configs.length} target(s): ${configs.join(', ')}`)

for (const cfg of configs) {
  console.log(`\n──────────────────────────────────────────────────────────`)
  console.log(`👉 Deploying target config: ${cfg}`)
  console.log(`──────────────────────────────────────────────────────────`)
  execSync(`npx wrangler deploy -c ${cfg}`, { stdio: 'inherit', cwd })
}

console.log(`\n✨ All Worker deployments completed successfully!`)
