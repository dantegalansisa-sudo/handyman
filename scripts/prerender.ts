/**
 * Runs after `vite build`. For every public URL it writes dist/<path>/index.html
 * with its own <title>, description, canonical, Open Graph, JSON-LD and a crawlable
 * HTML version of the page content (the React app replaces it on load).
 * Also writes sitemap.xml and robots.txt.
 *
 * Site URL: https://www.torreshandymanpr.com (override with the SITE_URL env var).
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { BUSINESS, CATEGORIES, FAQ, MIN_SERVICE, SERVICES, UNIT, type Service } from '../src/data'
import { getProjects, tx } from '../src/portfolio'
import { allPaths, metaFor, parsePath, projectPath, servicePath } from '../src/seo'
import { privacy, terms } from '../src/legal'

const DIST = 'dist'
/** Production domain. Override with SITE_URL (e.g. for a staging build). */
const SITE = (process.env.SITE_URL || 'https://www.torreshandymanpr.com').replace(/\/$/, '')

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const abs = (p: string) => (p.startsWith('http') ? p : `${SITE}${p}`)
const price = (s: Service) => `${s.from ? 'from ' : ''}$${s.price} ${UNIT[s.kind].per.en}`

// Same Supabase config the browser build uses (Vite only loads it for the client).
for (const f of ['.env.production', '.env.local', '.env']) {
  try {
    process.loadEnvFile(f)
  } catch {
    /* file not present */
  }
}
const { applyContent, fetchContent } = await import('../src/content')

// Pull the admin-edited content (if Supabase is configured) so the HTML matches the live site.
try {
  applyContent(await fetchContent())
} catch (e) {
  console.warn('  prerender: could not load admin content, using built-in data', e)
}
BUSINESS.url = SITE

const business = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  '@id': `${SITE}/#business`,
  name: BUSINESS.name,
  slogan: BUSINESS.tagline.es,
  url: SITE,
  telephone: `+1-${BUSINESS.phone}`,
  image: abs('/hero.webp'),
  logo: abs('/icon.svg'),
  priceRange: '$$',
  areaServed: { '@type': 'AdministrativeArea', name: 'Puerto Rico' },
  address: { '@type': 'PostalAddress', addressRegion: 'PR', addressCountry: 'US' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Services',
    itemListElement: CATEGORIES.map((c) => ({
      '@type': 'OfferCatalog',
      name: c.name.en,
      itemListElement: SERVICES.filter((s) => s.cat === c.id).map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name.en, alternateName: s.name.es, url: abs(servicePath(s)) },
        priceSpecification: { '@type': 'UnitPriceSpecification', price: s.price, priceCurrency: 'USD', ...(s.kind !== 'each' && { unitText: UNIT[s.kind].short.en }) },
      })),
    })),
  },
}

const crumbs = (items: [string, string][]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(p) })),
})

const nav = `<nav><a href="/">Home</a><a href="/services">Services · Servicios</a><a href="/work">Our work · Trabajos</a><a href="/contact">Contact · Contacto</a></nav>`
const legalLinks = `<p><a href="/privacy">Privacy Policy · Política de privacidad</a> · <a href="/terms">Terms · Términos</a></p>`
const serviceLi = (s: Service) => `<li><a href="${servicePath(s)}">${esc(s.name.en)} — ${esc(s.name.es)}</a>: ${esc(price(s))}</li>`
const contact = `<p>Call or WhatsApp <a href="${BUSINESS.phoneHref}">${esc(BUSINESS.phone)}</a>. All prices are base prices · Todos los precios son precios base. Minimum service $${MIN_SERVICE}.</p>`

