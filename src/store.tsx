import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { FREE_TRIP_OVER, SERVICES, TRIP_FEE, type CategoryId, type Lang, type Service, type T } from './data'

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
  trip: number
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
  const [cart, setCart] = useState<Cart>(() => load<Cart>('th.cart', {}))
  const [sheet, openSheet] = useState<Service | null>(null)
  const [checkout, setCheckout] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>(() => load<Booking[]>('th.bookings', []))
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => save('th.cart', cart), [cart])
  useEffect(() => save('th.bookings', bookings), [bookings])
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
    const count = Object.values(cart).reduce((a, b) => a + b, 0)
    const subtotal = Object.entries(cart).reduce((a, [id, q]) => a + byId(id).price * q, 0)
    const trip = subtotal === 0 || subtotal >= FREE_TRIP_OVER ? 0 : TRIP_FEE
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
      add: (id, qty = 1) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + qty })),
      clearCart: () => setCart({}),
      count,
      subtotal,
      trip,
      total: subtotal + trip,
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

export const money = (n: number) => `$${n.toLocaleString('en-US')}`
