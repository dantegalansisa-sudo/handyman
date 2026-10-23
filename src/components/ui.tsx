import { animate, motion, useInView, useMotionValue, useTransform, type Variants } from 'framer-motion'
import { Droplets, BrickWall, PaintRoller, Layers, Wrench, SprayCan, Zap, Check, Plus, Minus, Star } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { CategoryId } from '../data'

export const ease = [0.22, 1, 0.36, 1] as const

export function Logo({ size = 40, dark = false }: { size?: number; dark?: boolean }) {
  const ink = dark ? '#fff' : '#121212'
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-label="Torres Handyman">
      <path d="M6 29 L32 7 L58 29" fill="none" stroke="#B08A35" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 25 V54 H52" fill="none" stroke="#B08A35" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
      <g transform="translate(31 36)" fill={ink}>
        <circle r="9.5" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
          <rect key={r} x="-2.6" y="-13" width="5.2" height="6" rx="1" transform={`rotate(${r})`} />
        ))}
      </g>
      <circle cx="31" cy="36" r="4.6" fill={dark ? '#141414' : '#f6f3ea'} />
      <path d="M37 42 L47 52" stroke={ink} strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

export function Wordmark({ dark = false }: { dark?: boolean }) {
  return (
    <div style={{ lineHeight: 1 }}>
      <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: '0.14em', color: '#B08A35' }}>TORRES</div>
      <div style={{ fontWeight: 800, fontSize: 12.5, letterSpacing: '0.2em', color: dark ? '#fff' : '#121212', marginTop: 2 }}>HANDYMAN</div>
    </div>
  )
}

export const CAT_ICON: Record<CategoryId, (p: { size?: number }) => ReactNode> = {
  electrical: (p) => <Zap size={p.size ?? 24} strokeWidth={1.8} />,
  plumbing: (p) => <Droplets size={p.size ?? 24} strokeWidth={1.8} />,
  pvc: (p) => <Wrench size={p.size ?? 24} strokeWidth={1.8} />,
  concrete: (p) => <BrickWall size={p.size ?? 24} strokeWidth={1.8} />,
  painting: (p) => <PaintRoller size={p.size ?? 24} strokeWidth={1.8} />,
  drywall: (p) => <Layers size={p.size ?? 24} strokeWidth={1.8} />,
  washing: (p) => <SprayCan size={p.size ?? 24} strokeWidth={1.8} />,
}

/** Image that fades in once loaded. */
export function Img({ src, alt = '', className = '', style }: { src: string; alt?: string; className?: string; style?: React.CSSProperties }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      className={`fade-img ${loaded ? 'loaded' : ''} ${className}`}
      style={style}
    />
  )
}

/** Headline line that slides up from behind a mask. */
export function MaskLine({ children, delay = 0, inView = false }: { children: ReactNode; delay?: number; inView?: boolean }) {
  const anim = { y: '0%' }
  return (
    <span className="mask">
      <motion.span
        initial={{ y: '110%' }}
        {...(inView ? { whileInView: anim, viewport: { once: true, margin: '-40px' } } : { animate: anim })}
        transition={{ duration: 0.9, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  )
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease, delay: i * 0.06 } }),
}

/** Fades & lifts children into view on scroll. */
export function Reveal({ children, i = 0, className, style }: { children: ReactNode; i?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.div className={className} style={style} variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-30px' }}>
      {children}
    </motion.div>
  )
}

/** Number that tweens when value changes. */
export function AnimatedNumber({ value, prefix = '$' }: { value: number; prefix?: string }) {
  const mv = useMotionValue(value)
  const text = useTransform(mv, (v) => `${prefix}${Math.round(v).toLocaleString('en-US')}`)
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.6, ease })
    return () => c.stop()
  }, [value, mv])
  return <motion.span>{text}</motion.span>
}

/** Counts up once when scrolled into view. */
export function CountUp({ to, suffix = '', decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const mv = useMotionValue(0)
  const text = useTransform(mv, (v) => v.toFixed(decimals) + suffix)
  useEffect(() => {
    if (inView) animate(mv, to, { duration: 1.6, ease })
  }, [inView, to, mv])
  return <motion.span ref={ref}>{text}</motion.span>
}

export function Stepper({ qty, onChange, light = false }: { qty: number; onChange: (n: number) => void; light?: boolean }) {
  return (
    <motion.div className={`stepper ${light ? 'light' : ''}`} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}>
      <button aria-label="Decrease" onClick={(e) => { e.stopPropagation(); onChange(qty - 1) }}><Minus size={16} /></button>
      <motion.span key={qty} className="n" initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{qty}</motion.span>
      <button aria-label="Increase" onClick={(e) => { e.stopPropagation(); onChange(qty + 1) }}><Plus size={16} /></button>
    </motion.div>
  )
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.button
      className="btn sm"
      whileTap={{ scale: 0.92 }}
      onClick={(e) => { e.stopPropagation(); onClick() }}
      style={{ gap: 6, paddingLeft: 14 }}
    >
      <Plus size={16} /> {label}
    </motion.button>
  )
}

export function Stars({ n = 5, size = 14 }: { n?: number; size?: number }) {
  return (
    <div className="stars">
      {Array.from({ length: n }).map((_, i) => <Star key={i} size={size} fill="currentColor" strokeWidth={0} />)}
    </div>
  )
}

export function CheckDot() {
  return <span className="incl-ico"><Check size={14} strokeWidth={3} /></span>
}
