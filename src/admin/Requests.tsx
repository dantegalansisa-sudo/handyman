import { MessageCircle, Phone, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useToast } from './Admin'
import { sb } from './sb'

type Status = 'new' | 'contacted' | 'done'
type Req = {
  id: string
  created_at: string
  status: Status
  data: { id: string; name: string; phone: string; address: string; date: string; slot: string; notes?: string; total: number; lines?: string }
}

const LABEL: Record<Status, string> = { new: 'Nueva', contacted: 'Contactado', done: 'Completada' }
const digits = (s: string) => s.replace(/\D/g, '')

export default function Requests() {
  const [rows, setRows] = useState<Req[] | null>(null)
  const [filter, setFilter] = useState<Status | 'all'>('new')
  const [toast, say] = useToast()

  const load = async () => {
    const { data, error } = await sb.from('service_requests').select('*').order('created_at', { ascending: false }).limit(200)
    if (error) say(error.message)
    setRows((data as Req[]) ?? [])
  }
  useEffect(() => { load() }, [])

  const setStatus = async (r: Req, status: Status) => {
    setRows((rs) => rs!.map((x) => (x.id === r.id ? { ...x, status } : x)))
    const { error } = await sb.from('service_requests').update({ status }).eq('id', r.id)
    if (error) say(error.message)
  }

  const list = rows?.filter((r) => filter === 'all' || r.status === filter) ?? []
  const count = (s: Status) => rows?.filter((r) => r.status === s).length ?? 0

  return (
    <div>
      {toast}
      <div className="adm-head">
        <div>
          <h2>Solicitudes</h2>
          <p className="adm-muted">Lo que los clientes envían desde la web.</p>
        </div>
      </div>
      <div className="adm-chips">
        {(['new', 'contacted', 'done', 'all'] as const).map((s) => (
          <button key={s} className={`adm-chip ${filter === s ? 'on' : ''}`} onClick={() => setFilter(s)}>
            {s === 'all' ? 'Todas' : `${LABEL[s]} (${count(s)})`}
          </button>
        ))}
      </div>
      {rows === null && <div className="adm-muted">Cargando…</div>}
      {rows && !list.length && <div className="adm-card adm-muted">No hay solicitudes aquí.</div>}
      <div className="adm-list">
        {list.map((r) => {
          const d = r.data
          const wa = digits(d.phone).length === 10 ? `1${digits(d.phone)}` : digits(d.phone)
          return (
            <div key={r.id} className="adm-card adm-req">
              <div className="adm-row">
                <b>{d.name}</b>
                <span className={`adm-badge ${r.status}`}>{LABEL[r.status]}</span>
              </div>
              <div className="adm-muted" style={{ fontSize: 12.5 }}>
                #{d.id} · {new Date(r.created_at).toLocaleString('es-PR', { dateStyle: 'medium', timeStyle: 'short' })}
              </div>
              <div style={{ margin: '10px 0', fontSize: 14, lineHeight: 1.5 }}>
                <div>📅 {d.date} · {d.slot}</div>
                <div>📍 {d.address}</div>
                {d.notes && <div>📝 {d.notes}</div>}
                <div><b>Total estimado: ${d.total}</b></div>
              </div>
              {d.lines && <pre className="adm-pre">{d.lines.split('\n').filter((l) => l.startsWith('•')).join('\n')}</pre>}
              <div className="adm-row" style={{ gap: 6, flexWrap: 'wrap' }}>
                <a className="adm-btn sm" href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" onClick={() => r.status === 'new' && setStatus(r, 'contacted')}><MessageCircle size={15} /> WhatsApp</a>
                <a className="adm-btn sm ghost" href={`tel:${d.phone}`}><Phone size={15} /> Llamar</a>
                <select value={r.status} onChange={(e) => setStatus(r, e.target.value as Status)} className="adm-select-sm">
                  {(Object.keys(LABEL) as Status[]).map((s) => <option key={s} value={s}>{LABEL[s]}</option>)}
                </select>
                <button
                  className="adm-icon"
                  aria-label="Borrar"
                  onClick={async () => {
                    if (!confirm('¿Borrar esta solicitud?')) return
                    await sb.from('service_requests').delete().eq('id', r.id)
                    load()
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
