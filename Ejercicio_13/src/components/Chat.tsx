import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'
import {
  sendMessage,
  startListeningToMessages,
  stopListeningToMessages,
  clearMessages,
  resetError
} from '../store/slices/chatSlice'
import type { Message } from '../store/slices/chatSlice'

export default function Chat() {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { messages, status, error, isListening } = useSelector((state: RootState) => state.chat)
  
  const [newMessage, setNewMessage] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const unsubscribeRef = useRef<any>(null)

  // Scroll automático al final de los mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Iniciar/parar la escucha cuando el usuario cambia
  useEffect(() => {
    if (user && !isListening && !isConnecting) {
      setIsConnecting(true)
      dispatch(startListeningToMessages())
        .then((action) => {
          if (startListeningToMessages.fulfilled.match(action)) {
            unsubscribeRef.current = action.payload
          }
        })
        .finally(() => {
          setIsConnecting(false)
        })
    }

    return () => {
      if (unsubscribeRef.current) {
        dispatch(stopListeningToMessages(unsubscribeRef.current))
        unsubscribeRef.current = null
      }
    }
  }, [user, dispatch, isListening, isConnecting])

  // Limpiar mensajes cuando el usuario se desconecta
  useEffect(() => {
    if (!user) {
      dispatch(clearMessages())
    }
  }, [user, dispatch])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || !user || status === 'loading') return

    const messageText = newMessage.trim()
    setNewMessage('')

    try {
      await dispatch(sendMessage({
        text: messageText,
        userId: user.uid,
        userDisplayName: user.displayName || 'Usuario',
        userEmail: user.email || ''
      })).unwrap()
    } catch (error) {
      console.error('Error al enviar mensaje:', error)
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isCurrentUser = (messageUserId: string) => {
    return user?.uid === messageUserId
  }

  if (!user) {
    return (
      <div className="card">
        <header>
          <h2>💬 Chat Personal</h2>
          <div className="helper">Inicia sesión para usar el chat</div>
        </header>
      </div>
    )
  }

  return (
    <div className="card">
      <header>
        <h2>💬 Chat Personal</h2>
        <div className="helper">
          {isConnecting ? 'Conectando...' : 
           isListening ? 'Conectado en tiempo real' : 
           'Desconectado'}
        </div>
      </header>

      {error && (
        <div style={{
          background: 'var(--accent-tertiary)',
          color: 'white',
          padding: '0.75rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>⚠️ Error: {error}</span>
          <button
            onClick={() => dispatch(resetError())}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Área de mensajes */}
      <div style={{
        height: '400px',
        overflowY: 'auto',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1rem',
        background: 'var(--bg-secondary)'
      }}>
        {messages.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: 'var(--text-secondary)',
            marginTop: '2rem'
          }}>
            {isConnecting ? 'Conectando al chat...' : 
             'No hay mensajes aún. ¡Envía el primero!'}
          </div>
        ) : (
          messages.map((message: Message) => (
            <div
              key={message.id}
              style={{
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: isCurrentUser(message.userId) ? 'flex-end' : 'flex-start'
              }}
            >
              <div
                style={{
                  maxWidth: '70%',
                  padding: '0.75rem 1rem',
                  borderRadius: '18px',
                  background: isCurrentUser(message.userId) 
                    ? 'var(--accent-primary)' 
                    : 'var(--bg-tertiary)',
                  color: isCurrentUser(message.userId) 
                    ? 'white' 
                    : 'var(--text-primary)',
                  border: isCurrentUser(message.userId) 
                    ? 'none' 
                    : '1px solid var(--border)'
                }}
              >
                {!isCurrentUser(message.userId) && (
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    marginBottom: '0.25rem',
                    opacity: 0.8
                  }}>
                    {message.userDisplayName}
                  </div>
                )}
                <div style={{ marginBottom: '0.25rem' }}>
                  {message.text}
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  opacity: 0.7,
                  textAlign: 'right'
                }}>
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Formulario para enviar mensajes */}
      <form onSubmit={handleSendMessage}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            disabled={status === 'loading' || !isListening}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: '1rem'
            }}
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || status === 'loading' || !isListening}
            style={{
              padding: '0.75rem 1.5rem',
              background: status === 'loading' || !isListening 
                ? 'var(--bg-tertiary)' 
                : 'var(--accent-primary)',
              color: status === 'loading' || !isListening 
                ? 'var(--text-secondary)' 
                : 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: status === 'loading' || !isListening ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
          >
            {status === 'loading' ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
          marginTop: '0.5rem',
          textAlign: 'right'
        }}>
          {newMessage.length}/500 caracteres
        </div>
      </form>

      <div style={{
        marginTop: '1rem',
        padding: '0.75rem',
        background: 'var(--bg-tertiary)',
        borderRadius: '8px',
        fontSize: '0.875rem',
        color: 'var(--text-secondary)'
      }}>
        <strong>💡 Información:</strong> Este es un chat personal que se sincroniza en tiempo real usando Firebase Realtime Database. 
        Los mensajes se almacenan y se muestran instantáneamente.
      </div>
    </div>
  )
}
