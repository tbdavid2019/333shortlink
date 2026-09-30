export const LLMS_TXT = `# 333shortlink

> 333shortlink is an open-source, serverless URL shortener and real-time analytics service built on Cloudflare Workers (with Static Assets), Cloudflare Workers KV, and Nuxt 4.

333shortlink provides fast URL redirection, detailed visitor analytics, biometric Passkey authentication (WebAuthn), and native support for AI agents through the Model Context Protocol (MCP) and Google Chrome WebMCP.

## AI & Agent Endpoints

- [Model Context Protocol Endpoint](/mcp): JSON-RPC 2.0 endpoint implementing the Model Context Protocol (MCP) and Cloudflare WebMCP. Accepts POST requests with methods \`initialize\`, \`ping\`, \`tools/list\`, \`tools/call\`, \`resources/list\`, and \`resources/read\`.
- [WebMCP Browser Bridge](/.webmcp/bridge.js): Client-side JavaScript bridge enabling in-page AI agents (Chrome 146+ with \`#enable-webmcp-testing\` or Cloudflare BrowserRun) to call shortener tools directly through \`document.modelContext\`.
- [OpenAPI Specification](/swagger.json): OpenAPI 3.0 specification covering all REST API endpoints.

## Core Agent Tools

- \`shorten_url\`: Shorten a destination URL into a fast, trackable shortlink with optional custom slug, expiration (e.g. \`1h\`, \`24h\`, \`7d\`, \`30d\`), and notes. Public tool.
- \`lookup_link\`: Retrieve destination URL, creation timestamp, and expiration metadata for a given slug. Public tool.
- \`list_links\`: Paginated listing of stored shortlinks with full metadata. Requires \`Authorization: Bearer <NUXT_SITE_TOKEN>\`.
- \`delete_link\`: Delete an existing shortlink. Marked with \`consequentialHint: true\` to request confirmation before permanent deletion. Requires Site Token.
- \`get_link_analytics\`: Query access statistics, visitor counts, and referrers for a given slug. Requires Site Token.
- \`get_service_info\`: Query service status, running version, and WebMCP protocol capabilities. Public tool.

## Documentation & Developer Guides

- [Project Overview & Quickstart](/docs/deployment/workers.md): 5-minute setup and deployment guide for Cloudflare Workers.
- [WebMCP & MCP Protocol Guide](/docs/mcp.md): Specifications and client setup instructions for Claude Desktop, Cursor, and Chrome WebMCP.
- [Transition Pages & Tracking Guide](/docs/transition-page.md): Guide for countdown interstitial pages, GA4, Meta Pixel, and LINE LIFF integration.
- [Security & Passkeys Guide](/docs/security.md): WebAuthn biometric login, HMAC challenges, single-use anti-replay protection, and Site Token configuration.
- [REST API Reference](/docs/api.md): Complete HTTP endpoints, parameter schemas, and response formats.
- [Configuration Reference](/docs/configuration.md): Runtime environment variables and configuration options.

## Optional

- [Full Documentation](/llms-full.txt): Complete concatenated documentation file for LLM context ingestion.
`

export const LLMS_FULL_TXT = `# 333shortlink — Full Documentation for LLMs

> 333shortlink is an open-source, serverless URL shortener and real-time analytics service built on Cloudflare Workers (with Static Assets), Cloudflare Workers KV, and Nuxt 4.

---

## 1. System Architecture

- **Runtime**: Cloudflare Workers (V8 Edge isolates with \`nodejs_compat\`)
- **Frontend**: Nuxt 4, Vue 3, Tailwind CSS, shadcn-vue
- **Primary Storage**: Cloudflare Workers KV (stores link metadata, random slug indices, challenge tokens)
- **Analytics & Metrics**: Cloudflare Workers Analytics Engine (stores event logs and visitor metrics)
- **AI Integrations**: Cloudflare Workers AI (\`@cf/meta/llama-3.1-8b-instruct\`), Model Context Protocol (MCP), and Google Chrome WebMCP

---

## 2. Machine-Readable Endpoints

- \`POST /mcp\` — Model Context Protocol JSON-RPC 2.0 endpoint (public and authenticated tools)
- \`POST /api/mcp\` — Alternative MCP endpoint route
- \`GET /.webmcp/bridge.js\` — Client-side WebMCP bridge for browser AI agents
- \`GET /llms.txt\` — Concise machine-readable summary according to llmstxt.org
- \`GET /llms-full.txt\` — This complete documentation file
- \`GET /swagger.json\` — OpenAPI 3.0 specification for REST clients

---

## 3. Model Context Protocol (MCP) & WebMCP Specification

### Protocol Details
- **Protocol Version**: \`2024-11-05\`
- **Transport**: HTTP POST with JSON-RPC 2.0
- **Supported Methods**: \`initialize\`, \`ping\`, \`tools/list\`, \`tools/call\`, \`resources/list\`, \`resources/read\`
- **WebMCP Integration**: Chrome 146+ via \`document.modelContext.registerTool()\` and Cloudflare WebMCP edge injection

### Tools Schema

#### \`shorten_url\`
- **Description**: Shortens a destination URL into a fast, trackable shortlink. Reuses existing random slugs for identical destination URLs.
- **Annotations**: \`readOnlyHint: false\`, \`consequentialHint: false\`, \`untrustedContentHint: false\`
- **Authentication**: Public (unless restricted by server configuration)
- **Parameters**:
  - \`url\` (string, required): Destination target URL (must start with \`http://\` or \`https://\`).
  - \`slug\` (string, optional): Custom slug.
  - \`expiration\` (string, optional): Expiration period (e.g. \`1h\`, \`24h\`, \`7d\`, \`30d\`, \`1y\`) or Unix timestamp.
  - \`comment\` (string, optional): Internal note/comment.
  - \`title\` (string, optional): OpenGraph preview card title.
  - \`description\` (string, optional): OpenGraph preview card description.
  - \`isCustomSlug\` (boolean, optional): Set to true for explicit custom slugs.

#### \`lookup_link\`
- **Description**: Looks up destination URL, creation timestamp, and expiration details of an existing shortlink.
- **Annotations**: \`readOnlyHint: true\`, \`consequentialHint: false\`, \`untrustedContentHint: false\`
- **Parameters**:
  - \`slug\` (string, required): The slug identifier.

#### \`list_links\`
- **Description**: Paginated listing of stored short links.
- **Annotations**: \`readOnlyHint: true\`, \`consequentialHint: false\`, \`untrustedContentHint: false\`
- **Authentication**: Required (\`Authorization: Bearer <NUXT_SITE_TOKEN>\` or \`token\` argument).
- **Parameters**:
  - \`limit\` (number, optional, 1–100, default: 20): Maximum items to return.
  - \`cursor\` (string, optional): Pagination cursor.
  - \`token\` (string, optional): Site Token if header is not present.

#### \`delete_link\`
- **Description**: Permanently deletes an existing shortlink and removes its URL index.
- **Annotations**: \`readOnlyHint: false\`, \`consequentialHint: true\`, \`untrustedContentHint: false\`
- **Authentication**: Required.
- **Parameters**:
  - \`slug\` (string, required): The slug of the short link to delete.

#### \`get_link_analytics\`
- **Description**: Queries click statistics and visitor metrics from Cloudflare Analytics Engine.
- **Annotations**: \`readOnlyHint: true\`, \`consequentialHint: false\`, \`untrustedContentHint: false\`
- **Authentication**: Required.
- **Parameters**:
  - \`slug\` (string, required): Slug identifier.
  - \`interval\` (string, optional): \`'24h' | '7d' | '30d' | 'all'\`, default \`'7d'\`.

#### \`get_service_info\`
- **Description**: Retrieves service version, configuration status, and WebMCP capabilities.
- **Annotations**: \`readOnlyHint: true\`, \`consequentialHint: false\`, \`untrustedContentHint: false\`
- **Parameters**: None.

---

## 4. REST API Endpoints

- \`POST /api/link/create\` — Create a new shortlink (\`{ url, slug?, expiration?, comment? }\`)
- \`POST /api/link/upsert\` — Create or update an existing shortlink
- \`DELETE /api/link/delete\` — Delete a shortlink (\`{ slug }\`)
- \`GET /api/link/list\` — List shortlinks with pagination (\`?limit=20&cursor=...\`)
- \`GET /api/link/ai\` — Generate semantic shortlink slug using Cloudflare Workers AI (\`?url=...\`)
- \`GET /api/stats/counters\` — Aggregated visit counts, unique visitors, and referrers
- \`GET /api/stats/views\` — Time-series view trends (\`?unit=day&timezone=Asia/Taipei\`)
- \`GET /api/stats/metrics\` — Categorized breakdown metrics (\`?type=referer|browser|os|country\`)
- \`GET /api/logs/events\` — Real-time click log stream
- \`GET /api/logs/locations\` — Geographic coordinates for real-time 3D globe visualization

---

## 5. Security & Authentication

- **Biometric Passkeys (WebAuthn)**: Touch ID, Face ID, Windows Hello, and security keys.
- **Anti-Replay Protection**: Challenges are HMAC-signed tokens with 120-second dynamic TTL and single-use consumption in Cloudflare KV.
- **Site Token**: Configured via \`NUXT_SITE_TOKEN\` environment variable. Multiple tokens can be comma-separated. Required for API and MCP management tools.
- **Origin Isolation**: WebMCP APIs are origin-isolated and respect Chrome Permissions Policy \`tools=("self")\`.

---

## 6. Deployment Guide

1. Clone repository: \`git clone https://github.com/tbdavid2019/333shortlink.git\`
2. Install dependencies: \`pnpm install\`
3. Create KV Namespace: \`npx wrangler kv namespace create KV\`
4. Copy \`wrangler.local.example.jsonc\` to \`wrangler.local.jsonc\` and set the \`id\` field.
5. Deploy: \`pnpm run deploy\`
`
