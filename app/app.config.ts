export default defineAppConfig({
  title: '333shortlink',
  email: '',
  github: 'https://github.com/tbdavid2019/333shortlink',
  twitter: '',
  telegram: '',
  discord: '',
  blog: '',
  description: '短網址',
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
