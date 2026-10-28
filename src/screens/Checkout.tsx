import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Calendar, Check, Clock, MapPin, MessageCircle, Phone, User, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { BUSINESS, MIN_SERVICE, SLOTS, STR } from '../data'
import { submitRequest } from '../content'
import { byId, isMeasured, money, qtyLabel, useApp, type Booking } from '../store'
import { track } from '../track'
import { MaskLine, ease } from '../components/ui'
import { LegalLinks } from '../components/parts'
import { waLink } from './Home'

function nextDays(n: number) {
  const out: Date[] = []
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  for (let i = 0; out.length < n; i++) {
    const x = new Date(d)
    x.setDate(d.getDate() + i)
    out.push(x)
  }
  return out
}

export function bookingMessage(b: Booking, lang: 'en' | 'es') {
  const lines = b.items.map((it) => {
    const s = byId(it.id)
    const amount = isMeasured(s) ? qtyLabel(s, it.qty, lang) : `${it.qty} ×`
    return `• ${amount} ${s.name[lang]} — ${money(Math.round(s.price * it.qty * 100) / 100)}`
  })
  const head = lang === 'es' ? `Hola ${BUSINESS.name} 👋 Quiero solicitar un servicio (#${b.id}):` : `Hi ${BUSINESS.name} 👋 I'd like to request a service (#${b.id}):`
  return [
    head,
    '',
    ...lines,
    '',
    `${lang === 'es' ? 'Total estimado (precios base)' : 'Estimated total (base prices)'}: ${money(b.total)}`,
    b.total <= MIN_SERVICE ? (lang === 'es' ? `(Servicio mínimo $${MIN_SERVICE})` : `(Minimum service $${MIN_SERVICE})`) : null,
    `${lang === 'es' ? 'Fecha' : 'Date'}: ${b.date} · ${b.slot}`,
    `${lang === 'es' ? 'Nombre' : 'Name'}: ${b.name}`,
    `${lang === 'es' ? 'Tel' : 'Phone'}: ${b.phone}`,
    `${lang === 'es' ? 'Dirección' : 'Address'}: ${b.address}`,
    b.notes ? `${lang === 'es' ? 'Notas' : 'Notes'}: ${b.notes}` : null,
  ].filter((l) => l !== null).join('\n')
}

