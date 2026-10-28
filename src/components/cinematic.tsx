import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, BadgeDollarSign } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BUSINESS, CATEGORIES, STR } from '../data'
import { useApp } from '../store'
import { ease } from './ui'

const HOLD = 2600 // ms each trade stays on screen

/**
 * Home promo without a photo: a dark "movie title" card that cycles through the
 * trades letter by letter, with moving gold light, film grain and a reel counter.
 */
export function CinematicPromo() {
  const { t, go } = useApp()
  const words = CATEGORIES.map((c) => t(c.short))
  const [i, setI] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % CATEGORIES.length), HOLD)
    return () => clearInterval(id)
  }, [])

  const word = words[i]
  const brand = BUSINESS.name.toUpperCase()

  return (
    <motion.div
      className="cine mobile-only"
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.45, duration: 0.9, ease }}
      onClick={() => go('services', CATEGORIES[i].id)}
      role="button"
    >
      {/* moving gold light */}
      <motion.span className="cine-beam" animate={{ x: ['-30%', '40%', '-30%'], opacity: [0.55, 0.85, 0.55] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.span className="cine-beam b2" animate={{ x: ['30%', '-25%', '30%'] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />
      <span className="cine-grain" />
      <span className="cine-bar top" />
      <span className="cine-bar bottom" />

      <div className="cine-head">
        <span className="pill cine-pill"><BadgeDollarSign size={14} color="#D8BB6E" /> {t(STR.promoTag)}</span>
        <span className="cine-reel">{String(i + 1).padStart(2, '0')} <i>/</i> {String(words.length).padStart(2, '0')}</span>
      </div>

      <motion.div className="cine-kicker" initial={{ opacity: 0, letterSpacing: '0.6em' }} animate={{ opacity: 1, letterSpacing: '0.2em' }} transition={{ delay: 0.7, duration: 1.6, ease }}>
        {brand} · {t({ en: 'presents', es: 'presenta' })}
      </motion.div>

      <div className="cine-stage" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.h3
            key={word}
            className="cine-word"
            aria-label={word}
            // long names ("Lavado y Sellado") step down so they stay on one line on small phones
            style={{ fontSize: word.length > 12 ? 'clamp(36px, 10.5vw, 52px)' : word.length > 9 ? 'clamp(46px, 13.5vw, 62px)' : undefined }}
            exit={{ opacity: 0, y: '-30%', transition: { duration: 0.28, ease: 'easeIn' } }}
          >
            {Array.from(word).map((ch, k) => (
              <motion.span
                key={k}
                aria-hidden
                initial={{ opacity: 0, y: '55%', filter: 'blur(10px)', scale: 1.15 }}
                animate={{ opacity: 1, y: '0%', filter: 'blur(0px)', scale: 1, transitionEnd: { filter: 'none' } }}
                transition={{ duration: 0.75, ease, delay: k * 0.045 }}
              >
                {ch === ' ' ? ' ' : ch}
              </motion.span>
            ))}
          </motion.h3>
        </AnimatePresence>
        <motion.span key={`p${i}`} className="cine-progress" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: HOLD / 1000, ease: 'linear' }} />
      </div>

      <div className="cine-foot">
        <p>{t(STR.promoTitle)}</p>
        <motion.button
          className="btn cine-btn"
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            go('services', 'all')
          }}
        >
          {t(STR.bookNow)}
          <span className="btn-arrow"><ArrowRight size={16} /></span>
        </motion.button>
      </div>
    </motion.div>
  )
}
