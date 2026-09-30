export default defineAppConfig({
  title: '333shortlink',
  email: '',
  github: 'https://github.com/tbdavid2019/333shortlink',
  twitter: '',
  telegram: '',
  discord: '',
  blog: '',
  description: '現代化極速開源短網址服務。支援生物識別 Passkey 免密登入、即時訪客統計與全球地理分析、自定義中轉過渡跳轉頁面與開放 API，輕量高效且保障隱私。',
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
