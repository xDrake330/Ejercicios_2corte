import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'

// Configuración de Firebase para ejercicio11-b54c0
const firebaseConfig = {
  apiKey: "AIzaSyCvBVZCOo90sARu06M_zOT5H7db6pCYSvw",
  authDomain: "ejercicio11-b54c0.firebaseapp.com",
  projectId: "ejercicio11-b54c0",
  storageBucket: "ejercicio11-b54c0.firebasestorage.app",
  messagingSenderId: "950508607447",
  appId: "1:950508607447:web:4adaf2ef634bec805bdd92",
  measurementId: "G-Z6NNJQP1M5"
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Inicializar servicios
export const auth = getAuth(app)
export const db = getFirestore(app)
export const database = getDatabase(app)
export const googleProvider = new GoogleAuthProvider()
export const analytics = getAnalytics(app)

// Configurar el proveedor de Google
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

// Estado de Firebase listo
export const firebaseReady = true