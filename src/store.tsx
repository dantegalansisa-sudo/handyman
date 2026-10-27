import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { MIN_SERVICE, SERVICES, UNIT, type CategoryId, type Lang, type Service, type T } from './data'
import { getProjects, type Project } from './portfolio'
import { applyMeta, parsePath, projectPath, servicePath, tabPath, type Tab } from './seo'

export type { Tab } from './seo'
export type Cart = Record<string, number>
export type Booking = {
  id: string
  createdAt: number
  date: string
  slot: string
  name: string
  phone: string
  address: string
  notes: string
  items: { id: string; qty: number }[]
  total: number
}

function load<V>(key: string, fallback: V): V {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as V) : fallback
  } catch {
    return fallback
  }
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable */
  }
}

type Ctx = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (s: T) => string
  tab: Tab
  go: (tab: Tab, cat?: CategoryId | 'all') => void
  servicesCat: CategoryId | 'all'
  setServicesCat: (c: CategoryId | 'all') => void
  cart: Cart
  setQty: (id: string, qty: number) => void
  add: (id: string, qty?: number) => void
  clearCart: () => void
  count: number
  subtotal: number
  minAdj: number
  total: number
  sheet: Service | null
  openSheet: (s: Service | null) => void
  project: Project | null
  /** silent: close without touching the URL (used when handing off to another overlay). */
  openProject: (p: Project | null, silent?: boolean) => void
  checkout: boolean
  setCheckout: (v: boolean) => void
  bookings: Booking[]
  addBooking: (b: Booking) => void
  removeBooking: (id: string) => void
  toast: string | null
  showToast: (m: string) => void
  /** Bumps when admin-managed content arrives, so screens re-read data. */
  contentVersion: number
}

const AppCtx = createContext<Ctx | null>(null)

export const findService = (id: string) => SERVICES.find((s) => s.id === id)
export const byId = (id: string) => findService(id)!

export function AppProvider({ children }: { children: ReactNode }) {
  const initial = useRef(parsePath(location.pathname)).current
  const [lang, setLangState] = useState<Lang>(() => load<Lang>('th.lang', navigator.language?.startsWith('es') ? 'es' : 'en'))
  const [tab, setTab] = useState<Tab>(initial.tab)
  const [servicesCat, setServicesCat] = useState<CategoryId | 'all'>(initial.cat ?? 'all')
  const [rawCart, setCart] = useState<Cart>(() => load<Cart>('tcs.cart', {}))
  const [sheet, setSheet] = useState<Service | null>(() => (initial.serviceId ? findService(initial.serviceId) ?? null : null))
  const [project, setProject] = useState<Project | null>(() => getProjects().find((p) => p.id === initial.projectId) ?? null)
  const [checkout, setCheckout] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>(() => load<Booking[]>('tcs.bookings', []))
  const [toast, setToast] = useState<string | null>(null)
  const [contentVersion, setContentVersion] = useState(0)

  // Drop cart lines for services the admin removed.
  const cart = useMemo(() => Object.fromEntries(Object.entries(rawCart).filter(([id]) => findService(id))), [rawCart, contentVersion])

  useEffect(() => save('tcs.cart', rawCart), [rawCart])
  useEffect(() => save('tcs.bookings', bookings), [bookings])
  useEffect(() => {
    save('th.lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 1900)
    return () => clearTimeout(id)
  }, [toast])

  useEffect(() => {
    const onContent = () => setContentVersion((v) => v + 1)
    window.addEventListener('content-updated', onContent)
    return () => window.removeEventListener('content-updated', onContent)
  }, [])

  /* ---------- URL sync: every screen, service and project has its own address ---------- */
  const navigate = useCallback((path: string, overlay = false) => {
    if (location.pathname !== path) history.pushState({ overlay }, '', path)
    applyMeta(path)
  }, [])

  const closeOverlay = useCallback((basePath: string) => {
    if (history.state?.overlay) history.back()
    else {
      history.replaceState(null, '', basePath)
      applyMeta(basePath)
    }
  }, [])

  useEffect(() => {
    applyMeta(location.pathname)
    const onPop = () => {
      const r = parsePath(location.pathname)
      setTab(r.tab)
      if (r.cat) setServicesCat(r.cat)
      setSheet(r.serviceId ? findService(r.serviceId) ?? null : null)
      setProject(r.projectId ? getProjects().find((p) => p.id === r.projectId) ?? null : null)
      setCheckout(false)
      applyMeta(location.pathname)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const value = useMemo<Ctx>(() => {
    const count = Object.keys(cart).length
    const subtotal = round2(Object.entries(cart).reduce((a, [id, q]) => a + byId(id).price * q, 0))
    const minAdj = subtotal > 0 && subtotal < MIN_SERVICE ? round2(MIN_SERVICE - subtotal) : 0
    const base = tabPath(tab, servicesCat)
    return {
      lang,
      setLang: setLangState,
      t: (s) => s[lang] || s.es || s.en,
      tab,
      go: (next, cat) => {
        const c = cat ?? (next === 'services' ? servicesCat : undefined)
        if (cat) setServicesCat(cat)
        setTab(next)
        setSheet(null)
        setProject(null)
        navigate(tabPath(next, c))
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
      },
      servicesCat,
      setServicesCat: (c) => {
        setServicesCat(c)
        if (tab === 'services') {
          history.replaceState(null, '', tabPath('services', c))
          applyMeta(tabPath('services', c))
        }
      },
      cart,
      setQty: (id, qty) =>
        setCart((c) => {
          const n = { ...c }
          if (qty <= 0) delete n[id]
          else n[id] = qty
          return n
        }),
      add: (id, qty = defaultQty(byId(id))) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + qty })),
      clearCart: () => setCart({}),
      count,
      subtotal,
      minAdj,
      total: round2(subtotal + minAdj),
      sheet,
      openSheet: (s) => {
        setSheet(s)
        if (s) navigate(servicePath(s), true)
        else closeOverlay(base)
      },
      project,
      openProject: (p, silent) => {
        setProject(p)
        if (silent) return
        if (p) navigate(projectPath(p), true)
        else closeOverlay(base)
      },
      checkout,
      setCheckout,
      bookings,
      addBooking: (b) => setBookings((bs) => [b, ...bs]),
      removeBooking: (id) => setBookings((bs) => bs.filter((b) => b.id !== id)),
      toast,
      showToast: setToast,
      contentVersion,
    }
  }, [lang, tab, servicesCat, cart, sheet, project, checkout, bookings, toast, contentVersion, navigate, closeOverlay])

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

export function useApp() {
  const c = useContext(AppCtx)
  if (!c) throw new Error('useApp outside provider')
  return c
}

const round2 = (n: number) => Math.round(n * 100) / 100

export const money = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`

export const defaultQty = (s: Service) => s.qty ?? 1
export const stepOf = (s: Service) => s.step ?? 1
export const isMeasured = (s: Service) => s.kind !== 'each'

/** "$1.50 per sq ft" / "$30 each" */
export const priceLabel = (s: Service, lang: Lang) => `${money(s.price)} ${UNIT[s.kind].per[lang]}`

/** "400 sq ft" / "2" */
export const qtyLabel = (s: Service, qty: number, lang: Lang) =>
  isMeasured(s) ? `${qty.toLocaleString('en-US')} ${UNIT[s.kind].short[lang]}` : `${qty}`
