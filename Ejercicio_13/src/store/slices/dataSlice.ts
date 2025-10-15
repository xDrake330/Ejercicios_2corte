import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore'
import { db } from '../../firebase/config'

// Tipos para los items con asociación al usuario
export interface DataItem {
  id?: string
  nombre: string
  descripcion?: string
  completado: boolean
  fechaCreacion: Date
  fechaActualizacion: Date
  uid: string // ID del usuario autenticado
}

export interface CreateDataItemData {
  nombre: string
  descripcion?: string
  completado?: boolean
}

export interface UpdateDataItemData {
  nombre?: string
  descripcion?: string
  completado?: boolean
}

// Estado del slice
export interface DataState {
  items: DataItem[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: string
  lastFetch?: Date
}

const initialState: DataState = {
  items: [],
  status: 'idle',
  error: undefined,
  lastFetch: undefined
}

const COLLECTION_NAME = 'dataItems'

// Función auxiliar para convertir documentos de Firestore a objetos DataItem
const convertFirestoreDocToDataItem = (doc: QueryDocumentSnapshot<DocumentData>): DataItem => {
  const data = doc.data()
  return {
    id: doc.id,
    nombre: data.nombre,
    descripcion: data.descripcion || '',
    completado: data.completado || false,
    fechaCreacion: data.fechaCreacion?.toDate() || new Date(),
    fechaActualizacion: data.fechaActualizacion?.toDate() || new Date(),
    uid: data.uid
  }
}

// Thunks para operaciones CRUD

// Crear un nuevo item asociado al usuario
export const addData = createAsyncThunk(
  'data/addData',
  async ({ itemData, uid }: { itemData: CreateDataItemData; uid: string }, { rejectWithValue }) => {
    try {
      const now = serverTimestamp()
      const newItemData = {
        ...itemData,
        completado: itemData.completado || false,
        fechaCreacion: now,
        fechaActualizacion: now,
        uid: uid
      }

      const docRef = await addDoc(collection(db, COLLECTION_NAME), newItemData)
      
      // Crear el item con el ID generado
      const createdItem: DataItem = {
        id: docRef.id,
        nombre: itemData.nombre,
        descripcion: itemData.descripcion || '',
        completado: itemData.completado || false,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        uid: uid
      }

      return createdItem
    } catch (error: any) {
      console.error('Error al crear item:', error)
      return rejectWithValue(error.message || 'Error al crear item')
    }
  }
)

// Obtener todos los items del usuario autenticado
export const fetchData = createAsyncThunk(
  'data/fetchData',
  async (uid: string, { rejectWithValue }) => {
    try {
      // Consulta filtrada por usuario y ordenada por fecha de creación descendente
      const q = query(
        collection(db, COLLECTION_NAME),
        where('uid', '==', uid),
        orderBy('fechaCreacion', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const items: DataItem[] = []
      
      querySnapshot.forEach((doc) => {
        items.push(convertFirestoreDocToDataItem(doc))
      })
      
      return items
    } catch (error: any) {
      console.error('Error al obtener items:', error)
      return rejectWithValue(error.message || 'Error al obtener items')
    }
  }
)

// Actualizar un item
export const updateData = createAsyncThunk(
  'data/updateData',
  async ({ itemId, updateData }: { itemId: string; updateData: UpdateDataItemData }, { rejectWithValue }) => {
    try {
      const itemRef = doc(db, COLLECTION_NAME, itemId)
      
      const updatePayload = {
        ...updateData,
        fechaActualizacion: serverTimestamp()
      }
      
      await updateDoc(itemRef, updatePayload)
      
      // Devolver el item actualizado
      const updatedItem: DataItem = {
        id: itemId,
        nombre: updateData.nombre || '',
        descripcion: updateData.descripcion || '',
        completado: updateData.completado || false,
        fechaCreacion: new Date(), // Se actualizará en el store
        fechaActualizacion: new Date(),
        uid: '' // Se actualizará en el store
      }
      
      return { itemId, updatedItem }
    } catch (error: any) {
      console.error('Error al actualizar item:', error)
      return rejectWithValue(error.message || 'Error al actualizar item')
    }
  }
)

// Eliminar un item
export const deleteData = createAsyncThunk(
  'data/deleteData',
  async (itemId: string, { rejectWithValue }) => {
    try {
      const itemRef = doc(db, COLLECTION_NAME, itemId)
      await deleteDoc(itemRef)
      return itemId
    } catch (error: any) {
      console.error('Error al eliminar item:', error)
      return rejectWithValue(error.message || 'Error al eliminar item')
    }
  }
)

// Slice
const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    clearData: (state) => {
      state.items = []
      state.status = 'idle'
      state.error = undefined
      state.lastFetch = undefined
    },
    clearError: (state) => {
      state.error = undefined
    },
    toggleItemCompleted: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload)
      if (item) {
        item.completado = !item.completado
        item.fechaActualizacion = new Date()
      }
    },
    updateItemOptimistically: (state, action: PayloadAction<{ itemId: string; updateData: UpdateDataItemData }>) => {
      const { itemId, updateData } = action.payload
      const item = state.items.find(item => item.id === itemId)
      if (item) {
        Object.assign(item, updateData)
        item.fechaActualizacion = new Date()
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Crear item
      .addCase(addData.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(addData.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items.unshift(action.payload) // Agregar al inicio (más reciente primero)
      })
      .addCase(addData.rejected, (state, action) => {
        state.status = 'failed'
        state.error = String(action.payload)
      })

      // Obtener items
      .addCase(fetchData.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
        state.lastFetch = new Date()
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = 'failed'
        state.error = String(action.payload)
      })

      // Actualizar item
      .addCase(updateData.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(updateData.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const { itemId, updatedItem } = action.payload
        const index = state.items.findIndex(item => item.id === itemId)
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...updatedItem }
        }
      })
      .addCase(updateData.rejected, (state, action) => {
        state.status = 'failed'
        state.error = String(action.payload)
      })

      // Eliminar item
      .addCase(deleteData.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(deleteData.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = state.items.filter(item => item.id !== action.payload)
      })
      .addCase(deleteData.rejected, (state, action) => {
        state.status = 'failed'
        state.error = String(action.payload)
      })
  }
})

export const { 
  clearData, 
  clearError, 
  toggleItemCompleted, 
  updateItemOptimistically 
} = dataSlice.actions

export default dataSlice.reducer
