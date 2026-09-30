// WebMCP Client Bridge for 333shortlink URL Shortener
// Enables browser AI agents (Chrome 146+, Cloudflare BrowserRun) to interact directly with 333shortlink tools
// Specification: https://developer.chrome.com/docs/ai/webmcp

(async function initWebMCPBridge() {
  if (typeof window === 'undefined') {
    return
  }

  const modelContext = navigator.modelContext || document.modelContext
  if (!modelContext || typeof modelContext.registerTool !== 'function') {
    return
  }

  // Note: document.currentScript is always null inside <script type="module">
  const scriptElement = document.querySelector('script[data-mcp-url]')
    || document.querySelector('script[src*="/.webmcp/bridge.js"]')
    || document.currentScript
  const mcpUrl = scriptElement?.getAttribute('data-mcp-url') || '/mcp'

  try {
    const discoveryRes = await fetch(mcpUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'webmcp-init',
        method: 'tools/list',
        params: {},
      }),
    })

    if (!discoveryRes.ok) {
      return
    }
    const data = await discoveryRes.json()
    const tools = data?.result?.tools || []

    for (const tool of tools) {
      modelContext.registerTool({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
        ...(tool.annotations ? { annotations: tool.annotations } : {}),
        execute: async (args, options = {}) => {
          const callRes = await fetch(mcpUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: options.signal,
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: `webmcp-call-${Date.now()}`,
              method: 'tools/call',
              params: {
                name: tool.name,
                arguments: args,
              },
            }),
          })
          const callData = await callRes.json()
          return callData?.result || callData
        },
      })
    }
  }
  catch (err) {
    console.debug('[WebMCP] Bridge initialization skipped:', err)
  }
})()
