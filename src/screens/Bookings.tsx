import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Calendar, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Fragment } from 'react'
import { BUSINESS, IMG, STR } from '../data'
import { byId, money, useApp } from '../store'
import { Img, MaskLine, ease } from '../components/ui'
import { waLink } from './Home'
import { bookingMessage } from './Checkout'

export default function Bookings() {
  const { t, lang, bookings, go, removeBooking } = useApp()
  return (
    <div>
      <header className="topbar"><span style={{ width: 44 }} /><div style={{ fontWeight: 800, fontSize: 17 }}>{t(STR.bookings)}</div><a className="icon-btn" href={BUSINESS.phoneHref} aria-label="Call"><Phone size={18} /></a></header>
      <div className="page">
        {bookings.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', paddingTop: 30 }}>
            <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}
              style={{ width: 200, height: 200, margin: '0 auto', borderRadius: '50%', overflow: 'hidden', border: '8px solid #fff', boxShadow: 'var(--shadow)' }}>
              <Img src={IMG.pro2} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
            <h2 className="h2" style={{ marginTop: 26 }}>{t(STR.noBookings)}</h2>
            <p className="muted" style={{ maxWidth: 290, margin: '10px auto 24px', lineHeight: 1.5 }}>{t(STR.noBookingsSub)}</p>
            <motion.button className="btn" whileTap={{ scale: 0.95 }} onClick={() => go('services', 'all')}>{t(STR.browse)} <ArrowRight size={16} /></motion.button>
          </motion.div>
        ) : (
          <>
            <h1 className="h1" style={{ fontSize: 30, margin: '6px 0 18px' }}><MaskLine>{t(STR.upcoming)}</MaskLine></h1>
            <div style={{ display: 'grid', gap: 12 }}>
              <AnimatePresence initial={false}>
                {bookings.map((b, i) => {
                  const confirmed = Date.now() - b.createdAt > 60_000
                  const stage = confirmed ? 1 : 0
                  const first = byId(b.items[0].id)
                  return (
                    <motion.div key={b.id} layout className="card" style={{ padding: 16, overflow: 'hidden' }}
                      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.6, ease } }} exit={{ opacity: 0, x: -60 }}>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <Img src={first.img} alt="" style={{ width: 64, height: 64, borderRadius: 16, objectFit: 'cover', flex: 'none' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="row">
                            <span className="xs muted" style={{ fontWeight: 700 }}>#{b.id}</span>
                            <span className="pill" style={{ background: stage ? '#e3f1e8' : 'var(--gold-soft)', color: stage ? 'var(--ok)' : 'var(--gold)', height: 24, fontSize: 11 }}>{t(STR.status[stage])}</span>
                          </div>
                          <div className="small" style={{ fontWeight: 700, marginTop: 4, lineHeight: 1.3 }}>
                            {first.name[lang]}{b.items.length > 1 ? ` +${b.items.length - 1}` : ''}
                          </div>
                          <div className="price" style={{ fontSize: 17, marginTop: 2 }}>{money(b.total)}</div>
                        </div>
                      </div>
                      <div className="tl">
                        {STR.status.map((_, k) => (
                          <Fragment key={k}>
                            {k > 0 && <motion.span className={`tl-bar ${k <= stage ? 'on' : ''}`} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ originX: 0 }} transition={{ delay: 0.2 + k * 0.1 }} />}
                            <span className={`tl-dot ${k <= stage ? 'on' : ''}`} />
                          </Fragment>
                        ))}
                      </div>
                      <div className="row xs muted" style={{ marginTop: 6, fontWeight: 600 }}>
                        {STR.status.map((s, k) => <span key={k} style={{ color: k <= stage ? 'var(--ink)' : undefined }}>{t(s)}</span>)}
                      </div>
                      <div className="divider" style={{ margin: '14px 0 10px' }} />
                      <div className="small" style={{ display: 'grid', gap: 6 }}>
                        <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Calendar size={14} /> {b.date} · {b.slot}</span>
                        <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}><MapPin size={14} /> {b.address}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                        <a className="btn gold sm" style={{ flex: 1 }} href={waLink(bookingMessage(b, lang))} target="_blank" rel="noreferrer"><MessageCircle size={15} /> WhatsApp</a>
                        <button className="btn ghost sm" onClick={() => removeBooking(b.id)}>{t(STR.cancel)}</button>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
