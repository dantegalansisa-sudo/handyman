/**
 * URL ⇄ screen mapping plus per-page SEO metadata. Shared by the app (runtime
 * title/meta updates) and scripts/prerender.ts (static HTML + sitemap at build).
 */
import { BUSINESS, CATEGORIES, MIN_SERVICE, SERVICES, UNIT, type CategoryId, type Service } from './data'
import { getProjects, tx, type Project } from './portfolio'
import { privacy, terms } from './legal'
import { pageView } from './analytics'

export type Tab = 'home' | 'services' | 'work' | 'cart' | 'bookings' | 'profile' | 'privacy' | 'terms'

export type Route = { tab: Tab; cat?: CategoryId | 'all'; serviceId?: string; projectId?: string; admin?: boolean }

const TAB_PATH: Record<Tab, string> = { home: '/', services: '/services', work: '/work', cart: '/estimate', bookings: '/requests', profile: '/contact', privacy: '/privacy', terms: '/terms' }

const isCat = (s: string | undefined): s is CategoryId => !!s && CATEGORIES.some((c) => c.id === s)

export function parsePath(pathname: string): Route {
  const [a, b, c] = pathname.replace(/\/+$/, '').split('/').filter(Boolean)
  switch (a) {
    case undefined: return { tab: 'home' }
    case 'admin': return { tab: 'home', admin: true }
    case 'services': return { tab: 'services', cat: isCat(b) ? b : 'all', serviceId: c && SERVICES.some((s) => s.id === c) ? c : undefined }
    case 'work': return { tab: 'work', projectId: b && getProjects().some((p) => p.id === b) ? b : undefined }
    case 'estimate': return { tab: 'cart' }
    case 'requests': return { tab: 'bookings' }
    case 'contact': return { tab: 'profile' }
    case 'privacy': return { tab: 'privacy' }
    case 'terms': return { tab: 'terms' }
    default: return { tab: 'home' }
  }
}

export function tabPath(tab: Tab, cat?: CategoryId | 'all') {
  return tab === 'services' && cat && cat !== 'all' ? `/services/${cat}` : TAB_PATH[tab]
}
export const servicePath = (s: Service) => `/services/${s.cat}/${s.id}`
export const projectPath = (p: Project) => `/work/${p.id}`

/* ---------------- Metadata ---------------- */

export type Meta = { title: string; description: string; path: string; image: string; noindex?: boolean }

const brand = () => BUSINESS.name
const where = 'Puerto Rico'
const clip = (s: string, n = 158) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s)
const priceText = (s: Service) => `${s.from ? 'from ' : ''}$${s.price} ${UNIT[s.kind].per.en}`

