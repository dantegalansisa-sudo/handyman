import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, BadgeCheck, ChevronDown, Clock, HandCoins, MapPin, MessageCircle, Phone, Search, ShieldCheck, ShoppingBag, Sparkles, Star, X } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { BUSINESS, CATEGORIES, FAQ, IMG, REVIEWS, SERVICES, STR, type CategoryId } from '../data'
import { money, useApp } from '../store'
import { BeforeAfter, ServiceRow } from '../components/parts'
import { CAT_ICON, CountUp, Img, Logo, MaskLine, Reveal, Stars, ease } from '../components/ui'

export function waLink(text: string) {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`
}

export default function Home() {
  const { t, go, count, openSheet, lang } = useApp()
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
            <div style={{ fontWeight: 800, fontSize: 15.5, letterSpacing: '-0.01em' }}>Torres Handyman</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a className="icon-btn" href={BUSINESS.phoneHref} aria-label="Call"><Phone size={18} /></a>
          <motion.button whileTap={{ scale: 0.9 }} className="icon-btn" onClick={() => go('cart')} aria-label="Estimate">
            <ShoppingBag size={18} />
            {count > 0 && <span className="badge">{count}</span>}
          </motion.button>
        </div>
      </header>

      <div className="page">
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

        <AnimatePresence mode="wait">
          {q ? (
            <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ marginTop: 18 }}>
              <div className="small muted" style={{ marginBottom: 10, fontWeight: 600 }}>{results.length} {t(STR.results)}</div>
              <div style={{ display: 'grid', gap: 10 }}>
                {results.map((s, i) => <ServiceRow key={s.id} s={s} i={i} />)}
                {!results.length && <div className="card" style={{ padding: 24, textAlign: 'center' }}>{t(STR.noResults)}</div>}
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
              <motion.div ref={promoRef} className="promo" style={{ marginTop: 18 }} initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.45, duration: 0.9, ease }}>
                <motion.img className="ph" src={IMG.pro} alt="" style={{ y: promoY, scale: promoScale }} />
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
                  <span className="pill"><Sparkles size={13} color="#B08A35" /> {t(STR.promoTag)}</span>
                  <span className="rating-pill"><Star size={12} fill="#B08A35" strokeWidth={0} /> 4.9</span>
                </div>
                <div style={{ position: 'relative', marginTop: 'auto', maxWidth: '58%' }}>
                  <div className="h2" style={{ fontSize: 23 }}>{t(STR.promoTitle)}</div>
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
                <div className="hscroll">
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
                          <span className="rating-pill"><Star size={11} fill="#B08A35" strokeWidth={0} /> {s.rating}</span>
                        </div>
                        <div style={{ padding: '10px 6px 4px' }}>
                          <div className="h3" style={{ fontSize: 14.5, minHeight: 36 }}>{t(s.name)}</div>
                          <div className="row" style={{ marginTop: 8 }}>
                            <div className="price" style={{ fontSize: 17 }}><span className="xs muted" style={{ fontWeight: 600, marginRight: 3 }}>{t(STR.from)}</span>{money(s.price)}</div>
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
                    <a className="cat" href={waLink(lang === 'es' ? 'Hola Torres Handyman, necesito una cotización.' : 'Hi Torres Handyman, I need a quote.')} target="_blank" rel="noreferrer">
                      <span className="cat-ico" style={{ background: '#141414', color: '#fff' }}><MessageCircle size={26} strokeWidth={1.8} /></span>
                      {lang === 'es' ? 'Otro' : 'Other'}
                    </a>
                  </Reveal>
                </div>
              </section>

              {/* Stats */}
              <Reveal className="sec">
                <div className="stats">
                  <div className="stat"><b><CountUp to={1200} suffix="+" /></b><span>{t(STR.jobs)}</span></div>
                  <div className="stat"><b><CountUp to={10} suffix="+" /></b><span>{t(STR.years)}</span></div>
                  <div className="stat"><b><CountUp to={4.9} decimals={1} /></b><span>{t(STR.rating)}</span></div>
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

              {/* Feature image */}
              <ParallaxFeature />

              {/* Why */}
              <section className="sec">
                <div className="sec-head"><h2 className="h2"><MaskLine inView>{t(STR.whyTitle)}</MaskLine></h2></div>
                <div className="why">
                  {STR.why.map((w, i) => {
                    const Icon = [HandCoins, ShieldCheck, Clock, BadgeCheck][i]
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

              {/* Before after */}
              <section className="sec">
                <div className="sec-head" style={{ display: 'block' }}>
                  <h2 className="h2"><MaskLine inView>{t(STR.beforeAfter)}</MaskLine></h2>
                  <div className="small muted" style={{ marginTop: 4 }}>{t(STR.beforeAfterSub)}</div>
                </div>
                <Reveal><BeforeAfter /></Reveal>
              </section>

              {/* Reviews */}
              <section className="sec">
                <div className="sec-head"><h2 className="h2"><MaskLine inView>{t(STR.reviews)}</MaskLine></h2>
                  <span className="rating-pill" style={{ border: '1px solid var(--line)' }}><Star size={12} fill="#B08A35" strokeWidth={0} /> 4.9 · 500+</span>
                </div>
                <div className="hscroll">
                  {REVIEWS.map((r, i) => (
                    <motion.div key={i} className="card review" initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease, delay: i * 0.08 }}>
                      <Stars />
                      <p style={{ margin: '12px 0 16px', fontSize: 14.5, lineHeight: 1.5 }}>“{t(r.text)}”</p>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span className="avatar">{r.name[0]}</span>
                        <div>
                          <div className="small" style={{ fontWeight: 700 }}>{r.name}</div>
                          <div className="xs muted">{r.city} · {t(r.job)}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
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
                    <a className="btn gold" style={{ flex: 1, height: 50 }} href={waLink(lang === 'es' ? 'Hola Torres Handyman, quiero una cotización. Les envío foto.' : 'Hi Torres Handyman, I’d like a quote. Sending a photo.')} target="_blank" rel="noreferrer">
                      <MessageCircle size={18} /> WhatsApp
                    </a>
                    <a className="btn" style={{ background: '#fff', color: '#141414', height: 50 }} href={BUSINESS.phoneHref}><Phone size={18} /> {t(STR.call)}</a>
                  </div>
                </div>
              </Reveal>

              <footer style={{ textAlign: 'center', marginTop: 36 }}>
                <Logo size={44} />
                <div className="small" style={{ fontWeight: 800, letterSpacing: '0.14em', marginTop: 8 }}>TORRES HANDYMAN</div>
                <div className="xs muted" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4 }}>{t(STR.tagline)}</div>
                <div className="xs muted" style={{ marginTop: 12, display: 'inline-flex', gap: 6, alignItems: 'center' }}><MapPin size={12} /> {t(BUSINESS.area)}</div>
                <div className="xs muted" style={{ marginTop: 4 }}>© {new Date().getFullYear()} Torres Handyman · {BUSINESS.phone}</div>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
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
          <div className="small" style={{ color: '#ddd6c6', marginTop: 6 }}>{t({ en: 'From a dripping faucet to a full room refresh.', es: 'Desde una llave que gotea hasta renovar un cuarto completo.' })}</div>
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
