import { Buffer } from 'node:buffer'
import path from 'node:path'
import sharp from 'sharp'

const cwd = process.cwd()

const badgeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="brandLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#047857" />
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="26" fill="url(#brandLogoGrad)" />
  <g transform="translate(14, 14) scale(3)" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M4 8h2.5a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1 -1.5 1.5h-1.5h1.5a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1 -1.5 1.5h-2.5" />
    <path d="M10 8h2.5a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1 -1.5 1.5h-1.5h1.5a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1 -1.5 1.5h-2.5" />
    <path d="M16 8h2.5a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1 -1.5 1.5h-1.5h1.5a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1 -1.5 1.5h-2.5" />
  </g>
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
