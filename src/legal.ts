/**
 * Privacy policy & terms (bilingual). Written to match what the site actually does:
 * the request form, WhatsApp hand-off, Supabase storage, localStorage and Google tags.
 * Shared by the /privacy and /terms screens and the prerendered HTML.
 */
import { BUSINESS, MIN_SERVICE, type T } from './data'

export type LegalDoc = { title: T; updated: T; intro: T; sections: { h: T; p: T[] }[] }

const UPDATED: T = { en: 'Last updated: October 27, 2026', es: 'Última actualización: 27 de octubre de 2026' }

export function privacy(): LegalDoc {
  const n = BUSINESS.name
  const ph = BUSINESS.phone
  return {
    title: { en: 'Privacy Policy', es: 'Política de privacidad' },
    updated: UPDATED,
    intro: {
      en: `This policy explains what information ${n} (“we”) collects through this website, how we use it and the choices you have. By using the site you agree to this policy.`,
      es: `Esta política explica qué información recopila ${n} (“nosotros”) a través de este sitio web, cómo la usamos y qué opciones tienes. Al usar el sitio aceptas esta política.`,
    },
    sections: [
      {
        h: { en: 'Information we collect', es: 'Información que recopilamos' },
        p: [
          { en: 'When you request a service: your name, phone number, service address, preferred date and time, any notes you write, and the services and quantities you selected.', es: 'Cuando solicitas un servicio: tu nombre, número de teléfono, dirección del servicio, fecha y hora preferidas, las notas que escribas y los servicios y cantidades que seleccionaste.' },
          { en: 'When you contact us by WhatsApp or phone: the information you choose to share in that conversation.', es: 'Cuando nos contactas por WhatsApp o teléfono: la información que decidas compartir en esa conversación.' },
          { en: 'Automatically: basic usage data such as pages visited, device and browser type, approximate location (city/region) and how you arrived at the site, through analytics tools described below.', es: 'Automáticamente: datos básicos de uso como páginas visitadas, tipo de dispositivo y navegador, ubicación aproximada (ciudad/región) y cómo llegaste al sitio, mediante las herramientas de analítica descritas abajo.' },
        ],
      },
      {
        h: { en: 'How we use it', es: 'Cómo la usamos' },
        p: [
          { en: 'To contact you, confirm your quote and appointment, and perform the requested work.', es: 'Para contactarte, confirmar tu precio y cita, y realizar el trabajo solicitado.' },
          { en: 'To answer questions, provide customer service and keep a record of your requests.', es: 'Para responder preguntas, darte servicio al cliente y mantener un registro de tus solicitudes.' },
          { en: 'To understand how the site is used and to measure and improve our advertising.', es: 'Para entender cómo se usa el sitio y medir y mejorar nuestra publicidad.' },
          { en: 'We do not sell your personal information.', es: 'No vendemos tu información personal.' },
        ],
      },
      {
        h: { en: 'How it is shared', es: 'Con quién se comparte' },
        p: [
          { en: 'Service providers that help us run the site: website hosting, our database provider (Supabase) where requests are stored, and Google (Analytics and Ads) for measurement.', es: 'Proveedores que nos ayudan a operar el sitio: el hosting del sitio web, nuestro proveedor de base de datos (Supabase), donde se guardan las solicitudes, y Google (Analytics y Ads) para medición.' },
          { en: 'WhatsApp (Meta), when you choose to send your request or message us through WhatsApp. Their own privacy policy applies to that conversation.', es: 'WhatsApp (Meta), cuando decides enviar tu solicitud o escribirnos por WhatsApp. Su propia política de privacidad aplica a esa conversación.' },
          { en: 'When required by law or to protect our rights, safety or property.', es: 'Cuando la ley lo requiera o para proteger nuestros derechos, seguridad o propiedad.' },
        ],
      },
      {
        h: { en: 'Cookies and local storage', es: 'Cookies y almacenamiento local' },
        p: [
          { en: 'The site saves your estimate, your requests and your language choice in your own browser (local storage) so they are there when you come back. You can clear them by clearing your browser data.', es: 'El sitio guarda tu estimado, tus solicitudes y tu idioma en tu propio navegador (almacenamiento local) para que sigan ahí cuando regreses. Puedes borrarlos limpiando los datos de tu navegador.' },
          { en: 'Google Analytics and Google Ads may use cookies to measure visits and ad results. You can block cookies in your browser settings or opt out at tools.google.com/dlpage/gaoptout and adssettings.google.com.', es: 'Google Analytics y Google Ads pueden usar cookies para medir visitas y resultados de anuncios. Puedes bloquear cookies en la configuración de tu navegador o desactivarlas en tools.google.com/dlpage/gaoptout y adssettings.google.com.' },
        ],
      },
      {
        h: { en: 'How long we keep it', es: 'Por cuánto tiempo la guardamos' },
        p: [{ en: 'We keep request information only as long as needed to provide the service, keep business records and meet legal obligations.', es: 'Guardamos la información de las solicitudes solo el tiempo necesario para dar el servicio, mantener los registros del negocio y cumplir con obligaciones legales.' }],
      },
      {
        h: { en: 'Security', es: 'Seguridad' },
        p: [{ en: 'We use reasonable measures to protect your information (encrypted connections and access limited to authorized staff). No method of transmission or storage is 100% secure.', es: 'Usamos medidas razonables para proteger tu información (conexiones cifradas y acceso limitado a personal autorizado). Ningún método de transmisión o almacenamiento es 100% seguro.' }],
      },
      {
        h: { en: 'Your choices', es: 'Tus opciones' },
        p: [{ en: `You can ask us to see, correct or delete the information you sent us by calling or writing on WhatsApp to ${ph}.`, es: `Puedes pedirnos ver, corregir o borrar la información que nos enviaste llamando o escribiendo por WhatsApp al ${ph}.` }],
      },
      {
        h: { en: 'Children', es: 'Menores de edad' },
        p: [{ en: 'This site is meant for adults requesting home services. We do not knowingly collect information from children under 13.', es: 'Este sitio es para adultos que solicitan servicios para el hogar. No recopilamos a sabiendas información de menores de 13 años.' }],
      },
      {
        h: { en: 'Changes and contact', es: 'Cambios y contacto' },
        p: [{ en: `We may update this policy; the date above shows the latest version. Questions: ${n}, ${ph} (phone or WhatsApp), Puerto Rico.`, es: `Podemos actualizar esta política; la fecha de arriba indica la versión más reciente. Preguntas: ${n}, ${ph} (teléfono o WhatsApp), Puerto Rico.` }],
      },
    ],
  }
}

export function terms(): LegalDoc {
  const n = BUSINESS.name
  const ph = BUSINESS.phone
  return {
    title: { en: 'Terms & Conditions', es: 'Términos y condiciones' },
    updated: UPDATED,
    intro: {
      en: `These terms apply to the use of this website and to service requests made through it with ${n} (“we”). By using the site or sending a request you accept them.`,
      es: `Estos términos aplican al uso de este sitio web y a las solicitudes de servicio que se hagan por él con ${n} (“nosotros”). Al usar el sitio o enviar una solicitud los aceptas.`,
    },
    sections: [
      {
        h: { en: 'Prices are base prices', es: 'Los precios son precios base' },
        p: [
          { en: 'All prices shown are BASE prices for standard jobs. The final price depends on the size, condition and access of the job and is confirmed with you before any work starts.', es: 'Todos los precios mostrados son precios BASE para trabajos estándar. El precio final depende del tamaño, condición y acceso del trabajo y se confirma contigo antes de comenzar.' },
          { en: 'Totals shown in the estimate are approximate and are not a final quote or a binding offer.', es: 'Los totales del estimado son aproximados y no constituyen una cotización final ni una oferta vinculante.' },
          { en: 'Services marked “Materials not included” cover labor only. Materials, parts or special fixtures you choose are quoted separately unless agreed otherwise.', es: 'Los servicios marcados “No incluye materiales” cubren solo mano de obra. Materiales, piezas o accesorios especiales que elijas se cotizan aparte, salvo que se acuerde otra cosa.' },
          { en: `There is a minimum service charge of $${MIN_SERVICE} per visit.`, es: `Hay un cargo de servicio mínimo de $${MIN_SERVICE} por visita.` },
        ],
      },
      {
        h: { en: 'Requests and appointments', es: 'Solicitudes y citas' },
        p: [
          { en: 'Sending a request through the site does not guarantee an appointment. A request is confirmed only when we contact you and agree on the price, date and time.', es: 'Enviar una solicitud por el sitio no garantiza una cita. La solicitud queda confirmada solo cuando te contactamos y acordamos el precio, la fecha y la hora.' },
          { en: 'Please give accurate information and let us know as soon as possible if you need to change or cancel.', es: 'Por favor da información correcta y avísanos lo antes posible si necesitas cambiar o cancelar.' },
          { en: 'Jobs not listed on the site are quoted in person.', es: 'Los trabajos que no aparecen en el sitio se cotizan en persona.' },
        ],
      },
      {
        h: { en: 'Payment', es: 'Pago' },
        p: [{ en: 'No payment is taken on this website. Payment terms and methods are agreed directly with you when the quote is confirmed.', es: 'No se cobra nada en este sitio web. Los términos y métodos de pago se acuerdan directamente contigo al confirmar la cotización.' }],
      },
      {
        h: { en: 'Store pickups', es: 'Recogidos en tienda' },
        p: [{ en: 'Pickups from stores are charged per mile as listed. You are responsible for the purchase, for having the order ready for pickup and for the condition of the product as delivered by the store.', es: 'Los recogidos en tiendas se cobran por milla según lo indicado. Tú eres responsable de la compra, de que el pedido esté listo para recoger y de la condición del producto según lo entrega la tienda.' }],
      },
      {
        h: { en: 'Your responsibilities', es: 'Tus responsabilidades' },
        p: [{ en: 'Provide safe access to the work area, tell us about known hidden conditions (pipes, wiring, leaks, structural issues) and obtain any permits or approvals the property may require, unless agreed otherwise.', es: 'Dar acceso seguro al área de trabajo, informarnos de condiciones ocultas conocidas (tuberías, cableado, filtraciones, problemas estructurales) y obtener permisos o aprobaciones que la propiedad requiera, salvo que se acuerde otra cosa.' }],
      },
      {
        h: { en: 'Website content', es: 'Contenido del sitio' },
        p: [
          { en: 'Photos in “Our work” show jobs we completed; some service photos are illustrative. Descriptions and prices may change without notice.', es: 'Las fotos de “Trabajos realizados” muestran trabajos que completamos; algunas fotos de servicios son ilustrativas. Las descripciones y precios pueden cambiar sin previo aviso.' },
          { en: `The site's content, logo and design belong to ${n} and may not be copied without permission.`, es: `El contenido, logo y diseño del sitio pertenecen a ${n} y no pueden copiarse sin permiso.` },
        ],
      },
      {
        h: { en: 'Limitation of liability', es: 'Limitación de responsabilidad' },
        p: [{ en: 'The website is provided “as is”. To the extent allowed by law, we are not liable for indirect or consequential damages arising from the use of the site. Responsibility for work performed is governed by the agreement made with you for that job.', es: 'El sitio web se ofrece “tal cual”. En la medida permitida por la ley, no somos responsables por daños indirectos o consecuentes derivados del uso del sitio. La responsabilidad por los trabajos realizados se rige por el acuerdo hecho contigo para ese trabajo.' }],
      },
      {
        h: { en: 'Governing law and contact', es: 'Ley aplicable y contacto' },
        p: [{ en: `These terms are governed by the laws of Puerto Rico. Questions: ${n}, ${ph} (phone or WhatsApp).`, es: `Estos términos se rigen por las leyes de Puerto Rico. Preguntas: ${n}, ${ph} (teléfono o WhatsApp).` }],
      },
    ],
  }
}
