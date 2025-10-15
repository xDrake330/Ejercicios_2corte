import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateItemAsync, deleteItemAsync, toggleItemCompleted } from '../store/slices/itemsSlice'
import { RootState, AppDispatch } from '../store/store'
import { Item } from '../types/firestore'

interface EditItemFormProps {
  item: Item
  onCancel: () => void
  onSave: (itemId: string, nombre: string, descripcion: string) => void
}

function EditItemForm({ item, onCancel, onSave }: EditItemFormProps) {
  const [nombre, setNombre] = useState(item.nombre)
  const [descripcion, setDescripcion] = useState(item.descripcion || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(item.id!, nombre, descripcion)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        style={{
          padding: '0.5rem',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          fontSize: '0.875rem',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)'
        }}
      />
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        rows={2}
        style={{
          padding: '0.5rem',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          fontSize: '0.875rem',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          resize: 'vertical',
          fontFamily: 'inherit'
        }}
      />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          type="submit"
          style={{
            padding: '0.25rem 0.5rem',
            backgroundColor: 'var(--accent-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '0.25rem 0.5rem',
            backgroundColor: 'var(--text-tertiary)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

interface ItemCardProps {
  item: Item
  onEdit: (item: Item) => void
  onDelete: (itemId: string) => void
  onToggle: (itemId: string) => void
  isEditing: boolean
}

function ItemCard({ item, onEdit, onDelete, onToggle, isEditing }: ItemCardProps) {
  if (isEditing) {
    return (
      <div style={{
        padding: '1rem',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        backgroundColor: 'var(--bg-secondary)'
      }}>
        <EditItemForm
          item={item}
          onCancel={() => onEdit(item)} // Toggle edit mode
          onSave={(itemId, nombre, descripcion) => {
            onEdit(item) // Exit edit mode first
            // The parent will handle the save
          }}
        />
      </div>
    )
  }

  return (
    <div style={{
      padding: '1rem',
      border: '1px solid var(--border)',
      borderRadius: '8px',
      backgroundColor: item.completado ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
      opacity: item.completado ? 0.7 : 1,
      transition: 'all 0.2s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <input
          type="checkbox"
          checked={item.completado}
          onChange={() => onToggle(item.id!)}
          style={{
            marginTop: '0.25rem',
            transform: 'scale(1.2)',
            cursor: 'pointer'
          }}
        />
        
        <div style={{ flex: 1 }}>
          <h4 style={{
            margin: '0 0 0.5rem 0',
            textDecoration: item.completado ? 'line-through' : 'none',
            color: item.completado ? 'var(--text-tertiary)' : 'var(--text-primary)'
          }}>
            {item.nombre}
          </h4>
          
          {item.descripcion && (
            <p style={{
              margin: '0 0 0.75rem 0',
              fontSize: '0.875rem',
              color: item.completado ? 'var(--text-tertiary)' : 'var(--text-secondary)',
              lineHeight: '1.4'
            }}>
              {item.descripcion}
            </p>
          )}
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: 'var(--text-tertiary)'
          }}>
            <span>
              Creado: {item.fechaCreacion.toLocaleDateString('es-ES')}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => onEdit(item)}
                style={{
                  padding: '0.25rem 0.5rem',
                  backgroundColor: 'var(--accent-secondary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(item.id!)}
                style={{
                  padding: '0.25rem 0.5rem',
                  backgroundColor: 'var(--accent-tertiary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ItemsList() {
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [editingFormData, setEditingFormData] = useState({ nombre: '', descripcion: '' })
  
  const dispatch = useDispatch<AppDispatch>()
  const { items, status, error } = useSelector((state: RootState) => state.items)

  const handleEdit = (item: Item) => {
    if (editingItem?.id === item.id) {
      // Si ya está editando este item, cancelar edición
      setEditingItem(null)
      setEditingFormData({ nombre: '', descripcion: '' })
    } else {
      // Iniciar edición
      setEditingItem(item)
      setEditingFormData({ nombre: item.nombre, descripcion: item.descripcion || '' })
    }
  }

  const handleSave = async (itemId: string, nombre: string, descripcion: string) => {
    if (!nombre.trim()) return
    
    try {
      await dispatch(updateItemAsync({
        itemId,
        updateData: {
          nombre: nombre.trim(),
          descripcion: descripcion.trim() || undefined
        }
      })).unwrap()
      setEditingItem(null)
      setEditingFormData({ nombre: '', descripcion: '' })
    } catch (error) {
      console.error('Error al actualizar item:', error)
    }
  }

  const handleDelete = async (itemId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este item?')) return
    
    try {
      await dispatch(deleteItemAsync(itemId)).unwrap()
    } catch (error) {
      console.error('Error al eliminar item:', error)
    }
  }

  const handleToggle = async (itemId: string) => {
    // Actualización optimista
    dispatch(toggleItemCompleted(itemId))
    
    try {
      const item = items.find(i => i.id === itemId)
      if (item) {
        await dispatch(updateItemAsync({
          itemId,
          updateData: { completado: !item.completado }
        })).unwrap()
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error)
      // Revertir cambio optimista en caso de error
      dispatch(toggleItemCompleted(itemId))
    }
  }

  if (status === 'loading' && items.length === 0) {
    return (
      <div className="card">
        <header>
          <h2>Mis Items</h2>
          <div className="helper">Cargando items...</div>
        </header>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
          Cargando...
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <header>
        <h2>Mis Items ({items.length})</h2>
        <div className="helper">
          {items.length === 0 ? 'No tienes items aún' : 'Gestiona tus items'}
        </div>
      </header>
      
      {error && (
        <div style={{
          padding: '0.75rem',
          backgroundColor: 'var(--accent-tertiary)',
          color: 'white',
          borderRadius: '8px',
          fontSize: '0.875rem',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}
      
      {items.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: 'var(--text-tertiary)',
          fontStyle: 'italic'
        }}>
          No tienes items. ¡Crea tu primer item arriba!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggle={handleToggle}
              isEditing={editingItem?.id === item.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
