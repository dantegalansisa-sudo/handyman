import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { DESKTOP, useIsDesktop } from './hooks'
import { AppProvider, useApp, type Tab } from './store'
import { BottomNav, CartBar, Onboarding, ServiceSheet, Toast } from './components/parts'
import { DesktopFooter, DesktopHeader } from './components/desktop'
import { ease } from './components/ui'
import Home from './screens/Home'
import Services from './screens/Services'
import Cart from './screens/Cart'
import Checkout from './screens/Checkout'
import Bookings from './screens/Bookings'
import Profile from './screens/Profile'
import Work from './screens/Work'
import { ProjectViewer } from './components/work'

const SCREENS: Record<Tab, () => JSX.Element> = { home: Home, services: Services, work: Work, cart: Cart, bookings: Bookings, profile: Profile }
const ORDER: Tab[] = ['home', 'services', 'work', 'cart', 'bookings', 'profile']

function seenOnboarding() {
  try {
    return localStorage.getItem('th.onb') === '1'
  } catch {
    return false
  }
}

function Shell() {
  const { tab } = useApp()
  const desktop = useIsDesktop()
  // The swipe-to-start intro is a phone experience, and only for visitors landing on the home page.
  const [onb, setOnb] = useState(() => !seenOnboarding() && location.pathname === '/' && !window.matchMedia(DESKTOP).matches)
  const [prev, setPrev] = useState<Tab>(tab)
  const dir = ORDER.indexOf(tab) >= ORDER.indexOf(prev) ? 1 : -1
  if (prev !== tab) setPrev(tab)
  const Screen = SCREENS[tab]
  const showOnb = onb && !desktop

  return (
    <div className={`shell ${desktop ? 'is-desktop' : ''}`}>
      {desktop && <DesktopHeader />}
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={tab}
          className={`tab-${tab}`}
          initial={{ opacity: 0, x: desktop ? 0 : dir * 28, y: desktop ? 16 : 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: desktop ? 0 : dir * -28 }}
          transition={{ duration: 0.32, ease }}
        >
          {!showOnb && <Screen />}
        </motion.main>
      </AnimatePresence>
      {desktop && <DesktopFooter />}
      {!showOnb && !desktop && (
        <>
          <CartBar />
          <BottomNav />
        </>
      )}
      <ServiceSheet />
      <ProjectViewer />
      <Checkout />
      <Toast />
      <AnimatePresence>
        {showOnb && (
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
