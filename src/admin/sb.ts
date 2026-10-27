import { createClient } from '@supabase/supabase-js'
import { SUPABASE_KEY, SUPABASE_URL, hasBackend } from '../content'
import type { Photo } from '../portfolio'

export const sb = hasBackend ? createClient(SUPABASE_URL, SUPABASE_KEY) : null!

export const slugify = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'item'

const rand = () => Math.random().toString(36).slice(2, 8)

/** Resize on the phone before uploading: respects EXIF rotation, max `max` px, WebP (JPEG on browsers without WebP encoding). */
async function resize(file: File, max: number, quality: number): Promise<{ blob: Blob; w: number; h: number; ext: string }> {
  const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' })
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height))
  const w = Math.round(bmp.width * k)
  const h = Math.round(bmp.height * k)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  canvas.getContext('2d')!.drawImage(bmp, 0, 0, w, h)
  bmp.close()
  const toBlob = (type: string) => new Promise<Blob | null>((r) => canvas.toBlob(r, type, quality))
  let blob = await toBlob('image/webp')
  let ext = 'webp'
  if (!blob || blob.type !== 'image/webp') {
    blob = await toBlob('image/jpeg')
    ext = 'jpg'
  }
  return { blob: blob!, w, h, ext }
}

/** Uploads one phone photo as full (1600px) + thumbnail (700px). */
export async function uploadPhoto(file: File, folder: string): Promise<Photo> {
  const name = `${folder}/${Date.now()}-${rand()}`
  const [full, thumb] = await Promise.all([resize(file, 1600, 0.82), resize(file, 700, 0.76)])
  const put = async (path: string, blob: Blob) => {
    const { error } = await sb.storage.from('media').upload(path, blob, { contentType: blob.type, cacheControl: '31536000', upsert: false })
    if (error) throw error
    return sb.storage.from('media').getPublicUrl(path).data.publicUrl
  }
  const [src, sm] = await Promise.all([put(`${name}.${full.ext}`, full.blob), put(`${name}-sm.${thumb.ext}`, thumb.blob)])
  return { src, thumb: sm, w: full.w, h: full.h }
}

/** Removes uploaded files (ignores built-in /portfolio photos). */
export async function deletePhotos(photos: Photo[]) {
  const marker = '/storage/v1/object/public/media/'
  const paths = photos.flatMap((p) => [p.src, p.thumb ?? '']).filter((u) => u.includes(marker)).map((u) => u.split(marker)[1])
  if (paths.length) await sb.storage.from('media').remove(paths)
}
