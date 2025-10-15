import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../store/store'
import { logoutFirebase } from '../store/slices/authSlice'

export default function UserHome() {
  const user = useSelector((s: RootState) => s.auth.user)!
  const dispatch = useDispatch()

  return (
    <div>
      <header>
        <h2>Panel de usuario</h2>
        <div className="helper">Gestiona tu sesión y configuración</div>
      </header>

      <div className="user">
        {user.photoURL && <img src={user.photoURL} alt="Avatar del usuario" />}
        <div>
          <div style={{fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem'}}>
            {user.displayName || 'Usuario'}
          </div>
          <div className="helper">{user.email}</div>
          <div style={{
            marginTop: '0.5rem',
            fontSize: '0.8rem',
            color: 'var(--accent-secondary)',
            fontWeight: '500'
          }}>
            ✓ Sesión activa
          </div>
        </div>
      </div>

      <div className="divider" />

      <div className="row">
        <button 
          className="btn danger" 
          onClick={() => dispatch(logoutFirebase() as any)}
          style={{minWidth: '140px'}}
        >
          Cerrar sesión
        </button>
        <div className="helper" style={{marginLeft: '1rem'}}>
          Tu sesión está segura y encriptada
        </div>
      </div>
    </div>
  )
}