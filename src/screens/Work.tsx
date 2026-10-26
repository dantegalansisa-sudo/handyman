import { motion } from 'framer-motion'
import { ArrowLeft, Camera, MessageCircle, ShoppingBag } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CATEGORIES, STR, type CategoryId } from '../data'
import { getProjects } from '../portfolio'
import { useApp } from '../store'
import { track } from '../track'
import { Masonry } from '../components/work'
import { CountUp, MaskLine, Reveal, ease } from '../components/ui'
import { quoteMsg, waLink } from './Home'

export default function Work() {
  const { t, lang, go, count } = useApp()
  const all = useMemo(getProjects, [])
  const [cat, setCat] = useState<CategoryId | 'all'>('all')
  const cats = CATEGORIES.filter((c) => all.some((p) => p.category === c.id))
  const list = cat === 'all' ? all : all.filter((p) => p.category === cat)
  const photos = all.reduce((a, p) => a + p.photos.length, 0)

  return (
    <div>
      <header className="topbar">
        <motion.button whileTap={{ scale: 0.9 }} className="icon-btn" onClick={() => go('home')} aria-label="Back"><ArrowLeft size={18} /></motion.button>
        <div style={{ fontWeight: 800, fontSize: 17 }}>{t(STR.workTitle)}</div>
        <motion.button whileTap={{ scale: 0.9 }} className="icon-btn" onClick={() => go('cart')} aria-label="Estimate">
          <ShoppingBag size={18} />
          {count > 0 && <span className="badge">{count}</span>}
        </motion.button>
      </header>

      <div className="page">
        <h1 className="h1" style={{ marginTop: 6 }}>
          <MaskLine>{t({ en: 'Real jobs,', es: 'Trabajos reales,' })}</MaskLine>
          <MaskLine delay={0.1}><span className="light">{t({ en: 'real', es: 'hogares' })} </span><span className="gold">{t({ en: 'homes.', es: 'reales.' })}</span></MaskLine>
        </h1>
        <motion.p className="muted" style={{ fontSize: 14.5, lineHeight: 1.5, margin: '10px 0 0' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          {t(STR.workSub)}
        </motion.p>
        {all.some((p) => p.sample) && (
          <div className="xs" style={{ marginTop: 10, padding: '8px 12px', borderRadius: 12, background: 'var(--gold-soft)', color: 'var(--gold)', fontWeight: 700 }}>
            {t({ en: 'Sample photos — will be replaced with real jobs.', es: 'Fotos de ejemplo — se reemplazarán con trabajos reales.' })}
          </div>
        )}

        <motion.div className="work-stats" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6, ease }}>
          <div><b><CountUp to={all.length} /></b><span>{t({ en: 'Projects', es: 'Proyectos' })}</span></div>
          <div><b><CountUp to={photos} /></b><span>{t({ en: 'Photos', es: 'Fotos' })}</span></div>
          <div><b><CountUp to={cats.length} /></b><span>{t(STR.trades_n)}</span></div>
        </motion.div>

        <div className="chips" style={{ marginTop: 18 }}>
          {(['all', ...cats.map((c) => c.id)] as const).map((id) => {
            const on = cat === id
            const label = id === 'all' ? t(STR.all) : t(CATEGORIES.find((c) => c.id === id)!.short)
            return (
              <motion.button key={id} className={`chip ${on ? 'on' : ''}`} whileTap={{ scale: 0.94 }} onClick={() => setCat(id)}>
                {on && <motion.span layoutId="workchip" className="chip-bg" transition={{ type: 'spring', stiffness: 450, damping: 35 }} />}
                <span>{label}</span>
              </motion.button>
            )
          })}
        </div>

        <div style={{ marginTop: 16 }}>
          <Masonry projects={list} />
        </div>

        <Reveal className="sec">
          <div className="card" style={{ padding: 20, textAlign: 'center' }}>
            <span className="why-ico" style={{ margin: '0 auto 12px' }}><Camera size={20} /></span>
            <div className="h3">{t({ en: 'Have a similar project?', es: '¿Tienes un proyecto parecido?' })}</div>
            <p className="small muted" style={{ lineHeight: 1.5, margin: '6px 0 16px' }}>{t({ en: 'Send us a photo and we’ll give you a quote.', es: 'Envíanos una foto y te cotizamos.' })}</p>
            <a className="btn gold block" href={waLink(quoteMsg(lang))} target="_blank" rel="noreferrer" onClick={() => track('whatsapp_click', { from: 'portfolio_page' })}>
              <MessageCircle size={18} /> WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
