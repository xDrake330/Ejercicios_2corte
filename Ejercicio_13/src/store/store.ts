import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import itemsReducer from './slices/itemsSlice'
import chatReducer from './slices/chatSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemsReducer,
    chat: chatReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch