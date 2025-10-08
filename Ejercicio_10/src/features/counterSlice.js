import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 0,
}

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    decrement(state) {
      state.value -= 1
    },
    incrementBy(state, action) {
      const n = Number(action.payload)
      if (!Number.isNaN(n) && Number.isFinite(n)) {
        state.value += n
      }
    },
    reset(state){
      state.value = 0
    }
  },
})

export const { decrement, incrementBy, reset } = counterSlice.actions
export default counterSlice.reducer
