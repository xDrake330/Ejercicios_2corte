# Challenge 11 — Firebase Auth + Redux (tema claro, ES)

Cumple con:
- Login con **correo y contraseña** usando Redux + Firebase
- Login con **Google** usando Redux + Firebase
- **Logout** desde Firebase

## Ejecutar
```bash
npm install
npm run dev
```

### Configurar Firebase
1) Crea tu proyecto en Firebase > Authentication > habilita **Email/Password** y **Google**.  
2) Crea una **Web App** y copia su configuración.  
3) Elige una de estas dos opciones:

**A) Pega tu `firebaseConfig` directamente en `src/firebase/config.ts`** (bloque comentado):  
```ts
export const app = initializeApp({
  apiKey: 'TU_API_KEY',
  authDomain: 'TU_AUTH_DOMAIN',
  projectId: 'TU_PROJECT_ID',
  appId: 'TU_APP_ID'
})
```

**B) Variables de entorno (recomendado con Vite)**: crea un archivo `.env.local` en la raíz con:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```

Luego reinicia `npm run dev`.

## Estructura
- `src/firebase/config.ts` → Inicializa Firebase, exporta `auth` y `googleProvider`.
- `src/store/slices/authSlice.ts` → Thunks: `loginWithEmailPassword`, `loginWithGoogle`, `logoutFirebase`; reducer `setUserFromFirebase`.
- `src/components/AuthListener.tsx` → Sincroniza el estado Redux con Firebase Auth (onAuthStateChanged).
- `src/components/Login.tsx` → Formulario de correo/contraseña y botón Google.
- `src/components/UserHome.tsx` → Muestra usuario y botón **Cerrar sesión**.

> Basado en la guía dada en clase. Consulta también la doc oficial de Google Sign-In para Web.