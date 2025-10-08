import AuthListener from './components/AuthListener'
import Login from './components/Login'
import UserHome from './components/UserHome'
import { useSelector } from 'react-redux'
import type { RootState } from './store/store'
import { firebaseReady } from './firebase/config'

export default function App() {
  const user = useSelector((s: RootState) => s.auth.user)

  return (
    <div className="app">
      <AuthListener />
      <h1 style={{
        background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent-primary) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textAlign: 'center',
        marginBottom: '3rem'
      }}>
        Challenge 11 — Autenticación
      </h1>
      {!firebaseReady && (
        <div className="card" style={{
          borderColor: 'var(--accent-tertiary)', 
          background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)',
          borderWidth: '2px'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem'}}>
            <span style={{fontSize: '1.5rem'}}>⚠️</span>
            <strong style={{color: 'var(--accent-tertiary)', fontSize: '1.1rem'}}>Firebase no está configurado</strong>
          </div>
          <div className="helper">
            Edita <code>src/firebase/config.ts</code> y agrega tu configuración o variables <code>.env</code>. 
            Mientras tanto, la app no intentará conectarse y no se bloqueará.
          </div>
        </div>
      )}
      <div className="grid">
        {!user ? (
          <div className="card">
            <Login />
          </div>
        ) : (
          <div className="card">
            <UserHome />
          </div>
        )}
        <div className="card">
          <header>
            <h2>Estado de la aplicación</h2>
            <div className="helper">Información del usuario actual</div>
          </header>
          <pre style={{
            background: 'var(--bg-tertiary)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            overflow: 'auto',
            maxHeight: '300px',
            color: 'var(--text-secondary)'
          }}>
            {user ? JSON.stringify(user, null, 2) : 'No hay usuario autenticado'}
          </pre>
        </div>
      </div>
    </div>
  )
}