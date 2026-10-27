import { AnimatePresence, motion } from 'framer-motion'
import { ClipboardList, ExternalLink, Images, LayoutGrid, LogOut, Settings as SettingsIcon } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { hasBackend } from '../content'
import { BUSINESS } from '../data'
import { Logo } from '../components/ui'
import { sb } from './sb'
import Projects from './Projects'
import Services from './Services'
import SettingsTab from './Settings'
import Requests from './Requests'
import './admin.css'

type ATab = 'projects' | 'services' | 'settings' | 'requests'
const TABS: { id: ATab; label: string; icon: typeof Images }[] = [
  { id: 'projects', label: 'Trabajos', icon: Images },
  { id: 'services', label: 'Servicios', icon: LayoutGrid },
  { id: 'requests', label: 'Solicitudes', icon: ClipboardList },
  { id: 'settings', label: 'Ajustes', icon: SettingsIcon },
]

export default function Admin() {
  useEffect(() => {
    document.title = `Admin | ${BUSINESS.name}`
    const m = document.createElement('meta')
    m.name = 'robots'
    m.content = 'noindex, nofollow'
    document.head.appendChild(m)
  }, [])
  if (!hasBackend) return <Setup />
  return <Gate />
}

function Setup() {
  return (
    <div className="adm adm-center">
      <div className="adm-card" style={{ maxWidth: 520 }}>
        <Logo size={48} />
        <h1>Panel de administración</h1>
        <p>El panel está listo, pero falta conectar la base de datos (Supabase). Pasos:</p>
        <ol>
          <li>Crear un proyecto gratis en <b>supabase.com</b>.</li>
          <li>En <b>SQL Editor</b>, correr el archivo <code>supabase/schema.sql</code>.</li>
          <li>En <b>Authentication → Users</b>, crear el usuario del cliente (email + contraseña) y poner ese email al final del SQL.</li>
          <li>En Vercel, agregar <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code> y volver a publicar.</li>
        </ol>
        <a className="adm-btn ghost" href="/">Volver al sitio</a>
      </div>
    </div>
  )
}

function Gate() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = sb.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return setIsAdmin(null)
    sb.from('admins').select('email').then(({ data }) => setIsAdmin(!!data?.length))
  }, [session])

  if (session === undefined) return <div className="adm adm-center">Cargando…</div>
  if (!session) return <Login />
  if (isAdmin === null) return <div className="adm adm-center">Verificando acceso…</div>
  if (!isAdmin)
    return (
      <div className="adm adm-center">
        <div className="adm-card">
          <h1>Sin acceso</h1>
          <p>La cuenta <b>{session.user.email}</b> no está autorizada como administrador.</p>
          <button className="adm-btn" onClick={() => sb.auth.signOut()}>Salir</button>
        </div>
      </div>
    )
  return <Dashboard email={session.user.email ?? ''} />
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  return (
    <div className="adm adm-center">
      <form
        className="adm-card"
        onSubmit={async (e) => {
          e.preventDefault()
          setBusy(true)
          setErr('')
          const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password })
          setBusy(false)
          if (error) setErr('Email o contraseña incorrectos.')
        }}
      >
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Logo size={44} />
          <b>{BUSINESS.name}</b>
        </div>
        <h1>Entrar al panel</h1>
        <label className="adm-field"><span>Email</span><input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label className="adm-field"><span>Contraseña</span><input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        {err && <div className="adm-err">{err}</div>}
        <button className="adm-btn" disabled={busy}>{busy ? 'Entrando…' : 'Entrar'}</button>
        <button
          type="button"
          className="adm-link"
          onClick={async () => {
            if (!email) return setErr('Escribe tu email primero.')
            await sb.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${location.origin}/admin` })
            setErr('Te enviamos un email para cambiar la contraseña.')
          }}
        >
          Olvidé mi contraseña
        </button>
      </form>
    </div>
  )
}

function Dashboard({ email }: { email: string }) {
  const [tab, setTab] = useState<ATab>(() => (sessionStorage.getItem('adm.tab') as ATab) || 'projects')
  useEffect(() => sessionStorage.setItem('adm.tab', tab), [tab])
  return (
    <div className="adm">
      <header className="adm-top">
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', minWidth: 0 }}>
          <Logo size={36} />
          <div style={{ minWidth: 0 }}>
            <b className="adm-ellipsis">{BUSINESS.name}</b>
            <div className="adm-muted adm-ellipsis" style={{ fontSize: 12 }}>{email}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <a className="adm-icon" href="/" target="_blank" rel="noreferrer" aria-label="Ver sitio"><ExternalLink size={18} /></a>
          <button className="adm-icon" onClick={() => sb.auth.signOut()} aria-label="Salir"><LogOut size={18} /></button>
        </div>
      </header>
      <nav className="adm-tabs">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
            {tab === t.id && <motion.span layoutId="admtab" className="adm-tab-bg" />}
            <t.icon size={20} />
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
      <main className="adm-main">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {tab === 'projects' && <Projects />}
            {tab === 'services' && <Services />}
            {tab === 'requests' && <Requests />}
            {tab === 'settings' && <SettingsTab />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

/* ---------------- Shared form bits ---------------- */

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="adm-field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  )
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: ReactNode }) {
  return (
    <button type="button" className={`adm-toggle ${on ? 'on' : ''}`} onClick={() => onChange(!on)}>
      <span className="adm-switch"><motion.span layout className="adm-knob" /></span>
      {label}
    </button>
  )
}

/** Spanish is required; English is optional (falls back to Spanish on the site). */
export function BiText({ label, value, onChange, long }: { label: string; value?: { es?: string; en?: string }; onChange: (v: { es: string; en: string }) => void; long?: boolean }) {
  const [showEn, setShowEn] = useState(!!value?.en)
  const v = { es: value?.es ?? '', en: value?.en ?? '' }
  const Input = long ? 'textarea' : 'input'
  return (
    <div className="adm-field">
      <span>{label}</span>
      <Input value={v.es} onChange={(e) => onChange({ ...v, es: e.target.value })} placeholder="Español" rows={3} />
      {showEn ? (
        <Input value={v.en} onChange={(e) => onChange({ ...v, en: e.target.value })} placeholder="English (opcional)" rows={3} style={{ marginTop: 6 }} />
      ) : (
        <button type="button" className="adm-link" onClick={() => setShowEn(true)}>+ Inglés (opcional)</button>
      )}
    </div>
  )
}

export function useToast() {
  const [msg, setMsg] = useState('')
  useEffect(() => {
    if (!msg) return
    const id = setTimeout(() => setMsg(''), 2200)
    return () => clearTimeout(id)
  }, [msg])
  const el = (
    <AnimatePresence>
      {msg && (
        <motion.div className="adm-toast" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}>
          {msg}
        </motion.div>
      )}
    </AnimatePresence>
  )
  return [el, setMsg] as const
}