export function metaFor(pathname: string): Meta {
  const r = parsePath(pathname)
  const path = pathname.replace(/\/+$/, '') || '/'
  const img = '/hero.webp'
  if (r.admin) return { title: `Admin | ${brand()}`, description: '', path, image: img, noindex: true }

  if (r.tab === 'services' && r.serviceId) {
    const s = SERVICES.find((x) => x.id === r.serviceId)!
    return {
      title: `${s.name.en} in ${where} — ${s.name.es} | ${brand()}`,
      description: clip(`${s.name.en} (${s.name.es}) in ${where}: base price ${priceText(s)}. ${s.desc.en} Request service online or call ${BUSINESS.phone}.`),
      path, image: s.img,
    }
  }
  if (r.tab === 'services' && r.cat && r.cat !== 'all') {
    const c = CATEGORIES.find((x) => x.id === r.cat)!
    const n = SERVICES.filter((s) => s.cat === c.id).length
    return {
      title: `${c.name.en} Services in ${where} (${c.name.es}) | ${brand()}`,
      description: clip(`${c.name.en} in ${where} — ${c.blurb.en.toLowerCase()}. ${n} services with base prices. ${c.name.es}: ${c.blurb.es.toLowerCase()}. Call ${BUSINESS.phone}.`),
      path, image: c.img,
    }
  }
  if (r.tab === 'services') {
    return {
      title: `Services & Base Prices — Servicios y Precios | ${brand()}`,
      description: clip(`${SERVICES.length} home services in ${where} with base prices: plumbing, electrical, handyman, painting, tile, pressure washing, roof sealing, concrete. Minimum service $${MIN_SERVICE}.`),
      path, image: img,
    }
  }
  if (r.tab === 'work' && r.projectId) {
    const p = getProjects().find((x) => x.id === r.projectId)!
    return {
      title: `${tx(p.title, 'en')} — ${tx(p.title, 'es')} | ${brand()}`,
      description: clip(`${tx(p.description, 'en')} ${tx(p.description, 'es')}`),
      path, image: p.photos[0]?.src ?? img,
    }
  }
  if (r.tab === 'work') {
    return {
      title: `Our Work — Trabajos Realizados | ${brand()}`,
      description: clip(`Photos of real jobs by ${brand()} in ${where}: electrical panels, bathrooms, water heaters, cisterns, block walls, TV walls and more. Fotos de trabajos realizados.`),
      path, image: getProjects()[0]?.photos[0]?.src ?? img,
    }
  }
  if (r.tab === 'profile') {
    return { title: `Contact — Contacto | ${brand()}`, description: clip(`Call or WhatsApp ${BUSINESS.phone}. ${brand()} — ${BUSINESS.tagline.en}. Serving ${where}.`), path, image: img }
  }
  if (r.tab === 'privacy' || r.tab === 'terms') {
    const d = r.tab === 'privacy' ? privacy() : terms()
    return { title: `${d.title.en} — ${d.title.es} | ${brand()}`, description: clip(d.intro.en), path, image: img }
  }
  if (r.tab === 'cart' || r.tab === 'bookings') {
    return { title: `${r.tab === 'cart' ? 'Your estimate' : 'My requests'} | ${brand()}`, description: '', path, image: img, noindex: true }
  }
  return {
    title: `${brand()} | Plumbing, Electrical & Handyman in ${where}`,
    description: clip(`Plumbing, electrical, handyman, painting, tile, pressure washing, roof sealing and concrete in ${where}. See base prices and request service in minutes. Plomería, electricidad y handyman. Call ${BUSINESS.phone}.`),
    path: '/', image: img,
  }
}

/** Every indexable URL, for the sitemap and prerender. */
export function allPaths(): string[] {
  return [
    '/',
    '/services',
    ...CATEGORIES.map((c) => `/services/${c.id}`),
    ...SERVICES.map(servicePath),
    '/work',
    ...getProjects().map(projectPath),
    '/contact',
    '/privacy',
    '/terms',
  ]
}

/** Updates <title>, description, canonical and OG tags in the live document. */
export function applyMeta(pathname: string) {
  if (typeof document === 'undefined') return
  const m = metaFor(pathname)
  document.title = m.title
  const set = (sel: string, attr: string, val: string) => {
    let el = document.head.querySelector<HTMLElement>(sel)
    if (!el) {
      const [tag, rest] = sel.split('[')
      el = document.createElement(tag)
      const [k, v] = rest.replace(']', '').split('=')
      el.setAttribute(k, v.replace(/"/g, ''))
      document.head.appendChild(el)
    }
    el.setAttribute(attr, val)
  }
  const abs = (p: string) => (p.startsWith('http') ? p : `${BUSINESS.url || location.origin}${p}`)
  if (m.description) set('meta[name="description"]', 'content', m.description)
  set('link[rel="canonical"]', 'href', abs(m.path))
  set('meta[property="og:title"]', 'content', m.title)
  if (m.description) set('meta[property="og:description"]', 'content', m.description)
  set('meta[property="og:url"]', 'content', abs(m.path))
  set('meta[property="og:image"]', 'content', abs(m.image))
  set('meta[name="robots"]', 'content', m.noindex ? 'noindex, nofollow' : 'index, follow')
  pageView(m.path, m.title)
}
