export default defineAppConfig({
  title: '333shortlink',
  email: '',
  github: 'https://github.com/tbdavid2019/333shortlink',
  twitter: '',
  telegram: '',
  discord: '',
  blog: '',
  description: '基於 Cloudflare Workers 與 KV 構建的現代化極速開源短網址服務。支援生物識別 Passkey 免密登入、即時訪客數據分析與 3D 地球儀、WebMCP AI Agent 協議整合以及客製化中轉跳轉頁面。',
  image: '/banner.png',
  previewTTL: 300, // 5 minutes
  slugRegex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/i,
  reserveSlug: [
    'dashboard',
    'mcp',
    '.webmcp',
    'api',
  ],
})
