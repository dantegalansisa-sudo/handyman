import type { CategoryId, Lang } from './data'

/**
 * PORTFOLIO — "Trabajos realizados"
 *
 * Each project is one finished job, kept flat so the admin panel can store it
 * as-is (one form → one Project, one photo upload → one Photo).
 *
 * Only `title`, `category` and at least one photo are required. Text can be
 * written in Spanish only — English falls back to Spanish (and vice-versa).
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
  /** "YYYY-MM" — used for the "Oct 2026" label. */
  date?: string
  /** First photo is the cover. */
  photos: Photo[]
  /** Optional matching before/after pair (same angle) → shows a drag slider. */
  beforeAfter?: { before: Photo; after: Photo }
  /** Show on the home page. */
  featured?: boolean
  /** Placeholder stock photo — shows a "Sample photo" tag. */
  sample?: boolean
}

export const tx = (v: Text | undefined, lang: Lang) => (v ? v[lang] || v.es || v.en || '' : '')

export const orientation = (p: Photo) => (p.h > p.w * 1.08 ? 'portrait' : p.w > p.h * 1.08 ? 'landscape' : 'square')

export function monthLabel(date: string | undefined, lang: Lang) {
  if (!date) return ''
  const [y, m] = date.split('-').map(Number)
  return new Date(y, (m || 1) - 1, 1).toLocaleDateString(lang === 'es' ? 'es-PR' : 'en-US', { month: 'short', year: 'numeric' })
}

/* ---------- Real jobs (photos sent by the client, processed with `npm run photos`) ---------- */

const done: Text = { es: 'Terminado', en: 'Finished' }
const progress: Text = { es: 'En proceso', en: 'In progress' }
const before: Text = { es: 'Antes', en: 'Before' }

/** Builds the Photo list for /public/portfolio/<id>/<n>.webp */
const pics = (id: string, sizes: [number, number, Text?][]): Photo[] =>
  sizes.map(([w, h, caption], i) => ({ src: `/portfolio/${id}/${i + 1}.webp`, thumb: `/portfolio/${id}/${i + 1}-sm.webp`, w, h, caption }))

