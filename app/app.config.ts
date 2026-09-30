export default defineAppConfig({
  title: 'Sink',
  email: '104@david888.com',
  github: 'https://github.com/tbdavid2019/sinkurl',
  twitter: 'https://x.com/oobwei',
  telegram: 'https://t.me/a6a7a8a9abc',
  discord: 'https://discord.gg/9BCGcgCWpj',
  blog: 'https://blog.david888.com',
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
