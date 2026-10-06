import { Buffer } from 'node:buffer'
import path from 'node:path'
import sharp from 'sharp'

const cwd = process.cwd()

const badgeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="brandLogoOliveGrad" x1="15%" y1="0%" x2="85%" y2="100%">
      <stop offset="0%" stop-color="#668235" />
      <stop offset="48%" stop-color="#4c6224" />
      <stop offset="100%" stop-color="#303e16" />
    </linearGradient>
    <linearGradient id="brandLogoOliveBorder" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.35)" />
      <stop offset="100%" stop-color="rgba(255,255,255,0.06)" />
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="25" fill="url(#brandLogoOliveGrad)" />
  <rect x="0.75" y="0.75" width="98.5" height="98.5" rx="24.25" fill="none" stroke="url(#brandLogoOliveBorder)" stroke-width="1.5" />
  <text x="50" y="48" text-anchor="middle" fill="#ffffff" font-family="PingFang TC, Noto Sans TC, Heiti TC, Microsoft JhengHei, system-ui, sans-serif" font-weight="900" font-size="40" letter-spacing="-0.5">333</text>
  <text x="50.5" y="81" text-anchor="middle" fill="#e7f2d5" font-family="PingFang TC, Noto Sans TC, Heiti TC, Microsoft JhengHei, system-ui, sans-serif" font-weight="800" font-size="26" letter-spacing="2">短址</text>
</svg>`

async function generate() {
  console.log('🎨 Generating brand icon assets from 333 badge SVG...')

  const badgeBuffer = Buffer.from(badgeSvg)

  // 1. App icons
  await sharp(badgeBuffer).resize(512, 512).png().toFile(path.join(cwd, 'public/android-chrome-512x512.png'))
  await sharp(badgeBuffer).resize(512, 512).png().toFile(path.join(cwd, 'public/icon.png'))
  await sharp(badgeBuffer).resize(192, 192).png().toFile(path.join(cwd, 'public/android-chrome-192x192.png'))
  await sharp(badgeBuffer).resize(192, 192).png().toFile(path.join(cwd, 'public/icon-192.png'))
  await sharp(badgeBuffer).resize(180, 180).png().toFile(path.join(cwd, 'public/apple-touch-icon.png'))
  await sharp(badgeBuffer).resize(180, 180).png().toFile(path.join(cwd, 'public/apple-touch-icon-precomposed.png'))
  await sharp(badgeBuffer).resize(128, 128).png().toFile(path.join(cwd, 'public/sink.png'))
  await sharp(badgeBuffer).resize(64, 64).png().toFile(path.join(cwd, 'public/favicon.ico'))

  console.log('✅ App icons updated!')

  // 2. Banner
  console.log('🖼️  Generating public/banner.png (1200x630) from public/banner.svg...')
  const bannerSvgPath = path.join(cwd, 'public/banner.svg')
  const bannerPngPath = path.join(cwd, 'public/banner.png')

  await sharp(bannerSvgPath)
    .resize(1200, 630)
    .png({ quality: 95 })
    .toFile(bannerPngPath)

  console.log('✅ public/banner.png generated successfully!')
}

generate().catch((err) => {
  console.error('❌ Error generating assets:', err)
  process.exit(1)
})
