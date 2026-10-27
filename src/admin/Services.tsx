import { ArrowLeft, Camera, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CATEGORIES, SERVICES, UNIT, type CategoryId, type Service, type UnitKind } from '../data'
import { BiText, Field, Toggle, useToast } from './Admin'
import { sb, slugify, uploadPhoto } from './sb'

type Row = { id: string; data: Service; sort: number; active: boolean }

const KINDS: { id: UnitKind; label: string }[] = [
  { id: 'each', label: 'Por unidad (c/u)' },
  { id: 'sqft', label: 'Por pie cuadrado (pie²)' },
  { id: 'ft', label: 'Por pie lineal' },
  { id: 'mile', label: 'Por milla' },
]

export default function Services() {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [edit, setEdit] = useState<Row | null>(null)
  const [cat, setCat] = useState<CategoryId>('plumbing')
  const [toast, say] = useToast()

  const load = async () => {
    const { data, error } = await sb.from('services').select('*').order('sort')
    if (error) say(error.message)
    setRows((data as Row[]) ?? [])
  }
  useEffect(() => { load() }, [])

  const importDefaults = async () => {
    const { error } = await sb.from('services').upsert(SERVICES.map((s, i) => ({ id: s.id, data: s, sort: i, active: true })))
    say(error ? error.message : 'Servicios importados')
    load()
  }

  /** Quick price change right from the list. */
  const setPrice = async (r: Row, price: number) => {
    if (!(price >= 0) || price === r.data.price) return
    const data = { ...r.data, price }
    setRows((rs) => rs!.map((x) => (x.id === r.id ? { ...x, data } : x)))
    const { error } = await sb.from('services').update({ data, updated_at: new Date().toISOString() }).eq('id', r.id)
    say(error ? error.message : 'Precio actualizado ✓')
  }

  if (edit) return <Editor row={edit} onDone={(m) => { setEdit(null); if (m) say(m); load() }} />

  const list = rows?.filter((r) => r.data.cat === cat) ?? []
  return (
    <div>
      {toast}
      <div className="adm-head">
        <div>
          <h2>Servicios y precios</h2>
          <p className="adm-muted">Toca un precio para cambiarlo. Todos son precios base.</p>
        </div>
      </div>

      {rows?.length === 0 && (
        <div className="adm-card">
          <b>Los servicios todavía no están en el panel.</b>
          <p className="adm-muted">Impórtalos una vez para poder cambiar precios, textos y fotos.</p>
          <button className="adm-btn" onClick={importDefaults}>Importar {SERVICES.length} servicios</button>
        </div>
      )}

      {!!rows?.length && (
        <>
          <div className="adm-chips adm-scroll">
            {CATEGORIES.map((c) => (
              <button key={c.id} className={`adm-chip ${cat === c.id ? 'on' : ''}`} onClick={() => setCat(c.id)}>{c.name.es}</button>
            ))}
          </div>
          <div className="adm-list">
            {list.map((r) => (
              <div key={r.id} className="adm-item" onClick={() => setEdit(r)} style={{ opacity: r.active ? 1 : 0.5 }}>
                <div className="adm-thumb"><img src={r.data.img} alt="" /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <b className="adm-ellipsis">{r.data.name.es}</b>
                  <div className="adm-muted" style={{ fontSize: 12.5 }}>{UNIT[r.data.kind].per.es}{!r.active && ' · Oculto'}</div>
                </div>
                <label className="adm-price" onClick={(e) => e.stopPropagation()}>
                  {r.data.from && <small>desde</small>}$
                  <input type="number" inputMode="decimal" step="0.01" defaultValue={r.data.price} onBlur={(e) => setPrice(r, Number(e.target.value))} />
                </label>
              </div>
            ))}
          </div>
          <button
            className="adm-btn ghost"
            style={{ width: '100%', marginTop: 12 }}
            onClick={() => setEdit({ id: '', sort: rows.length, active: true, data: { id: '', cat, name: { es: '', en: '' }, desc: { es: '', en: '' }, price: 0, kind: 'each', img: CATEGORIES.find((c) => c.id === cat)!.img } })}
          >
            <Plus size={17} /> Nuevo servicio en {CATEGORIES.find((c) => c.id === cat)!.name.es}
          </button>
        </>
      )}
    </div>
  )
}

