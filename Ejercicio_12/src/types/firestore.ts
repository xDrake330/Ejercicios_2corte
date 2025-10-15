// Tipos para los documentos de Firestore

export interface Item {
  id?: string
  nombre: string
  descripcion?: string
  completado: boolean
  fechaCreacion: Date
  fechaActualizacion: Date
  usuarioId: string
}

export interface CreateItemData {
  nombre: string
  descripcion?: string
  completado?: boolean
}

export interface UpdateItemData {
  nombre?: string
  descripcion?: string
  completado?: boolean
}

export interface FirestoreError {
  code: string
  message: string
}

// Tipos para el estado de Redux
export interface ItemsState {
  items: Item[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: string
  lastFetch?: Date
}

// Tipos para las operaciones CRUD
export interface CRUDOperation {
  type: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE'
  item?: Item
  data?: CreateItemData | UpdateItemData
  itemId?: string
}
