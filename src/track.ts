/**
 * Conversion events for Google Ads / GA4 / Meta. Pushes to the GTM dataLayer and
 * calls gtag/fbq when those tags are installed; does nothing otherwise.
 */
import { adsConversion } from './analytics'

type W = Window & {
  dataLayer?: unknown[]
  gtag?: (...a: unknown[]) => void
  fbq?: (...a: unknown[]) => void
}

export function track(event: 'add_to_estimate' | 'begin_booking' | 'booking_request' | 'whatsapp_click' | 'call_click', params: Record<string, unknown> = {}) {
  const w = window as W
  try {
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push({ event, ...params })
    w.gtag?.('event', event, params)
    if (event === 'booking_request') {
      w.fbq?.('track', 'Lead', params)
      adsConversion('lead', typeof params.value === 'number' ? params.value : undefined)
    }
    if (event === 'whatsapp_click' || event === 'call_click') adsConversion('contact')
    if (event === 'whatsapp_click' || event === 'call_click') w.fbq?.('track', 'Contact', params)
  } catch {
    /* tracking must never break the app */
  }
}
