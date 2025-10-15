import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { database } from '../../firebase/config'
import { ref, push, onValue, off, serverTimestamp, DataSnapshot } from 'firebase/database'

export interface Message {
  id: string
  text: string
  timestamp: number
  userId: string
  userDisplayName: string
  userEmail: string
}

interface ChatState {
  messages: Message[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: string
  isListening: boolean
}

const initialState: ChatState = {
  messages: [],
  status: 'idle',
  isListening: false
}

// Enviar mensaje
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (
    { text, userId, userDisplayName, userEmail }: {
      text: string
      userId: string
      userDisplayName: string
      userEmail: string
    },
    { rejectWithValue }
  ) => {
    try {
      const messagesRef = ref(database, 'messages')
      const newMessageRef = push(messagesRef, {
        text,
        userId,
        userDisplayName,
        userEmail,
        timestamp: serverTimestamp()
      })
      
      return {
        id: newMessageRef.key!,
        text,
        userId,
        userDisplayName,
        userEmail,
        timestamp: Date.now()
      } as Message
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al enviar mensaje')
    }
  }
)

// Iniciar escucha en tiempo real
export const startListeningToMessages = createAsyncThunk(
  'chat/startListeningToMessages',
  async (_, { dispatch, rejectWithValue }): Promise<any> => {
    try {
      const messagesRef = ref(database, 'messages')
      
      const unsubscribe = onValue(messagesRef, (snapshot: DataSnapshot) => {
        const messagesData = snapshot.val()
        if (messagesData) {
          const messages: Message[] = Object.entries(messagesData).map(([id, data]: [string, any]) => ({
            id,
            text: data.text,
            userId: data.userId,
            userDisplayName: data.userDisplayName,
            userEmail: data.userEmail,
            timestamp: data.timestamp || Date.now()
          }))
          
          // Ordenar mensajes por timestamp
          messages.sort((a, b) => a.timestamp - b.timestamp)
          
          dispatch(setMessages(messages))
        } else {
          dispatch(setMessages([]))
        }
      })
      
      return unsubscribe
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al conectar con el chat')
    }
  }
)

// Detener escucha
export const stopListeningToMessages = createAsyncThunk(
  'chat/stopListeningToMessages',
  async (unsubscribe: any): Promise<void> => {
    if (unsubscribe) {
      off(unsubscribe)
    }
  }
)

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload
    },
    clearMessages: (state) => {
      state.messages = []
    },
    resetError: (state) => {
      state.error = undefined
    }
  },
  extraReducers: (builder) => {
    builder
      // Enviar mensaje
      .addCase(sendMessage.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // El mensaje ya se agregó a través de la escucha en tiempo real
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'failed'
        state.error = String(action.payload)
      })
      
      // Iniciar escucha
      .addCase(startListeningToMessages.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(startListeningToMessages.fulfilled, (state) => {
        state.status = 'succeeded'
        state.isListening = true
      })
      .addCase(startListeningToMessages.rejected, (state, action) => {
        state.status = 'failed'
        state.error = String(action.payload)
        state.isListening = false
      })
      
      // Detener escucha
      .addCase(stopListeningToMessages.fulfilled, (state) => {
        state.isListening = false
      })
  }
})

export const { setMessages, clearMessages, resetError } = chatSlice.actions
export default chatSlice.reducer
