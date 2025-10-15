import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginWithEmailPassword, loginWithGoogle } from '../store/slices/authSlice'
import type { RootState } from '../store/store'

export default function Login() {
  const dispatch = useDispatch()
  const { status, error } = useSelector((s: RootState) => s.auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const disabled = status === 'loading'

  return (
    <div>
      <header>
        <h2>Iniciar sesión</h2>
        <div className="helper">Accede a tu cuenta para continuar</div>
      </header>

      <div className="column">
        <label>Correo electrónico</label>
        <input 
          className="input" 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="tu@email.com" 
          disabled={disabled}
        />
        <label>Contraseña</label>
        <input 
          className="input" 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="••••••••" 
          disabled={disabled}
        />
      </div>

      <div className="divider" />

      <div className="row">
        <button 
          className="btn primary" 
          disabled={disabled} 
          onClick={() => dispatch(loginWithEmailPassword({ email, password }) as any)}
        >
          {disabled ? 'Entrando...' : 'Entrar con correo'}
        </button>
        <button 
          className="btn" 
          disabled={disabled} 
          onClick={() => dispatch(loginWithGoogle() as any)}
        >
          {disabled ? 'Entrando...' : 'Entrar con Google'}
        </button>
      </div>

      {error && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: 'rgba(220, 38, 38, 0.1)',
          border: '1px solid rgba(220, 38, 38, 0.3)',
          borderRadius: '12px',
          color: 'var(--accent-danger)'
        }} role="alert">
          ⚠️ {error}
        </div>
      )}
    </div>
  )
}