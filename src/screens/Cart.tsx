import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ShieldCheck, ShoppingBag, Sparkles, Trash2, Truck } from 'lucide-react'
import { FREE_TRIP_OVER, IMG, STR } from '../data'
import { byId, money, useApp } from '../store'
import { AnimatedNumber, Img, MaskLine, Stepper, ease } from '../components/ui'

export default function Cart() {
  const { t, go, cart, setQty, subtotal, trip, total, count, setCheckout, clearCart } = useApp()
  const entries = Object.entries(cart)
  const pct = Math.min(100, (subtotal / FREE_TRIP_OVER) * 100)

  return (
    <div>
      <header className="topbar">
        <motion.button whileTap={{ scale: 0.9 }} className="icon-btn" onClick={() => go('services')} aria-label="Back"><ArrowLeft size={18} /></motion.button>
        <div style={{ fontWeight: 800, fontSize: 17 }}>{t(STR.estimate)}</div>
        {count > 0 ? (
          <motion.button whileTap={{ scale: 0.9 }} className="icon-btn" onClick={clearCart} aria-label="Clear"><Trash2 size={17} /></motion.button>
        ) : <span style={{ width: 44 }} />}
      </header>

      <div className="page">
        <AnimatePresence mode="wait">
          {entries.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', paddingTop: 30 }}>
              <motion.div initial={{ scale: 0.6, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                style={{ width: 200, height: 200, margin: '0 auto', borderRadius: '50%', overflow: 'hidden', border: '8px solid #fff', boxShadow: 'var(--shadow)' }}>
                <Img src={IMG.caulk} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </motion.div>
              <h2 className="h2" style={{ marginTop: 26 }}>{t(STR.emptyCart)}</h2>
              <p className="muted" style={{ maxWidth: 290, margin: '10px auto 24px', lineHeight: 1.5 }}>{t(STR.emptyCartSub)}</p>
              <motion.button className="btn" whileTap={{ scale: 0.95 }} onClick={() => go('services', 'all')}>{t(STR.browse)} <ArrowRight size={16} /></motion.button>
            </motion.div>
          ) : (
            <motion.div key="full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="h1" style={{ fontSize: 30, marginTop: 6 }}>
                <MaskLine>{count} {count === 1 ? t(STR.item) : t(STR.items)},</MaskLine>
                <MaskLine delay={0.08}><span className="light">{t({ en: 'one simple', es: 'un solo' })} </span><span className="gold">{t({ en: 'visit.', es: 'viaje.' })}</span></MaskLine>
              </h1>

              {/* Free visit meter */}
              <motion.div className="card" style={{ padding: 16, marginTop: 18, borderRadius: 22 }} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6, ease }}>
                <div className="row small" style={{ fontWeight: 700 }}>
                  <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                    {trip === 0 ? <Sparkles size={16} color="#B08A35" /> : <Truck size={16} />}
                    {trip === 0
                      ? t({ en: 'Your visit is FREE', es: 'Tu visita es GRATIS' })
                      : `${t(STR.addMore)} ${money(FREE_TRIP_OVER - subtotal)} ${t(STR.forFree)}`}
                  </span>
                </div>
                <div className="meter"><motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease }} /></div>
              </motion.div>

              <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
                <AnimatePresence initial={false}>
                  {entries.map(([id, qty], i) => {
                    const s = byId(id)
                    return (
                      <motion.div
                        key={id}
                        layout
                        className="line-item"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0, transition: { delay: i * 0.05, duration: 0.5, ease } }}
                        exit={{ opacity: 0, x: -80, height: 0, padding: 0, margin: 0, transition: { duration: 0.35 } }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={{ left: 0.5, right: 0 }}
                        onDragEnd={(_, info) => { if (info.offset.x < -110) setQty(id, 0) }}
                      >
                        <Img src={s.img} alt="" />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="small" style={{ fontWeight: 700, lineHeight: 1.25 }}>{t(s.name)}</div>
                          <div className="xs muted" style={{ marginTop: 2 }}>{money(s.price)} {t(s.unit)}</div>
                          <div className="price" style={{ fontSize: 16, marginTop: 4 }}><AnimatedNumber value={s.price * qty} /></div>
                        </div>
                        <Stepper light qty={qty} onChange={(n) => setQty(id, n)} />
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
              <div className="xs muted" style={{ textAlign: 'center', marginTop: 8 }}>{t({ en: '← Swipe an item left to remove', es: '← Desliza a la izquierda para quitar' })}</div>

              <motion.button className="btn ghost block" style={{ marginTop: 14, height: 50 }} whileTap={{ scale: 0.97 }} onClick={() => go('services')}>
                + {t({ en: 'Add more services', es: 'Agregar más servicios' })}
              </motion.button>

              {/* Summary */}
              <motion.div className="card" style={{ padding: 20, marginTop: 14 }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="sum-row"><span className="muted">{t(STR.subtotal)}</span><b><AnimatedNumber value={subtotal} /></b></div>
                <div className="sum-row">
                  <span className="muted">{t(STR.trip)}</span>
                  <AnimatePresence mode="wait">
                    <motion.b key={trip} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} style={{ color: trip === 0 ? 'var(--ok)' : undefined }}>
                      {trip === 0 ? t(STR.free) : money(trip)}
                    </motion.b>
                  </AnimatePresence>
                </div>
                <div className="divider" />
                <div className="row" style={{ alignItems: 'flex-end' }}>
                  <span style={{ fontWeight: 700 }}>{t(STR.total)}</span>
                  <span className="price" style={{ fontSize: 30 }}><AnimatedNumber value={total} /></span>
                </div>
                <div className="xs muted" style={{ marginTop: 10, display: 'flex', gap: 6, alignItems: 'center' }}>
                  <ShieldCheck size={14} color="#B08A35" /> {t(STR.payLater)}
                </div>
              </motion.div>

              <motion.button className="btn block" style={{ marginTop: 16, height: 62, justifyContent: 'space-between', paddingLeft: 26 }} whileTap={{ scale: 0.97 }} onClick={() => setCheckout(true)}>
                <span>{t(STR.schedule)}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                  {money(total)} <span className="btn-arrow"><ArrowRight size={18} /></span>
                </span>
              </motion.button>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 14 }} className="xs muted">
                <ShoppingBag size={13} /> {t({ en: 'Estimates for standard jobs. Final price confirmed on site before work starts.', es: 'Estimados para trabajos estándar. Precio final confirmado antes de comenzar.' })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
