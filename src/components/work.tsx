import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Calendar, Images, MapPin, MessageCircle, MoveHorizontal, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { BUSINESS, CATEGORIES, SERVICES, STR } from '../data'
import { useIsDesktop } from '../hooks'
import { getProjects, monthLabel, orientation, tx, type Photo, type Project } from '../portfolio'
import { useApp } from '../store'
import { track } from '../track'
import { waLink } from '../screens/Home'
import { CAT_ICON, MaskLine, ease } from './ui'

/** Grid ratio follows the photo, clamped so very tall/wide shots still look tidy. */
const cardRatio = (p: Photo) => Math.min(4 / 3, Math.max(3 / 4, p.w / p.h))

export function SampleTag() {
  const { t } = useApp()
  return <span className="sample-tag">{t({ en: 'Sample photo', es: 'Foto de ejemplo' })}</span>
}

/* ---------------- Card (masonry grid) ---------------- */
export function ProjectCard({ p, i = 0 }: { p: Project; i?: number }) {
  const { lang, openProject } = useApp()
  const cover = p.photos[0]
  const cat = CATEGORIES.find((c) => c.id === p.category)!
  const [loaded, setLoaded] = useState(false)
  return (
    <motion.button
      className="work-card"
      style={{ aspectRatio: String(cardRatio(cover)) }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.7, ease, delay: (i % 2) * 0.08 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => openProject(p)}
    >
      <motion.img
        src={cover.thumb ?? cover.src}
        alt={tx(p.title, lang)}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        initial={{ scale: 1.15 }}
        animate={{ scale: loaded ? 1 : 1.15, opacity: loaded ? 1 : 0 }}
        transition={{ duration: 1, ease }}
      />
      <span className="work-shade" />
      <span className="work-cat" style={{ background: cat.tint }}>{CAT_ICON[p.category]({ size: 13 })}</span>
      {p.photos.length > 1 && <span className="work-count"><Images size={12} /> {p.photos.length}</span>}
      <span className="work-info">
        <b>{tx(p.title, lang)}</b>
        {p.town && <small><MapPin size={11} /> {p.town}</small>}
      </span>
      {p.sample && <SampleTag />}
    </motion.button>
  )
}