function Editor({ row, onDone }: { row: Row; onDone: (m?: string) => void }) {
  const [s, setS] = useState<Service>(row.data)
  const [active, setActive] = useState(row.active)
  const [busy, setBusy] = useState(false)
  const [toast, say] = useToast()
  const set = (patch: Partial<Service>) => setS((x) => ({ ...x, ...patch }))
  const note = s.notes?.[0]

  const save = async () => {
    if (!s.name.es.trim()) return say('Escribe el nombre')
    setBusy(true)
    const id = row.id || `${slugify(s.name.es)}-${Date.now().toString(36).slice(-4)}`
    const data: Service = {
      ...s,
      id,
      name: { es: s.name.es, en: s.name.en || s.name.es },
      desc: { es: s.desc.es, en: s.desc.en || s.desc.es },
      qty: s.kind === 'each' ? undefined : s.qty || (s.kind === 'sqft' ? 100 : 10),
      step: s.kind === 'each' ? undefined : s.step || (s.kind === 'sqft' ? 10 : 1),
    }
    const { error } = await sb.from('services').upsert({ id, data, sort: row.sort, active, updated_at: new Date().toISOString() })
    setBusy(false)
    if (error) return say(error.message)
    onDone('Guardado ✓')
  }

  return (
    <div>
      {toast}
      <div className="adm-head">
        <button className="adm-icon" onClick={() => onDone()} aria-label="Volver"><ArrowLeft size={18} /></button>
        <h2 style={{ flex: 1 }}>{row.id ? 'Editar servicio' : 'Nuevo servicio'}</h2>
      </div>

      <section className="adm-card">
        <div className="adm-label">Foto</div>
        <label className="adm-hero-photo">
          <img src={s.img} alt="" />
          <span><Camera size={18} /> Cambiar foto</span>
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={async (e) => {
              const f = e.target.files?.[0]
              if (!f) return
              setBusy(true)
              try {
                const ph = await uploadPhoto(f, 'services')
                set({ img: ph.src })
              } catch {
                say('No se pudo subir la foto')
              }
              setBusy(false)
            }}
          />
        </label>
      </section>

      <section className="adm-card">
        <BiText label="Nombre *" value={s.name} onChange={(name) => set({ name })} />
        <BiText label="Descripción" value={s.desc} onChange={(desc) => set({ desc })} long />
        <div className="adm-grid2">
          <Field label="Precio base ($)"><input type="number" inputMode="decimal" step="0.01" value={s.price} onChange={(e) => set({ price: Number(e.target.value) })} /></Field>
          <Field label="Se cobra"><select value={s.kind} onChange={(e) => set({ kind: e.target.value as UnitKind })}>{KINDS.map((k) => <option key={k.id} value={k.id}>{k.label}</option>)}</select></Field>
        </div>
        <Field label="Categoría">
          <select value={s.cat} onChange={(e) => set({ cat: e.target.value as CategoryId })}>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name.es}</option>)}</select>
        </Field>
        <Field label="Nota (opcional)" hint="Ej. “No incluye materiales”">
          <input value={note?.es ?? ''} onChange={(e) => set({ notes: e.target.value ? [{ es: e.target.value, en: note?.en && note.es === e.target.value ? note.en : e.target.value }] : undefined })} />
        </Field>
        <Toggle on={!!s.from} onChange={(from) => set({ from })} label="Mostrar “desde” antes del precio" />
        <Toggle on={!!s.popular} onChange={(popular) => set({ popular })} label="Destacar en “Servicios populares”" />
        <Toggle on={active} onChange={setActive} label={active ? 'Visible en la web' : 'Oculto'} />
      </section>

      <div className="adm-actions">
        {row.id && (
          <button
            className="adm-btn danger"
            onClick={async () => {
              if (!confirm('¿Borrar este servicio?')) return
              const { error } = await sb.from('services').delete().eq('id', row.id)
              if (error) return say(error.message)
              onDone('Servicio borrado')
            }}
          >
            <Trash2 size={16} />
          </button>
        )}
        <button className="adm-btn" style={{ flex: 1 }} disabled={busy} onClick={save}>{busy ? 'Guardando…' : 'Guardar'}</button>
      </div>
    </div>
  )
}
