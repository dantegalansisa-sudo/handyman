# Torres Handyman — Mobile Web App (Demo)

Mobile-first booking web app for **Torres Handyman** (Puerto Rico · 939-496-4444).
Uber Eats–style flow: browse services with upfront prices, add them to an estimate, watch the total update live, pick a date & time and book. The booking can be sent straight to the business on WhatsApp.

## Features
- Animated onboarding with swipe-to-start
- Home: search, category chips, parallax promo, popular fixes, how it works, stats, before/after slider, reviews, FAQ, WhatsApp/call CTA
- 7 trades / 29 services with prices: Electrical, Plumbing, PVC, Concrete, Painting, Drywall (Gypsum), Pressure Washing & Sealing
- Service bottom sheet (drag to close), quantity steppers, floating live-total bar
- Estimate with free-visit meter (free over $150, else $39 trip fee), swipe-to-remove
- 3-step checkout (date/time → details → review) → success → "Send to WhatsApp"
- My bookings with status timeline · Account page with contact info
- English / Español toggle, installable as PWA, data saved in localStorage

## Stack
React 18 + TypeScript + Vite · Framer Motion · lucide-react. Photos from Unsplash.

## Run
```bash
npm install
npm run dev
```
Build: `npm run build` (output in `dist/`). Deploys as-is on Vercel (`vercel.json` included).
