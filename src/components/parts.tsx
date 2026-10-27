import { AnimatePresence, motion, useMotionValue, useTransform, animate, type PanInfo } from 'framer-motion'
import { ArrowRight, BadgeDollarSign, Check, ChevronsRight, ClipboardList, House, Images, Info, LayoutGrid, MoveHorizontal, Ruler, ShoppingBag, Wrench, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { BUSINESS, CATEGORIES, IMG, SERVICES, STR, UNIT, type Service } from '../data'
import { track } from '../track'
import { defaultQty, isMeasured, money, priceLabel, qtyLabel, stepOf, useApp, type Tab } from '../store'
import { AddButton, AnimatedNumber, CheckDot, Img, Logo, MaskLine, Stepper, Wordmark, ease } from './ui'

/* ---------------- Service row ---------------- */
export function ServiceRow({ s, i = 0 }: { s: Service; i?: number }) {
  const { t, lang, cart, add, setQty, openSheet, showToast } = useApp()
  const qty = cart[s.id] ?? 0
  const tint = CATEGORIES.find((c) => c.id === s.cat)!.tint
  return (
    <motion.div
      layout
      className="svc"
      style={{ ['--tint' as string]: tint }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.6, ease, delay: Math.min(i, 6) * 0.05 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => openSheet(s)}
      role="button"
    >
      <div className="svc-img"><Img src={s.img} alt={t(s.name)} /></div>
      <div className="svc-body">
        <div className="svc-title">{t(s.name)}</div>
        <div className="svc-desc">{t(s.desc)}</div>
        {s.notes && <div className="svc-note"><Info size={11} /> {t(s.notes[0])}</div>}
        <div className="svc-foot" style={{ marginTop: 8 }}>
          <div className="price">
            {s.from && <span className="from">{t(STR.from)} </span>}
            {money(s.price)}<small>{t(UNIT[s.kind].per)}</small>
          </div>
          <AnimatePresence mode="popLayout" initial={false}>
            {qty > 0 ? (
              <motion.div key="st" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                {isMeasured(s) ? (
                  <button className="qty-chip" onClick={(e) => { e.stopPropagation(); openSheet(s) }}>{qtyLabel(s, qty, lang)}</button>
                ) : (
                  <Stepper qty={qty} onChange={(n) => setQty(s.id, n)} />
                )}
              </motion.div>
            ) : (
              <motion.div key="add" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                <AddButton
                  label={t(STR.add)}
                  onClick={() => {
                    if (isMeasured(s)) return openSheet(s)
                    add(s.id)
                    track('add_to_estimate', { service: s.id })
                    showToast(`${t(s.name)} · ${t(STR.added)}`)
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

/* ---------------- Bottom nav ---------------- */
const NAV: { id: Tab; icon: typeof House; label: keyof typeof STR }[] = [
  { id: 'home', icon: House, label: 'home' },
  { id: 'services', icon: LayoutGrid, label: 'services' },
  { id: 'work', icon: Images, label: 'workTitle' },
  { id: 'cart', icon: ShoppingBag, label: 'cart' },
  { id: 'bookings', icon: ClipboardList, label: 'bookings' },
]

export function BottomNav() {
  const { tab, go, count, bookings, t } = useApp()
  return (
    <div className="nav-wrap">
      <motion.nav className="nav" initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease, delay: 0.2 }}>
        {NAV.map(({ id, icon: Icon, label }) => (
          <motion.button key={id} className={`nav-btn ${tab === id ? 'on' : ''}`} whileTap={{ scale: 0.88 }} onClick={() => go(id)} aria-label={t(STR[label] as { en: string; es: string })}>
            {tab === id && <motion.span layoutId="navbg" className="nav-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <Icon size={22} strokeWidth={tab === id ? 2.2 : 1.8} />
            {id === 'cart' && count > 0 && (
              <motion.span key={count} className="badge" initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 600, damping: 18 }}>{count}</motion.span>
            )}
            {id === 'bookings' && bookings.length > 0 && <span className="badge" style={{ minWidth: 10, height: 10, padding: 0, top: 10, right: 10 }} />}
          </motion.button>
        ))}
      </motion.nav>
    </div>
  )
}

/* ---------------- Floating estimate bar ---------------- */
export function CartBar() {
  const { count, total, tab, go, t, sheet, checkout, project } = useApp()
  const show = count > 0 && tab !== 'cart' && !sheet && !checkout && !project
  return (
    <div className="cartbar-wrap">
      <AnimatePresence>
        {show && (
          <motion.button
            className="cartbar"
            initial={{ y: 90, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 90, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => go('cart')}
          >
            <motion.span key={count} className="count" initial={{ scale: 1.5 }} animate={{ scale: 1 }}>{count}</motion.span>
            <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
              <div className="xs" style={{ opacity: 0.85, fontWeight: 600 }}>{t(STR.total)}</div>
              <div style={{ fontWeight: 800, fontSize: 18 }}><AnimatedNumber value={total} /></div>
            </div>
            <span className="go">{t(STR.viewEstimate)} <ArrowRight size={16} /></span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------------- Service bottom sheet ---------------- */
export function ServiceSheet() {
  const { sheet, openSheet } = useApp()
  return (
    <AnimatePresence>
      {sheet && <SheetBody key={sheet.id} s={sheet} onClose={() => openSheet(null)} />}
    </AnimatePresence>
  )
}

function SheetBody({ s, onClose }: { s: Service; onClose: () => void }) {
  const { t, lang, cart, setQty, showToast } = useApp()
  const inCart = cart[s.id] ?? 0
  const step = stepOf(s)
  const measured = isMeasured(s)
  const [qty, setQ] = useState(inCart || defaultQty(s))
  const [raw, setRaw] = useState(String(inCart || defaultQty(s)))
  const cat = CATEGORIES.find((c) => c.id === s.cat)!
  const setBoth = (n: number) => {
    const v = Math.max(1, Math.round(n))
    setQ(v)
    setRaw(String(v))
  }
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 600) onClose()
  }
  const lineTotal = Math.round(s.price * qty * 100) / 100
  const own = s.notes ?? []
  const notes = [...own, STR.basePrice, STR.minimumNote]
  return (
    <>
      <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div
        className="sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={onDragEnd}
      >
        <div className="sheet-hero">
          <span className="grabber" />
          <motion.div initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease }} style={{ height: '100%' }}>
            <Img src={s.img.replace('w=800&h=600', 'w=900&h=700')} alt={t(s.name)} />
          </motion.div>
          <button className="close-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <div style={{ padding: '0 20px', marginTop: -26, position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6, ease }}>
            <span className="pill" style={{ background: cat.tint }}>{t(cat.name)}</span>
            <h2 className="h2" style={{ marginTop: 12, fontSize: 26 }}>{t(s.name)}</h2>
            <p className="muted" style={{ margin: '8px 0 14px', lineHeight: 1.5, fontSize: 14.5 }}>{t(s.desc)}</p>
            <div className="meta">
              <span><BadgeDollarSign size={14} /> {s.from && `${t(STR.from)} `}{priceLabel(s, lang)}</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6, ease }} className="card" style={{ padding: '8px 18px', marginTop: 18, borderRadius: 22 }}>
            <div className="h3" style={{ padding: '10px 0 4px' }}>{t(STR.goodToKnow)}</div>
            {notes.map((n, k) => (
              <motion.div key={k} className="incl" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + k * 0.07 }}>
                {k < own.length ? <span className="incl-ico" style={{ background: '#141414', color: '#fff' }}><Info size={13} /></span> : <CheckDot />} {t(n)}
              </motion.div>
            ))}
          </motion.div>

          {measured && (
            <div className="card" style={{ padding: 16, marginTop: 14, borderRadius: 22 }} onPointerDownCapture={(e) => e.stopPropagation()}>
              <div className="xs muted" style={{ fontWeight: 700, display: 'flex', gap: 6, alignItems: 'center' }}><Ruler size={13} /> {t(STR.howMuch)}</div>
              <div className="row" style={{ marginTop: 10 }}>
                <label className="measure">
                  <input
                    inputMode="numeric"
                    value={raw}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
                      setRaw(v)
                      if (Number(v) > 0) setQ(Number(v))
                    }}
                    onBlur={() => setBoth(Number(raw) || defaultQty(s))}
                    aria-label={t(STR.howMuch)}
                  />
                  <span>{t(UNIT[s.kind].short)}</span>
                </label>
                <Stepper light qty={qty} hideValue onChange={(n) => setBoth(qty + (n > qty ? step : -step))} />
              </div>
            </div>
          )}

          <div className="row" style={{ marginTop: 18 }}>
            <div>
              <div className="xs muted" style={{ fontWeight: 600 }}>{measured ? qtyLabel(s, qty, lang) : t(STR.quantity)} × {money(s.price)}</div>
              <div className="price" style={{ fontSize: 28, marginTop: 2 }}><AnimatedNumber value={lineTotal} /></div>
            </div>
            {!measured && <Stepper light qty={qty} onChange={(n) => setBoth(n)} />}
          </div>

          <motion.button
            className="btn block"
            style={{ marginTop: 18 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setQty(s.id, qty)
              track('add_to_estimate', { service: s.id, qty })
              showToast(`${t(s.name)} · ${t(STR.added)}`)
              onClose()
            }}
          >
            {inCart ? t(STR.update) : t(STR.addToEstimate)} · {money(lineTotal)}
          </motion.button>
        </div>
      </motion.div>
    </>
  )
}

