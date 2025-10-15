import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchItemsAsync, clearError } from '../store/slices/itemsSlice'
import { RootState, AppDispatch } from '../store/store'
import CreateItemForm from './CreateItemForm'
import ItemsList from './ItemsList'

export default function FirestoreManager() {
  const dispatch = useDispatch<AppDispatch>()
  const { status, error } = useSelector((state: RootState) => state.items)
  const user = useSelector((state: RootState) => state.auth.user)

  // Cargar items cuando el usuario se autentique
  useEffect(() => {
    if (user?.uid && status === 'idle') {
      dispatch(fetchItemsAsync(user.uid))
    }
  }, [user?.uid, dispatch, status])

  // Limpiar error cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError())
      }
    }
  }, [error, dispatch])

  if (!user) {
    return (
      <div className="card">
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: 'var(--text-tertiary)'
        }}>
          Debes iniciar sesión para gestionar tus items
        </div>
      </div>
    )
  }

  return (
    <div className="grid">
      <CreateItemForm />
      <ItemsList />
      
      {/* Panel de información del estado */}
      <div className="card">
        <header>
          <h2>Estado de Firestore</h2>
          <div className="helper">Información sobre la conexión y operaciones</div>
        </header>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div>
            <strong>Estado de la conexión:</strong>
            <span style={{
              marginLeft: '0.5rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: status === 'succeeded' ? 'var(--accent-primary)' : 
                             status === 'loading' ? 'var(--accent-secondary)' : 
                             status === 'failed' ? 'var(--accent-tertiary)' : 'var(--text-tertiary)',
              color: 'white',
              borderRadius: '4px',
              fontSize: '0.875rem'
            }}>
              {status === 'idle' && 'Inactivo'}
              {status === 'loading' && 'Cargando...'}
              {status === 'succeeded' && 'Conectado'}
              {status === 'failed' && 'Error'}
            </span>
          </div>
          
          <div>
            <strong>Usuario:</strong>
            <span style={{ marginLeft: '0.5rem', color: 'var(--text-secondary)' }}>
              {user.email}
            </span>
          </div>
          
          <div>
            <strong>UID:</strong>
            <span style={{ 
              marginLeft: '0.5rem', 
              fontSize: '0.875rem',
              color: 'var(--text-tertiary)',
              fontFamily: 'monospace'
            }}>
              {user.uid}
            </span>
          </div>
          
          {error && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: 'var(--accent-tertiary)',
              color: 'white',
              borderRadius: '8px',
              fontSize: '0.875rem'
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
