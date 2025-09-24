import React, { useState } from 'react'

export default function BookForm({ onAdd }){
  const [form, setForm] = useState({ name:'', isbn:'', author:'', publisher:'' })
  const [error, setError] = useState(null)

  const onChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const validate = () => {
    if(!form.name.trim()) return 'El nombre es obligatorio.'
    if(!form.isbn.trim()) return 'El ISBN es obligatorio.'
    if(!/^[-0-9Xx]{10,17}$/.test(form.isbn.trim())) return 'ISBN con formato no válido.'
    if(!form.author.trim()) return 'El autor es obligatorio.'
    if(!form.publisher.trim()) return 'La editorial es obligatoria.'
    return null
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const v = validate()
    if(v){ setError(v); return }
    onAdd(form)
    setForm({ name:'', isbn:'', author:'', publisher:'' })
    setError(null)
  }

  return (
    <section>
      <h2>Agregar nuevo libro</h2>
      <form onSubmit={onSubmit} noValidate>
        <div>
          <label>Nombre del libro</label>
          <input name="name" value={form.name} onChange={onChange} placeholder="Ej: Clean Architecture" />
        </div>
        <div>
          <label>ISBN</label>
          <input name="isbn" value={form.isbn} onChange={onChange} placeholder="Ej: 9780134494166" />
        </div>
        <div>
          <label>Autor</label>
          <input name="author" value={form.author} onChange={onChange} placeholder="Ej: Robert C. Martin" />
        </div>
        <div>
          <label>Editorial</label>
          <input name="publisher" value={form.publisher} onChange={onChange} placeholder="Ej: Addison-Wesley" />
        </div>
        <div className="actions" style={{gridColumn:'1 / -1'}}>
          <button className="button" type="submit">Agregar a la pila</button>
          <span aria-live="polite" style={{color:'#b91c1c', fontSize:12}}>{error}</span>
        </div>
      </form>
    </section>
  )
}
