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

### Cloudflare WebMCP & Google Chrome WebMCP Native Agent

333shortlink implements the official [Google Chrome WebMCP specification](https://developer.chrome.com/docs/ai/webmcp) and Cloudflare WebMCP bridge.

#### 1. In-Browser Agent Integration (`document.modelContext`)

When visiting 333shortlink in a browser supporting WebMCP (Chrome 146+ or with WebMCP flags enabled), the client-side bridge (`app/plugins/webmcp.client.ts` and `public/.webmcp/bridge.js`) registers tools into the browser's model context:

```typescript
document.modelContext.registerTool({
  name: 'shorten_url',
  description: 'Shorten a destination URL into a fast, trackable short link...',
  annotations: {
    readOnlyHint: false,
    consequentialHint: false,
    untrustedContentHint: false,
  },
  inputSchema: {
    type: 'object',
    properties: { url: { type: 'string' } },
  },
  execute: async (args: Record<string, any>, options: { signal?: AbortSignal } = {}) => {
    // Passes options.signal (AbortSignal) to allow agent cancellation
    return await fetch('/mcp', {
      method: 'POST',
      signal: options.signal,
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'shorten_url', arguments: args } }),
    })
  },
})
```

#### 2. Chrome WebMCP Annotations & Safety Model

All tools adhere to Chrome WebMCP annotations:

- **`readOnlyHint`**: Set to `true` for idempotent query tools (`lookup_link`, `list_links`, `get_link_analytics`, `get_service_info`) to inform AI models that execution will not alter state.
- **`consequentialHint`**: Set to `true` on destructive operations (`delete_link`). This prompts AI agents and Chrome's agent UI to request explicit user confirmation before executing.
- **`untrustedContentHint`**: Notifies models when inputs/outputs contain external user-submitted strings.
- **`AbortSignal` Support**: The `execute` function accepts `{ signal?: AbortSignal }`, allowing agents or users to cancel long-running or stalled tool requests.

#### 3. How to Test WebMCP Locally in Chrome

1. Open Chrome and navigate to `chrome://flags/#enable-webmcp-testing`.
2. Set the flag to **Enabled** and restart Chrome.
3. Install the **Model Context Tool Inspector** Chrome extension from the Chrome Web Store.
4. Visit your 333shortlink deployment or `http://localhost:3000`.
5. Open Chrome DevTools > **WebMCP** panel to view registered tools, inspect schemas, and simulate tool calls.

---

## 📄 LLM & Agent Documentation Discovery (`llms.txt`)

Following the [llmstxt.org](https://llmstxt.org/) specification, 333shortlink provides structured, machine-readable summaries for AI agents and LLMs:

- **[`/llms.txt`](/llms.txt)**: Concise index of endpoints, available MCP tools, parameters, and documentation links.
- **[`/llms-full.txt`](/llms-full.txt)**: Concatenated complete markdown documentation optimized for LLM context windows.
- **HTML Discovery**: `<head>` automatically includes:
  ```html
  <link rel="help" type="text/markdown" href="/llms.txt" title="LLMs.txt" />
  <link rel="alternate" type="text/markdown" href="/llms.txt" title="LLMs.txt" />
  ```
