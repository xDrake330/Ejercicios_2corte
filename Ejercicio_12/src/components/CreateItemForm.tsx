import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createItemAsync } from '../store/slices/itemsSlice'
import { RootState, AppDispatch } from '../store/store'
import { CreateItemData } from '../types/firestore'

export default function CreateItemForm() {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const dispatch = useDispatch<AppDispatch>()
  const { status, error } = useSelector((state: RootState) => state.items)
  const user = useSelector((state: RootState) => state.auth.user)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nombre.trim() || !user) return
    
    setIsSubmitting(true)
    
    const itemData: CreateItemData = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || undefined
    }
    
    try {
      await dispatch(createItemAsync({ itemData, userId: user.uid })).unwrap()
      setNombre('')
      setDescripcion('')
    } catch (error: any) {
      console.error('Error al crear item:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLoading = status === 'loading' && isSubmitting

  return (
    <div className="card">
      <header>
        <h2>Crear Nuevo Item</h2>
        <div className="helper">Agrega un nuevo item a tu lista</div>
      </header>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label htmlFor="nombre" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Nombre *
          </label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del item"
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '1rem',
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              opacity: isLoading ? 0.6 : 1
            }}
          />
        </div>
        
        <div>
          <label htmlFor="descripcion" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Descripción
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción opcional del item"
            rows={3}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '1rem',
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              resize: 'vertical',
              fontFamily: 'inherit',
              opacity: isLoading ? 0.6 : 1
            }}
          />
        </div>
        
        {error && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: 'var(--accent-tertiary)',
            color: 'white',
            borderRadius: '8px',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={!nombre.trim() || isLoading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: isLoading ? 'var(--text-tertiary)' : 'var(--accent-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s ease',
            opacity: (!nombre.trim() || isLoading) ? 0.6 : 1
          }}
        >
          {isLoading ? 'Creando...' : 'Crear Item'}
        </button>
      </form>
    </div>
  )
}

