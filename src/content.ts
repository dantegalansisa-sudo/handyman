/**
 * Admin-managed content. The site ships with the defaults in data.ts / portfolio.ts;
 * when Supabase is configured, whatever the client edits in /admin overrides them.
 *
 * Public pages read with plain fetch (no SDK) to keep the bundle small.
 */
import { BUSINESS, STR, setFaq, setMinService, setServices, type Faq, type Service, type T } from './data'
import { setProjects, type Project } from './portfolio'

type Env = Record<string, string | undefined>
const nodeEnv = (globalThis as { process?: { env: Env } }).process?.env
const env: Env = (import.meta as unknown as { env?: Env }).env ?? nodeEnv ?? {}

export const SUPABASE_URL = (env.VITE_SUPABASE_URL ?? '').replace(/\/$/, '')
export const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY ?? ''
export const hasBackend = Boolean(SUPABASE_URL && SUPABASE_KEY)

/** Texts the client can edit from the admin panel (key in STR → label). */
export const EDITABLE_TEXT: { key: keyof typeof STR; label: string; long?: boolean }[] = [
  { key: 'homeTitle1', label: 'Título principal — línea 1' },
  { key: 'homeTitle2', label: 'Título principal — línea 2 (la última palabra va en dorado)' },
  { key: 'onbSub', label: 'Frase debajo del título', long: true },
  { key: 'promoTag', label: 'Etiqueta de la tarjeta promocional' },
  { key: 'promoTitle', label: 'Texto de la tarjeta promocional', long: true },
  { key: 'workSub', label: 'Subtítulo de Trabajos realizados' },
  { key: 'ctaTitle', label: 'Título del bloque de WhatsApp' },
  { key: 'ctaSub', label: 'Texto del bloque de WhatsApp', long: true },
  { key: 'aboutText', label: 'Sobre nosotros', long: true },
]

export type Business = { name: string; phone: string; whatsapp: string; area: T; tagline: T }

export type Settings = {
  business?: Partial<Business>
  minService?: number
  text?: Partial<Record<keyof typeof STR, T>>
  faq?: Faq[]
}

export type Content = { settings?: Settings | null; services?: Service[] | null; projects?: Project[] | null }

const digits = (s: string) => s.replace(/\D/g, '')

export function applyContent(c: Content | null | undefined) {
  if (!c) return
  const s = c.settings
  if (s) {
    if (s.business) {
      const b = s.business
      if (b.name) BUSINESS.name = b.name
      if (b.phone) {
        BUSINESS.phone = b.phone
        BUSINESS.phoneHref = `tel:+${digits(b.phone).length === 10 ? '1' : ''}${digits(b.phone)}`
      }
      if (b.whatsapp) BUSINESS.whatsapp = `${digits(b.whatsapp).length === 10 ? '1' : ''}${digits(b.whatsapp)}`
      if (b.area?.es || b.area?.en) BUSINESS.area = { en: b.area.en || b.area.es || '', es: b.area.es || b.area.en || '' }
      if (b.tagline?.es || b.tagline?.en) BUSINESS.tagline = { en: b.tagline.en || b.tagline.es || '', es: b.tagline.es || b.tagline.en || '' }
    }
    if (typeof s.minService === 'number' && s.minService >= 0) setMinService(s.minService)
    for (const [k, v] of Object.entries(s.text ?? {})) {
      const cur = STR[k as keyof typeof STR] as unknown
      if (v && cur && typeof cur === 'object' && 'en' in (cur as object)) {
        const t = cur as T
        if (v.es) t.es = v.es
        if (v.en) t.en = v.en
        else if (v.es) t.en = v.es
      }
    }
    setFaq(s.faq?.filter((f) => f.q.es || f.q.en) ?? null)
  }
  if (c.services?.length) setServices(c.services)
  if (c.projects) setProjects(c.projects)
}

/* ---------------- Supabase REST (public) ---------------- */

async function rest<R>(path: string, init?: RequestInit): Promise<R> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  })
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`)
  return (res.status === 204 || res.headers.get('content-length') === '0' ? null : res.json()) as R
}

export async function fetchContent(): Promise<Content | null> {
  if (!hasBackend) return null
  const [settings, services, projects] = await Promise.all([
    rest<{ data: Settings }[]>('site_settings?select=data&id=eq.1'),
    rest<{ data: Service }[]>('services?select=data&active=eq.true&order=sort.asc'),
    rest<{ data: Project }[]>('projects?select=data&published=eq.true&order=sort.asc'),
  ])
  return {
    settings: settings[0]?.data ?? null,
    services: services.map((r) => r.data),
    // An empty table means "not set up yet" — keep the built-in projects.
    projects: projects.length ? projects.map((r) => r.data) : null,
  }
}

/** Saves a booking request so it shows up in the admin inbox. */
export async function submitRequest(data: Record<string, unknown>) {
  if (!hasBackend) return
  try {
    await rest('service_requests', { method: 'POST', body: JSON.stringify({ data }), headers: { Prefer: 'return=minimal' } })
  } catch {
    /* WhatsApp is the main channel — never block the customer */
  }
}

/* ---------------- Local cache so returning visitors see edits instantly ---------------- */

const CACHE = 'tcs.content'

export function loadCached(): Content | null {
  try {
    const raw = localStorage.getItem(CACHE)
    return raw ? (JSON.parse(raw) as Content) : null
  } catch {
    return null
  }
}

export function saveCached(c: Content) {
  try {
    localStorage.setItem(CACHE, JSON.stringify(c))
  } catch {
    /* storage unavailable */
  }
}
