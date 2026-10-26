import type { CategoryId, Lang } from './data'

/**
 * PORTFOLIO — "Trabajos realizados"
 *
 * Each project is one finished job. The shape is kept flat and simple so an
 * admin panel (or a JSON file / Supabase table later) can fill it directly:
 *
 *   one form  →  one Project
 *   one photo upload  →  one Photo  (w/h are read automatically from the file)
 *
 * Only `title`, `category` and at least one photo are required. Text can be
 * written in Spanish only — English falls back to Spanish (and vice-versa).
 *
 * Photos: any normal phone photo works, vertical or horizontal.
 * Run `npm run photos` to resize them (see docs/FOTOS-PORTAFOLIO.md).
 */

export type Text = { es?: string; en?: string }

export type Photo = {
  /** Full-size image (max 1600px long side). */
  src: string
  /** Small version for the grid (max 700px). Falls back to `src`. */
  thumb?: string
  /** Pixel size — tells the layout if the photo is vertical or horizontal. */
  w: number
  h: number
  caption?: Text
}

export type Project = {
  id: string
  title: Text
  category: CategoryId
  description?: Text
  /** Optional: ids from SERVICES (data.ts) done in this job — shown as tappable chips. */
  services?: string[]
  /** Town / municipio, e.g. "Bayamón". */
  town?: string
  /** "YYYY-MM" — used for sorting and the "Oct 2026" label. */
  date?: string
  /** First photo is the cover. */
  photos: Photo[]
  /** Optional matching before/after pair (same angle) → shows a drag slider. */
  beforeAfter?: { before: Photo; after: Photo }
  /** Show on the home page strip. */
  featured?: boolean
  /** Placeholder stock photo — remove when real job photos are added. */
  sample?: boolean
}

export const tx = (v: Text | undefined, lang: Lang) => (v ? v[lang] || v.es || v.en || '' : '')

export const orientation = (p: Photo) => (p.h > p.w * 1.08 ? 'portrait' : p.w > p.h * 1.08 ? 'landscape' : 'square')

export function monthLabel(date: string | undefined, lang: Lang) {
  if (!date) return ''
  const [y, m] = date.split('-').map(Number)
  return new Date(y, (m || 1) - 1, 1).toLocaleDateString(lang === 'es' ? 'es-PR' : 'en-US', { month: 'short', year: 'numeric' })
}

/* ---------- Sample data (stock photos) — replace with the client's real jobs ---------- */

const stock = (id: string, o: 'v' | 'h'): Photo => {
  const [w, h] = o === 'v' ? [1200, 1600] : [1600, 1200]
  const url = (W: number, H: number) => `https://images.unsplash.com/photo-${id}?w=${W}&h=${H}&fit=crop&q=75&auto=format`
  return { src: url(w, h), thumb: url(w / 2, h / 2), w, h }
}

