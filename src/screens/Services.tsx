import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { CATEGORIES, IMG, SERVICES, STR } from '../data'
import { useApp } from '../store'
import { ServiceRow } from '../components/parts'
import { CAT_ICON, Img, MaskLine, ease } from '../components/ui'

export default function Services() {
  const { t, go, servicesCat: cat, setServicesCat, count } = useApp()
  const chipsRef = useRef<HTMLDivElement>(null)
  const current = CATEGORIES.find((c) => c.id === cat)
  const list = cat === 'all' ? SERVICES : SERVICES.filter((s) => s.cat === cat)

  useEffect(() => {
    const el = chipsRef.current?.querySelector<HTMLElement>('.chip.on')
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [cat])

  return (
    <div>
      <header className="topbar">
        <motion.button whileTap={{ scale: 0.9 }} className="icon-btn" onClick={() => go('home')} aria-label="Back"><ArrowLeft size={18} /></motion.button>
        <div style={{ fontWeight: 800, fontSize: 17 }}>{t(STR.services)}</div>
        <motion.button whileTap={{ scale: 0.9 }} className="icon-btn" onClick={() => go('cart')} aria-label="Estimate">
          <ShoppingBag size={18} />
          {count > 0 && <span className="badge">{count}</span>}
        </motion.button>
      </header>

      <div style={{ position: 'sticky', top: 68, zIndex: 25, background: 'color-mix(in srgb, var(--bg) 88%, transparent)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', padding: '4px 20px 12px' }}>
        <div className="chips" ref={chipsRef}>
          {(['all', ...CATEGORIES.map((c) => c.id)] as const).map((id) => {
            const on = cat === id
            const label = id === 'all' ? t(STR.all) : t(CATEGORIES.find((c) => c.id === id)!.short)
            return (
              <motion.button key={id} className={`chip ${on ? 'on' : ''}`} whileTap={{ scale: 0.94 }} onClick={() => { setServicesCat(id); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                {on && <motion.span layoutId="svcchip" className="chip-bg" transition={{ type: 'spring', stiffness: 450, damping: 35 }} />}
                <span>{label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className="page">
        <AnimatePresence mode="wait">
          <motion.div key={cat} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45, ease }}>
            <div style={{ position: 'relative', height: 190, borderRadius: 30, overflow: 'hidden', marginTop: 4 }}>
              <motion.div initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease }} style={{ height: '100%' }}>
                <Img src={(current?.img ?? IMG.caulk).replace('w=800&h=600', 'w=900&h=500')} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </motion.div>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,12,12,.78), rgba(12,12,12,.05) 70%)' }} />
              <div style={{ position: 'absolute', left: 18, right: 18, bottom: 16, color: '#fff' }}>
                {current && (
                  <motion.span initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.15 }}
                    style={{ width: 40, height: 40, borderRadius: 14, background: current.tint, color: '#141414', display: 'grid', placeItems: 'center', marginBottom: 10 }}>
                    {CAT_ICON[current.id]({ size: 20 })}
                  </motion.span>
                )}
                <h1 className="h1" style={{ fontSize: 28, color: '#fff' }}>
                  <MaskLine delay={0.1}>{current ? t(current.name) : t({ en: 'All services', es: 'Todos los servicios' })}</MaskLine>
                </h1>
                <div className="small" style={{ color: '#ddd5c4', marginTop: 4 }}>
                  {current ? t(current.blurb) : t({ en: '7 trades · one trusted team', es: '7 oficios · un solo equipo de confianza' })} · {list.length} {t(STR.services).toLowerCase()}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
              {cat === 'all'
                ? CATEGORIES.map((c) => (
                    <div key={c.id} style={{ display: 'grid', gap: 10 }}>
                      <motion.div className="row" style={{ marginTop: 14, justifyContent: 'flex-start', gap: 10 }} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <span style={{ width: 32, height: 32, borderRadius: 11, background: c.tint, display: 'grid', placeItems: 'center' }}>{CAT_ICON[c.id]({ size: 16 })}</span>
                        <span className="h3">{t(c.name)}</span>
                      </motion.div>
                      {SERVICES.filter((s) => s.cat === c.id).map((s, i) => <ServiceRow key={s.id} s={s} i={i} />)}
                    </div>
                  ))
                : list.map((s, i) => <ServiceRow key={s.id} s={s} i={i} />)}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
