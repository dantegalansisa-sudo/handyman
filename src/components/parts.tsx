import { AnimatePresence, motion, useMotionValue, useTransform, animate, type PanInfo } from 'framer-motion'
import { ArrowRight, Check, ChevronsRight, ClipboardList, Clock, House, LayoutGrid, MoveHorizontal, ShoppingBag, Star, User, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { CATEGORIES, IMG, STR, type Service } from '../data'
import { money, useApp, type Tab } from '../store'
import { AddButton, AnimatedNumber, CheckDot, Img, Logo, MaskLine, Stepper, Wordmark, ease } from './ui'

/* ---------------- Service row ---------------- */
export function ServiceRow({ s, i = 0 }: { s: Service; i?: number }) {
  const { t, cart, add, setQty, openSheet, showToast } = useApp()
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
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <div className="svc-title">{t(s.name)}</div>
        </div>
        <div className="svc-desc">{t(s.desc)}</div>
        <div className="xs muted" style={{ display: 'flex', gap: 10, marginTop: 6, alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center' }}><Star size={12} fill="#B08A35" strokeWidth={0} /> {s.rating}</span>
          <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center' }}><Clock size={12} /> {t(s.time)}</span>
        </div>
        <div className="svc-foot" style={{ marginTop: 8 }}>
          <div className="price">{money(s.price)}<small>{t(s.unit)}</small></div>
          <AnimatePresence mode="popLayout" initial={false}>
            {qty > 0 ? (
              <motion.div key="st" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                <Stepper qty={qty} onChange={(n) => setQty(s.id, n)} />
              </motion.div>
            ) : (
              <motion.div key="add" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                <AddButton label={t(STR.add)} onClick={() => { add(s.id); showToast(`${t(s.name)} · ${t(STR.added)}`) }} />
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
  { id: 'cart', icon: ShoppingBag, label: 'cart' },
  { id: 'bookings', icon: ClipboardList, label: 'bookings' },
  { id: 'profile', icon: User, label: 'profile' },
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
  const { count, total, tab, go, t, sheet, checkout } = useApp()
  const show = count > 0 && tab !== 'cart' && !sheet && !checkout
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
  const { t, cart, setQty, showToast } = useApp()
  const inCart = cart[s.id] ?? 0
  const [qty, setQ] = useState(inCart || 1)
  const cat = CATEGORIES.find((c) => c.id === s.cat)!
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 600) onClose()
  }
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
              <span><Star size={13} fill="#B08A35" strokeWidth={0} /> {s.rating} (120+)</span>
              <span><Clock size={13} /> {t(s.time)}</span>
              <span><Check size={13} /> {t(STR.why[3].t)}</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6, ease }} className="card" style={{ padding: '8px 18px', marginTop: 18, borderRadius: 22 }}>
            <div className="h3" style={{ padding: '10px 0 4px' }}>{t(STR.included)}</div>
            {s.includes.map((inc, k) => (
              <motion.div key={k} className="incl" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + k * 0.07 }}>
                <CheckDot /> {t(inc)}
              </motion.div>
            ))}
          </motion.div>

          <div className="row" style={{ marginTop: 18 }}>
            <div>
              <div className="xs muted" style={{ fontWeight: 600 }}>{t(STR.quantity)} · {money(s.price)} {t(s.unit)}</div>
              <div className="price" style={{ fontSize: 28, marginTop: 2 }}><AnimatedNumber value={s.price * qty} /></div>
            </div>
            <Stepper light qty={qty} onChange={(n) => setQ(Math.max(1, n))} />
          </div>

          <motion.button
            className="btn block"
            style={{ marginTop: 18 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setQty(s.id, qty)
              showToast(`${t(s.name)} · ${t(STR.added)}`)
              onClose()
            }}
          >
            {inCart ? t(STR.update) : t(STR.addToEstimate)} · {money(s.price * qty)}
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
        <motion.div className="onb-photo" initial={{ scale: 1.2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.4, ease }}>
          <img src={IMG.hero} alt="Torres Handyman professional" />
        </motion.div>

        <div style={{ position: 'absolute', top: 18, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <motion.div className="pill" style={{ height: 44, padding: '0 14px 0 6px', gap: 8 }} initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.7, ease }}>
            <Logo size={34} /> <Wordmark />
          </motion.div>
          <motion.button className="pill" style={{ height: 36, fontWeight: 700 }} onClick={() => setLang(lang === 'en' ? 'es' : 'en')} initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.7, ease }}>
            {lang === 'en' ? 'ES' : 'EN'}
          </motion.button>
        </div>

        <div className="onb-body">
          <motion.div className="rating-pill" style={{ marginBottom: 16, boxShadow: 'var(--shadow)' }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.6, ease }}>
            <Star size={13} fill="#B08A35" strokeWidth={0} /> {t(STR.rated)}
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
