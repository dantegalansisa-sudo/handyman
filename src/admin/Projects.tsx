import { motion } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Camera, Eye, EyeOff, Plus, Star, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CATEGORIES, SERVICES } from '../data'
import { PROJECTS, type Photo, type Project } from '../portfolio'
import { BiText, Field, Toggle, useToast } from './Admin'
import { deletePhotos, sb, slugify, uploadPhoto } from './sb'

type Row = { id: string; data: Project; sort: number; published: boolean }

export default function Projects() {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [edit, setEdit] = useState<Row | null>(null)
  const [toast, say] = useToast()

  const load = async () => {
    const { data, error } = await sb.from('projects').select('*').order('sort')
    if (error) say(error.message)
    setRows((data as Row[]) ?? [])
  }
  useEffect(() => { load() }, [])

  const importDefaults = async () => {
    const payload = PROJECTS.map((p, i) => ({ id: p.id, data: p, sort: i, published: true }))
    const { error } = await sb.from('projects').upsert(payload)
    say(error ? error.message : 'Trabajos importados')
    load()
  }

  const move = async (i: number, d: -1 | 1) => {
    if (!rows) return
    const list = [...rows]
    const j = i + d
    if (j < 0 || j >= list.length) return
    ;[list[i], list[j]] = [list[j], list[i]]
    setRows(list)
    await sb.from('projects').upsert(list.map((r, k) => ({ id: r.id, data: r.data, published: r.published, sort: k })))
  }

  if (edit) return <Editor row={edit} onDone={(msg) => { setEdit(null); if (msg) say(msg); load() }} />

  return (
    <div>
      {toast}
      <div className="adm-head">
        <div>
          <h2>Trabajos realizados</h2>
          <p className="adm-muted">Lo que aparece en “Trabajos realizados”. El primero de la lista sale primero en la web.</p>
        </div>
        <button
          className="adm-btn"
          onClick={() => setEdit({ id: '', sort: rows?.length ?? 0, published: true, data: { id: '', title: { es: '' }, category: 'handyman', photos: [], featured: true } })}
        >
          <Plus size={18} /> Nuevo
        </button>
      </div>

      {rows === null && <div className="adm-muted">Cargando…</div>}
      {rows?.length === 0 && (
        <div className="adm-card">
          <b>Todavía no hay trabajos guardados en el panel.</b>
          <p className="adm-muted">La web está mostrando los {PROJECTS.length} trabajos que vienen de fábrica. Impórtalos para poder editarlos desde aquí.</p>
          <button className="adm-btn" onClick={importDefaults}>Importar los {PROJECTS.length} trabajos</button>
        </div>
      )}

      <div className="adm-list">
        {rows?.map((r, i) => (
          <motion.div key={r.id} layout className="adm-item" onClick={() => setEdit(r)}>
            <div className="adm-thumb">{r.data.photos[0] && <img src={r.data.photos[0].thumb ?? r.data.photos[0].src} alt="" />}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <b className="adm-ellipsis">{r.data.title.es || r.data.title.en || '(sin título)'}</b>
              <div className="adm-muted" style={{ fontSize: 12.5 }}>
                {CATEGORIES.find((c) => c.id === r.data.category)?.name.es} · {r.data.photos.length} fotos
                {r.data.featured && ' · ★ Inicio'}
                {!r.published && ' · Oculto'}
              </div>
            </div>
            <div className="adm-order" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => move(i, -1)} aria-label="Subir"><ArrowUp size={16} /></button>
              <button onClick={() => move(i, 1)} aria-label="Bajar"><ArrowDown size={16} /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function Editor({ row, onDone }: { row: Row; onDone: (msg?: string) => void }) {
  const [p, setP] = useState<Project>(row.data)
  const [published, setPublished] = useState(row.published)
  const [uploading, setUploading] = useState(0)
  const [saving, setSaving] = useState(false)
  const [removed, setRemoved] = useState<Photo[]>([])
  const [toast, say] = useToast()
  const isNew = !row.id
  const set = (patch: Partial<Project>) => setP((x) => ({ ...x, ...patch }))

  const addPhotos = async (files: FileList | null) => {
    if (!files?.length) return
    const folder = `projects/${row.id || slugify(p.title.es || 'trabajo')}`
    setUploading(files.length)
    for (const f of Array.from(files)) {
      try {
        const ph = await uploadPhoto(f, folder)
        setP((x) => ({ ...x, photos: [...x.photos, ph] }))
      } catch (e) {
        say(`No se pudo subir ${f.name}`)
      }
      setUploading((n) => n - 1)
    }
  }

  const movePhoto = (i: number, d: -1 | 1) => {
    const list = [...p.photos]
    const j = i + d
    if (j < 0 || j >= list.length) return
    ;[list[i], list[j]] = [list[j], list[i]]
    set({ photos: list })
  }

  const save = async () => {
    if (!p.title.es?.trim()) return say('Escribe el título')
    if (!p.photos.length) return say('Agrega al menos una foto')
    setSaving(true)
    let id = row.id
    if (!id) {
      id = slugify(p.title.es)
      const { data } = await sb.from('projects').select('id').eq('id', id)
      if (data?.length) id = `${id}-${Date.now().toString(36).slice(-4)}`
    }
    const data: Project = { ...p, id }
    const { error } = await sb.from('projects').upsert({ id, data, sort: row.sort, published, updated_at: new Date().toISOString() })
    if (!error && removed.length) await deletePhotos(removed).catch(() => {})
    setSaving(false)
    if (error) return say(error.message)
    onDone('Guardado ✓')
  }

  const remove = async () => {
    if (!confirm('¿Borrar este trabajo? Esto no se puede deshacer.')) return
    const { error } = await sb.from('projects').delete().eq('id', row.id)
    if (error) return say(error.message)
    await deletePhotos(p.photos).catch(() => {})
    onDone('Trabajo borrado')
  }

  return (
    <div>
      {toast}
      <div className="adm-head">
        <button className="adm-icon" onClick={() => onDone()} aria-label="Volver"><ArrowLeft size={18} /></button>
        <h2 style={{ flex: 1 }}>{isNew ? 'Nuevo trabajo' : 'Editar trabajo'}</h2>
      </div>

      <section className="adm-card">
        <div className="adm-label">Fotos <span className="adm-muted">— la primera es la portada</span></div>
        <div className="adm-photos">
          {p.photos.map((ph, i) => (
            <div key={ph.src} className="adm-photo">
              <img src={ph.thumb ?? ph.src} alt="" />
              {i === 0 && <span className="adm-cover">Portada</span>}
              <div className="adm-photo-bar">
                <button onClick={() => movePhoto(i, -1)} aria-label="Mover a la izquierda"><ArrowLeft size={15} /></button>
                <button onClick={() => { setRemoved((r) => [...r, ph]); set({ photos: p.photos.filter((_, k) => k !== i) }) }} aria-label="Quitar"><Trash2 size={15} /></button>
                <button onClick={() => movePhoto(i, 1)} aria-label="Mover a la derecha"><ArrowRight size={15} /></button>
              </div>
            </div>
          ))}
          {Array.from({ length: uploading }).map((_, i) => <div key={`u${i}`} className="adm-photo adm-uploading">Subiendo…</div>)}
          <label className="adm-photo adm-add">
            <Camera size={22} />
            <span>Agregar fotos</span>
            <input type="file" accept="image/*" multiple hidden onChange={(e) => { addPhotos(e.target.files); e.target.value = '' }} />
          </label>
        </div>
        <p className="adm-muted" style={{ fontSize: 12.5, margin: '10px 0 0' }}>Fotos del celular, verticales u horizontales. Se optimizan solas al subirlas.</p>
      </section>

      <section className="adm-card">
        <BiText label="Título *" value={p.title} onChange={(title) => set({ title })} />
        <Field label="Categoría">
          <select value={p.category} onChange={(e) => set({ category: e.target.value as Project['category'] })}>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name.es}</option>)}
          </select>
        </Field>
        <BiText label="Descripción (1–2 oraciones)" value={p.description} onChange={(description) => set({ description })} long />
        <div className="adm-grid2">
          <Field label="Pueblo (opcional)"><input value={p.town ?? ''} onChange={(e) => set({ town: e.target.value || undefined })} placeholder="Ej. Bayamón" /></Field>
          <Field label="Mes (opcional)"><input type="month" value={p.date ?? ''} onChange={(e) => set({ date: e.target.value || undefined })} /></Field>
        </div>
      </section>

      <section className="adm-card">
        <div className="adm-label">Servicios de este trabajo <span className="adm-muted">(opcional)</span></div>
        <div className="adm-chips">
          {SERVICES.filter((s) => s.cat === p.category).concat(SERVICES.filter((s) => s.cat !== p.category && p.services?.includes(s.id))).map((s) => {
            const on = p.services?.includes(s.id)
            return (
              <button key={s.id} className={`adm-chip ${on ? 'on' : ''}`} onClick={() => set({ services: on ? p.services!.filter((x) => x !== s.id) : [...(p.services ?? []), s.id] })}>
                {s.name.es}
              </button>
            )
          })}
        </div>
      </section>

      <section className="adm-card">
        <Toggle on={!!p.featured} onChange={(featured) => set({ featured })} label={<><Star size={15} /> Mostrar en la página de inicio</>} />
        <Toggle on={published} onChange={setPublished} label={(published ? 'Visible en la web' : 'Oculto (borrador)')} />
      </section>

      <div className="adm-actions">
        {!isNew && <button className="adm-btn danger" onClick={remove}><Trash2 size={16} /> Borrar</button>}
        <button className="adm-btn" onClick={save} disabled={saving || uploading > 0} style={{ flex: 1 }}>
          {published ? <Eye size={16} /> : <EyeOff size={16} />} {saving ? 'Guardando…' : uploading ? 'Esperando fotos…' : 'Guardar'}
        </button>
      </div>
    </div>
  )
}
