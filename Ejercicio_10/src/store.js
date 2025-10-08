import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counterSlice'
import stackReducer from './features/stackSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    stack: stackReducer,
  },
})