function body(p: string): { html: string; ld: object[] } {
  const r = parsePath(p)
  const projects = getProjects()

  if (r.tab === 'services' && r.serviceId) {
    const s = SERVICES.find((x) => x.id === r.serviceId)!
    const c = CATEGORIES.find((x) => x.id === s.cat)!
    const related = projects.filter((x) => x.services?.includes(s.id))
    return {
      html: `${nav}<h1>${esc(s.name.en)} in Puerto Rico</h1><p><strong>${esc(s.name.es)}</strong></p>
<p>${esc(s.desc.en)} ${esc(s.desc.es)}</p><p>Base price: <strong>${esc(price(s))}</strong>${s.notes ? ` · ${esc(s.notes.map((n) => n.en).join(' · '))}` : ''}</p>${contact}
<h2>More ${esc(c.name.en)} services</h2><ul>${SERVICES.filter((x) => x.cat === s.cat && x.id !== s.id).map(serviceLi).join('')}</ul>
${related.length ? `<h2>Related jobs</h2><ul>${related.map((x) => `<li><a href="${projectPath(x)}">${esc(tx(x.title, 'en'))}</a></li>`).join('')}</ul>` : ''}`,
      ld: [
        {
          '@context': 'https://schema.org', '@type': 'Service', name: s.name.en, alternateName: s.name.es, description: s.desc.en,
          serviceType: c.name.en, areaServed: 'Puerto Rico', provider: { '@id': `${SITE}/#business` }, image: abs(s.img), url: abs(p),
          offers: { '@type': 'Offer', price: s.price, priceCurrency: 'USD', description: price(s) },
        },
        crumbs([['Home', '/'], ['Services', '/services'], [c.name.en, `/services/${c.id}`], [s.name.en, p]]),
      ],
    }
  }
  if (r.tab === 'services' && r.cat && r.cat !== 'all') {
    const c = CATEGORIES.find((x) => x.id === r.cat)!
    return {
      html: `${nav}<h1>${esc(c.name.en)} in Puerto Rico · ${esc(c.name.es)}</h1><p>${esc(c.blurb.en)}. ${esc(c.blurb.es)}.</p>
<ul>${SERVICES.filter((s) => s.cat === c.id).map(serviceLi).join('')}</ul>${contact}`,
      ld: [crumbs([['Home', '/'], ['Services', '/services'], [c.name.en, p]])],
    }
  }
  if (r.tab === 'services') {
    return {
      html: `${nav}<h1>Services &amp; base prices · Servicios y precios</h1>${CATEGORIES.map((c) => `<h2><a href="/services/${c.id}">${esc(c.name.en)} · ${esc(c.name.es)}</a></h2><ul>${SERVICES.filter((s) => s.cat === c.id).map(serviceLi).join('')}</ul>`).join('')}${contact}`,
      ld: [crumbs([['Home', '/'], ['Services', p]])],
    }
  }
  if (r.tab === 'work' && r.projectId) {
    const x = projects.find((y) => y.id === r.projectId)!
    const c = CATEGORIES.find((y) => y.id === x.category)!
    return {
      html: `${nav}<h1>${esc(tx(x.title, 'en'))}</h1><p><strong>${esc(tx(x.title, 'es'))}</strong> · ${esc(c.name.en)}${x.town ? ` · ${esc(x.town)}` : ''}</p>
<p>${esc(tx(x.description, 'en'))}</p><p>${esc(tx(x.description, 'es'))}</p>
<div>${x.photos.map((ph, i) => `<img src="${ph.thumb ?? ph.src}" alt="${esc(`${tx(x.title, 'en')} — ${tx(ph.caption, 'en') || `photo ${i + 1}`}`)}" width="${Math.round((ph.w / ph.h) * 213)}" height="213" loading="lazy" />`).join('')}</div>
${x.services?.length ? `<h2>Services in this job</h2><ul>${x.services.map((id) => SERVICES.find((s) => s.id === id)).filter(Boolean).map((s) => serviceLi(s!)).join('')}</ul>` : ''}${contact}`,
      ld: [
        {
          '@context': 'https://schema.org', '@type': 'CreativeWork', name: tx(x.title, 'en'), alternateName: tx(x.title, 'es'),
          description: tx(x.description, 'en'), creator: { '@id': `${SITE}/#business` }, url: abs(p),
          image: x.photos.map((ph) => abs(ph.src)),
        },
        crumbs([['Home', '/'], ['Our work', '/work'], [tx(x.title, 'en'), p]]),
      ],
    }
  }
  if (r.tab === 'work') {
    return {
      html: `${nav}<h1>Our work · Trabajos realizados</h1><p>Photos of real jobs completed by ${esc(BUSINESS.name)} in Puerto Rico.</p>
<ul>${projects.map((x) => `<li><a href="${projectPath(x)}">${esc(tx(x.title, 'en'))} — ${esc(tx(x.title, 'es'))}</a>: ${esc(tx(x.description, 'en'))}</li>`).join('')}</ul>${contact}`,
      ld: [crumbs([['Home', '/'], ['Our work', p]])],
    }
  }
  if (r.tab === 'privacy' || r.tab === 'terms') {
    const d = r.tab === 'privacy' ? privacy() : terms()
    const lang = (l: 'en' | 'es') => `<h2>${esc(d.title[l])}</h2><p>${esc(d.updated[l])}</p><p>${esc(d.intro[l])}</p>${d.sections.map((s) => `<h3>${esc(s.h[l])}</h3>${s.p.map((x) => `<p>${esc(x[l])}</p>`).join('')}`).join('')}`
    return { html: `${nav}<h1>${esc(d.title.en)} · ${esc(d.title.es)}</h1>${lang('en')}${lang('es')}`, ld: [crumbs([['Home', '/'], [d.title.en, p]])] }
  }
  if (r.tab === 'profile') {
    return { html: `${nav}<h1>Contact ${esc(BUSINESS.name)}</h1><p>${esc(BUSINESS.tagline.en)} · ${esc(BUSINESS.tagline.es)}</p>${contact}`, ld: [crumbs([['Home', '/'], ['Contact', p]])] }
  }
  // Home
  return {
    html: `${nav}<h1>${esc(BUSINESS.name)} — Plumbing, Electrical &amp; Handyman in Puerto Rico</h1>
<p>${esc(BUSINESS.tagline.en)}. ${esc(BUSINESS.tagline.es)}. Plumbing, electrical, handyman, painting, tile, pressure washing, roof sealing, concrete and demolition. See base prices and request service in minutes.</p>${contact}
<h2>Services · Servicios</h2><ul>${CATEGORIES.map((c) => `<li><a href="/services/${c.id}">${esc(c.name.en)} (${esc(c.name.es)})</a> — ${esc(c.blurb.en)}</li>`).join('')}</ul>
<h2>Popular services</h2><ul>${SERVICES.filter((s) => s.popular).map(serviceLi).join('')}</ul>
<h2>Our work · Trabajos realizados</h2><ul>${projects.slice(0, 8).map((x) => `<li><a href="${projectPath(x)}">${esc(tx(x.title, 'en'))}</a></li>`).join('')}</ul>
<h2>FAQ</h2>${FAQ.map((f) => `<h3>${esc(f.q.en)}</h3><p>${esc(f.a.en)}</p>`).join('')}`,
    ld: [
      {
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q.en, acceptedAnswer: { '@type': 'Answer', text: f.a.en } })),
      },
      { '@context': 'https://schema.org', '@type': 'WebSite', name: BUSINESS.name, url: SITE, inLanguage: ['en', 'es'] },
    ],
  }
}

const template = await readFile(path.join(DIST, 'index.html'), 'utf8')

function render(p: string) {
  const m = metaFor(p)
  const { html, ld } = body(p)
  const head = [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<meta name="robots" content="${m.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}" />`,
    `<link rel="canonical" href="${abs(m.path)}" />`,
    `<meta property="og:url" content="${abs(m.path)}" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:image" content="${esc(abs(m.image))}" />`,
  ].join('\n    ')
  const scripts = [business, ...ld].map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n    ')
  return template
    .replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, head)
    .replace(/<!--ld:start-->[\s\S]*?<!--ld:end-->/, scripts)
    .replace('<!--app-->', `<div class="ssr">${html}${legalLinks}</div>`)
}

const paths = allPaths()
for (const p of paths) {
  const file = p === '/' ? path.join(DIST, 'index.html') : path.join(DIST, p, 'index.html')
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, render(p))
}
// App-only pages: real HTML (so refresh works) but kept out of Google.
for (const p of ['/estimate', '/requests', '/admin']) {
  await mkdir(path.join(DIST, p), { recursive: true })
  await writeFile(path.join(DIST, p, 'index.html'), render(p).replace('<div class="ssr">', '<div class="ssr" hidden>'))
}

const today = new Date().toISOString().slice(0, 10)
const prio = (p: string) => (p === '/' ? '1.0' : p.split('/').length === 2 ? '0.9' : p.split('/').length === 3 ? '0.8' : '0.7')
await writeFile(
  path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${paths
  .map((p) => {
    const r = parsePath(p)
    const proj = r.projectId ? getProjects().find((x) => x.id === r.projectId) : undefined
    const imgs = proj ? proj.photos.map((ph) => `\n    <image:image><image:loc>${esc(abs(ph.src))}</image:loc></image:image>`).join('') : ''
    return `  <url>\n    <loc>${abs(p)}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${prio(p)}</priority>${imgs}\n  </url>`
  })
  .join('\n')}
</urlset>
`,
)
await writeFile(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /estimate\nDisallow: /requests\n\nSitemap: ${SITE}/sitemap.xml\n`)

console.log(`  prerender: ${paths.length} pages + sitemap.xml for ${SITE}`)
