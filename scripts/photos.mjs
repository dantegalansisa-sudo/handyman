// Prepares phone photos for the portfolio ("Trabajos realizados").
//
//   1. Put the photos in  portfolio-inbox/<project-id>/   (any size, vertical or horizontal)
//   2. npm run photos
//   3. Paste the printed `photos: [...]` into that project in src/portfolio.ts
//
// Each photo is rotated using its EXIF orientation, resized and saved as WebP:
//   public/portfolio/<project-id>/<n>.webp     max 1600px long side  (viewer)
//   public/portfolio/<project-id>/<n>-sm.webp  max 700px long side   (grid)
// Metadata (GPS, camera info) is removed.
import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const INBOX = 'portfolio-inbox'
const OUT = 'public/portfolio'
const EXT = /\.(jpe?g|png|webp|tiff?|avif)$/i

const projects = (await readdir(INBOX, { withFileTypes: true }).catch(() => [])).filter((d) => d.isDirectory())
if (!projects.length) {
  console.log(`No folders in ${INBOX}/. Create ${INBOX}/<project-id>/ and drop the photos there.`)
  process.exit(0)
}

for (const dir of projects) {
  const files = (await readdir(path.join(INBOX, dir.name))).filter((f) => EXT.test(f)).sort()
  if (!files.length) continue
  const out = path.join(OUT, dir.name)
  await mkdir(out, { recursive: true })
  const photos = []
  for (const [i, file] of files.entries()) {
    const src = path.join(INBOX, dir.name, file)
    const n = i + 1
    const full = await sharp(src).rotate().resize(1600, 1600, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(out, `${n}.webp`))
    await sharp(src).rotate().resize(700, 700, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 74 }).toFile(path.join(out, `${n}-sm.webp`))
    const kind = full.height > full.width ? 'vertical' : full.width > full.height ? 'horizontal' : 'square'
    console.log(`  ${dir.name}/${file} → ${n}.webp  ${full.width}×${full.height} (${kind}, ${Math.round(full.size / 1024)} KB)`)
    photos.push(`    { src: '/portfolio/${dir.name}/${n}.webp', thumb: '/portfolio/${dir.name}/${n}-sm.webp', w: ${full.width}, h: ${full.height} },`)
  }
  console.log(`\n  ${dir.name}:\n  photos: [\n${photos.join('\n')}\n  ],\n`)
}
