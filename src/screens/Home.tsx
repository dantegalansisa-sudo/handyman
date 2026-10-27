import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, BadgeDollarSign, ChevronDown, MapPin, MessageCircle, Phone, Search, Truck, User, Users, Wallet, X } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { BUSINESS, CATEGORIES, FAQ, IMG, MIN_SERVICE, PICKUP_STORES, SERVICES, STR, UNIT, type CategoryId } from '../data'
import { money, useApp } from '../store'
import { track } from '../track'
import { BeforeAfter, ServiceRow } from '../components/parts'
import { WorkStrip } from '../components/work'
import { DesktopHero } from '../components/desktop'
import { useIsDesktop } from '../hooks'
import { CAT_ICON, CountUp, Img, Logo, MaskLine, Reveal, ease } from '../components/ui'

export function waLink(text: string) {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`
}

export const quoteMsg = (lang: 'en' | 'es') =>
  lang === 'es' ? `Hola ${BUSINESS.name}, quiero una cotización. Les envío foto.` : `Hi ${BUSINESS.name}, I’d like a quote. Sending a photo.`

export default function Home() {
  const { t, go, openSheet, lang } = useApp()
  const desktop = useIsDesktop()
  const [q, setQ] = useState('')
  const [chip, setChip] = useState<CategoryId | 'all'>('all')
  const promoRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: promoRef, offset: ['start end', 'end start'] })
  const promoY = useTransform(scrollYProgress, [0, 1], ['-8%', '10%'])
  const promoScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.02, 1.08])

  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return []
    return SERVICES.filter((x) => (x.name.en + x.name.es + x.desc.en + x.desc.es + x.cat).toLowerCase().includes(s))
  }, [q])

  const popular = SERVICES.filter((s) => s.popular && (chip === 'all' || s.cat === chip))
  const shown = popular.length ? popular : SERVICES.filter((s) => s.cat === chip).slice(0, 4)

  return (
    <div>
      <header className="topbar">
        <div className="brand">
          <Logo size={42} />
          <div>
            <div className="xs muted" style={{ fontWeight: 600 }}>{t(STR.hello)}</div>
            <div style={{ fontWeight: 800, fontSize: 14.5, letterSpacing: '-0.01em' }}>{BUSINESS.name}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a className="icon-btn" href={BUSINESS.phoneHref} onClick={() => track('call_click', { from: 'header' })} aria-label="Call"><Phone size={18} /></a>
          <motion.button whileTap={{ scale: 0.9 }} className="icon-btn dark" onClick={() => go('profile')} aria-label="Contact">
            <User size={18} />
          </motion.button>
        </div>
      </header>

      {desktop && <DesktopHero q={q} setQ={setQ} />}
      <div className="page">
        {!desktop && <>
        <h1 className="h1" style={{ marginTop: 10 }}>
          <MaskLine delay={0.05}>{t(STR.homeTitle1)}</MaskLine>
          <MaskLine delay={0.15}><span className="light">{t(STR.homeTitle2).split(' ').slice(0, -1).join(' ')} </span><span className="gold">{t(STR.homeTitle2).split(' ').slice(-1)}</span></MaskLine>
        </h1>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7, ease }} style={{ marginTop: 18 }}>
          <label className="search">
            <Search size={19} color="#8a857a" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t(STR.search)} enterKeyHint="search" />
            {q && <button onClick={() => setQ('')} aria-label="Clear"><X size={18} /></button>}
          </label>
        </motion.div>
        </>}

        <AnimatePresence mode="wait">
          {q ? (
            <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ marginTop: 18 }}>
              <div className="small muted" style={{ marginBottom: 10, fontWeight: 600 }}>{results.length} {t(STR.results)}</div>
              <div style={{ display: 'grid', gap: 10 }}>
                {results.map((s, i) => <ServiceRow key={s.id} s={s} i={i} />)}
                {!results.length && (
                  <div className="card" style={{ padding: 24, textAlign: 'center' }}>
                    {t(STR.noResults)}
                    <a className="btn gold sm" style={{ marginTop: 14 }} href={waLink(quoteMsg(lang))} target="_blank" rel="noreferrer" onClick={() => track('whatsapp_click', { from: 'search' })}><MessageCircle size={15} /> WhatsApp</a>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Chips */}
              <motion.div className="chips" style={{ marginTop: 16 }} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.7, ease }}>
                {(['all', ...CATEGORIES.map((c) => c.id)] as const).map((id) => {
                  const on = chip === id
                  const label = id === 'all' ? t(STR.all) : t(CATEGORIES.find((c) => c.id === id)!.short)
                  return (
                    <motion.button key={id} className={`chip ${on ? 'on' : ''}`} whileTap={{ scale: 0.94 }} onClick={() => setChip(id)}>
                      {on && <motion.span layoutId="chipbg" className="chip-bg" transition={{ type: 'spring', stiffness: 450, damping: 35 }} />}
                      <span>{label}</span>
                    </motion.button>
                  )
                })}
              </motion.div>

              {/* Promo card */}
              <motion.div ref={promoRef} className="promo mobile-only" style={{ marginTop: 18 }} initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.45, duration: 0.9, ease }}>
                <motion.img className="ph" src={IMG.pro} alt="" style={{ y: promoY, scale: promoScale }} />
                <div style={{ position: 'relative' }}>
                  <span className="pill"><BadgeDollarSign size={14} color="#B08A35" /> {t(STR.promoTag)}</span>
                </div>
                <div style={{ position: 'relative', marginTop: 'auto', maxWidth: '60%' }}>
                  <div className="h2" style={{ fontSize: 21 }}>{t(STR.promoTitle)}</div>
                  <motion.button className="btn" style={{ marginTop: 16, height: 50, paddingRight: 20 }} whileTap={{ scale: 0.95 }} onClick={() => go('services', 'all')}>
                    {t(STR.bookNow)}
                    <span className="btn-arrow" style={{ width: 34, height: 34, marginRight: -10 }}><ArrowRight size={16} /></span>
                  </motion.button>
                </div>
              </motion.div>

              {/* Marquee */}
              <div className="marquee" style={{ marginTop: 18 }}>
                <div className="marquee-track">
                  {[...CATEGORIES, ...CATEGORIES].map((c, i) => (
                    <span key={i} className="marquee-item" style={{ background: c.tint }}>{CAT_ICON[c.id]({ size: 16 })} {t(c.name)}</span>
                  ))}
                </div>
              </div>

              {/* Popular */}
              <section className="sec">
                <div className="sec-head">
                  <h2 className="h2"><MaskLine inView>{t(STR.popular)}</MaskLine></h2>
                  <button className="link" onClick={() => go('services', chip)}>{t(STR.seeAll)}</button>
                </div>
                <div className="hscroll pop-row">
                  <AnimatePresence mode="popLayout">
                    {shown.map((s, i) => (
                      <motion.button
                        key={s.id}
                        layout
                        className="pop"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5, ease, delay: i * 0.05 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => openSheet(s)}
                      >
                        <div className="pop-img">
                          <Img src={s.img} alt={t(s.name)} />
                        </div>
                        <div style={{ padding: '10px 6px 4px' }}>
                          <div className="h3" style={{ fontSize: 14.5, minHeight: 36 }}>{t(s.name)}</div>
                          <div className="row" style={{ marginTop: 8 }}>
                            <div className="price" style={{ fontSize: 17 }}>
                              {money(s.price)}
                              {s.kind !== 'each' && <small>{t(UNIT[s.kind].per)}</small>}
                            </div>
                            <span className="icon-btn dark" style={{ width: 34, height: 34 }}><ArrowRight size={15} /></span>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              </section>

              {/* Categories */}
              <section className="sec">
                <div className="sec-head"><h2 className="h2"><MaskLine inView>{t(STR.categories)}</MaskLine></h2></div>
                <div className="cat-grid">
                  {CATEGORIES.map((c, i) => (
                    <Reveal key={c.id} i={i}>
                      <motion.button className="cat" style={{ width: '100%' }} whileTap={{ scale: 0.92 }} onClick={() => go('services', c.id)}>
                        <span className="cat-ico" style={{ background: c.tint }}>{CAT_ICON[c.id]({ size: 26 })}</span>
                        {t(c.short)}
                      </motion.button>
                    </Reveal>
                  ))}
                  <Reveal i={7}>
                    <a className="cat" href={waLink(quoteMsg(lang))} target="_blank" rel="noreferrer" onClick={() => track('whatsapp_click', { from: 'categories' })}>
                      <span className="cat-ico" style={{ background: '#141414', color: '#fff' }}><MessageCircle size={26} strokeWidth={1.8} /></span>
                      {lang === 'es' ? 'Otro' : 'Other'}
                    </a>
                  </Reveal>
                </div>
              </section>

              <WorkStrip />

              {/* Stats — all real numbers from the catalog */}
              <Reveal className="sec">
                <div className="stats">
                  <div className="stat"><b><CountUp to={SERVICES.length} suffix="+" /></b><span>{t(STR.services_n)}</span></div>
                  <div className="stat"><b><CountUp to={CATEGORIES.length} /></b><span>{t(STR.trades_n)}</span></div>
                  <div className="stat"><b>$<CountUp to={MIN_SERVICE} /></b><span>{t(STR.min_n)}</span></div>
                </div>
              </Reveal>

              {/* How it works */}
              <section className="sec">
                <div className="sec-head"><h2 className="h2"><MaskLine inView>{t(STR.howTitle)}</MaskLine></h2></div>
                <div className="steps">
                  {STR.how.map((h, i) => (
                    <Reveal key={i} i={i}>
                      <div className="card step">
                        <motion.span className="step-n" initial={{ rotate: -90, scale: 0.4 }} whileInView={{ rotate: 0, scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 + i * 0.1 }}>
                          0{i + 1}
                        </motion.span>
                        <div>
                          <div className="h3">{t(h.t)}</div>
                          <div className="small muted" style={{ marginTop: 4, lineHeight: 1.45 }}>{t(h.d)}</div>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </section>

              <ParallaxFeature />

              {/* Why */}
              <section className="sec">
                <div className="sec-head"><h2 className="h2"><MaskLine inView>{t(STR.whyTitle)}</MaskLine></h2></div>
                <div className="why">
                  {STR.why.map((w, i) => {
                    const Icon = [BadgeDollarSign, Users, Truck, Wallet][i]
                    return (
                      <Reveal key={i} i={i}>
                        <div className="card" style={{ height: '100%' }}>
                          <div className="why-ico"><Icon size={20} /></div>
                          <div className="h3" style={{ fontSize: 14.5 }}>{t(w.t)}</div>
                          <div className="xs muted" style={{ marginTop: 4, lineHeight: 1.45 }}>{t(w.d)}</div>
                        </div>
                      </Reveal>
                    )
                  })}
                </div>
              </section>

              {/* Store pickup */}
              <PickupBanner />

              {/* Before after */}
              <section className="sec">
                <div className="sec-head" style={{ display: 'block' }}>
                  <h2 className="h2"><MaskLine inView>{t(STR.beforeAfter)}</MaskLine></h2>
                  <div className="small muted" style={{ marginTop: 4 }}>{t(STR.beforeAfterSub)}</div>
                </div>
                <Reveal><BeforeAfter /></Reveal>
              </section>

              {/* FAQ */}
              <section className="sec">
                <div className="sec-head"><h2 className="h2"><MaskLine inView>{t(STR.faq)}</MaskLine></h2></div>
                <Faq />
              </section>

              {/* CTA */}
              <Reveal className="sec">
                <div className="cta">
                  <img src={IMG.toolbelt} alt="" />
                  <div className="h2" style={{ fontSize: 24, maxWidth: 260 }}>{t(STR.ctaTitle)}</div>
                  <p style={{ color: '#d6d0c2', fontSize: 14, lineHeight: 1.5, margin: '8px 0 18px', maxWidth: 280 }}>{t(STR.ctaSub)}</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <a className="btn gold" style={{ flex: 1, height: 50 }} href={waLink(quoteMsg(lang))} target="_blank" rel="noreferrer" onClick={() => track('whatsapp_click', { from: 'cta' })}>
                      <MessageCircle size={18} /> WhatsApp
                    </a>
                    <a className="btn" style={{ background: '#fff', color: '#141414', height: 50 }} href={BUSINESS.phoneHref} onClick={() => track('call_click', { from: 'cta' })}><Phone size={18} /> {t(STR.call)}</a>
                  </div>
                </div>
              </Reveal>

              <footer style={{ textAlign: 'center', marginTop: 36 }}>
                <Logo size={44} />
                <div className="small" style={{ fontWeight: 800, letterSpacing: '0.12em', marginTop: 8, textTransform: 'uppercase' }}>{BUSINESS.name}</div>
                <div className="xs muted" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4 }}>{t(BUSINESS.tagline)}</div>
                <div className="xs muted" style={{ marginTop: 12, display: 'inline-flex', gap: 6, alignItems: 'center' }}><MapPin size={12} /> {t(BUSINESS.area)}</div>
                <div className="xs muted" style={{ marginTop: 4 }}>© {new Date().getFullYear()} {BUSINESS.name} · {BUSINESS.phone}</div>
                <div className="xs muted" style={{ marginTop: 4 }}>{t({ en: 'All prices are base prices.', es: 'Todos los precios son precios base.' })}</div>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function PickupBanner() {
  const { t, openSheet } = useApp()
  const pickup = SERVICES.find((s) => s.id === 'pickup')!
  return (
    <Reveal className="sec">
      <motion.button className="card" whileTap={{ scale: 0.98 }} onClick={() => openSheet(pickup)}
        style={{ width: '100%', textAlign: 'left', padding: 18, display: 'flex', gap: 14, alignItems: 'center', background: 'linear-gradient(135deg,#f7efd4,#efe3bd)', border: 0 }}>
        <span className="why-ico" style={{ margin: 0, width: 52, height: 52, borderRadius: 16, background: '#141414', color: '#D8BB6E', flex: 'none' }}><Truck size={24} /></span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="h3">{t({ en: 'We pick up your order', es: 'Recogemos tu pedido' })}</div>
          <div className="xs muted" style={{ marginTop: 3, lineHeight: 1.4 }}>{PICKUP_STORES.join(' · ')}</div>
        </div>
        <div className="price" style={{ fontSize: 18, textAlign: 'right' }}>$3<small style={{ display: 'block', marginLeft: 0 }}>{t(UNIT.mile.per)}</small></div>
      </motion.button>
    </Reveal>
  )
}

function ParallaxFeature() {
  const { t, go } = useApp()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%'])
  const clip = useTransform(scrollYProgress, [0, 0.35], ['inset(12% 8% 12% 8% round 30px)', 'inset(0% 0% 0% 0% round 30px)'])
  return (
    <section className="sec">
      <motion.div ref={ref} style={{ position: 'relative', height: 360, overflow: 'hidden', clipPath: clip, borderRadius: 30 }}>
        <motion.img src={IMG.home} alt="" style={{ position: 'absolute', inset: '-15% 0', width: '100%', height: '130%', objectFit: 'cover', y }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,.75), transparent 60%)' }} />
        <div style={{ position: 'absolute', left: 20, right: 20, bottom: 20, color: '#fff' }}>
          <div className="h2" style={{ fontSize: 24 }}>{t({ en: 'Love your home again.', es: 'Vuelve a amar tu hogar.' })}</div>
          <div className="small" style={{ color: '#ddd6c6', marginTop: 6 }}>{t({ en: 'From a new faucet to tile, paint and roof sealing.', es: 'Desde una mezcladora nueva hasta losas, pintura y sellado de techo.' })}</div>
          <motion.button className="btn" whileTap={{ scale: 0.95 }} onClick={() => go('services', 'all')} style={{ background: '#fff', color: '#141414', height: 46, marginTop: 14 }}>
            {t(STR.browse)} <ArrowRight size={16} />
          </motion.button>
        </div>
      </motion.div>
    </section>
  )
}

function Faq() {
  const { t } = useApp()
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div>
      {FAQ.map((f, i) => (
        <div key={i} className="faq-item">
          <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
            {t(f.q)}
            <motion.span animate={{ rotate: open === i ? 180 : 0 }}><ChevronDown size={18} /></motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div className="faq-a" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }}>
                <div style={{ paddingBottom: 18 }}>{t(f.a)}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
