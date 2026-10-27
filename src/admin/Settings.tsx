import { Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BUSINESS, FAQ, MIN_SERVICE, STR, type Faq } from '../data'
import { EDITABLE_TEXT, type Settings } from '../content'
import { BiText, Field, useToast } from './Admin'
import { sb } from './sb'

/** Starting values = what the site shows today, so the form is never empty. */
const defaults = (): Settings => ({
  business: { name: BUSINESS.name, phone: BUSINESS.phone, whatsapp: BUSINESS.whatsapp, area: { ...BUSINESS.area }, tagline: { ...BUSINESS.tagline } },
  minService: MIN_SERVICE,
  text: Object.fromEntries(EDITABLE_TEXT.map((e) => [e.key, { ...(STR[e.key] as { en: string; es: string }) }])),
  faq: FAQ.map((f) => ({ q: { ...f.q }, a: { ...f.a } })),
})

export default function SettingsTab() {
  const [s, setS] = useState<Settings | null>(null)
  const [busy, setBusy] = useState(false)
  const [toast, say] = useToast()

  useEffect(() => {
    sb.from('site_settings').select('data').eq('id', 1).maybeSingle().then(({ data }) => {
      const d = defaults()
      const saved = (data?.data ?? {}) as Settings
      setS({ ...d, ...saved, business: { ...d.business, ...saved.business }, text: { ...d.text, ...saved.text }, faq: saved.faq?.length ? saved.faq : d.faq })
    })
  }, [])

  if (!s) return <div className="adm-muted">Cargando…</div>
  const b = s.business!
  const setB = (patch: Partial<typeof b>) => setS({ ...s, business: { ...b, ...patch } })
  const faq = s.faq ?? []
  const setFaq = (list: Faq[]) => setS({ ...s, faq: list })

  const save = async () => {
    setBusy(true)
    const { error } = await sb.from('site_settings').upsert({ id: 1, data: s, updated_at: new Date().toISOString() })
    setBusy(false)
    say(error ? error.message : 'Guardado ✓ — los cambios ya están en la web')
  }

  return (
    <div>
      {toast}
      <div className="adm-head">
        <div>
          <h2>Ajustes del sitio</h2>
          <p className="adm-muted">Nombre, contacto, textos principales y preguntas frecuentes.</p>
        </div>
      </div>

      <section className="adm-card">
        <div className="adm-label">Negocio</div>
        <Field label="Nombre del negocio"><input value={b.name ?? ''} onChange={(e) => setB({ name: e.target.value })} /></Field>
        <div className="adm-grid2">
          <Field label="Teléfono"><input type="tel" value={b.phone ?? ''} onChange={(e) => setB({ phone: e.target.value })} /></Field>
          <Field label="WhatsApp" hint="Solo números, ej. 9394964444"><input type="tel" value={b.whatsapp ?? ''} onChange={(e) => setB({ whatsapp: e.target.value })} /></Field>
        </div>
        <BiText label="Lema" value={b.tagline} onChange={(tagline) => setB({ tagline })} />
        <BiText label="Área de servicio" value={b.area} onChange={(area) => setB({ area })} />
        <Field label="Servicio mínimo ($)"><input type="number" inputMode="numeric" value={s.minService ?? 0} onChange={(e) => setS({ ...s, minService: Number(e.target.value) })} /></Field>
      </section>

      <section className="adm-card">
        <div className="adm-label">Textos de la página</div>
        {EDITABLE_TEXT.map((e) => (
          <BiText key={e.key} label={e.label} long={e.long} value={s.text?.[e.key]} onChange={(v) => setS({ ...s, text: { ...s.text, [e.key]: v } })} />
        ))}
      </section>

      <section className="adm-card">
        <div className="adm-label">Preguntas frecuentes</div>
        {faq.map((f, i) => (
          <div key={i} className="adm-faq">
            <BiText label={`Pregunta ${i + 1}`} value={f.q} onChange={(q) => setFaq(faq.map((x, k) => (k === i ? { ...x, q } : x)))} />
            <BiText label="Respuesta" long value={f.a} onChange={(a) => setFaq(faq.map((x, k) => (k === i ? { ...x, a } : x)))} />
            <button className="adm-link danger" onClick={() => setFaq(faq.filter((_, k) => k !== i))}><Trash2 size={14} /> Quitar pregunta</button>
          </div>
        ))}
        <button className="adm-btn ghost" onClick={() => setFaq([...faq, { q: { es: '', en: '' }, a: { es: '', en: '' } }])}><Plus size={16} /> Agregar pregunta</button>
      </section>

      <div className="adm-actions sticky">
        <button className="adm-btn" style={{ flex: 1 }} disabled={busy} onClick={save}>{busy ? 'Guardando…' : 'Guardar ajustes'}</button>
      </div>
    </div>
  )
}
