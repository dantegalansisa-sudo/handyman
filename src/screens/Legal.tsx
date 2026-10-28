import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { LEGAL_TABS, isLegal, legalDoc } from '../legal'
import { useApp } from '../store'
import { MaskLine, ease } from '../components/ui'

export default function Legal() {
  const { t, tab, go } = useApp()
  const current = isLegal(tab) ? tab : 'privacy'
  const doc = legalDoc(current)
  return (
    <div>
      <header className="topbar">
        <motion.button whileTap={{ scale: 0.9 }} className="icon-btn" onClick={() => go('home')} aria-label="Back"><ArrowLeft size={18} /></motion.button>
        <div style={{ fontWeight: 800, fontSize: 16 }}>{t(doc.title)}</div>
        <span style={{ width: 44 }} />
      </header>
      <article className="page legal">
        <h1 className="h1" style={{ fontSize: 32, marginTop: 6 }}><MaskLine>{t(doc.title)}</MaskLine></h1>
        <div className="xs muted" style={{ marginTop: 8, fontWeight: 600 }}>{t(doc.updated)}</div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6, ease }} className="legal-intro">{t(doc.intro)}</motion.p>
        {doc.sections.map((s, i) => (
          <section key={i}>
            <h2>{t(s.h)}</h2>
            {s.p.map((p, k) => <p key={k}>{t(p)}</p>)}
          </section>
        ))}
        <div style={{ display: 'grid', gap: 6, marginTop: 24 }}>
          {LEGAL_TABS.filter((x) => x !== current).map((x) => (
            <button key={x} className="link" style={{ textAlign: 'left' }} onClick={() => go(x)}>
              {t(legalDoc(x).title)} →
            </button>
          ))}
        </div>
      </article>
    </div>
  )
}
