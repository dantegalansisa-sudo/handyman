import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { AppProvider, useApp, type Tab } from './store'
import { BottomNav, CartBar, Onboarding, ServiceSheet, Toast } from './components/parts'
import { ease } from './components/ui'
import Home from './screens/Home'
import Services from './screens/Services'
import Cart from './screens/Cart'
import Checkout from './screens/Checkout'
import Bookings from './screens/Bookings'
import Profile from './screens/Profile'

const SCREENS: Record<Tab, () => JSX.Element> = { home: Home, services: Services, cart: Cart, bookings: Bookings, profile: Profile }
const ORDER: Tab[] = ['home', 'services', 'cart', 'bookings', 'profile']

function seenOnboarding() {
  try {
    return localStorage.getItem('th.onb') === '1'
  } catch {
    return false
  }
}

function Shell() {
  const { tab } = useApp()
  const [onb, setOnb] = useState(() => !seenOnboarding())
  const [prev, setPrev] = useState<Tab>(tab)
  const dir = ORDER.indexOf(tab) >= ORDER.indexOf(prev) ? 1 : -1
  if (prev !== tab) setPrev(tab)
  const Screen = SCREENS[tab]

  return (
    <div className="shell">
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={tab}
          initial={{ opacity: 0, x: dir * 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -28 }}
          transition={{ duration: 0.32, ease }}
        >
          {!onb && <Screen />}
        </motion.main>
      </AnimatePresence>
      {!onb && (
        <>
          <CartBar />
          <BottomNav />
        </>
      )}
      <ServiceSheet />
      <Checkout />
      <Toast />
      <AnimatePresence>
        {onb && (
          <Onboarding
            key="onb"
            onDone={() => {
              try { localStorage.setItem('th.onb', '1') } catch { /* ignore */ }
              setOnb(false)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
