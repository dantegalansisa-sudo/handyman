import { motion } from 'framer-motion'
import { BadgeDollarSign, ChevronRight, Globe, MapPin, MessageCircle, Phone, Truck } from 'lucide-react'
import { BUSINESS, CATEGORIES, IMG, MIN_SERVICE, PICKUP_STORES, SERVICES, STR } from '../data'
import { useApp } from '../store'
import { track } from '../track'
import { CAT_ICON, Img, Logo, MaskLine, Reveal, Wordmark, ease } from '../components/ui'
import { quoteMsg, waLink } from './Home'

export default function Profile() {
  const { t, lang, setLang, go } = useApp()
  return (
    <div>
      <header className="topbar"><span style={{ width: 44 }} /><div style={{ fontWeight: 800, fontSize: 17 }}>{t(STR.profile)}</div><span style={{ width: 44 }} /></header>
      <div className="page">
        <motion.div style={{ position: 'relative', borderRadius: 30, overflow: 'hidden', background: '#141414', color: '#fff', padding: 22, minHeight: 230 }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
          <Img src={IMG.toolbelt} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ background: '#f6f3ea', borderRadius: 18, padding: 4, display: 'grid' }}><Logo size={44} /></span>
              <Wordmark dark />
            </div>
            <h1 className="h1" style={{ fontSize: 26, color: '#fff', marginTop: 34 }}>
              <MaskLine delay={0.1}>{t(BUSINESS.tagline)}</MaskLine>
            </h1>
            <div className="small" style={{ color: '#d9d2c2', marginTop: 10 }}>
              {SERVICES.length} {t(STR.services).toLowerCase()} · {CATEGORIES.length} {t(STR.trades_n).toLowerCase()} · {t(BUSINESS.area)}
            </div>
          </div>
        </motion.div>

        <Reveal className="sec" style={{ marginTop: 18 }}>
          <div className="seg">
            {(['en', 'es'] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)}>
                {lang === l && <motion.span layoutId="langbg" className="seg-bg" transition={{ type: 'spring', stiffness: 450, damping: 35 }} />}
                <span>{l === 'en' ? 'English' : 'Español'}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal className="sec" style={{ marginTop: 18 }}>
          <div className="card" style={{ padding: 20 }}>
            <div className="h3">{t(STR.about)}</div>
            <p className="small muted" style={{ lineHeight: 1.6, margin: '8px 0 0' }}>{t(STR.aboutText)}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
              {CATEGORIES.map((c) => (
                <button key={c.id} className="marquee-item" style={{ background: c.tint, height: 34, fontSize: 12.5 }} onClick={() => go('services', c.id)}>
                  {CAT_ICON[c.id]({ size: 14 })} {t(c.short)}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="sec" style={{ marginTop: 14 }}>
          <div className="card">
            {[
              { icon: Phone, label: t(STR.call), value: BUSINESS.phone, href: BUSINESS.phoneHref, ev: 'call_click' as const },
              { icon: MessageCircle, label: 'WhatsApp', value: BUSINESS.phone, href: waLink(quoteMsg(lang)), ev: 'whatsapp_click' as const },
              { icon: MapPin, label: t(STR.areaL), value: t(BUSINESS.area) },
              { icon: BadgeDollarSign, label: t({ en: 'Pricing', es: 'Precios' }), value: t({ en: `Base prices · $${MIN_SERVICE} minimum service`, es: `Precios base · servicio mínimo $${MIN_SERVICE}` }) },
              { icon: Truck, label: t({ en: 'Store pickups · $3/mile', es: 'Recogidos · $3/milla' }), value: PICKUP_STORES.join(', ') },
              { icon: Globe, label: t(STR.language), value: lang === 'en' ? 'English' : 'Español', onClick: () => setLang(lang === 'en' ? 'es' : 'en') },
            ].map((r, i) => {
              const inner = (
                <>
                  <span className="list-ico"><r.icon size={18} /></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="xs muted" style={{ fontWeight: 600 }}>{r.label}</div>
                    <div className="small" style={{ fontWeight: 700 }}>{r.value}</div>
                  </div>
                  {(r.href || r.onClick) && <ChevronRight size={18} color="#a39e92" />}
                </>
              )
              return r.href ? (
                <a key={i} className="list-row" href={r.href} target={r.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" onClick={() => r.ev && track(r.ev, { from: 'contact' })}>{inner}</a>
              ) : (
                <button key={i} className="list-row" style={{ width: '100%', textAlign: 'left' }} onClick={r.onClick} disabled={!r.onClick}>{inner}</button>
              )
            })}
          </div>
        </Reveal>

        <Reveal className="sec" style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <a className="btn gold" style={{ flex: 1 }} href={waLink(quoteMsg(lang))} target="_blank" rel="noreferrer" onClick={() => track('whatsapp_click', { from: 'contact_cta' })}><MessageCircle size={18} /> WhatsApp</a>
            <a className="btn" style={{ flex: 1 }} href={BUSINESS.phoneHref} onClick={() => track('call_click', { from: 'contact_cta' })}><Phone size={18} /> {t(STR.call)}</a>
          </div>
        </Reveal>
        <div className="xs muted" style={{ textAlign: 'center', marginTop: 24, lineHeight: 1.5 }}>
          {t({ en: 'More jobs are quoted in person — just ask.', es: 'Hay más trabajos que se cotizan en persona — pregúntanos.' })}
          <br />
          {t({ en: 'Tip: add this app to your home screen for one-tap booking.', es: 'Tip: agrega esta app a tu pantalla de inicio para reservar con un toque.' })}
        </div>
      </div>
    </div>
  )
}