export let PROJECTS: Project[] = [
  {
    id: 'pared-tv-paneles',
    featured: true,
    category: 'handyman',
    title: { es: 'Pared de TV con paneles decorativos', en: 'TV feature wall with decorative panels' },
    description: {
      es: 'Transformamos una sala vacía en un espacio moderno: pared de acento oscura, paneles decorativos tipo listón, TV montado y mueble flotante.',
      en: 'We turned a bare living room into a modern space: dark accent wall, slatted decorative panels, mounted TV and a floating console.',
    },
    services: ['pvc-panels', 'tv-70'],
    photos: pics('pared-tv-paneles', [[1200, 1600, done], [1200, 1600, progress], [1200, 1600, before]]),
  },
  {
    id: 'bano-remodelado',
    featured: true,
    category: 'plumbing',
    title: { es: 'Remodelación de baño', en: 'Bathroom remodel' },
    description: {
      es: 'Plomería nueva dentro de la pared para la ducha, instalación de toilet y gabinete con lavamanos. Un baño limpio y moderno de principio a fin.',
      en: 'New in-wall shower plumbing, toilet installation and vanity with sink. A clean, modern bathroom from start to finish.',
    },
    services: ['shower-valve', 'toilet', 'bath-sink'],
    photos: pics('bano-remodelado', [[900, 1600, done], [900, 1600, { es: 'Plomería de la ducha', en: 'Shower plumbing' }], [900, 1600, progress]]),
  },
  {
    id: 'panel-electrico',
    featured: true,
    category: 'electrical',
    title: { es: 'Instalación de panel eléctrico', en: 'Electrical panel installation' },
    description: {
      es: 'Caja de breakers nueva con circuitos organizados y cableado ordenado, lista para pasar inspección.',
      en: 'New breaker box with organized circuits and clean wiring, ready for inspection.',
    },
    services: ['panel'],
    photos: pics('panel-electrico', [[900, 1600, { es: 'Cableado del panel', en: 'Panel wiring' }], [900, 1600, progress], [900, 1600], [1200, 1600, done]]),
  },
  {
    id: 'lavamanos-y-gabinete',
    featured: true,
    category: 'plumbing',
    title: { es: 'Lavamanos y gabinete de baño', en: 'Bathroom sink & vanity' },
    description: {
      es: 'Instalación de gabinete flotante con lavamanos de sobreponer, mezcladora y conexiones de agua y desagüe.',
      en: 'Floating vanity with vessel sink, faucet, and water and drain connections.',
    },
    services: ['bath-sink'],
    photos: pics('lavamanos-y-gabinete', [[900, 1600, done], [900, 1600], [900, 1600, before], [900, 1600, { es: 'Conexiones', en: 'Connections' }]]),
  },
  {
    id: 'muro-de-bloques',
    featured: true,
    category: 'concrete',
    title: { es: 'Construcción de muro en bloques', en: 'Concrete block wall' },
    description: {
      es: 'Levantamos un muro perimetral en bloques de hormigón con varilla y lo terminamos empañetado.',
      en: 'We built a reinforced concrete-block perimeter wall and finished it with stucco.',
    },
    photos: pics('muro-de-bloques', [[1600, 900, done], [1600, 900, progress], [900, 1600, { es: 'Bloques con varilla', en: 'Reinforced blocks' }], [900, 1600, done]]),
  },
  {
    id: 'cargador-carro-electrico',
    featured: true,
    category: 'electrical',
    title: { es: 'Cargador para carro eléctrico', en: 'EV charger installation' },
    description: {
      es: 'Cargador de pared instalado en marquesina con tubería eléctrica, verificado con medición de voltaje.',
      en: 'Wall charger installed in the carport with electrical conduit, verified with a voltage reading.',
    },
    services: ['ev'],
    photos: pics('cargador-carro-electrico', [[1200, 1600, done], [1200, 1600, { es: 'Prueba de voltaje', en: 'Voltage test' }]]),
  },
  {
    id: 'calentadores-de-agua',
    category: 'plumbing',
    title: { es: 'Instalación de calentadores de agua', en: 'Water heater installations' },
    description: {
      es: 'Calentador de línea, calentador solar en techo y calentador de tanque: instalados con sus conexiones de agua.',
      en: 'Tankless, rooftop solar and tank water heaters, installed with their water connections.',
    },
    services: ['water-heater', 'water-heater-tank'],
    photos: pics('calentadores-de-agua', [[900, 1600, { es: 'Calentador de línea', en: 'Tankless heater' }], [1600, 900, { es: 'Calentador solar', en: 'Solar heater' }], [900, 1600, { es: 'Calentador de tanque', en: 'Tank heater' }]]),
  },
  {
    id: 'sistema-cisterna-bomba',
    category: 'plumbing',
    title: { es: 'Cisterna con bomba de presión', en: 'Cistern with pressure pump' },
    description: {
      es: 'Sistema de cisterna con bomba, control de presión y filtro de agua, para tener servicio aunque falte el agua.',
      en: 'Cistern system with pump, pressure control and water filter, so the house keeps water during outages.',
    },
    services: ['cistern'],
    photos: pics('sistema-cisterna-bomba', [[1600, 900, done], [1200, 1600, { es: 'Control de presión', en: 'Pressure control' }], [740, 1315, { es: 'Filtro de agua', en: 'Water filter' }]]),
  },
  {
    id: 'tuberia-electrica-empotrada',
    category: 'electrical',
    title: { es: 'Tubería eléctrica empotrada', en: 'In-wall electrical conduit' },
    description: {
      es: 'Abrimos la pared, empotramos la tubería para un nuevo punto eléctrico y dejamos la pared resanada.',
      en: 'We opened the wall, recessed the conduit for a new electrical point and patched the wall.',
    },
    services: ['conduit', 'outlet'],
    photos: pics('tuberia-electrica-empotrada', [[900, 1600, progress], [900, 1600, { es: 'Resane', en: 'Patching' }], [900, 1600, done]]),
  },
  {
    id: 'linea-electrica-soterrada',
    category: 'electrical',
    title: { es: 'Línea eléctrica soterrada', en: 'Underground electrical line' },
    description: {
      es: 'Zanja y tubería eléctrica bajo tierra hasta el área de equipos, con sus desconectivos instalados.',
      en: 'Trench and underground conduit to the equipment area, with disconnects installed.',
    },
    services: ['conduit'],
    photos: pics('linea-electrica-soterrada', [[900, 1600, progress], [900, 1600, { es: 'Tubería en zanja', en: 'Conduit in trench' }], [900, 1600, { es: 'Desconectivos', en: 'Disconnects' }]]),
  },
  {
    id: 'linea-de-agua-principal',
    category: 'plumbing',
    title: { es: 'Línea de agua y llave de paso', en: 'Water line & shut-off valve' },
    description: {
      es: 'Reemplazo de la línea de agua principal en PEX con llave de paso nueva desde el contador.',
      en: 'Main water line replaced with PEX and a new shut-off valve from the meter.',
    },
    services: ['shutoff'],
    photos: pics('linea-de-agua-principal', [[1200, 1600, progress], [1200, 1600, { es: 'Llave de paso', en: 'Shut-off valve' }], [1200, 1600, done]]),
  },
  {
    id: 'losas-de-concreto',
    category: 'concrete',
    title: { es: 'Losas de concreto en la entrada', en: 'Concrete entry pads' },
    description: {
      es: 'Losas de concreto vaciadas en sitio con encofrado y malla para un paso firme hasta la casa.',
      en: 'Cast-in-place concrete pads with forms and mesh for a solid walkway to the house.',
    },
    services: ['concrete-floor'],
    photos: pics('losas-de-concreto', [[900, 1600, done], [900, 1600, { es: 'Encofrado y malla', en: 'Forms and mesh' }]]),
  },
  {
    id: 'iluminacion-interior',
    category: 'electrical',
    title: { es: 'Iluminación interior', en: 'Interior lighting' },
    description: {
      es: 'Instalación de lámpara de techo y luces decorativas en pasillo.',
      en: 'Ceiling fixture and decorative accent lighting in a hallway.',
    },
    services: ['fixture', 'spotlight'],
    photos: pics('iluminacion-interior', [[900, 1600, done]]),
  },
  {
    id: 'lavado-presion-acera',
    category: 'washing',
    title: { es: 'Lavado a presión de acera', en: 'Sidewalk pressure washing' },
    description: {
      es: 'Lavado a presión de acera y entrada para quitar el sucio y el hongo acumulado.',
      en: 'Sidewalk and entry pressure washed to remove built-up dirt and mildew.',
    },
    services: ['wash'],
    photos: pics('lavado-presion-acera', [[900, 1600, progress]]),
  },
]

/** Replaced at runtime by the admin-managed list (see content.ts). */
export function setProjects(list: Project[]) {
  PROJECTS = list
}

/** In the order set by the admin (featured first on the home page). */
export function getProjects(): Project[] {
  return PROJECTS
}
