import { motion } from 'framer-motion'
import { ArrowRight, BadgeDollarSign, Check, MapPin, MessageCircle, Phone, Search, ShoppingBag, Wrench, X } from 'lucide-react'
import { BUSINESS, CATEGORIES, SERVICES, STR } from '../data'
import { getProjects } from '../portfolio'
import { money, useApp, type Tab } from '../store'
import { tabPath } from '../seo'
import { track } from '../track'
import { quoteMsg, waLink } from '../screens/Home'
import { Logo, MaskLine, Wordmark, ease } from './ui'

const LINKS: { tab: Tab; label: { en: string; es: string } }[] = [
  { tab: 'home', label: STR.home },
  { tab: 'services', label: STR.services },
  { tab: 'work', label: STR.workTitle },
  { tab: 'profile', label: STR.profile },
]

/** Real <a href> links so crawlers can follow them; clicks stay in the app. */
function NavLink({ tab, children, className, cat }: { tab: Tab; children: React.ReactNode; className?: string; cat?: Parameters<typeof tabPath>[1] }) {
  const { go } = useApp()
  return (
    <a
      href={tabPath(tab, cat)}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey) return
        e.preventDefault()
        go(tab, cat)
      }}
    >
      {children}
    </a>
  )
}

export function DesktopHeader() {
  const { t, tab, lang, setLang, count, total, go } = useApp()
  return (
    <header className="dk-header">
      <div className="dk-header-inner">
        <NavLink tab="home" className="dk-brand"><Logo size={44} /><Wordmark /></NavLink>
        <nav className="dk-nav">
          {LINKS.map((l) => (
            <NavLink key={l.tab} tab={l.tab} className={`dk-link ${tab === l.tab ? 'on' : ''}`}>
              {tab === l.tab && <motion.span layoutId="dknav" className="dk-link-bg" transition={{ type: 'spring', stiffness: 450, damping: 36 }} />}
              <span>{t(l.label)}</span>
            </NavLink>
          ))}
        </nav>
        <div className="dk-actions">
          <button className="dk-lang" onClick={() => setLang(lang === 'en' ? 'es' : 'en')} aria-label="Language">{lang === 'en' ? 'ES' : 'EN'}</button>
          <a className="dk-phone" href={BUSINESS.phoneHref} onClick={() => track('call_click', { from: 'desktop_header' })}><Phone size={16} /> {BUSINESS.phone}</a>
          <motion.button className={`btn ${count ? 'gold' : ''}`} style={{ height: 46 }} whileTap={{ scale: 0.96 }} onClick={() => go('cart')}>
            <ShoppingBag size={17} />
            {count ? <>{count} · {money(total)}</> : t(STR.cart)}
          </motion.button>
        </div>
      </div>
    </header>
  )
}

export function DesktopFooter() {
  const { t, lang } = useApp()
  return (
    <footer className="dk-footer">
      <div className="dk-footer-inner">
        <div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ background: '#f6f3ea', borderRadius: 16, padding: 4, display: 'grid' }}><Logo size={44} /></span>
            <Wordmark dark />
          </div>
          <p className="dk-foot-text">{t(BUSINESS.tagline)}. {t(STR.aboutText)}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
            <a className="btn gold sm" href={waLink(quoteMsg(lang))} target="_blank" rel="noreferrer" onClick={() => track('whatsapp_click', { from: 'footer' })}><MessageCircle size={15} /> WhatsApp</a>
            <a className="btn sm" style={{ background: '#fff', color: '#141414' }} href={BUSINESS.phoneHref} onClick={() => track('call_click', { from: 'footer' })}><Phone size={15} /> {BUSINESS.phone}</a>
          </div>
        </div>
        <div>
          <h4>{t(STR.services)}</h4>
          {CATEGORIES.map((c) => (
            <NavLink key={c.id} tab="services" cat={c.id} className="dk-foot-link">{t(c.name)}</NavLink>
          ))}
        </div>
        <div>
          <h4>{t(STR.workTitle)}</h4>
          {getProjects().slice(0, 6).map((p) => (
            <a key={p.id} className="dk-foot-link" href={`/work/${p.id}`}>{p.title[lang] || p.title.es}</a>
          ))}
        </div>
        <div>
          <h4>{t(STR.profile)}</h4>
          <span className="dk-foot-link"><MapPin size={13} /> {t(BUSINESS.area)}</span>
          <a className="dk-foot-link" href={BUSINESS.phoneHref}><Phone size={13} /> {BUSINESS.phone}</a>
          <span className="dk-foot-link"><BadgeDollarSign size={13} /> {t(STR.minimumNote)}</span>
        </div>
      </div>
      <div className="dk-foot-bottom">
        © {new Date().getFullYear()} {BUSINESS.name} · {t({ en: 'All prices are base prices.', es: 'Todos los precios son precios base.' })}
      </div>
    </footer>
  )
}

/** Desktop home hero: same gold composition as the phone intro, laid out side by side. */
export function DesktopHero({ q, setQ }: { q: string; setQ: (v: string) => void }) {
  const { t, lang, go } = useApp()
  const words = t(STR.homeTitle2).split(' ')
  return (
    <section className="dk-hero">
      <div className="dk-hero-copy">
        <motion.div className="onb-kicker" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.6, ease }}>
          <span /> {t(BUSINESS.tagline)}
        </motion.div>
        <h1 className="h1 dk-hero-title">
          <MaskLine delay={0.1}>{t(STR.homeTitle1)}</MaskLine>
          <MaskLine delay={0.2}><span className="light">{words.slice(0, -1).join(' ')} </span><span className="gold">{words.slice(-1)}</span></MaskLine>
        </h1>
        <motion.p className="muted dk-hero-sub" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.7, ease }}>
          {t(STR.onbSub)}
        </motion.p>
        <motion.label className="search dk-hero-search" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.7, ease }}>
          <Search size={20} color="#8a857a" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t(STR.search)} />
          {q && <button onClick={() => setQ('')} aria-label="Clear"><X size={18} /></button>}
        </motion.label>
        <motion.div style={{ display: 'flex', gap: 10, marginTop: 18 }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.7, ease }}>
          <motion.button className="btn" whileTap={{ scale: 0.96 }} onClick={() => go('services', 'all')}>
            {t(STR.browse)} <span className="btn-arrow"><ArrowRight size={17} /></span>
          </motion.button>
          <a className="btn gold" href={waLink(quoteMsg(lang))} target="_blank" rel="noreferrer" onClick={() => track('whatsapp_click', { from: 'desktop_hero' })}>
            <MessageCircle size={18} /> WhatsApp
          </a>
        </motion.div>
      </div>

      <div className="dk-hero-art">
        <motion.div className="onb-sun" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.4, ease }} />
        <motion.div className="onb-ring" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1, rotate: 360 }}
          transition={{ scale: { duration: 1.4, ease }, opacity: { duration: 1 }, rotate: { duration: 60, repeat: Infinity, ease: 'linear' } }} />
        <motion.img
          className="dk-hero-pro"
          src="/hero.webp"
          alt={`${BUSINESS.name} professional`}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease, delay: 0.15 }}
        />
        {[
          { cls: 'c1', icon: <BadgeDollarSign size={15} color="#B08A35" />, text: t({ en: 'Base prices upfront', es: 'Precios base claros' }) },
          { cls: 'c2', icon: <Wrench size={15} color="#B08A35" />, text: t({ en: `${SERVICES.length} services · one team`, es: `${SERVICES.length} servicios · un equipo` }) },
          { cls: 'c3', icon: <Check size={15} color="#B08A35" />, text: t({ en: `${getProjects().length} jobs in our portfolio`, es: `${getProjects().length} trabajos en portafolio` }) },
        ].map((c, i) => (
          <motion.div key={c.cls} className={`onb-chip dk-chip ${c.cls}`} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.7 + i * 0.15 }}>
            <motion.span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }} animate={{ y: [0, i % 2 ? 6 : -6, 0] }} transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}>
              {c.icon} {c.text}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
