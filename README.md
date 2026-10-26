# Torres Contractor Solution — Mobile Web App

Mobile-first booking web app for **Torres Contractor Solution** (Puerto Rico · 939-496-4444).
The flow works like Uber Eats: customers browse services with base prices, add them to an estimate and watch the total update live. Then they pick a day and send the request to the business on WhatsApp.

## Real business info (from the client)
- **All prices are BASE prices**; the final price is confirmed before work starts. Other jobs are quoted in person.
- **Minimum service: $75** (the estimate adds an adjustment when the subtotal is lower).
- **38 services in 7 trades:** Plumbing, Electrical, Handyman, Painting, Tile, Pressure Washing & Roof Sealing, Concrete & Demolition.
- Measured services (per sq ft / per ft / per mile) let the customer enter the size, e.g. interior painting at $1.50/sq ft.
- Store pickup from Home Depot, IKEA, Home Design, Berrios and Rooms To Go: $3/mile.

All catalog data lives in [`src/data.ts`](src/data.ts): services, prices, notes, FAQ and copy (EN/ES).

## Swapping in real photos
Photos are stock placeholders. To use the client's job photos:
1. Put them in `public/services/` (WebP, about 900×700).
2. In `src/data.ts`, point the matching `IMG` key at the file, e.g. `toilet: '/services/toilet.webp'`.

## Google Ads / analytics
`src/track.ts` sends these conversion events: `add_to_estimate`, `begin_booking`, `booking_request`, `whatsapp_click` and `call_click`. They go to `dataLayer`, and to `gtag`/`fbq` when those tags are installed. Add the Google tag (or GTM) snippet to `index.html` and mark `booking_request`, `whatsapp_click` and `call_click` as conversions. `index.html` already includes the SEO meta tags and LocalBusiness JSON-LD.

## Stack
React 18 + TypeScript + Vite · Framer Motion · lucide-react.

## Run
```bash
npm install
npm run dev
```
Build with `npm run build` (output goes to `dist/`). The app deploys as-is on Vercel (`vercel.json` is included).