export const PROJECTS: Project[] = [
  {
    id: 'bano-completo-bayamon',
    sample: true,
    featured: true,
    category: 'plumbing',
    title: { es: 'Remodelación de baño', en: 'Bathroom remodel' },
    description: {
      es: 'Instalación de toilet y lavamanos nuevos, losa de pared en la ducha y accesorios de baño.',
      en: 'New toilet and bathroom sink, shower wall tile and bathroom accessories.',
    },
    services: ['toilet', 'bath-sink', 'tile-wall', 'bath-acc'],
    town: 'Bayamón',
    date: '2026-09',
    photos: [stock('1569597967185-cd6120712154', 'v'), stock('1595514535116-d0401260e7cf', 'v'), stock('1625646333826-c30c4e4d73d2', 'h')],
  },
  {
    id: 'sellado-techo-caguas',
    sample: true,
    featured: true,
    category: 'washing',
    title: { es: 'Lavado y sellado de techo', en: 'Roof wash & seal' },
    description: {
      es: 'Lavado a presión de 1,400 pies² de techo y sellado impermeabilizante en dos capas.',
      en: 'Pressure washed a 1,400 sq ft roof and applied two coats of waterproof sealer.',
    },
    services: ['wash', 'roof-seal'],
    town: 'Caguas',
    date: '2026-08',
    photos: [stock('1674485169641-bcb2bf6f1df9', 'h'), stock('1718152521364-b9655b8a7926', 'h')],
  },
  {
    id: 'tv-paneles-sala',
    sample: true,
    featured: true,
    category: 'handyman',
    title: { es: 'Pared de TV con paneles PVC', en: 'TV wall with PVC panels' },
    description: {
      es: 'Paneles decorativos PVC, base para TV de 70″ y cables escondidos.',
      en: 'Decorative PVC panels, 70″ TV mount and hidden cables.',
    },
    services: ['pvc-panels', 'tv-70'],
    town: 'San Juan',
    date: '2026-09',
    photos: [stock('1633604712918-6ab1173d0ecd', 'v'), stock('1521607630287-ee2e81ad3ced', 'h')],
  },
  {
    id: 'cargador-ev',
    sample: true,
    featured: true,
    category: 'electrical',
    title: { es: 'Cargador para carro eléctrico', en: 'EV charger install' },
    description: {
      es: 'Instalación de cargador en marquesina con breaker dedicado.',
      en: 'Garage EV charger with a dedicated breaker.',
    },
    services: ['ev', 'panel'],
    town: 'Guaynabo',
    date: '2026-07',
    photos: [stock('1704474618942-ae933a8edd86', 'v'), stock('1544724569-5f546fd6f2b5', 'v')],
  },
  {
    id: 'pintura-sala',
    sample: true,
    category: 'painting',
    title: { es: 'Pintura interior de sala y comedor', en: 'Living & dining room paint' },
    description: { es: 'Unos 650 pies² de paredes, dos capas.', en: 'About 650 sq ft of walls, two coats.' },
    services: ['paint-in'],
    town: 'Carolina',
    date: '2026-06',
    photos: [stock('1717281234297-3def5ae3eee1', 'h'), stock('1786053538161-501fbdd89629', 'h')],
  },
  {
    id: 'cocina-mezcladora',
    sample: true,
    category: 'plumbing',
    title: { es: 'Mezcladora y triturador de cocina', en: 'Kitchen faucet & disposal' },
    description: { es: 'Cambio de mezcladora de fregadero e instalación de triturador.', en: 'Kitchen faucet swap and garbage disposal install.' },
    services: ['kitchen-faucet', 'disposal'],
    town: 'Trujillo Alto',
    date: '2026-05',
    photos: [stock('1629078692818-c5a0443f4ae3', 'v'), stock('1757787697646-e84d5490add1', 'v')],
  },
  {
    id: 'losa-piso',
    sample: true,
    category: 'tile',
    title: { es: 'Losa de piso en terraza', en: 'Patio floor tile' },
    description: { es: 'Unos 300 pies² de losa de piso con nivelación previa.', en: 'About 300 sq ft of floor tile over a leveled base.' },
    services: ['concrete-floor', 'tile-floor'],
    town: 'Dorado',
    date: '2026-04',
    photos: [stock('1523413307857-ef24c53571ae', 'h'), stock('1656646523907-97b094c7e63a', 'v')],
  },
  {
    id: 'puerta-exterior',
    sample: true,
    category: 'handyman',
    title: { es: 'Puerta exterior nueva', en: 'New exterior door' },
    description: { es: 'Instalación de puerta exterior con cerradura.', en: 'Exterior door installed with lockset.' },
    services: ['door-out'],
    town: 'Bayamón',
    date: '2026-03',
    photos: [stock('1536160885591-301854e2ed04', 'v')],
  },
]

/** Newest first. Swap this for a fetch from the admin backend later. */
export function getProjects(): Project[] {
  return [...PROJECTS].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
}
