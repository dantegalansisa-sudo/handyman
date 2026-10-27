/**
 * Google Analytics 4 + Google Ads (gtag.js). Inactive until the IDs are set in .env.production:
 *   VITE_GA_ID=G-XXXXXXXXXX            GA4 measurement ID
 *   VITE_GADS_ID=AW-XXXXXXXXXX         Google Ads account tag (optional)
 *   VITE_GADS_LEAD_LABEL=xxxxxxxx      Ads conversion label for "request sent" (optional)
 *   VITE_GADS_CONTACT_LABEL=xxxxxxxx   Ads conversion label for WhatsApp/call taps (optional)
 */
type Env = Record<string, string | undefined>
const env: Env = (import.meta as unknown as { env?: Env }).env ?? {}

export const GA_ID = env.VITE_GA_ID ?? ''
export const ADS_ID = env.VITE_GADS_ID ?? ''
const LEAD = env.VITE_GADS_LEAD_LABEL ?? ''
const CONTACT = env.VITE_GADS_CONTACT_LABEL ?? ''

type W = Window & { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void }

export function initAnalytics() {
  const id = GA_ID || ADS_ID
  if (!id || typeof window === 'undefined') return
  const w = window as W
  w.dataLayer = w.dataLayer || []
  // gtag must push the `arguments` object, not an array
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments)
  }
  w.gtag('js', new Date())
  // Page views are sent manually on every route change (single-page app).
  if (GA_ID) w.gtag('config', GA_ID, { send_page_view: false })
  if (ADS_ID) w.gtag('config', ADS_ID)
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
  document.head.appendChild(s)
}

export function pageView(path: string, title: string) {
  if (typeof window === 'undefined') return
  ;(window as W).gtag?.('event', 'page_view', { page_location: location.origin + path + location.search, page_path: path, page_title: title })
}

/** Fires the Google Ads conversion that matches a site event. */
export function adsConversion(kind: 'lead' | 'contact', value?: number) {
  const label = kind === 'lead' ? LEAD : CONTACT
  if (!ADS_ID || !label || typeof window === 'undefined') return
  ;(window as W).gtag?.('event', 'conversion', { send_to: `${ADS_ID}/${label}`, ...(value ? { value, currency: 'USD' } : {}) })
}
