import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { MIN_SERVICE, SERVICES, UNIT, type CategoryId, type Lang, type Service, type T } from './data'

export type Tab = 'home' | 'services' | 'cart' | 'bookings' | 'profile'
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
  checkout: boolean
  setCheckout: (v: boolean) => void
  bookings: Booking[]
  addBooking: (b: Booking) => void
  removeBooking: (id: string) => void
  toast: string | null
  showToast: (m: string) => void
}

const AppCtx = createContext<Ctx | null>(null)

export const byId = (id: string) => SERVICES.find((s) => s.id === id)!

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => load<Lang>('th.lang', navigator.language?.startsWith('es') ? 'es' : 'en'))
  const [tab, setTab] = useState<Tab>('home')
  const [servicesCat, setServicesCat] = useState<CategoryId | 'all'>('all')
  const [cart, setCart] = useState<Cart>(() => load<Cart>('tcs.cart', {}))
  const [sheet, openSheet] = useState<Service | null>(null)
  const [checkout, setCheckout] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>(() => load<Booking[]>('tcs.bookings', []))
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => save('tcs.cart', cart), [cart])
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

  const value = useMemo<Ctx>(() => {
    const count = Object.keys(cart).length
    const subtotal = round2(Object.entries(cart).reduce((a, [id, q]) => a + byId(id).price * q, 0))
    const minAdj = subtotal > 0 && subtotal < MIN_SERVICE ? round2(MIN_SERVICE - subtotal) : 0
    return {
      lang,
      setLang: setLangState,
      t: (s) => s[lang],
      tab,
      go: (next, cat) => {
        if (cat) setServicesCat(cat)
        setTab(next)
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
      },
      servicesCat,
      setServicesCat,
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
      openSheet,
      checkout,
      setCheckout,
      bookings,
      addBooking: (b) => setBookings((bs) => [b, ...bs]),
      removeBooking: (id) => setBookings((bs) => bs.filter((b) => b.id !== id)),
      toast,
      showToast: setToast,
    }
  }, [lang, tab, servicesCat, cart, sheet, checkout, bookings, toast])

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
