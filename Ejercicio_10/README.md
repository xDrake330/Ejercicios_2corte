# Redux DSA: Counter & Stack (Vite + React + Redux Toolkit)

## Definición del problema
Implementar en Redux:
1) Acción `decrement` y `incrementBy(VALUE)` para un contador, con UI que **pregunta en pantalla** el valor a incrementar.
2) Una **pila (Stack)** con operaciones `push`, `pop`, `peek` y `clear`, gestionada completamente por Redux.
3) Entregar un proyecto **listo para ejecutar** en VS Code (Vite).

---

## Requisitos
- Node.js >= 18
- npm >= 9

## Cómo ejecutar
```bash
npm install
npm run dev
# abre la URL que te muestra (por defecto http://localhost:5173)
```

## Estructura
```
├─ src/
│  ├─ features/
│  │  ├─ counterSlice.js
│  │  └─ stackSlice.js
│  ├─ components/
│  │  ├─ Counter.jsx
│  │  └─ Stack.jsx
│  ├─ store.js
│  ├─ App.jsx
│  └─ main.jsx
├─ index.html
├─ vite.config.js
└─ package.json
```

## Notas
- `incrementBy(VALUE)` valida el número ingresado (acepta enteros/decimales).
- La pila se visualiza desde la **cima** hacia abajo.
- `peek` no modifica la pila; muestra el elemento superior.