/* ---------------- Toast ---------------- */
export function Toast() {
  const { toast } = useApp()
  return (
    <div className="toast-wrap">
      <AnimatePresence>
        {toast && (
          <motion.div className="toast" initial={{ y: -60, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: -60, opacity: 0 }} transition={{ type: 'spring', stiffness: 420, damping: 30 }}>
            <span className="ok"><Check size={16} strokeWidth={3} /></span>
            <span style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------------- Before / after slider ---------------- */
export function BeforeAfter() {
  const { t } = useApp()
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(50)
  const move = (clientX: number) => {
    const r = ref.current!.getBoundingClientRect()
    setPos(Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100)))
  }
  return (
    <div
      ref={ref}
      className="ba"
      onPointerDown={(e) => { (e.target as HTMLElement).setPointerCapture?.(e.pointerId); move(e.clientX) }}
      onPointerMove={(e) => { if (e.buttons || e.pointerType === 'touch') move(e.clientX) }}
    >
      <img src={IMG.washing2.replace('w=800&h=600', 'w=900&h=600')} alt="" />
      <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img className="before" src={IMG.washing2.replace('w=800&h=600', 'w=900&h=600')} alt="" />
        <div className="grime" />
      </div>
      <span className="ba-label" style={{ left: 14 }}>{t(STR.before)}</span>
      <span className="ba-label" style={{ right: 14, background: 'rgba(176,138,53,.9)' }}>{t(STR.after)}</span>
      <div className="ba-handle" style={{ left: `${pos}%` }}>
        <motion.div className="ba-knob" animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
          <MoveHorizontal size={20} />
        </motion.div>
      </div>
    </div>
  )
}

/* ---------------- Onboarding ---------------- */
export function Onboarding({ onDone }: { onDone: () => void }) {
  const { t, lang, setLang } = useApp()
  const track = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const fill = useTransform(x, (v) => v + 60)
  const labelOpacity = useTransform(x, [0, 140], [1, 0])
  const max = () => (track.current ? track.current.offsetWidth - 66 : 260)

  return (
    <motion.div className="onb" exit={{ opacity: 0, transition: { duration: 0.5, ease } }}>
      <motion.div className="onb-inner" exit={{ scale: 1.04, transition: { duration: 0.5, ease } }}>
        <div className="onb-stage">
          {/* soft gold sun + rings behind the pro */}
          <motion.div className="onb-sun" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.4, ease }} />
          <motion.div className="onb-ring" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1, rotate: 360 }}
            transition={{ scale: { duration: 1.4, ease, delay: 0.1 }, opacity: { duration: 1, delay: 0.1 }, rotate: { duration: 60, repeat: Infinity, ease: 'linear' } }} />
          <motion.div className="onb-ring onb-ring-2" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.6, ease, delay: 0.2 }} />
          <motion.div className="onb-watermark" initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1.4, ease, delay: 0.15 }}>
            {BUSINESS.name.split(' ')[0]}
          </motion.div>

          <motion.picture className="onb-pro" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.2, ease, delay: 0.2 }}>
            <motion.img
              srcSet="/hero-sm.webp 543w, /hero.webp 1086w"
              sizes="(max-width: 440px) 100vw, 440px"
              src="/hero.webp"
              alt={`${BUSINESS.name} professional`}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
            />
          </motion.picture>

          {[
            { k: 'r', cls: 'c1', d: 0.9, icon: <BadgeDollarSign size={14} color="#B08A35" />, text: t({ en: 'Base prices upfront', es: 'Precios base claros' }) },
            { k: 's', cls: 'c2', d: 1.05, icon: <Wrench size={14} color="#B08A35" />, text: t({ en: `${SERVICES.length} services · one team`, es: `${SERVICES.length} servicios · un equipo` }) },
            { k: 'c', cls: 'c3', d: 1.2, icon: <Check size={14} color="#B08A35" />, text: t({ en: 'Plumbing · Electrical · Handyman', es: 'Plomería · Electricidad · Handyman' }) },
          ].map((c, i) => (
            <motion.div key={c.k} className={`onb-chip ${c.cls}`} initial={{ opacity: 0, scale: 0.6, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18, delay: c.d }}>
              <motion.span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }} animate={{ y: [0, i % 2 ? 5 : -5, 0] }} transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: 1.6 + i * 0.3 }}>
                {c.icon} {c.text}
              </motion.span>
            </motion.div>
          ))}
        </div>

        <div style={{ position: 'absolute', top: 18, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <motion.div className="pill" style={{ height: 44, padding: '0 14px 0 6px', gap: 8 }} initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.7, ease }}>
            <Logo size={34} /> <Wordmark />
          </motion.div>
          <motion.button className="pill" style={{ height: 36, fontWeight: 700 }} onClick={() => setLang(lang === 'en' ? 'es' : 'en')} initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.7, ease }}>
            {lang === 'en' ? 'ES' : 'EN'}
          </motion.button>
        </div>

        <div className="onb-body">
          <motion.div className="onb-kicker" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45, duration: 0.6, ease }}>
            <span /> {t(BUSINESS.tagline)}
          </motion.div>
          <h1 className="h1" style={{ fontSize: 42 }}>
            <MaskLine delay={0.5}>{t(STR.onbTitle1)}</MaskLine>
            <MaskLine delay={0.62}><span className="light">{t(STR.onbTitle2)} </span><span className="gold">{t(STR.onbTitle3)}</span></MaskLine>
          </h1>
          <motion.p className="muted" style={{ margin: '14px 0 26px', fontSize: 15, lineHeight: 1.5, maxWidth: 330 }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.7, ease }}>
            {t(STR.onbSub)}
          </motion.p>

          <motion.div ref={track} className="swipe" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.7, ease }}>
            <motion.div className="swipe-fill" style={{ width: fill }} />
            <motion.div className="swipe-label" style={{ opacity: labelOpacity }}>
              <span className="shimmer">{t(STR.slide)}</span>
              <ChevronsRight size={18} color="#8f8a7e" />
            </motion.div>
            <motion.div
              className="swipe-knob"
              drag="x"
              dragConstraints={track}
              dragElastic={0}
              dragMomentum={false}
              style={{ x }}
              whileTap={{ scale: 0.95 }}
              onDragEnd={() => {
                if (x.get() > max() * 0.6) animate(x, max(), { duration: 0.2 }).then(onDone)
                else animate(x, 0, { type: 'spring', stiffness: 500, damping: 30 })
              }}
              onTap={() => animate(x, max(), { duration: 0.45, ease }).then(onDone)}
            >
              <ArrowRight size={22} />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
