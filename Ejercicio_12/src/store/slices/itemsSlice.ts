import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { 
  createItem, 
  getItems, 
  updateItem, 
  deleteItem 
} from '../../services/firestoreService'
import { Item, CreateItemData, UpdateItemData, ItemsState } from '../../types/firestore'

const initialState: ItemsState = {
  items: [],
  status: 'idle',
  error: undefined,
  lastFetch: undefined
}

// Thunks para operaciones CRUD

// Crear un nuevo item
export const createItemAsync = createAsyncThunk(
  'items/createItem',
  async ({ itemData, userId }: { itemData: CreateItemData; userId: string }, { rejectWithValue }) => {
    try {
      const newItem = await createItem(itemData, userId)
      return newItem
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

// Obtener todos los items
export const fetchItemsAsync = createAsyncThunk(
  'items/fetchItems',
  async (userId: string, { rejectWithValue }) => {
    try {
      const items = await getItems(userId)
      return items
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

// Actualizar un item
export const updateItemAsync = createAsyncThunk(
  'items/updateItem',
  async ({ itemId, updateData }: { itemId: string; updateData: UpdateItemData }, { rejectWithValue }) => {
    try {
      const updatedItem = await updateItem(itemId, updateData)
      return { itemId, updatedItem }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

// Eliminar un item
export const deleteItemAsync = createAsyncThunk(
  'items/deleteItem',
  async (itemId: string, { rejectWithValue }) => {
    try {
      await deleteItem(itemId)
      return itemId
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

// Slice
const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    clearItems: (state) => {
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
    updateItemOptimistically: (state, action: PayloadAction<{ itemId: string; updateData: UpdateItemData }>) => {
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
      .addCase(createItemAsync.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(createItemAsync.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items.unshift(action.payload) // Agregar al inicio
      })
      .addCase(createItemAsync.rejected, (state, action) => {
        state.status = 'failed'
        state.error = String(action.payload)
      })

      // Obtener items
      .addCase(fetchItemsAsync.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(fetchItemsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
        state.lastFetch = new Date()
      })
      .addCase(fetchItemsAsync.rejected, (state, action) => {
        state.status = 'failed'
        state.error = String(action.payload)
      })

      // Actualizar item
      .addCase(updateItemAsync.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(updateItemAsync.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const { itemId, updatedItem } = action.payload
        const index = state.items.findIndex(item => item.id === itemId)
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...updatedItem }
        }
      })
      .addCase(updateItemAsync.rejected, (state, action) => {
        state.status = 'failed'
        state.error = String(action.payload)
      })

      // Eliminar item
      .addCase(deleteItemAsync.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(deleteItemAsync.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = state.items.filter(item => item.id !== action.payload)
      })
      .addCase(deleteItemAsync.rejected, (state, action) => {
        state.status = 'failed'
        state.error = String(action.payload)
      })
  }
})

export const { 
  clearItems, 
  clearError, 
  toggleItemCompleted, 
  updateItemOptimistically 
} = itemsSlice.actions

export default itemsSlice.reducer

