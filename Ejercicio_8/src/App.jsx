import React, { useMemo, useState } from 'react'
import BookForm from './components/BookForm.jsx'
import BookStack from './components/BookStack.jsx'

const seedBooks = [
  { id: crypto.randomUUID(), name: 'Clean Code', isbn: '9780132350884', author: 'Robert C. Martin', publisher: 'Prentice Hall', createdAt: Date.now() - 1000 },
  { id: crypto.randomUUID(), name: 'You Don\'t Know JS Yet', isbn: '9781091210099', author: 'Kyle Simpson', publisher: 'Independently published', createdAt: Date.now() - 800 },
  { id: crypto.randomUUID(), name: 'Refactoring', isbn: '9780134757599', author: 'Martin Fowler', publisher: 'Addison-Wesley', createdAt: Date.now() - 600 },
]

export default function App(){
  const [stack, setStack] = useState(seedBooks)

  // Push: add to top
  const push = (book) => {
    setStack(prev => [...prev, { ...book, id: crypto.randomUUID(), createdAt: Date.now() }])
  }

  // Pop: remove from top
  const pop = () => {
    setStack(prev => prev.slice(0, -1))
  }

  const top = stack.length ? stack[stack.length - 1] : null

  const size = stack.length

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1> Pila de Libros</h1>
          <h2>Challenge 08 </h2>
        </div>
        <div className="badge">Tamaño: {size}</div>
      </header>

      <div className="card" style={{marginBottom:16}}>
        <BookForm onAdd={push} />
      </div>

      <div className="card">
        <div style={{display:'flex',justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
          <h2>Contenido de la pila:</h2>
          <div className="actions">
            <button className="button ghost" onClick={pop} disabled={size === 0}>Retirar</button>
          </div>
        </div>

        <BookStack items={stack} />
      </div>

      <footer>Nota: En una pila LIFO, el último libro agregado es el primero en salir.</footer>
    </div>
  )
}
