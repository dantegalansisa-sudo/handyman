export type Lang = 'en' | 'es'
export type T = { en: string; es: string }

export const BUSINESS = {
  name: 'Torres Contractor Solution',
  short: 'Torres',
  phone: '939-496-4444',
  phoneHref: 'tel:+19394964444',
  whatsapp: '19394964444',
  area: { en: 'Puerto Rico', es: 'Puerto Rico' },
  tagline: { en: 'Your fast & reliable solution', es: 'Tu solución rápida y confiable' },
}

/** Minimum charge for any visit (client-provided). */
export const MIN_SERVICE = 75

const u = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=75&auto=format`

/**
 * Photos. Stock placeholders for now — to use the client's real job photos,
 * drop files in /public/services/ and point these keys at '/services/<file>.webp'.
 */
export const IMG = {
  hero: '/hero.webp',
  pro: u('1743130940714-91b221fa49ec', 800, 900),
  pro2: u('1732395805034-e0bf859665e5', 800, 900),
  toolbelt: u('1595844730298-b960ff98fee0', 800, 1000),
  caulk: u('1786204697642-328c597b6f05', 800, 800),
  home: u('1786053538161-501fbdd89629', 900, 700),
  // plumbing
  plumbing: u('1749532125405-70950966b0e5'),
  toilet: u('1569597967185-cd6120712154'),
  bathSink: u('1595514535116-d0401260e7cf'),
  kitchenFaucet: u('1629078692818-c5a0443f4ae3'),
  disposal: u('1757787697646-e84d5490add1'),
  shower: u('1698724624855-e9dbc5a0bddb'),
  cistern: u('1787672357817-0840af8debbf'),
  regulator: u('1761758674188-2b8e4c89c5e2'),
  valve: u('1607472586893-edb57bdc0e39'),
  faucetFix: u('1542013936693-884638332954'),
  heater: u('1776860155275-eee24bfb1dee'),
  washer: u('1626806787461-102c1bfaaea1'),
  // electrical
  electrical: u('1732660780054-0cf9fadb9d30'),
  outlet: u('1758101755915-462eddc23f57'),
  spotlight: u('1660330589693-99889d60181e'),
  fixture: u('1554995207-c18c203602cb'),
  fan: u('1762529716272-b316f61502e7'),
  conduit: u('1768321913920-d3ac011e0683'),
  register: u('1635335874521-7987db781153'),
  panel: u('1544724569-5f546fd6f2b5'),
  ev: u('1704474618942-ae933a8edd86'),
  // handyman
  handyman: u('1590635023142-73c3d34f2805'),
  bathAcc: u('1595182939836-5d4ba24ae7bf'),
  hanging: u('1452457005517-a0dd81caca2a'),
  tv: u('1665827488605-7717598fdf78'),
  tvBig: u('1521607630287-ee2e81ad3ced'),
  pvcPanels: u('1633604712918-6ab1173d0ecd'),
  furniture: u('1623043453741-11aef9cb59b5'),
  closet: u('1753918525893-c8f2098abd0a'),
  window: u('1527352774566-e4916e36c645'),
  doorIn: u('1601835895382-3d7854422c04'),
  doorOut: u('1536160885591-301854e2ed04'),
  pickup: u('1574462233115-1a4a05e33433'),
  // painting
  painting: u('1688372199140-cade7ae820fe'),
  paintIn: u('1717281234297-3def5ae3eee1'),
  paintOut: u('1759406066673-f76869a4e6db'),
  // tile
  tile: u('1656646523907-97b094c7e63a'),
  tileFloor: u('1523413307857-ef24c53571ae'),
  tileWall: u('1625646333826-c30c4e4d73d2'),
  // washing & roofs
  washing: u('1718152423993-a29048dbc223'),
  washing2: u('1718152521364-b9655b8a7926'),
  roof: u('1674485169641-bcb2bf6f1df9'),
  // concrete & demolition
  concrete: u('1774516534097-76eb46de7229'),
  demo: u('1649692112200-f81e4a0421e3'),
}

export type CategoryId = 'plumbing' | 'electrical' | 'handyman' | 'painting' | 'tile' | 'washing' | 'concrete'

export type Category = { id: CategoryId; name: T; short: T; tint: string; img: string; blurb: T }

export const CATEGORIES: Category[] = [
  { id: 'plumbing', name: { en: 'Plumbing', es: 'Plomería' }, short: { en: 'Plumbing', es: 'Plomería' }, tint: '#E3ECEF', img: IMG.plumbing, blurb: { en: 'Toilets, sinks, faucets, heaters & cisterns', es: 'Inodoros, lavamanos, mezcladoras, calentadores y cisternas' } },
  { id: 'electrical', name: { en: 'Electrical', es: 'Electricidad' }, short: { en: 'Electrical', es: 'Electricidad' }, tint: '#F3EBD3', img: IMG.electrical, blurb: { en: 'Outlets, lights, fans, panels & EV chargers', es: 'Receptáculos, lámparas, abanicos, paneles y cargadores' } },
  { id: 'handyman', name: { en: 'Handyman', es: 'Handyman' }, short: { en: 'Handyman', es: 'Handyman' }, tint: '#ECE7DC', img: IMG.handyman, blurb: { en: 'TVs, furniture, doors, windows & store pickups', es: 'TVs, muebles, puertas, ventanas y recogidos' } },
  { id: 'painting', name: { en: 'Painting', es: 'Pintura' }, short: { en: 'Painting', es: 'Pintura' }, tint: '#F5EDCB', img: IMG.painting, blurb: { en: 'Interior & exterior painting by the sq ft', es: 'Pintura interior y exterior por pie cuadrado' } },
  { id: 'tile', name: { en: 'Tile', es: 'Losas' }, short: { en: 'Tile', es: 'Losas' }, tint: '#E9EBE2', img: IMG.tile, blurb: { en: 'Floor tile & bathroom wall tile', es: 'Losa de piso y losa de pared de baño' } },
  { id: 'washing', name: { en: 'Pressure Wash & Roof Seal', es: 'Lavado a Presión y Sellado' }, short: { en: 'Wash & Seal', es: 'Lavado y Sellado' }, tint: '#E2EBE6', img: IMG.washing, blurb: { en: 'Floors, roofs & roof sealing', es: 'Pisos, techos y sellado de techo' } },
  { id: 'concrete', name: { en: 'Concrete & Demolition', es: 'Concreto y Demolición' }, short: { en: 'Concrete', es: 'Concreto' }, tint: '#EDE6DD', img: IMG.concrete, blurb: { en: 'Concrete floor leveling & wall demolition', es: 'Baseado de piso y demolición de paredes' } },
]

/** How a service is priced. Measured units let the customer enter an amount. */
export type UnitKind = 'each' | 'sqft' | 'ft' | 'mile'

export type Service = {
  id: string
  cat: CategoryId
  name: T
  desc: T
  price: number
  kind: UnitKind
  /** "Starting at" price — final depends on size/scope. */
  from?: boolean
  /** Default amount and step for measured units. */
  qty?: number
  step?: number
  notes?: T[]
  img: string
  popular?: boolean
}

export const UNIT: Record<UnitKind, { per: T; short: T }> = {
  each: { per: { en: 'each', es: 'c/u' }, short: { en: '', es: '' } },
  sqft: { per: { en: 'per sq ft', es: 'por pie²' }, short: { en: 'sq ft', es: 'pie²' } },
  ft: { per: { en: 'per ft', es: 'por pie' }, short: { en: 'ft', es: 'pies' } },
  mile: { per: { en: 'per mile', es: 'por milla' }, short: { en: 'miles', es: 'millas' } },
}

const noMaterials: T = { en: 'Materials not included', es: 'No incluye materiales' }

export const SERVICES: Service[] = [
  // ---------- Plumbing ----------
  { id: 'toilet', cat: 'plumbing', name: { en: 'Toilet Installation', es: 'Instalación de Toilet' }, desc: { en: 'Remove the old toilet and set the new one, sealed and leak-tested.', es: 'Removemos el toilet viejo e instalamos el nuevo, sellado y probado.' }, price: 125, kind: 'each', img: IMG.toilet, popular: true },
  { id: 'bath-sink', cat: 'plumbing', name: { en: 'Bathroom Sink Installation', es: 'Instalación de Lavamanos' }, desc: { en: 'Install a new bathroom sink and connect the supply and drain.', es: 'Instalamos lavamanos nuevo y conectamos suministro y desagüe.' }, price: 100, kind: 'each', img: IMG.bathSink },
  { id: 'kitchen-faucet', cat: 'plumbing', name: { en: 'Kitchen Faucet Installation', es: 'Instalación de Mezcladora de Fregadero' }, desc: { en: 'Swap your kitchen sink faucet for a new one.', es: 'Cambiamos la mezcladora del fregadero por una nueva.' }, price: 75, kind: 'each', img: IMG.kitchenFaucet, popular: true },
  { id: 'disposal', cat: 'plumbing', name: { en: 'Garbage Disposal Installation', es: 'Instalación de Triturador' }, desc: { en: 'Mount and connect a garbage disposal under your sink.', es: 'Instalamos y conectamos el triturador bajo el fregadero.' }, price: 100, kind: 'each', img: IMG.disposal },
  { id: 'shower-valve', cat: 'plumbing', name: { en: 'Shower Valve Installation', es: 'Instalación de Mezcladora de Ducha' }, desc: { en: 'Install a new shower mixing valve and trim.', es: 'Instalamos mezcladora de ducha nueva.' }, price: 150, kind: 'each', img: IMG.shower },
  { id: 'water-heater', cat: 'plumbing', name: { en: 'Tankless Water Heater', es: 'Calentador de Línea' }, desc: { en: 'Install an on-demand (tankless) water heater.', es: 'Instalación de calentador de línea (sin tanque).' }, price: 125, kind: 'each', img: IMG.heater, popular: true },
  { id: 'washer-box', cat: 'plumbing', name: { en: 'Washer Box Installation', es: 'Instalación de Caja de Lavadora' }, desc: { en: 'Recessed washer outlet box with water and drain connections.', es: 'Caja empotrada para lavadora con conexiones de agua y desagüe.' }, price: 150, kind: 'each', img: IMG.washer },
  { id: 'cistern', cat: 'plumbing', name: { en: 'Water Cistern with Pump', es: 'Instalación de Cisterna con Bomba' }, desc: { en: 'Install a water storage cistern with its pressure pump.', es: 'Instalamos cisterna de agua con su bomba de presión.' }, price: 400, kind: 'each', img: IMG.cistern, notes: [noMaterials], popular: true },
  { id: 'regulator', cat: 'plumbing', name: { en: 'Water Pressure Regulator', es: 'Regulador de Presión de Agua' }, desc: { en: 'Install a pressure regulator to protect your pipes and fixtures.', es: 'Instalamos regulador de presión para proteger tuberías y llaves.' }, price: 200, kind: 'each', img: IMG.regulator, notes: [noMaterials] },
  { id: 'shutoff', cat: 'plumbing', name: { en: 'Shut-off Valve Installation', es: 'Instalación de Llave de Paso' }, desc: { en: 'Install a main or fixture shut-off valve.', es: 'Instalamos llave de paso principal o de equipo.' }, price: 150, kind: 'each', img: IMG.valve, notes: [{ en: 'Price for accessible piping', es: 'Precio para tubería accesible' }] },
  { id: 'faucet-repair', cat: 'plumbing', name: { en: 'Faucet Repair', es: 'Reparación de Pluma de Agua' }, desc: { en: 'Fix a dripping or broken faucet.', es: 'Reparamos pluma que gotea o está dañada.' }, price: 75, kind: 'each', img: IMG.faucetFix },

  // ---------- Electrical ----------
  { id: 'outlet', cat: 'electrical', name: { en: 'Outlet or Switch Installation', es: 'Instalación de Receptáculo o Switch' }, desc: { en: 'Install or replace receptacles and light switches.', es: 'Instalamos o cambiamos receptáculos y switches.' }, price: 30, kind: 'each', img: IMG.outlet, popular: true },
  { id: 'spotlight', cat: 'electrical', name: { en: 'Spotlight Installation', es: 'Instalación de Spotlight' }, desc: { en: 'Recessed spotlights, priced per light.', es: 'Spotlights empotrados, precio por unidad.' }, price: 15, kind: 'each', img: IMG.spotlight },
  { id: 'fixture', cat: 'electrical', name: { en: 'Light Fixture Installation', es: 'Instalación de Lámpara' }, desc: { en: 'Ceiling or wall lights. Price depends on fixture size.', es: 'Lámparas de techo o pared. El precio depende del tamaño.' }, price: 50, kind: 'each', from: true, img: IMG.fixture },
  { id: 'fan', cat: 'electrical', name: { en: 'Ceiling Fan Installation', es: 'Instalación de Abanico de Techo' }, desc: { en: 'Assemble, mount and wire your ceiling fan.', es: 'Ensamblamos, montamos y conectamos tu abanico.' }, price: 100, kind: 'each', img: IMG.fan, popular: true },
  { id: 'conduit', cat: 'electrical', name: { en: 'In-Wall Conduit Installation', es: 'Instalación de Tubería Empotrada' }, desc: { en: 'Recessed electrical conduit, priced per foot.', es: 'Tubería eléctrica empotrada, precio por pie.' }, price: 10, kind: 'ft', qty: 20, step: 5, img: IMG.conduit },
  { id: 'register', cat: 'electrical', name: { en: 'Electrical Junction Box (Registro)', es: 'Instalación de Registro Eléctrico' }, desc: { en: 'Install an electrical register / junction box.', es: 'Instalamos registro eléctrico.' }, price: 150, kind: 'each', img: IMG.register },
  { id: 'panel', cat: 'electrical', name: { en: 'Breaker Box Installation', es: 'Instalación de Caja de Breakers' }, desc: { en: 'Install a new breaker panel.', es: 'Instalamos caja de breakers nueva.' }, price: 350, kind: 'each', img: IMG.panel },
  { id: 'ev', cat: 'electrical', name: { en: 'EV Charger Installation', es: 'Instalación de Cargador para Carro' }, desc: { en: 'Home electric-vehicle charger, ready to plug in.', es: 'Cargador de carro eléctrico en tu hogar.' }, price: 350, kind: 'each', img: IMG.ev, notes: [{ en: 'Includes 10 ft of wiring', es: 'Incluye 10 pies' }], popular: true },

  // ---------- Handyman ----------
  { id: 'tv-32', cat: 'handyman', name: { en: 'TV Mount — up to 32″', es: 'Instalación de Base + TV — 32″' }, desc: { en: 'Wall mount and hang your TV, level and secure.', es: 'Instalamos la base y colgamos tu TV, nivelada y segura.' }, price: 75, kind: 'each', img: IMG.tv, popular: true },
  { id: 'tv-70', cat: 'handyman', name: { en: 'TV Mount — up to 70″', es: 'Instalación de Base + TV — 70″' }, desc: { en: 'Large TV wall mount, level and secure.', es: 'Base y TV grande, nivelada y segura.' }, price: 150, kind: 'each', img: IMG.tvBig },
  { id: 'bath-acc', cat: 'handyman', name: { en: 'Bathroom Accessories', es: 'Instalación de Accesorios de Baño' }, desc: { en: 'Towel bars, paper holders, shelves and more — per piece.', es: 'Toalleros, porta papel, repisas y más — por pieza.' }, price: 25, kind: 'each', img: IMG.bathAcc },
  { id: 'hanging', cat: 'handyman', name: { en: 'Hang Pictures & Mirrors', es: 'Colgar Cuadros, Espejos, etc.' }, desc: { en: 'Pictures, mirrors, shelves and wall décor — per piece.', es: 'Cuadros, espejos, repisas y decoración — por pieza.' }, price: 25, kind: 'each', img: IMG.hanging },
  { id: 'pvc-panels', cat: 'handyman', name: { en: 'Decorative PVC Panels', es: 'Paneles Decorativos PVC' }, desc: { en: 'Modern decorative wall panels, priced per foot.', es: 'Paneles decorativos modernos, precio por pie.' }, price: 20, kind: 'ft', qty: 10, step: 1, img: IMG.pvcPanels },
  { id: 'furniture', cat: 'handyman', name: { en: 'Furniture Assembly & Install', es: 'Ensamble e Instalación de Muebles' }, desc: { en: 'We assemble and install your furniture.', es: 'Ensamblamos e instalamos tus muebles.' }, price: 125, kind: 'each', from: true, img: IMG.furniture, popular: true },
  { id: 'closet', cat: 'handyman', name: { en: 'Closet Shelving', es: 'Tablillero de Clóset' }, desc: { en: 'Closet shelf systems, priced per foot.', es: 'Tablilleros de clóset, precio por pie.' }, price: 10, kind: 'ft', from: true, qty: 6, step: 1, img: IMG.closet },
  { id: 'window', cat: 'handyman', name: { en: 'Window Installation', es: 'Instalación de Ventana' }, desc: { en: 'Install a new window.', es: 'Instalamos ventana nueva.' }, price: 150, kind: 'each', img: IMG.window },
  { id: 'door-in', cat: 'handyman', name: { en: 'Interior Door Installation', es: 'Instalación de Puerta Interior' }, desc: { en: 'Hang and adjust an interior door.', es: 'Instalamos y ajustamos puerta interior.' }, price: 125, kind: 'each', img: IMG.doorIn },
  { id: 'door-out', cat: 'handyman', name: { en: 'Exterior Door Installation', es: 'Instalación de Puerta Exterior' }, desc: { en: 'Install an exterior door, lockset included.', es: 'Instalamos puerta exterior, incluye la cerradura.' }, price: 150, kind: 'each', img: IMG.doorOut, notes: [{ en: 'Includes lock installation', es: 'Incluye instalación de cerradura' }] },
  { id: 'pickup', cat: 'handyman', name: { en: 'Store Pickup & Delivery', es: 'Recogido de Pedidos' }, desc: { en: 'We pick up your order from Home Depot, IKEA, Home Design, Berrios, Rooms To Go and more.', es: 'Recogemos tu pedido de Home Depot, IKEA, Home Design, Berrios, Rooms To Go y más.' }, price: 3, kind: 'mile', qty: 10, step: 5, img: IMG.pickup, popular: true },

  // ---------- Painting ----------
  { id: 'paint-in', cat: 'painting', name: { en: 'Interior Painting', es: 'Pintura Interior' }, desc: { en: 'Walls and ceilings, priced per square foot.', es: 'Paredes y techos, precio por pie cuadrado.' }, price: 1.5, kind: 'sqft', qty: 400, step: 50, img: IMG.paintIn, notes: [{ en: 'Wall repair & prep quoted separately', es: 'Reparación y preparación de pared aparte' }], popular: true },
  { id: 'paint-out', cat: 'painting', name: { en: 'Exterior Painting', es: 'Pintura Exterior' }, desc: { en: 'Façades and exterior walls, priced per square foot.', es: 'Fachadas y paredes exteriores, por pie cuadrado.' }, price: 2.5, kind: 'sqft', qty: 600, step: 50, img: IMG.paintOut, notes: [{ en: 'Wall repair & prep quoted separately', es: 'Reparación y preparación de pared aparte' }] },

  // ---------- Tile ----------
  { id: 'tile-floor', cat: 'tile', name: { en: 'Floor Tile Installation', es: 'Instalación de Losa de Piso' }, desc: { en: 'Floor tile set and grouted, priced per square foot.', es: 'Losa de piso instalada y emboquillada, por pie cuadrado.' }, price: 4, kind: 'sqft', qty: 150, step: 10, img: IMG.tileFloor, popular: true },
  { id: 'tile-wall', cat: 'tile', name: { en: 'Bathroom Wall Tile', es: 'Losa de Pared de Baño' }, desc: { en: 'Shower and bathroom wall tile, per square foot.', es: 'Losa de pared de baño y ducha, por pie cuadrado.' }, price: 10, kind: 'sqft', qty: 80, step: 10, img: IMG.tileWall },

  // ---------- Pressure washing & roof sealing ----------
  { id: 'wash', cat: 'washing', name: { en: 'Pressure Washing — Floors & Roofs', es: 'Lavado a Presión — Piso y Techo' }, desc: { en: 'Driveways, patios, floors and roofs, per square foot.', es: 'Marquesinas, patios, pisos y techos, por pie cuadrado.' }, price: 0.2, kind: 'sqft', qty: 800, step: 100, img: IMG.washing, popular: true },
  { id: 'roof-seal', cat: 'washing', name: { en: 'Roof Sealing', es: 'Sellado de Techo' }, desc: { en: 'Waterproof roof sealing, per square foot.', es: 'Sellado impermeabilizante de techo, por pie cuadrado.' }, price: 1.25, kind: 'sqft', qty: 1000, step: 100, img: IMG.roof, popular: true },

  // ---------- Concrete & demolition ----------
  { id: 'concrete-floor', cat: 'concrete', name: { en: 'Concrete Floor Leveling', es: 'Baseado de Piso de Concreto' }, desc: { en: 'Concrete floor base/leveling, per square foot.', es: 'Baseado de piso de concreto, por pie cuadrado.' }, price: 7.25, kind: 'sqft', qty: 100, step: 10, img: IMG.concrete },
  { id: 'demo', cat: 'concrete', name: { en: 'Non-Structural Wall Demolition', es: 'Demolición de Pared No Estructural' }, desc: { en: 'Remove non-load-bearing walls, per square foot.', es: 'Demolición de paredes no estructurales, por pie cuadrado.' }, price: 5, kind: 'sqft', qty: 80, step: 10, img: IMG.demo },
]

export const PICKUP_STORES = ['Home Depot', 'IKEA', 'Home Design', 'Berrios', 'Rooms To Go']

export const FAQ: { q: T; a: T }[] = [
  { q: { en: 'Are these the final prices?', es: '¿Estos son los precios finales?' }, a: { en: 'All prices shown are BASE prices. The final price depends on the size and condition of the job and is confirmed with you before any work starts.', es: 'Todos los precios son precios BASE. El precio final depende del tamaño y condición del trabajo y se confirma contigo antes de comenzar.' } },
  { q: { en: 'Is there a minimum charge?', es: '¿Hay un cargo mínimo?' }, a: { en: `Yes — the minimum service is $${MIN_SERVICE}.`, es: `Sí — el servicio mínimo requerido es $${MIN_SERVICE}.` } },
  { q: { en: 'Are materials included?', es: '¿Incluyen materiales?' }, a: { en: 'Some services are labor only — they are marked “Materials not included”. We’ll confirm what’s needed when we quote your job.', es: 'Algunos servicios son solo mano de obra y están marcados “No incluye materiales”. Te confirmamos lo necesario al cotizar.' } },
  { q: { en: 'Can you pick up my order from the store?', es: '¿Pueden recoger mi pedido en la tienda?' }, a: { en: `Yes. We pick up from ${PICKUP_STORES.join(', ')} and more for $3 per mile.`, es: `Sí. Recogemos en ${PICKUP_STORES.join(', ')} y más por $3 la milla.` } },
  { q: { en: 'My job isn’t listed. Can you do it?', es: 'Mi trabajo no aparece. ¿Lo pueden hacer?' }, a: { en: 'Probably! We do more jobs that are quoted in person. Send us a photo on WhatsApp and we’ll get back to you.', es: '¡Seguramente! Hacemos más trabajos que se cotizan en persona. Envíanos una foto por WhatsApp y te respondemos.' } },
]

export const STR = {
  slide: { en: 'Slide to start', es: 'Desliza para empezar' },
  onbTitle1: { en: 'Home repairs,', es: 'Reparaciones,' },
  onbTitle2: { en: 'made', es: 'hechas' },
  onbTitle3: { en: 'simple.', es: 'simples.' },
  onbSub: { en: 'Pick your services, see the base price instantly and request your appointment in minutes.', es: 'Escoge tus servicios, ve el precio base al instante y solicita tu cita en minutos.' },
  hello: { en: 'Welcome to', es: 'Bienvenido a' },
  homeTitle1: { en: 'Fix it fast.', es: 'Arréglalo rápido.' },
  homeTitle2: { en: 'Know the price first.', es: 'Conoce el precio primero.' },
  search: { en: 'Search a service… e.g. toilet', es: 'Busca un servicio… ej. toilet' },
  all: { en: 'All', es: 'Todos' },
  promoTag: { en: 'Base prices, upfront', es: 'Precios base claros' },
  promoTitle: { en: 'Plumbing, electrical & handyman — one call', es: 'Plomería, electricidad y handyman — una llamada' },
  bookNow: { en: 'Book now', es: 'Reservar' },
  popular: { en: 'Popular services', es: 'Servicios populares' },
  seeAll: { en: 'See all', es: 'Ver todo' },
  categories: { en: 'What do you need?', es: '¿Qué necesitas?' },
  howTitle: { en: 'How it works', es: 'Cómo funciona' },
  how: [
    { t: { en: 'Pick your services', es: 'Escoge tus servicios' }, d: { en: 'Add services like a shopping cart. Your estimate updates live.', es: 'Agrega servicios como en un carrito. Tu estimado se actualiza al instante.' } },
    { t: { en: 'Choose a day', es: 'Escoge el día' }, d: { en: 'Pick the day and time window that works for you.', es: 'Selecciona el día y la hora que te convenga.' } },
    { t: { en: 'We confirm & get it done', es: 'Confirmamos y lo hacemos' }, d: { en: 'We confirm the final quote with you, then do the job.', es: 'Confirmamos el precio final contigo y hacemos el trabajo.' } },
  ],
  whyTitle: { en: 'Why Torres', es: 'Por qué Torres' },
  why: [
    { t: { en: 'Base prices upfront', es: 'Precios base claros' }, d: { en: 'See the starting price before you book.', es: 'Ve el precio base antes de reservar.' } },
    { t: { en: 'One team, many trades', es: 'Un equipo, muchos oficios' }, d: { en: 'Plumbing, electrical, handyman, paint, tile & more.', es: 'Plomería, electricidad, handyman, pintura, losas y más.' } },
    { t: { en: 'Store pickups', es: 'Recogidos en tienda' }, d: { en: 'We grab your order for $3/mile.', es: 'Recogemos tu pedido a $3 la milla.' } },
    { t: { en: `$${MIN_SERVICE} minimum`, es: `Mínimo $${MIN_SERVICE}` }, d: { en: 'Simple, clear minimum service.', es: 'Servicio mínimo simple y claro.' } },
  ],
  beforeAfter: { en: 'See the difference', es: 'Mira la diferencia' },
  beforeAfterSub: { en: 'Drag to see what a pressure wash can do.', es: 'Desliza para ver lo que logra un lavado a presión.' },
  before: { en: 'Before', es: 'Antes' },
  after: { en: 'After', es: 'Después' },
  faq: { en: 'Questions', es: 'Preguntas' },
  workTitle: { en: 'Our work', es: 'Trabajos realizados' },
  workSub: { en: 'Photos of jobs we’ve completed.', es: 'Fotos de trabajos que hemos completado.' },
  ctaTitle: { en: 'Need something not listed?', es: '¿Necesitas algo que no aparece?' },
  ctaSub: { en: 'We do more jobs quoted in person. Send us a photo on WhatsApp.', es: 'Hacemos más trabajos que se cotizan en persona. Envíanos una foto por WhatsApp.' },
  call: { en: 'Call', es: 'Llamar' },
  add: { en: 'Add', es: 'Agregar' },
  added: { en: 'Added', es: 'Agregado' },
  from: { en: 'from', es: 'desde' },
  services: { en: 'Services', es: 'Servicios' },
  viewEstimate: { en: 'View estimate', es: 'Ver estimado' },
  items: { en: 'services', es: 'servicios' },
  item: { en: 'service', es: 'servicio' },
  goodToKnow: { en: 'Good to know', es: 'Bueno saber' },
  basePrice: { en: 'Base price — final quote confirmed before work starts', es: 'Precio base — el precio final se confirma antes de comenzar' },
  minimumNote: { en: `Minimum service $${MIN_SERVICE}`, es: `Servicio mínimo $${MIN_SERVICE}` },
  quantity: { en: 'Quantity', es: 'Cantidad' },
  howMuch: { en: 'Approximate size', es: 'Tamaño aproximado' },
  addToEstimate: { en: 'Add to estimate', es: 'Agregar al estimado' },
  update: { en: 'Update', es: 'Actualizar' },
  estimate: { en: 'Your estimate', es: 'Tu estimado' },
  emptyCart: { en: 'Your estimate is empty', es: 'Tu estimado está vacío' },
  emptyCartSub: { en: 'Add a few services and we’ll calculate everything for you.', es: 'Agrega algunos servicios y calculamos todo por ti.' },
  browse: { en: 'Browse services', es: 'Ver servicios' },
  subtotal: { en: 'Subtotal', es: 'Subtotal' },
  minAdj: { en: 'Minimum service adjustment', es: 'Ajuste servicio mínimo' },
  total: { en: 'Estimated total', es: 'Total estimado' },
  payLater: { en: 'No payment now · we confirm your quote first', es: 'Sin pago ahora · confirmamos tu precio primero' },
  schedule: { en: 'Schedule', es: 'Agendar' },
  continue: { en: 'Continue', es: 'Continuar' },
  when: { en: 'When works for you?', es: '¿Cuándo te conviene?' },
  date: { en: 'Date', es: 'Fecha' },
  time: { en: 'Preferred time', es: 'Hora preferida' },
  details: { en: 'Your details', es: 'Tus datos' },
  name: { en: 'Full name', es: 'Nombre completo' },
  phone: { en: 'Phone', es: 'Teléfono' },
  address: { en: 'Service address', es: 'Dirección del servicio' },
  notes: { en: 'Notes (optional)', es: 'Notas (opcional)' },
  confirm: { en: 'Send request', es: 'Enviar solicitud' },
  step: { en: 'Step', es: 'Paso' },
  of: { en: 'of', es: 'de' },
  booked: { en: 'Request sent!', es: '¡Solicitud enviada!' },
  bookedSub: { en: 'Send it to us on WhatsApp so we can confirm your quote and appointment.', es: 'Envíanosla por WhatsApp para confirmar tu precio y tu cita.' },
  sendWa: { en: 'Send to WhatsApp', es: 'Enviar por WhatsApp' },
  bookings: { en: 'My requests', es: 'Mis solicitudes' },
  noBookings: { en: 'No requests yet', es: 'Aún no tienes solicitudes' },
  noBookingsSub: { en: 'When you request a service it will show up here.', es: 'Cuando solicites un servicio aparecerá aquí.' },
  status: [
    { en: 'Requested', es: 'Solicitado' },
    { en: 'Confirmed', es: 'Confirmado' },
    { en: 'In progress', es: 'En proceso' },
    { en: 'Completed', es: 'Completado' },
  ],
  upcoming: { en: 'Your requests', es: 'Tus solicitudes' },
  profile: { en: 'Contact', es: 'Contacto' },
  about: { en: 'About Torres Contractor Solution', es: 'Sobre Torres Contractor Solution' },
  aboutText: { en: 'Plumbing, electrical, handyman, painting, tile, pressure washing, roof sealing, concrete and demolition — one team for your home.', es: 'Plomería, electricidad, handyman, pintura, losas, lavado a presión, sellado de techo, concreto y demolición — un solo equipo para tu hogar.' },
  language: { en: 'Language', es: 'Idioma' },
  areaL: { en: 'Service area', es: 'Área de servicio' },
  home: { en: 'Home', es: 'Inicio' },
  cart: { en: 'Estimate', es: 'Estimado' },
  required: { en: 'Please complete name, phone and address.', es: 'Completa nombre, teléfono y dirección.' },
  results: { en: 'results', es: 'resultados' },
  noResults: { en: 'No matches. Try “paint” or “toilet”, or send us a WhatsApp.', es: 'Sin resultados. Prueba “pintura” o “toilet”, o escríbenos por WhatsApp.' },
  services_n: { en: 'Services', es: 'Servicios' },
  trades_n: { en: 'Trades', es: 'Oficios' },
  min_n: { en: 'Minimum', es: 'Mínimo' },
  remove: { en: 'Remove', es: 'Quitar' },
  today: { en: 'Today', es: 'Hoy' },
  cancel: { en: 'Cancel', es: 'Cancelar' },
  bookingFor: { en: 'Request', es: 'Solicitud' },
}

export const SLOTS = ['8:00 – 10:00 AM', '10:00 – 12:00 PM', '12:00 – 2:00 PM', '2:00 – 4:00 PM', '4:00 – 6:00 PM']
