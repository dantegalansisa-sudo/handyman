/**
 * Writes supabase/setup-completo.sql = schema.sql + the site's current content
 * (services, portfolio jobs, settings) so the admin panel starts filled in.
 *   npx tsx scripts/seed-sql.ts
 */
import { readFile, writeFile } from 'node:fs/promises'
import { BUSINESS, FAQ, MIN_SERVICE, SERVICES } from '../src/data'
import { PROJECTS } from '../src/portfolio'

const q = (v: unknown) => `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`
const schema = await readFile('supabase/schema.sql', 'utf8')

const settings = {
  business: { name: BUSINESS.name, phone: BUSINESS.phone, whatsapp: BUSINESS.whatsapp, area: BUSINESS.area, tagline: BUSINESS.tagline },
  minService: MIN_SERVICE,
  faq: FAQ,
}

const sql = `${schema.replace(/-- ▼[\s\S]*$/, '').trimEnd()}

-- ================= Contenido inicial (lo que la web muestra hoy) =================
insert into public.site_settings (id, data) values (1, ${q(settings)})
  on conflict (id) do nothing;

insert into public.services (id, data, sort, active) values
${SERVICES.map((s, i) => `  ('${s.id}', ${q(s)}, ${i}, true)`).join(',\n')}
  on conflict (id) do nothing;

insert into public.projects (id, data, sort, published) values
${PROJECTS.map((p, i) => `  ('${p.id}', ${q(p)}, ${i}, true)`).join(',\n')}
  on conflict (id) do nothing;

-- ================= Administrador =================
-- 1) Crea el usuario en Authentication → Users → Add user (email + contraseña).
-- 2) Cambia el email de abajo por el mismo y corre solo esta línea:
-- insert into public.admins (email) values ('email-del-cliente@ejemplo.com');
`
await writeFile('supabase/setup-completo.sql', sql)
console.log(`supabase/setup-completo.sql: ${SERVICES.length} services, ${PROJECTS.length} projects`)
