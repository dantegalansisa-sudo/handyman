# Panel de administración y SEO

## 1. Conectar el panel (una sola vez, ~10 minutos)

El panel está en **`/admin`** y funciona desde el celular. Mientras no esté conectado, muestra estos mismos pasos.

1. Crea un proyecto gratis en [supabase.com](https://supabase.com) (región `us-east-1`).
2. **SQL Editor → New query:** pega el contenido de [`supabase/schema.sql`](../supabase/schema.sql) y dale *Run*.
3. **Authentication → Users → Add user:** crea el usuario del cliente con su email y una contraseña. Él puede cambiarla después con "Olvidé mi contraseña".
4. Autoriza ese email como administrador en el SQL Editor:
   ```sql
   insert into public.admins (email) values ('email-del-cliente@ejemplo.com');
   ```
5. **Project Settings → API:** copia la *Project URL* y la *anon / publishable key*.
6. En **Vercel → Settings → Environment Variables**, agrega:
   - `VITE_SUPABASE_URL` = la Project URL
   - `VITE_SUPABASE_ANON_KEY` = la anon key
   - `SITE_URL` = el dominio final, por ejemplo `https://www.dominio.com` (opcional: Vercel usa su dominio de producción si no lo pones)
7. Haz *Redeploy*. Luego entra a `/admin`, ve a **Trabajos** y a **Servicios**, y toca **Importar** para pasar el contenido actual al panel.

## 2. Qué puede hacer el cliente desde el panel

| Pestaña | Qué puede hacer |
|---|---|
| **Trabajos** | Agregar o editar trabajos, subir fotos desde el celular (se optimizan solas), elegir la portada, ordenar, marcar "Mostrar en inicio" y ocultar o borrar trabajos. |
| **Servicios** | Cambiar precios (se tocan directo en la lista), nombres, descripciones, fotos y notas ("No incluye materiales"). También destacar, ocultar o crear servicios nuevos. |
| **Solicitudes** | Ver lo que mandan los clientes desde la web, escribirles por WhatsApp o llamarlos, y marcarlas como Contactado o Completada. |
| **Ajustes** | Nombre del negocio, teléfono, WhatsApp, lema, área, servicio mínimo, textos principales y preguntas frecuentes. |

Los cambios salen en la web apenas se guardan. Lo que no se puede tocar desde el panel es la estructura y el diseño; eso se cambia en el código.

## 3. SEO: qué tiene la web

- **Una URL real por página:** `/services`, `/services/plumbing`, `/services/plumbing/toilet`, `/work`, `/work/panel-electrico` y `/contact`, en total 63 páginas.
- **HTML generado para cada URL:** al compilar, cada página sale con su `<title>`, su descripción, la URL canónica, Open Graph y su contenido en texto. Google lee todo eso aunque no ejecute JavaScript.
- **Datos estructurados (JSON-LD):** el negocio local (`HomeAndConstructionBusiness`) con el catálogo y los precios, cada servicio (`Service` + `Offer`), cada trabajo (`CreativeWork` con sus fotos), las preguntas frecuentes (`FAQPage`) y la ruta de navegación (`BreadcrumbList`).
- **Bilingüe:** los títulos y textos llevan inglés y español para captar búsquedas como "plomero Puerto Rico" o "toilet installation Puerto Rico".
- **`/sitemap.xml`:** incluye las fotos de los trabajos. **`/robots.txt`:** bloquea `/admin` y `/estimate` y apunta al sitemap.
- **Conversiones para Google Ads:** la web registra cuando alguien pide un servicio, toca WhatsApp o toca llamar (ver `src/track.ts`).

### Después de publicar con el dominio final
1. Abre [Google Search Console](https://search.google.com/search-console), agrega el dominio y envía `https://<dominio>/sitemap.xml`.
2. Crea el **Perfil de Empresa en Google** (Google Business Profile) con el mismo nombre, teléfono y link. En el SEO local, eso pesa tanto como la web.
3. Activa **Google Analytics 4 / Google Ads** (sección 4).

## 4. Google Analytics y Google Ads
El código ya está instalado. Solo falta poner los IDs en [`.env.production`](../.env.production) y publicar:

| Variable | Dónde se saca | Ejemplo |
|---|---|---|
| `VITE_GA_ID` | Analytics → Administrar → Flujos de datos → Web → *ID de medición* | `G-AB12CD34EF` |
| `VITE_GADS_ID` | Google Ads → Herramientas → Conversiones → etiqueta, *ID de conversión* | `AW-1234567890` |
| `VITE_GADS_LEAD_LABEL` | La *etiqueta* de la conversión "Solicitud enviada" | `AbC-dEfGhIj` |
| `VITE_GADS_CONTACT_LABEL` | La *etiqueta* de la conversión "WhatsApp / llamada" | `KlM-nOpQrSt` |

Lo que registra la web:
- **Visitas** de cada página, incluido cada servicio y cada trabajo.
- **Eventos:** `add_to_estimate` (agregó un servicio), `begin_booking` (empezó a reservar), `booking_request` (envió la solicitud, con el total), `whatsapp_click` y `call_click`.

**Recomendación:** en GA4 marca `booking_request`, `whatsapp_click` y `call_click` como *eventos clave*. Luego vincula GA4 con Google Ads, o usa las etiquetas de la tabla, para que Ads optimice los anuncios por clientes reales.

## 5. Páginas legales
- `/privacy`: Política de privacidad.
- `/terms`: Términos y condiciones.

Están en español e inglés, enlazadas en el pie de página, en Contacto y en la confirmación de la reserva. El texto vive en `src/legal.ts`. Es un texto estándar hecho a la medida de cómo funciona la web; si el negocio crece, conviene que lo revise un abogado.

**Nota:** el HTML para Google se genera en cada publicación. Los cambios del panel salen en la web de inmediato, pero Google ve las páginas nuevas (por ejemplo, un trabajo nuevo) después del siguiente *Redeploy*.
