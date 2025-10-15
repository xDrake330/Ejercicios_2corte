import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import itemsReducer from './slices/itemsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemsReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch