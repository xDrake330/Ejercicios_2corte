import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],  // top at end
  peek: null,
}

const stackSlice = createSlice({
  name: 'stack',
  initialState,
  reducers: {
    push(state, action) {
      state.items.push(action.payload)
      state.peek = state.items[state.items.length - 1] ?? null
    },
    pop(state) {
      if (state.items.length > 0) {
        state.items.pop()
        state.peek = state.items[state.items.length - 1] ?? null
      }
    },
    clear(state) {
      state.items = []
      state.peek = null
    }
  },
})

export const { push, pop, clear } = stackSlice.actions
export default stackSlice.reducer
