export type Lang = 'en' | 'es'
export type T = { en: string; es: string }

export const BUSINESS = {
  name: 'Torres Handyman',
  phone: '939-496-4444',
  phoneHref: 'tel:+19394964444',
  whatsapp: '19394964444',
  area: { en: 'Puerto Rico · Metro & surrounding areas', es: 'Puerto Rico · Área metro y alrededores' },
  hours: { en: 'Mon–Sat · 7:00 AM – 6:00 PM', es: 'Lun–Sáb · 7:00 AM – 6:00 PM' },
}

const u = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=75&auto=format`

export const IMG = {
  hero: '/hero.webp',
  pro: u('1743130940714-91b221fa49ec', 800, 900),
  pro2: u('1732395805034-e0bf859665e5', 800, 900),
  toolbelt: u('1595844730298-b960ff98fee0', 800, 1000),
  caulk: u('1786204697642-328c597b6f05', 800, 800),
  home: u('1786053538161-501fbdd89629', 900, 700),
  couple: u('1758523671285-9ff3f4e0ff38', 800, 800),
  electrical: u('1732660780054-0cf9fadb9d30'),
  electrical2: u('1758101755915-462eddc23f57'),
  plumbing: u('1749532125405-70950966b0e5'),
  plumbing2: u('1676210133055-eab6ef033ce3'),
  pvc: u('1545193329-4a052e14eb8f'),
  pvc2: u('1650246363606-a2402ec42b08'),
  concrete: u('1773432114474-c1afba22a339'),
  concrete2: u('1774931363306-5a896cd4dd02'),
  painting: u('1688372199140-cade7ae820fe'),
  painting2: u('1717281234297-3def5ae3eee1'),
  drywall: u('1768839725085-829e6ac7ac26'),
  drywall2: u('1768321914149-5a6428ec2f82'),
  washing: u('1718152423993-a29048dbc223'),
  washing2: u('1718152521364-b9655b8a7926'),
}

export type CategoryId = 'electrical' | 'plumbing' | 'pvc' | 'concrete' | 'painting' | 'drywall' | 'washing'

export type Category = { id: CategoryId; name: T; short: T; tint: string; img: string; blurb: T }

export const CATEGORIES: Category[] = [
  { id: 'electrical', name: { en: 'Electrical', es: 'Electricidad' }, short: { en: 'Electric', es: 'Eléctrico' }, tint: '#F3EBD3', img: IMG.electrical, blurb: { en: 'Outlets, fixtures, fans & breakers', es: 'Tomacorrientes, lámparas, abanicos y breakers' } },
  { id: 'plumbing', name: { en: 'Plumbing', es: 'Plomería' }, short: { en: 'Plumbing', es: 'Plomería' }, tint: '#E3ECEF', img: IMG.plumbing, blurb: { en: 'Leaks, faucets, toilets & drains', es: 'Filtraciones, llaves, inodoros y desagües' } },
  { id: 'pvc', name: { en: 'PVC Work', es: 'Trabajos en PVC' }, short: { en: 'PVC', es: 'PVC' }, tint: '#ECEAE4', img: IMG.pvc, blurb: { en: 'Pipes, drain lines & PVC panels', es: 'Tuberías, líneas de drenaje y paneles PVC' } },
  { id: 'concrete', name: { en: 'Concrete', es: 'Cemento' }, short: { en: 'Concrete', es: 'Cemento' }, tint: '#EDE6DD', img: IMG.concrete, blurb: { en: 'Cracks, slabs, steps & block walls', es: 'Grietas, losas, escalones y paredes de bloque' } },
  { id: 'painting', name: { en: 'Painting', es: 'Pintura' }, short: { en: 'Painting', es: 'Pintura' }, tint: '#F5EDCB', img: IMG.painting, blurb: { en: 'Rooms, accent walls, doors & exteriors', es: 'Cuartos, paredes, puertas y exteriores' } },
  { id: 'drywall', name: { en: 'Drywall', es: 'Gypsum' }, short: { en: 'Drywall', es: 'Gypsum' }, tint: '#E9EBE2', img: IMG.drywall, blurb: { en: 'Patches, new sheets & water damage', es: 'Parchos, planchas nuevas y daños por agua' } },
  { id: 'washing', name: { en: 'Pressure Washing', es: 'Lavado a Presión' }, short: { en: 'Washing', es: 'Lavado' }, tint: '#E2EBE6', img: IMG.washing, blurb: { en: 'Driveways, homes, roofs & sealing', es: 'Marquesinas, casas, techos y sellado' } },
]

export type Service = {
  id: string
  cat: CategoryId
  name: T
  desc: T
  price: number
  unit: T
  time: T
  img: string
  rating: number
  popular?: boolean
  includes: T[]
}

const per = { en: 'per unit', es: 'por unidad' }
const job = { en: 'per job', es: 'por trabajo' }

export const SERVICES: Service[] = [
  // Electrical
  { id: 'outlet', cat: 'electrical', name: { en: 'Outlet or Switch Replacement', es: 'Cambio de Tomacorriente o Interruptor' }, desc: { en: 'Swap worn or dead outlets and switches safely.', es: 'Cambiamos tomacorrientes e interruptores dañados de forma segura.' }, price: 85, unit: per, time: { en: '30–45 min', es: '30–45 min' }, img: IMG.electrical2, rating: 4.9, popular: true, includes: [{ en: 'Power shut-off & testing', es: 'Corte de energía y prueba' }, { en: 'Standard outlet/switch included', es: 'Tomacorriente/interruptor estándar incluido' }, { en: 'Cover plate', es: 'Tapa incluida' }] },
  { id: 'fixture', cat: 'electrical', name: { en: 'Light Fixture Installation', es: 'Instalación de Lámpara' }, desc: { en: 'Install ceiling or wall lights you already own.', es: 'Instalamos lámparas de techo o pared que ya tengas.' }, price: 120, unit: per, time: { en: '1 hr', es: '1 h' }, img: IMG.electrical, rating: 4.9, includes: [{ en: 'Remove old fixture', es: 'Remoción de lámpara vieja' }, { en: 'Mount & wire new fixture', es: 'Montaje y conexión de la nueva' }, { en: 'Clean-up', es: 'Limpieza' }] },
  { id: 'fan', cat: 'electrical', name: { en: 'Ceiling Fan Installation', es: 'Instalación de Abanico de Techo' }, desc: { en: 'Assembly, balancing and wiring on an existing box.', es: 'Ensamblaje, balance y conexión en caja existente.' }, price: 165, unit: per, time: { en: '1.5 hr', es: '1.5 h' }, img: IMG.electrical2, rating: 4.8, popular: true, includes: [{ en: 'Full assembly', es: 'Ensamblaje completo' }, { en: 'Blade balancing', es: 'Balance de aspas' }, { en: 'Remote/wall control setup', es: 'Configuración de control' }] },
  { id: 'gfci', cat: 'electrical', name: { en: 'GFCI Outlet Install', es: 'Instalación de Outlet GFCI' }, desc: { en: 'Code-required protection for kitchens & baths.', es: 'Protección requerida por código en cocinas y baños.' }, price: 110, unit: per, time: { en: '45 min', es: '45 min' }, img: IMG.electrical, rating: 4.9, includes: [{ en: 'GFCI device included', es: 'GFCI incluido' }, { en: 'Trip test', es: 'Prueba de disparo' }] },
  { id: 'breaker', cat: 'electrical', name: { en: 'Breaker Replacement', es: 'Cambio de Breaker' }, desc: { en: 'Replace a faulty breaker in your panel.', es: 'Reemplazo de breaker defectuoso en el panel.' }, price: 195, unit: per, time: { en: '1 hr', es: '1 h' }, img: IMG.electrical2, rating: 4.8, includes: [{ en: 'Panel inspection', es: 'Inspección del panel' }, { en: 'Standard breaker included', es: 'Breaker estándar incluido' }] },
  // Plumbing
  { id: 'faucet-fix', cat: 'plumbing', name: { en: 'Leaky Faucet Repair', es: 'Reparación de Llave que Gotea' }, desc: { en: 'Stop the drip — cartridges, washers and seals.', es: 'Adiós al goteo: cartuchos, gomas y sellos.' }, price: 95, unit: per, time: { en: '45 min', es: '45 min' }, img: IMG.plumbing2, rating: 4.9, popular: true, includes: [{ en: 'Diagnosis', es: 'Diagnóstico' }, { en: 'Washers & seals', es: 'Gomas y sellos' }] },
  { id: 'faucet-new', cat: 'plumbing', name: { en: 'Faucet Replacement', es: 'Cambio de Llave' }, desc: { en: 'Install a new kitchen or bathroom faucet.', es: 'Instalamos llave nueva de cocina o baño.' }, price: 145, unit: per, time: { en: '1 hr', es: '1 h' }, img: IMG.plumbing, rating: 4.8, includes: [{ en: 'Remove old faucet', es: 'Remoción de llave vieja' }, { en: 'New supply lines', es: 'Líneas de suministro nuevas' }] },
  { id: 'toilet-fix', cat: 'plumbing', name: { en: 'Toilet Repair', es: 'Reparación de Inodoro' }, desc: { en: 'Running, leaking or weak flush — fixed.', es: 'Inodoro que corre, gotea o descarga débil.' }, price: 110, unit: per, time: { en: '1 hr', es: '1 h' }, img: IMG.plumbing2, rating: 4.9, includes: [{ en: 'Flapper/fill valve', es: 'Flapper/válvula de llenado' }, { en: 'Leak test', es: 'Prueba de filtración' }] },
  { id: 'toilet-new', cat: 'plumbing', name: { en: 'Toilet Installation', es: 'Instalación de Inodoro' }, desc: { en: 'Remove old unit and set the new one.', es: 'Removemos el viejo e instalamos el nuevo.' }, price: 225, unit: per, time: { en: '2 hr', es: '2 h' }, img: IMG.plumbing, rating: 4.8, includes: [{ en: 'Wax ring & bolts', es: 'Anillo de cera y tornillos' }, { en: 'Haul-away of old toilet', es: 'Recogido del inodoro viejo' }] },
  { id: 'drain', cat: 'plumbing', name: { en: 'Drain Unclogging', es: 'Destape de Desagüe' }, desc: { en: 'Sinks, tubs and showers flowing again.', es: 'Fregaderos, bañeras y duchas fluyendo otra vez.' }, price: 135, unit: per, time: { en: '1 hr', es: '1 h' }, img: IMG.plumbing2, rating: 4.7, popular: true, includes: [{ en: 'Snake/auger', es: 'Culebra/barrena' }, { en: 'Flow test', es: 'Prueba de flujo' }] },
  // PVC
  { id: 'pvc-repair', cat: 'pvc', name: { en: 'PVC Pipe Repair', es: 'Reparación de Tubería PVC' }, desc: { en: 'Cut out and replace cracked PVC sections.', es: 'Cortamos y reemplazamos secciones rotas de PVC.' }, price: 125, unit: per, time: { en: '1 hr', es: '1 h' }, img: IMG.pvc2, rating: 4.8, popular: true, includes: [{ en: 'Up to 6 ft of pipe', es: 'Hasta 6 pies de tubo' }, { en: 'Fittings & cement', es: 'Conexiones y pega' }] },
  { id: 'pvc-drain', cat: 'pvc', name: { en: 'PVC Drain Line Install', es: 'Instalación de Línea de Drenaje' }, desc: { en: 'New drain runs for A/C, sinks or gutters.', es: 'Líneas nuevas para A/C, fregaderos o canales.' }, price: 175, unit: { en: 'per run', es: 'por línea' }, time: { en: '1.5 hr', es: '1.5 h' }, img: IMG.pvc, rating: 4.8, includes: [{ en: 'Up to 15 ft', es: 'Hasta 15 pies' }, { en: 'Brackets & fittings', es: 'Soportes y conexiones' }] },
  { id: 'pvc-panel', cat: 'pvc', name: { en: 'PVC Wall / Ceiling Panels', es: 'Paneles PVC de Pared / Techo' }, desc: { en: 'Moisture-proof panels, clean modern finish.', es: 'Paneles a prueba de humedad, acabado moderno.' }, price: 65, unit: { en: 'per 10 sq ft', es: 'por 10 p²' }, time: { en: 'Varies', es: 'Varía' }, img: IMG.pvc2, rating: 4.7, includes: [{ en: 'Install & trim', es: 'Instalación y molduras' }, { en: 'Panels quoted separately', es: 'Paneles se cotizan aparte' }] },
  // Concrete
  { id: 'crack', cat: 'concrete', name: { en: 'Concrete Crack Repair', es: 'Reparación de Grietas' }, desc: { en: 'Seal and patch cracks in walls or floors.', es: 'Sellamos y resanamos grietas en paredes o pisos.' }, price: 150, unit: job, time: { en: '2 hr', es: '2 h' }, img: IMG.concrete, rating: 4.8, popular: true, includes: [{ en: 'Up to 10 linear ft', es: 'Hasta 10 pies lineales' }, { en: 'Patch & seal', es: 'Resane y sellado' }] },
  { id: 'slab', cat: 'concrete', name: { en: 'Small Slab or Pad', es: 'Losa o Base Pequeña' }, desc: { en: 'Pads for A/C units, water tanks or walkways.', es: 'Bases para A/C, cisternas o pasillos.' }, price: 140, unit: { en: 'per 10 sq ft', es: 'por 10 p²' }, time: { en: '1 day', es: '1 día' }, img: IMG.concrete2, rating: 4.7, includes: [{ en: 'Form, pour & finish', es: 'Encofrado, vaciado y acabado' }] },
  { id: 'steps', cat: 'concrete', name: { en: 'Step or Sidewalk Repair', es: 'Reparación de Escalón o Acera' }, desc: { en: 'Rebuild chipped steps and broken sections.', es: 'Reconstruimos escalones y secciones rotas.' }, price: 260, unit: job, time: { en: '4 hr', es: '4 h' }, img: IMG.concrete, rating: 4.8, includes: [{ en: 'Demo of damaged area', es: 'Demolición del área dañada' }, { en: 'New concrete finish', es: 'Terminación nueva' }] },
  { id: 'block', cat: 'concrete', name: { en: 'Block Wall Repair', es: 'Reparación de Pared de Bloque' }, desc: { en: 'Replace damaged blocks and re-stucco.', es: 'Reemplazo de bloques dañados y empañetado.' }, price: 220, unit: job, time: { en: '4 hr', es: '4 h' }, img: IMG.concrete2, rating: 4.7, includes: [{ en: 'Up to 10 blocks', es: 'Hasta 10 bloques' }, { en: 'Stucco finish', es: 'Empañetado' }] },
  // Painting
  { id: 'room', cat: 'painting', name: { en: 'Interior Room Painting', es: 'Pintura de Cuarto Interior' }, desc: { en: 'Walls of a room up to 12×12 ft, two coats.', es: 'Paredes de cuarto hasta 12×12 pies, dos capas.' }, price: 380, unit: { en: 'per room', es: 'por cuarto' }, time: { en: '1 day', es: '1 día' }, img: IMG.painting2, rating: 4.9, popular: true, includes: [{ en: 'Prep, tape & cover', es: 'Preparación y protección' }, { en: '2 coats premium paint', es: '2 capas de pintura premium' }, { en: 'Clean-up', es: 'Limpieza' }] },
  { id: 'accent', cat: 'painting', name: { en: 'Accent Wall', es: 'Pared de Acento' }, desc: { en: 'One bold wall to change the whole room.', es: 'Una pared que cambia todo el espacio.' }, price: 190, unit: per, time: { en: '4 hr', es: '4 h' }, img: IMG.painting, rating: 4.9, includes: [{ en: 'Paint included', es: 'Pintura incluida' }, { en: 'Crisp cut lines', es: 'Bordes perfectos' }] },
  { id: 'door', cat: 'painting', name: { en: 'Door Painting', es: 'Pintura de Puerta' }, desc: { en: 'Both sides, frame and trim.', es: 'Ambos lados, marco y moldura.' }, price: 95, unit: per, time: { en: '2 hr', es: '2 h' }, img: IMG.painting2, rating: 4.8, includes: [{ en: 'Sanding & primer', es: 'Lijado y primer' }] },
  { id: 'exterior', cat: 'painting', name: { en: 'Exterior Wall Painting', es: 'Pintura Exterior' }, desc: { en: 'Weather-resistant paint for façades.', es: 'Pintura resistente al clima para fachadas.' }, price: 240, unit: { en: 'per 100 sq ft', es: 'por 100 p²' }, time: { en: 'Varies', es: 'Varía' }, img: IMG.painting, rating: 4.8, includes: [{ en: 'Wash & prep', es: 'Lavado y preparación' }, { en: 'Elastomeric option', es: 'Opción elastomérica' }] },
  // Drywall
  { id: 'patch-s', cat: 'drywall', name: { en: 'Small Hole Patch', es: 'Parcho Pequeño' }, desc: { en: 'Nail pops, door-knob holes and dents.', es: 'Huecos de clavos, perillas y golpes.' }, price: 95, unit: per, time: { en: '1 hr', es: '1 h' }, img: IMG.drywall, rating: 4.9, popular: true, includes: [{ en: 'Patch, mud & sand', es: 'Parcho, masilla y lijado' }, { en: 'Primer ready', es: 'Listo para pintar' }] },
  { id: 'patch-l', cat: 'drywall', name: { en: 'Large Patch (up to 2×2 ft)', es: 'Parcho Grande (hasta 2×2 pies)' }, desc: { en: 'Cut-in new drywall and blend the texture.', es: 'Pieza nueva de gypsum y textura igualada.' }, price: 165, unit: per, time: { en: '2 hr', es: '2 h' }, img: IMG.drywall, rating: 4.8, includes: [{ en: 'New board & tape', es: 'Plancha y cinta nuevas' }, { en: 'Texture match', es: 'Igualar textura' }] },
  { id: 'sheet', cat: 'drywall', name: { en: 'Drywall Sheet Install', es: 'Instalación de Plancha de Gypsum' }, desc: { en: 'Hang, tape and finish new 4×8 sheets.', es: 'Colgar, encintar y terminar planchas 4×8.' }, price: 85, unit: { en: 'per sheet', es: 'por plancha' }, time: { en: 'Varies', es: 'Varía' }, img: IMG.drywall2, rating: 4.7, includes: [{ en: 'Sheet included', es: 'Plancha incluida' }, { en: 'Level 4 finish', es: 'Terminación nivel 4' }] },
  { id: 'water-dmg', cat: 'drywall', name: { en: 'Water Damage Repair', es: 'Reparación por Daño de Agua' }, desc: { en: 'Remove wet drywall, dry, replace & finish.', es: 'Removemos gypsum mojado, secamos y reemplazamos.' }, price: 285, unit: job, time: { en: '1 day', es: '1 día' }, img: IMG.drywall2, rating: 4.8, includes: [{ en: 'Moisture check', es: 'Medición de humedad' }, { en: 'Up to 16 sq ft', es: 'Hasta 16 p²' }] },
  // Washing
  { id: 'driveway', cat: 'washing', name: { en: 'Driveway Pressure Wash', es: 'Lavado a Presión de Marquesina' }, desc: { en: 'Lift oil, mold and grime off concrete.', es: 'Removemos aceite, hongo y suciedad del cemento.' }, price: 160, unit: job, time: { en: '2 hr', es: '2 h' }, img: IMG.washing, rating: 4.9, popular: true, includes: [{ en: 'Surface cleaner finish', es: 'Acabado con surface cleaner' }, { en: 'Up to 2 cars', es: 'Hasta 2 carros' }] },
  { id: 'house-wash', cat: 'washing', name: { en: 'House Exterior Wash', es: 'Lavado Exterior de Casa' }, desc: { en: 'Soft-wash walls, eaves and windows.', es: 'Lavado suave de paredes, aleros y ventanas.' }, price: 320, unit: job, time: { en: '4 hr', es: '4 h' }, img: IMG.washing2, rating: 4.8, includes: [{ en: 'Mold treatment', es: 'Tratamiento de hongo' }, { en: 'Single-story home', es: 'Casa de un nivel' }] },
  { id: 'patio', cat: 'washing', name: { en: 'Patio or Deck Wash', es: 'Lavado de Patio o Terraza' }, desc: { en: 'Bring back the original color.', es: 'Recupera el color original.' }, price: 140, unit: job, time: { en: '2 hr', es: '2 h' }, img: IMG.washing, rating: 4.8, includes: [{ en: 'Up to 400 sq ft', es: 'Hasta 400 p²' }] },
  { id: 'seal', cat: 'washing', name: { en: 'Roof Wash & Seal', es: 'Lavado y Sellado de Techo' }, desc: { en: 'Pressure wash and waterproof sealing.', es: 'Lavado a presión y sellado impermeabilizante.' }, price: 95, unit: { en: 'per 100 sq ft', es: 'por 100 p²' }, time: { en: '1–2 days', es: '1–2 días' }, img: IMG.washing2, rating: 4.9, popular: true, includes: [{ en: 'Wash, prime & seal', es: 'Lavado, primer y sellado' }, { en: 'Warranty available', es: 'Garantía disponible' }] },
]

export const TRIP_FEE = 39
export const FREE_TRIP_OVER = 150

export const REVIEWS = [
  { name: 'Melissa R.', city: 'Carolina', text: { en: 'Booked a ceiling fan and two outlets in 2 minutes. Price was exactly what the app said. On time and super clean.', es: 'Reservé un abanico y dos tomacorrientes en 2 minutos. El precio fue exacto. Puntual y muy limpio.' }, stars: 5, job: { en: 'Electrical', es: 'Electricidad' } },
  { name: 'Carlos M.', city: 'Bayamón', text: { en: 'The driveway looks brand new. Loved seeing the total before booking — no surprises.', es: 'La marquesina quedó como nueva. Me encantó ver el total antes de reservar, sin sorpresas.' }, stars: 5, job: { en: 'Pressure washing', es: 'Lavado a presión' } },
  { name: 'Jennifer L.', city: 'Guaynabo', text: { en: 'Fixed a water-damaged wall and painted the room the same day. Highly recommend Torres.', es: 'Arreglaron una pared con daño de agua y pintaron el cuarto el mismo día. Recomendados.' }, stars: 5, job: { en: 'Drywall + Paint', es: 'Gypsum + Pintura' } },
  { name: 'Ángel T.', city: 'San Juan', text: { en: 'Fast, honest and professional. Fixed my leak in 40 minutes.', es: 'Rápidos, honestos y profesionales. Arreglaron la filtración en 40 minutos.' }, stars: 5, job: { en: 'Plumbing', es: 'Plomería' } },
]

export const FAQ: { q: T; a: T }[] = [
  { q: { en: 'Are the prices final?', es: '¿Los precios son finales?' }, a: { en: 'Prices are upfront estimates for standard jobs. If our pro finds something different on site, you approve any change before work starts — always.', es: 'Son estimados por adelantado para trabajos estándar. Si el técnico encuentra algo distinto, tú apruebas cualquier cambio antes de empezar.' } },
  { q: { en: 'Do I pay now?', es: '¿Pago ahora?' }, a: { en: 'No. Booking is free. You pay when the job is done — card, cash, ATH Móvil or Zelle.', es: 'No. Reservar es gratis. Pagas al terminar: tarjeta, efectivo, ATH Móvil o Zelle.' } },
  { q: { en: 'Do you bring materials?', es: '¿Traen los materiales?' }, a: { en: 'Standard parts listed under each service are included. Special fixtures or finishes you choose are quoted separately.', es: 'Las piezas estándar indicadas en cada servicio están incluidas. Accesorios o acabados especiales se cotizan aparte.' } },
  { q: { en: 'Is there a trip fee?', es: '¿Cobran visita?' }, a: { en: `A $${TRIP_FEE} trip fee applies to orders under $${FREE_TRIP_OVER}. Orders over $${FREE_TRIP_OVER} get the visit free.`, es: `Se cobra $${TRIP_FEE} de visita en órdenes menores de $${FREE_TRIP_OVER}. Sobre $${FREE_TRIP_OVER}, la visita es gratis.` } },
  { q: { en: 'Is the work guaranteed?', es: '¿El trabajo tiene garantía?' }, a: { en: 'Yes. Every job comes with our 90-day workmanship guarantee.', es: 'Sí. Todo trabajo tiene 90 días de garantía de mano de obra.' } },
]

export const STR = {
  getStarted: { en: 'Get started', es: 'Comenzar' },
  slide: { en: 'Slide to start', es: 'Desliza para empezar' },
  onbTitle1: { en: 'Home repairs,', es: 'Reparaciones,' },
  onbTitle2: { en: 'made', es: 'hechas' },
  onbTitle3: { en: 'simple.', es: 'simples.' },
  onbSub: { en: 'Pick your fixes, see the price instantly and book a trusted pro in minutes.', es: 'Escoge tus arreglos, ve el precio al instante y reserva un profesional en minutos.' },
  hello: { en: 'Welcome to', es: 'Bienvenido a' },
  homeTitle1: { en: 'Fix it fast.', es: 'Arréglalo rápido.' },
  homeTitle2: { en: 'Pay what you see.', es: 'Paga lo que ves.' },
  search: { en: 'Search a repair… e.g. faucet', es: 'Busca un arreglo… ej. llave' },
  all: { en: 'All', es: 'Todos' },
  promoTag: { en: 'Free visit over $150', es: 'Visita gratis sobre $150' },
  promoTitle: { en: 'Your trusted handyman, one tap away', es: 'Tu handyman de confianza, a un toque' },
  bookNow: { en: 'Book now', es: 'Reservar' },
  popular: { en: 'Popular fixes', es: 'Arreglos populares' },
  seeAll: { en: 'See all', es: 'Ver todo' },
  categories: { en: 'What do you need?', es: '¿Qué necesitas?' },
  howTitle: { en: 'How it works', es: 'Cómo funciona' },
  how: [
    { t: { en: 'Pick your fixes', es: 'Escoge tus arreglos' }, d: { en: 'Add services like a shopping cart. Your total updates live.', es: 'Agrega servicios como en un carrito. El total se actualiza al instante.' } },
    { t: { en: 'Choose a time', es: 'Escoge la hora' }, d: { en: 'Select the day and time window that works for you.', es: 'Selecciona el día y la hora que te convenga.' } },
    { t: { en: 'We fix it', es: 'Lo arreglamos' }, d: { en: 'A vetted pro arrives on time. Pay only when you’re happy.', es: 'Un profesional llega a tiempo. Pagas cuando estés satisfecho.' } },
  ],
  whyTitle: { en: 'Why Torres', es: 'Por qué Torres' },
  why: [
    { t: { en: 'Upfront pricing', es: 'Precios claros' }, d: { en: 'See the price before you book.', es: 'Ve el precio antes de reservar.' } },
    { t: { en: 'Licensed & insured', es: 'Licenciados y asegurados' }, d: { en: 'Peace of mind on every job.', es: 'Tranquilidad en cada trabajo.' } },
    { t: { en: 'Fast scheduling', es: 'Citas rápidas' }, d: { en: 'Same-week appointments.', es: 'Citas en la misma semana.' } },
    { t: { en: '90-day guarantee', es: 'Garantía de 90 días' }, d: { en: 'We stand behind our work.', es: 'Respaldamos nuestro trabajo.' } },
  ],
  beforeAfter: { en: 'See the difference', es: 'Mira la diferencia' },
  beforeAfterSub: { en: 'Drag to see what a pressure wash can do.', es: 'Desliza para ver lo que logra un lavado a presión.' },
  before: { en: 'Before', es: 'Antes' },
  after: { en: 'After', es: 'Después' },
  reviews: { en: 'Neighbors love us', es: 'Nuestros clientes opinan' },
  faq: { en: 'Questions', es: 'Preguntas' },
  ctaTitle: { en: 'Not sure what you need?', es: '¿No sabes qué necesitas?' },
  ctaSub: { en: 'Send us a photo on WhatsApp and get a quote in minutes.', es: 'Envíanos una foto por WhatsApp y recibe tu cotización en minutos.' },
  call: { en: 'Call', es: 'Llamar' },
  add: { en: 'Add', es: 'Agregar' },
  added: { en: 'Added', es: 'Agregado' },
  from: { en: 'from', es: 'desde' },
  services: { en: 'Services', es: 'Servicios' },
  viewEstimate: { en: 'View estimate', es: 'Ver estimado' },
  items: { en: 'items', es: 'servicios' },
  item: { en: 'item', es: 'servicio' },
  included: { en: 'What’s included', es: 'Qué incluye' },
  quantity: { en: 'Quantity', es: 'Cantidad' },
  addToEstimate: { en: 'Add to estimate', es: 'Agregar al estimado' },
  update: { en: 'Update', es: 'Actualizar' },
  estimate: { en: 'Your estimate', es: 'Tu estimado' },
  emptyCart: { en: 'Your estimate is empty', es: 'Tu estimado está vacío' },
  emptyCartSub: { en: 'Add a few repairs and we’ll calculate everything for you.', es: 'Agrega algunos arreglos y calculamos todo por ti.' },
  browse: { en: 'Browse services', es: 'Ver servicios' },
  subtotal: { en: 'Subtotal', es: 'Subtotal' },
  trip: { en: 'Trip fee', es: 'Visita' },
  free: { en: 'FREE', es: 'GRATIS' },
  total: { en: 'Estimated total', es: 'Total estimado' },
  addMore: { en: 'Add', es: 'Agrega' },
  forFree: { en: 'more for a free visit', es: 'más para visita gratis' },
  payLater: { en: 'No payment now · Pay after the job', es: 'Sin pago ahora · Pagas al terminar' },
  schedule: { en: 'Schedule', es: 'Agendar' },
  continue: { en: 'Continue', es: 'Continuar' },
  when: { en: 'When works for you?', es: '¿Cuándo te conviene?' },
  date: { en: 'Date', es: 'Fecha' },
  time: { en: 'Arrival window', es: 'Hora de llegada' },
  details: { en: 'Your details', es: 'Tus datos' },
  name: { en: 'Full name', es: 'Nombre completo' },
  phone: { en: 'Phone', es: 'Teléfono' },
  address: { en: 'Service address', es: 'Dirección del servicio' },
  notes: { en: 'Notes for the pro (optional)', es: 'Notas para el técnico (opcional)' },
  confirm: { en: 'Confirm booking', es: 'Confirmar reserva' },
  step: { en: 'Step', es: 'Paso' },
  of: { en: 'of', es: 'de' },
  booked: { en: 'You’re booked!', es: '¡Reservado!' },
  bookedSub: { en: 'We received your request. Torres Handyman will confirm by text shortly.', es: 'Recibimos tu solicitud. Torres Handyman te confirmará por mensaje en breve.' },
  sendWa: { en: 'Send to WhatsApp', es: 'Enviar por WhatsApp' },
  backHome: { en: 'Back to home', es: 'Volver al inicio' },
  bookings: { en: 'My bookings', es: 'Mis reservas' },
  noBookings: { en: 'No bookings yet', es: 'Aún no tienes reservas' },
  noBookingsSub: { en: 'When you book a service it will show up here with live status.', es: 'Cuando reserves un servicio aparecerá aquí con su estado.' },
  status: [
    { en: 'Requested', es: 'Solicitado' },
    { en: 'Confirmed', es: 'Confirmado' },
    { en: 'On the way', es: 'En camino' },
    { en: 'Completed', es: 'Completado' },
  ],
  upcoming: { en: 'Upcoming', es: 'Próximas' },
  profile: { en: 'Account', es: 'Cuenta' },
  about: { en: 'About Torres Handyman', es: 'Sobre Torres Handyman' },
  aboutText: { en: 'A local, family-run handyman service. Electrical, plumbing, PVC, concrete, painting, drywall and pressure washing — done right the first time.', es: 'Servicio local y familiar. Electricidad, plomería, PVC, cemento, pintura, gypsum y lavado a presión — bien hecho desde la primera vez.' },
  language: { en: 'Language', es: 'Idioma' },
  hoursL: { en: 'Hours', es: 'Horario' },
  areaL: { en: 'Service area', es: 'Área de servicio' },
  contact: { en: 'Contact', es: 'Contacto' },
  home: { en: 'Home', es: 'Inicio' },
  cart: { en: 'Estimate', es: 'Estimado' },
  required: { en: 'Please complete name, phone and address.', es: 'Completa nombre, teléfono y dirección.' },
  results: { en: 'results', es: 'resultados' },
  noResults: { en: 'No matches. Try “paint” or “leak”.', es: 'Sin resultados. Prueba “pintura” o “llave”.' },
  tagline: { en: 'Your fast & reliable solution', es: 'Tu solución rápida y confiable' },
  rated: { en: 'Rated 4.9 by 500+ homeowners', es: 'Calificación 4.9 por +500 clientes' },
  jobs: { en: 'Jobs done', es: 'Trabajos' },
  years: { en: 'Years', es: 'Años' },
  rating: { en: 'Rating', es: 'Calificación' },
  remove: { en: 'Remove', es: 'Quitar' },
  today: { en: 'Today', es: 'Hoy' },
  tomorrow: { en: 'Tomorrow', es: 'Mañana' },
  cancel: { en: 'Cancel booking', es: 'Cancelar reserva' },
  bookingFor: { en: 'Booking', es: 'Reserva' },
}

export const SLOTS = ['8:00 – 10:00 AM', '10:00 – 12:00 PM', '12:00 – 2:00 PM', '2:00 – 4:00 PM', '4:00 – 6:00 PM']
