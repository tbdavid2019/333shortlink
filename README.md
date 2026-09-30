<div align="center">

# ⚡ 333shortlink

**Modern, lightweight, and blazingly fast serverless URL shortener built on Cloudflare Workers, KV, and Nuxt 4.**

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](LICENSE)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare)](https://workers.cloudflare.com/)
[![Nuxt 4](https://img.shields.io/badge/Nuxt-4.x-00DC82?logo=nuxt.js)](https://nuxt.com/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-6E9F18?logo=vitest)](https://vitest.dev/)

[English](README.md) | [繁體中文](README.zh-TW.md) | [简体中文](README.zh-CN.md)

</div>

---

## ✨ Features

- ⚡ **100% Serverless**: Powered by Cloudflare Workers (with Static Assets), KV, and Analytics Engine. Zero server maintenance, zero cold starts, global edge latency.
- 🌐 **Dynamic Multi-Domain Branding**: Automatically adapts dashboard branding and breadcrumbs to the visited host domain without code changes.
- 🪪 **Biometric Passkeys (WebAuthn)**: One-click passwordless login via Touch ID, Face ID, Windows Hello, and security keys with single-use replay protection.
- 🤖 **WebMCP & MCP Protocol Native**: Built-in support for Model Context Protocol (MCP), Google Chrome WebMCP (Chrome 146+ in-browser agents with `consequentialHint` safety annotations), and Claude/Cursor.
- 📄 **LLMs.txt Standard**: Built-in [`/llms.txt`](public/llms.txt) and [`/llms-full.txt`](public/llms-full.txt) following [llmstxt.org](https://llmstxt.org/) for AI agents and LLM ingestion.
- 🔁 **Smart Random Slug Deduplication**: Reuses existing random shortlinks for identical target URLs while preserving custom slugs.
- 🧠 **AI-Generated Slugs**: Integrated Cloudflare Workers AI for semantic, memorable slug recommendations.
- 🧭 **Transition Pages & Tracking**: Intermediate landing pages with countdowns, custom HTML, and integrations for GA4, Meta Pixel, and LINE LIFF.
- 📊 **Real-time Analytics**: Built-in 3D globe and detailed visitor metrics (referrers, devices, geolocations, and views).

---

## 🧱 Tech Stack

| Layer                   | Technology                                                                                                                                                              |
| :---------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fullstack Framework** | [Nuxt 4](https://nuxt.com/) (Vue 3, Vite, Tailwind CSS, shadcn-vue)                                                                                                     |
| **Compute & Edge**      | [Cloudflare Workers with Static Assets](https://developers.cloudflare.com/workers/)                                                                                     |
| **Key-Value Database**  | [Cloudflare Workers KV](https://developers.cloudflare.com/kv/)                                                                                                          |
| **Metrics & Analytics** | [Cloudflare Workers Analytics Engine](https://developers.cloudflare.com/analytics/)                                                                                     |
| **AI Protocol**         | [Model Context Protocol (MCP)](https://modelcontextprotocol.io/), [Chrome WebMCP](https://developer.chrome.com/docs/ai/webmcp), and [llmstxt.org](https://llmstxt.org/) |

---

## 🚀 Quickstart

### Prerequisites

- **Node.js**: `>= 22.18`
- **Package Manager**: `pnpm` (`>= 10`)
- **Cloudflare Account**: Free tier is sufficient

### 1. Clone & Install

```bash
git clone https://github.com/tbdavid2019/333shortlink.git
cd 333shortlink
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Set your administrative access token in `.env`:

```env
NUXT_SITE_TOKEN=your-secure-site-token
```

### 3. Local Development

```bash
pnpm dev
```

Visit `http://localhost:3000`. Wrangler automatically emulates Cloudflare KV and AI locally—no cloud connection required.

### 4. Deploy to Cloudflare Workers

1. Login to Cloudflare:
   ```bash
   cf auth login
   # or
   npx wrangler login
   ```
2. Create your cloud KV namespace:
   ```bash
   npx wrangler kv namespace create KV
   ```
3. Copy the template and add your KV ID (this file is `.gitignore`d to prevent leaking IDs):
   ```bash
   cp wrangler.local.example.jsonc wrangler.local.jsonc
   ```
4. Deploy:
   ```bash
   pnpm run deploy
   ```

---

## 📚 Documentation

Detailed guides and specifications are modularized in the [`docs/`](docs/) directory:

- 🚀 **[Workers Deployment Guide](docs/deployment/workers.md)**: Full production deployment and multi-tenant accounts setup.
- 🤖 **[WebMCP & MCP Protocol Guide](docs/mcp.md)**: Connect Claude Desktop, Cursor, and Chrome 146+ agents.
- 📄 **[LLMs.txt Standard](public/llms.txt)**: Machine-readable documentation and tool summary following [llmstxt.org](https://llmstxt.org/).
- 🧭 **[Transition Page & Tracking Guide](docs/transition-page.md)**: Configure interstitial pages, GA4, Meta Pixel, and LINE LIFF.
- 🔐 **[Security & Passkeys Guide](docs/security.md)**: Biometric authentication, challenge tokens, and anti-replay protection.
- 📡 **[REST API Reference](docs/api.md)**: API endpoints and payload schemas.
- ⚙️ **[Configuration Reference](docs/configuration.md)**: Environment variables and runtime configuration options.

---

## 🏢 Multi-Site Deployments

Deploy the same codebase to multiple Cloudflare accounts or domains without changing code:

```bash
# Deploy to a specific named site (reads wrangler.<site>.local.jsonc)
pnpm run deploy siteA

# Batch deploy to all configured local sites in sequence
pnpm run deploy all
```

---

## 🧪 Testing & Code Quality

```bash
# Run ESLint & Tailwind checks
pnpm lint

# Run all 56 Vitest test suites (Redirects, KV, Passkeys, WebMCP)
pnpm test
```

---

## 💖 Acknowledgments

Originally evolved from [miantiao-me/Sink](https://github.com/miantiao-me/Sink). Special thanks to all open-source contributors!

---

## 📄 License

Licensed under the [GNU Affero General Public License v3.0 (AGPL-3.0)](LICENSE).