export default function Checkout() {
  const { checkout, setCheckout } = useApp()
  return (
    <AnimatePresence>
      {checkout && (
        <motion.div className="full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="full-inner" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 260, damping: 32 }}>
            <Flow onClose={() => setCheckout(false)} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Flow({ onClose }: { onClose: () => void }) {
  const { t, lang, cart, total, minAdj, addBooking, clearCart, go } = useApp()
  const days = useMemo(() => nextDays(14), [])
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [day, setDay] = useState(1)
  const [slot, setSlot] = useState(0)
  const [form, setForm] = useState({ name: '', phone: '', address: '', notes: '' })
  const [err, setErr] = useState(false)
  const [done, setDone] = useState<Booking | null>(null)

  const locale = lang === 'es' ? 'es-PR' : 'en-US'
  const dayLabel = (d: Date, i: number) =>
    i === 0 && d.toDateString() === new Date().toDateString() ? t(STR.today) : d.toLocaleDateString(locale, { weekday: 'short' })
  const fullDate = days[day].toLocaleDateString(locale, { weekday: 'long', month: 'short', day: 'numeric' })

  const next = () => {
    if (step === 1 && (!form.name.trim() || form.phone.replace(/\D/g, '').length < 7 || !form.address.trim())) {
      setErr(true)
      return
    }
    setErr(false)
    if (step < 2) {
      setDir(1)
      setStep(step + 1)
      return
    }
    const b: Booking = {
      id: Math.random().toString(36).slice(2, 7).toUpperCase(),
      createdAt: Date.now(),
      date: fullDate,
      slot: SLOTS[slot],
      ...form,
      items: Object.entries(cart).map(([id, qty]) => ({ id, qty })),
      total,
    }
    addBooking(b)
    submitRequest({ ...b, lang, lines: bookingMessage(b, lang) })
    track('booking_request', { value: total, currency: 'USD', items: b.items.length })
    clearCart()
    setDone(b)
  }
  const back = () => {
    if (step === 0) onClose()
    else { setDir(-1); setStep(step - 1) }
  }

  if (done) return <Success b={done} onClose={() => { onClose(); go('bookings') }} />

  const titles = [STR.when, STR.details, { en: 'Review & confirm', es: 'Revisa y confirma' }]

  return (
    <div style={{ padding: '14px 20px 40px', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="row">
        <motion.button whileTap={{ scale: 0.9 }} className="icon-btn" onClick={back} aria-label="Back"><ArrowLeft size={18} /></motion.button>
        <span className="small muted" style={{ fontWeight: 700 }}>{t(STR.step)} {step + 1} {t(STR.of)} 3</span>
        <motion.button whileTap={{ scale: 0.9 }} className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></motion.button>
      </div>
      <div className="progress" style={{ marginTop: 16 }}><motion.div animate={{ width: `${((step + 1) / 3) * 100}%` }} transition={{ duration: 0.6, ease }} /></div>

      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={step}
          custom={dir}
          initial={{ opacity: 0, x: dir * 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -50 }}
          transition={{ duration: 0.4, ease }}
          style={{ flex: 1 }}
        >
          <h1 className="h1" style={{ fontSize: 30, margin: '24px 0 20px' }}><MaskLine>{t(titles[step])}</MaskLine></h1>

          {step === 0 && (
            <>
              <div className="h3" style={{ marginBottom: 10, display: 'flex', gap: 8, alignItems: 'center' }}><Calendar size={16} /> {t(STR.date)}</div>
              <div className="dates">
                {days.map((d, i) => (
                  <motion.button key={i} className={`date ${day === i ? 'on' : ''}`} whileTap={{ scale: 0.93 }} onClick={() => setDay(i)}
                    initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    {day === i && <motion.span layoutId="datebg" className="sel-bg" transition={{ type: 'spring', stiffness: 450, damping: 35 }} />}
                    <small>{dayLabel(d, i)}</small>
                    <b>{d.getDate()}</b>
                    <small style={{ fontSize: 9.5 }}>{d.toLocaleDateString(locale, { month: 'short' })}</small>
                  </motion.button>
                ))}
              </div>
              <div className="h3" style={{ margin: '24px 0 10px', display: 'flex', gap: 8, alignItems: 'center' }}><Clock size={16} /> {t(STR.time)}</div>
              <div className="slots">
                {SLOTS.map((s, i) => (
                  <motion.button key={s} className={`slot ${slot === i ? 'on' : ''}`} whileTap={{ scale: 0.95 }} onClick={() => setSlot(i)}
                    initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.04 }}>
                    {slot === i && <motion.span layoutId="slotbg" className="sel-bg" transition={{ type: 'spring', stiffness: 450, damping: 35 }} />}
                    <span>{s}</span>
                  </motion.button>
                ))}
              </div>
              <div className="card small" style={{ padding: 14, marginTop: 18, borderRadius: 18, display: 'flex', gap: 10, alignItems: 'center' }}>
                <span className="incl-ico"><Check size={14} strokeWidth={3} /></span>
                {t({ en: 'We’ll confirm your quote and time on WhatsApp.', es: 'Te confirmamos el precio y la hora por WhatsApp.' })}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              {([
                ['name', STR.name, 'text', 'name', User],
                ['phone', STR.phone, 'tel', 'tel', Phone],
                ['address', STR.address, 'text', 'street-address', MapPin],
              ] as const).map(([k, label, type, ac, Icon], i) => (
                <motion.label key={k} className="field" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Icon size={13} /> {t(label)}</span>
                  <input
                    className="input"
                    type={type}
                    autoComplete={ac}
                    value={form[k]}
                    onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                    placeholder={k === 'phone' ? '(787) 555-0123' : k === 'address' ? t({ en: 'Street, city, ZIP', es: 'Calle, pueblo, código postal' }) : ''}
                    style={err && !form[k].trim() ? { borderColor: '#c0392b' } : undefined}
                  />
                </motion.label>
              ))}
              <motion.label className="field" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <span>{t(STR.notes)}</span>
                <textarea className="input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder={t({ en: 'Gate code, parking, pets, what’s broken…', es: 'Código del portón, estacionamiento, mascotas, qué está dañado…' })} />
              </motion.label>
              <AnimatePresence>{err && <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="small" style={{ color: '#c0392b', fontWeight: 600 }}>{t(STR.required)}</motion.div>}</AnimatePresence>
            </>
          )}

          {step === 2 && (
            <>
              <div className="card" style={{ padding: 18 }}>
                {Object.entries(cart).map(([id, qty]) => {
                  const s = byId(id)
                  return (
                    <div key={id} className="sum-row">
                      <span><b>{isMeasured(s) ? qtyLabel(s, qty, lang) : `${qty}×`}</b> {t(s.name)}</span>
                      <b>{money(Math.round(s.price * qty * 100) / 100)}</b>
                    </div>
                  )
                })}
                {minAdj > 0 && <div className="sum-row"><span className="muted">{t(STR.minAdj)}</span><b>{money(minAdj)}</b></div>}
                <div className="divider" />
                <div className="row"><b>{t(STR.total)}</b><span className="price" style={{ fontSize: 24 }}>{money(total)}</span></div>
              </div>
              <div className="card" style={{ marginTop: 10 }}>
                {[
                  [Calendar, `${fullDate} · ${SLOTS[slot]}`],
                  [User, `${form.name} · ${form.phone}`],
                  [MapPin, form.address],
                ].map(([Icon, text], i) => {
                  const I = Icon as typeof Calendar
                  return (
                    <div key={i} className="list-row">
                      <span className="list-ico"><I size={18} /></span>
                      <span className="small" style={{ fontWeight: 600 }}>{text as string}</span>
                    </div>
                  )
                })}
              </div>
              <div className="xs muted" style={{ marginTop: 12, lineHeight: 1.5 }}>{t(STR.payLater)}. {t({ en: 'You can cancel anytime.', es: 'Puedes cancelar cuando quieras.' })}<br />
                {t({
                  en: `By sending, you agree that ${BUSINESS.name} may call, text or WhatsApp you at the number above about this request. Message and data rates may apply.`,
                  es: `Al enviar, aceptas que ${BUSINESS.name} te llame, te envíe textos o te escriba por WhatsApp al número de arriba sobre esta solicitud. Pueden aplicar cargos de mensajes y datos.`,
                })}{' '}
                <LegalLinks prefix={t({ en: 'You also accept our', es: 'También aceptas nuestra' })} /></div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <motion.button className="btn block" style={{ marginTop: 24, height: 60 }} whileTap={{ scale: 0.97 }} onClick={next}>
        {step < 2 ? t(STR.continue) : `${t(STR.confirm)} · ${money(total)}`} <ArrowRight size={18} />
      </motion.button>
    </div>
  )
}

function Success({ b, onClose }: { b: Booking; onClose: () => void }) {
  const { t, lang } = useApp()
  return (
    <div style={{ padding: '60px 24px 40px', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
          animate={{ opacity: 0, x: Math.cos((i / 18) * Math.PI * 2) * 160, y: Math.sin((i / 18) * Math.PI * 2) * 160 + 40, scale: 1, rotate: 180 }}
          transition={{ duration: 1.4, ease, delay: 0.25 }}
          style={{ position: 'absolute', top: 130, left: '50%', width: 10, height: 10, borderRadius: i % 2 ? 99 : 3, background: i % 3 ? '#B08A35' : '#141414' }}
        />
      ))}
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 15 }}
        style={{ width: 120, height: 120, borderRadius: '50%', background: '#141414', display: 'grid', placeItems: 'center', boxShadow: '0 0 0 14px #efe6cc' }}>
        <motion.svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#D8BB6E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35, duration: 0.6, ease }} />
        </motion.svg>
      </motion.div>
      <h1 className="h1" style={{ marginTop: 34 }}><MaskLine delay={0.4}>{t(STR.booked)}</MaskLine></h1>
      <motion.p className="muted" style={{ lineHeight: 1.5, maxWidth: 310, margin: '12px 0 22px' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>{t(STR.bookedSub)}</motion.p>
      <motion.div className="card" style={{ width: '100%', padding: 18, textAlign: 'left' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6, ease }}>
        <div className="row"><span className="xs muted" style={{ fontWeight: 700 }}>{t(STR.bookingFor)} #{b.id}</span><span className="pill" style={{ background: 'var(--gold-soft)', height: 26 }}>{t(STR.status[0])}</span></div>
        <div className="h3" style={{ marginTop: 10 }}>{b.date}</div>
        <div className="small muted">{b.slot}</div>
        <div className="divider" />
        <div className="row"><span className="small muted">{b.items.length} {b.items.length === 1 ? t(STR.item) : t(STR.items)}</span><span className="price">{money(b.total)}</span></div>
      </motion.div>
      <motion.div style={{ width: '100%', marginTop: 'auto', paddingTop: 24, display: 'grid', gap: 10 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}>
        <a className="btn gold block" style={{ height: 58 }} href={waLink(bookingMessage(b, lang))} target="_blank" rel="noreferrer" onClick={() => track('whatsapp_click', { from: 'booking_success' })}><MessageCircle size={18} /> {t(STR.sendWa)}</a>
        <button className="btn ghost block" onClick={onClose}>{t(STR.bookings)}</button>
      </motion.div>
    </div>
  )
}
