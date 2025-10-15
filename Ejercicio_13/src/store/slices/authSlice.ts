import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { auth, googleProvider, firebaseReady } from '../../firebase/config'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User
} from 'firebase/auth'

type AuthUser = {
  uid: string
  displayName: string | null
  email: string | null
  photoURL: string | null
}

type AuthState = {
  user: AuthUser | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: string
}

const initialState: AuthState = {
  user: null,
  status: 'idle'
}

// Email + password
export const loginWithEmailPassword = createAsyncThunk(
  'auth/loginWithEmailPassword',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      if (!firebaseReady || !auth) throw new Error('Firebase no está configurado. Configura src/firebase/config.ts')
      const res = await signInWithEmailAndPassword(auth, email, password)
      const u = res.user
      return { uid: u.uid, displayName: u.displayName, email: u.email, photoURL: u.photoURL } as AuthUser
    } catch (err: any) {
      return rejectWithValue(err?.message ?? 'Error desonocido')
    }
  }
)

// Google popup
export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      if (!firebaseReady || !auth) throw new Error('Firebase no está configurado. Configura src/firebase/config.ts')
      const res = await signInWithPopup(auth, googleProvider)
      const u = res.user
      return { uid: u.uid, displayName: u.displayName, email: u.email, photoURL: u.photoURL } as AuthUser
    } catch (err: any) {
      return rejectWithValue(err?.message ?? 'Error desonocido')
    }
  }
)

// Logout
export const logoutFirebase = createAsyncThunk('auth/logout', async () => {
  if (!firebaseReady || !auth) return null
  await signOut(auth)
  return null
})

// Reducer
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserFromFirebase: (state, action: PayloadAction<User | null>) => {
      if (!action.payload) {
        state.user = null
      } else {
        const u = action.payload
        state.user = {
          uid: u.uid,
          displayName: u.displayName,
          email: u.email,
          photoURL: u.photoURL
        }
      }
    },
    resetError: (state) => { state.error = undefined }
  },
  extraReducers: (builder) => {
    builder
      // email+password
      .addCase(loginWithEmailPassword.pending, (state) => { state.status = 'loading'; state.error = undefined })
      .addCase(loginWithEmailPassword.fulfilled, (state, action) => { state.status = 'succeeded'; state.user = action.payload })
      .addCase(loginWithEmailPassword.rejected, (state, action) => { state.status = 'failed'; state.error = String(action.payload) })

      // google
      .addCase(loginWithGoogle.pending, (state) => { state.status = 'loading'; state.error = undefined })
      .addCase(loginWithGoogle.fulfilled, (state, action) => { state.status = 'succeeded'; state.user = action.payload })
      .addCase(loginWithGoogle.rejected, (state, action) => { state.status = 'failed'; state.error = String(action.payload) })

      // logout
      .addCase(logoutFirebase.fulfilled, (state) => { state.user = null; state.status = 'idle' })
  }
})

export const { setUserFromFirebase, resetError } = authSlice.actions
export default authSlice.reducer