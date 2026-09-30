# 🤖 Model Context Protocol (MCP) & Cloudflare WebMCP Guide

333shortlink features native first-class support for both the **Model Context Protocol (MCP)** specification and **Cloudflare WebMCP** (browser-based in-page agent runtime in Chrome 146+).

AI agents (such as Claude Desktop, Cursor, Cline, OpenCode, or browser-level agents) can directly interact with 333shortlink through structured tools to create, manage, query, and analyze short URLs without HTML scraping.

---

## 📡 Endpoints

| Endpoint                   | Path                                    | Protocol     | Purpose                                                  |
| :------------------------- | :-------------------------------------- | :----------- | :------------------------------------------------------- |
| **WebMCP / Root Endpoint** | `https://your-domain/mcp`               | JSON-RPC 2.0 | Standard MCP protocol endpoint & WebMCP discovery target |
| **API Path Endpoint**      | `https://your-domain/api/mcp`           | JSON-RPC 2.0 | Alternative API route for MCP clients                    |
| **WebMCP Browser Bridge**  | `https://your-domain/.webmcp/bridge.js` | JavaScript   | Client-side agent bridge injected into webpage           |

> 💡 **Auto-Discovery**: The root page automatically injects `<link rel="model-context" href="/mcp">` and `<meta name="model-context-protocol" content="/mcp">` into `<head>`. Supported AI browsers will detect and mount it automatically.

---

## 🛠️ Available AI Tools

| Tool Name            | Description                                                      | Authentication Required       | Parameters                                                                                                                  |
| :------------------- | :--------------------------------------------------------------- | :---------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| `shorten_url`        | Compress a target URL into a shortlink                           | No (Public)                   | `url` (required), `slug` (optional), `expiration` (e.g., `1d`, `7d`, `1h`), `comment` (optional), `isCustomSlug` (optional) |
| `lookup_link`        | Retrieve destination URL, expiration date, and creation metadata | No (Public)                   | `slug` (required)                                                                                                           |
| `list_links`         | Paginated listing of all shortlinks                              | **Yes** (Site Token required) | `limit` (optional, 1–100), `cursor` (optional), `token` (optional)                                                          |
| `delete_link`        | Permanently delete a shortlink and its search index              | **Yes** (Site Token required) | `slug` (required), `token` (optional)                                                                                       |
| `get_link_analytics` | Retrieve click counters and visitor analytics                    | **Yes** (Site Token required) | `slug` (required), `interval` (e.g., `24h`, `7d`, `30d`), `token` (optional)                                                |
| `get_service_info`   | Query 333shortlink version, endpoints, and capabilities          | No (Public)                   | None                                                                                                                        |

---

## 💻 Client Configuration

### Claude Desktop / Cursor / Cline Setup

Add the server to your `claude_desktop_config.json` or Cursor MCP settings:

```json
{
  "mcpServers": {
    "shortlink": {
      "url": "https://your-domain/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_NUXT_SITE_TOKEN"
      }
    }
  }
}
```

### Cloudflare WebMCP (Developer Preview)

If your domain is proxied through Cloudflare:

1. In Cloudflare Dashboard, navigate to your zone and enable **WebMCP Developer Preview**.
2. Point the target endpoint to `/mcp`.
3. Browser clients (such as Chrome 146+ with agent flags enabled) can directly call tools via `document.modelContext`.