export function Masonry({ projects }: { projects: Project[] }) {
  // Two columns, balanced by photo height so vertical and horizontal shots interleave nicely.
  const n = useIsDesktop() ? 4 : 2
  const cols: Project[][] = Array.from({ length: n }, () => [])
  const heights = Array(n).fill(0)
  for (const p of projects) {
    const k = heights.indexOf(Math.min(...heights))
    cols[k].push(p)
    heights[k] += 1 / cardRatio(p.photos[0])
  }
  let idx = 0
  return (
    <div className="masonry" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
      {cols.map((col, k) => (
        <div key={k} className="masonry-col">
          <AnimatePresence mode="popLayout">
            {col.map((p) => (
              <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4, ease }}>
                <ProjectCard p={p} i={idx++} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

/* ---------------- Home strip ---------------- */
export function WorkStrip() {
  const { t, lang, go, openProject } = useApp()
  const all = getProjects()
  const list = (all.filter((p) => p.featured).length ? all.filter((p) => p.featured) : all).slice(0, 6)
  if (!list.length) return null
  return (
    <section className="sec work-strip">
      <div className="sec-head">
        <div>
          <h2 className="h2"><MaskLine inView>{t(STR.workTitle)}</MaskLine></h2>
          <div className="small muted" style={{ marginTop: 4 }}>{t(STR.workSub)}</div>
        </div>
        <button className="link" onClick={() => go('work')}>{t(STR.seeAll)}</button>
      </div>
      <div className="hscroll">
        {list.map((p, i) => (
          <motion.button
            key={p.id}
            className="work-strip-card"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease, delay: i * 0.07 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => openProject(p)}
          >
            <img src={p.photos[0].thumb ?? p.photos[0].src} alt={tx(p.title, lang)} loading="lazy" />
            <span className="work-shade" />
            <span className="work-info">
              <span className="pill" style={{ height: 24, fontSize: 11, alignSelf: 'flex-start', marginBottom: 8 }}>{t(CATEGORIES.find((c) => c.id === p.category)!.short)}</span>
              <b>{tx(p.title, lang)}</b>
              {p.town && <small><MapPin size={11} /> {p.town}</small>}
            </span>
            {p.sample && <SampleTag />}
          </motion.button>
        ))}
      </div>
    </section>
  )
}

/* ---------------- Full-screen project viewer ---------------- */
export function ProjectViewer() {
  const { project, openProject } = useApp()
  useEffect(() => {
    if (!project) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && openProject(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [project, openProject])
  return (
    <AnimatePresence>
      {project && (
        <motion.div key={project.id} className="full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="full-inner viewer" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 260, damping: 32 }}>
            <ViewerBody p={project} onClose={() => openProject(null)} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ViewerBody({ p, onClose }: { p: Project; onClose: () => void }) {
  const { t, lang, openSheet, openProject } = useApp()
  const track_ = useRef<HTMLDivElement>(null)
  const [idx, setIdx] = useState(0)
  const cat = CATEGORIES.find((c) => c.id === p.category)!
  const services = (p.services ?? []).map((id) => SERVICES.find((s) => s.id === id)).filter(Boolean) as typeof SERVICES
  const more = getProjects().filter((x) => x.id !== p.id && x.category === p.category).slice(0, 4)

  const goTo = (i: number) => track_.current?.scrollTo({ left: i * track_.current.clientWidth, behavior: 'smooth' })
  const msg = lang === 'es'
    ? `Hola ${BUSINESS.name} 👋 Vi el trabajo "${tx(p.title, lang)}" en su web y quiero algo similar.`
    : `Hi ${BUSINESS.name} 👋 I saw "${tx(p.title, lang)}" on your site and I'd like something similar.`

  return (
    <div className="viewer-body">
      {/* Gallery: each photo shown whole (contain) over a blurred copy, so vertical and horizontal both fill the frame. */}
      <div className="gallery">
        <div
          ref={track_}
          className="gallery-track"
          onScroll={(e) => {
            const el = e.currentTarget
            setIdx(Math.round(el.scrollLeft / el.clientWidth))
          }}
        >
          {p.photos.map((ph, i) => (
            <div key={i} className={`gallery-slide ${orientation(ph)}`}>
              <img className="gallery-bg" src={ph.thumb ?? ph.src} alt="" aria-hidden />
              <motion.img
                className="gallery-img"
                src={ph.src}
                alt={tx(ph.caption, lang) || tx(p.title, lang)}
                initial={{ scale: 1.08, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.9, ease, delay: 0.15 }}
              />
              {ph.caption && <span className="gallery-cap">{tx(ph.caption, lang)}</span>}
            </div>
          ))}
        </div>
        <button className="close-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        {p.sample && <SampleTag />}
        {p.photos.length > 1 && (
          <>
            <span className="gallery-counter">{idx + 1} / {p.photos.length}</span>
            <div className="gallery-dots">
              {p.photos.map((_, i) => (
                <button key={i} onClick={() => goTo(i)} aria-label={`Photo ${i + 1}`}>
                  {i === idx && <motion.span layoutId="gdot" className="gallery-dot-on" />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {p.photos.length > 1 && (
        <div className="thumbs">
          {p.photos.map((ph, i) => (
            <button key={i} className={i === idx ? 'on' : ''} onClick={() => goTo(i)}>
              <img src={ph.thumb ?? ph.src} alt="" />
            </button>
          ))}
        </div>
      )}

      <div style={{ padding: '18px 20px 0' }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6, ease }}>
          <span className="pill" style={{ background: cat.tint }}>{CAT_ICON[p.category]({ size: 13 })} {t(cat.name)}</span>
          <h1 className="h1" style={{ fontSize: 28, marginTop: 12 }}><MaskLine delay={0.15}>{tx(p.title, lang)}</MaskLine></h1>
          <div className="meta" style={{ marginTop: 12 }}>
            {p.town && <span><MapPin size={13} /> {p.town}</span>}
            {p.date && <span><Calendar size={13} /> {monthLabel(p.date, lang)}</span>}
            <span><Images size={13} /> {p.photos.length} {t({ en: p.photos.length === 1 ? 'photo' : 'photos', es: p.photos.length === 1 ? 'foto' : 'fotos' })}</span>
          </div>
          {p.description && <p style={{ fontSize: 15, lineHeight: 1.6, margin: '16px 0 0', color: 'var(--ink-2)' }}>{tx(p.description, lang)}</p>}
        </motion.div>

        {p.beforeAfter && (
          <div className="sec" style={{ marginTop: 24 }}>
            <div className="h3" style={{ marginBottom: 10 }}>{t(STR.beforeAfter)}</div>
            <PairSlider before={p.beforeAfter.before} after={p.beforeAfter.after} />
          </div>
        )}

        {services.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6, ease }} style={{ marginTop: 24 }}>
            <div className="h3" style={{ marginBottom: 10 }}>{t({ en: 'Services in this job', es: 'Servicios de este trabajo' })}</div>
            <div className="card">
              {services.map((s) => (
                <button key={s.id} className="list-row" style={{ width: '100%', textAlign: 'left' }} onClick={() => { openProject(null, true); openSheet(s) }}>
                  <span className="list-ico" style={{ background: cat.tint }}>{CAT_ICON[s.cat]({ size: 17 })}</span>
                  <span className="small" style={{ flex: 1, fontWeight: 700 }}>{t(s.name)}</span>
                  <ArrowRight size={16} color="#a39e92" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <a className="btn gold block" style={{ marginTop: 22, height: 58 }} href={waLink(msg)} target="_blank" rel="noreferrer" onClick={() => track('whatsapp_click', { from: 'portfolio', project: p.id })}>
          <MessageCircle size={18} /> {t({ en: 'I want something like this', es: 'Quiero algo así' })}
        </a>

        {more.length > 0 && (
          <div style={{ marginTop: 30 }}>
            <div className="h3" style={{ marginBottom: 12 }}>{t({ en: 'More', es: 'Más de' })} {t(cat.name).toLowerCase()}</div>
            <div className="hscroll">
              {more.map((m) => (
                <button key={m.id} className="work-mini" onClick={() => openProject(m)}>
                  <img src={m.photos[0].thumb ?? m.photos[0].src} alt="" loading="lazy" />
                  <b>{tx(m.title, lang)}</b>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/** Before/after for a real matching pair of photos. */
function PairSlider({ before, after }: { before: Photo; after: Photo }) {
  const { t } = useApp()
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(50)
  const move = (x: number) => {
    const r = ref.current!.getBoundingClientRect()
    setPos(Math.min(96, Math.max(4, ((x - r.left) / r.width) * 100)))
  }
  return (
    <div ref={ref} className="ba" style={{ aspectRatio: String(after.w / after.h), height: 'auto', maxHeight: '70dvh' }}
      onPointerDown={(e) => move(e.clientX)} onPointerMove={(e) => { if (e.buttons || e.pointerType === 'touch') move(e.clientX) }}>
      <img src={after.src} alt="" />
      <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - pos}% 0 0)` }}><img src={before.src} alt="" /></div>
      <span className="ba-label" style={{ left: 14 }}>{t(STR.before)}</span>
      <span className="ba-label" style={{ right: 14, background: 'rgba(176,138,53,.9)' }}>{t(STR.after)}</span>
      <div className="ba-handle" style={{ left: `${pos}%` }}><div className="ba-knob"><MoveHorizontal size={20} /></div></div>
    </div>
  )
}
