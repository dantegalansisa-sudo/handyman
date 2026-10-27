import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import App from './App'
import { applyContent, fetchContent, loadCached, saveCached } from './content'
import { BUSINESS } from './data'
import { initAnalytics } from './analytics'
import './styles.css'

const Admin = lazy(() => import('./admin/Admin'))
const isAdmin = location.pathname.replace(/\/+$/, '') === '/admin'

BUSINESS.url = location.origin
if (!isAdmin) initAnalytics()
// Show the last known admin edits immediately, then refresh in the background.
applyContent(loadCached())
fetchContent()
  .then((c) => {
    if (!c) return
    applyContent(c)
    saveCached(c)
    window.dispatchEvent(new Event('content-updated'))
  })
  .catch(() => {
    /* offline or not configured — built-in content stays */
  })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      {isAdmin ? (
        <Suspense fallback={<div className="admin-loading">…</div>}>
          <Admin />
        </Suspense>
      ) : (
        <App />
      )}
    </MotionConfig>
  </StrictMode>,
)
