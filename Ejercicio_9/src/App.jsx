import React, { useMemo, useState, useEffect } from 'react'
import { Queue } from './components.Queue.js'

const formatoCOP = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n || 0)

const MOCK = [
  { id: crypto.randomUUID(), nombre: 'Ana Gómez', monto: 120000 },
  { id: crypto.randomUUID(), nombre: 'Carlos Ruiz', monto: 300000 },
  { id: crypto.randomUUID(), nombre: 'María López', monto: 80000 },
]

const STORAGE_KEY = 'cola_atm_v1'

export default function App(){
  const [nombre, setNombre] = useState('')
  const [monto, setMonto] = useState('')
  const [queue, setQueue] = useState(() => {
    const prev = localStorage.getItem(STORAGE_KEY)
    if (prev) {
      try { return JSON.parse(prev) } catch {}
    }
    return MOCK
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
  }, [queue])

  const q = useMemo(() => new Queue(queue), [queue])

  const totalPersonas = q.size()
  const totalMonto = useMemo(() => queue.reduce((acc, p) => acc + Number(p.monto || 0), 0), [queue])
  const primeraPersona = q.peek()

  function agregarPersona(e){
    e.preventDefault()
    const n = nombre.trim()
    const m = Number(monto)
    if (!n) return alert('Por favor ingresa el nombre.')
    if (!Number.isFinite(m) || m <= 0) return alert('Ingresa un monto de retiro válido (> 0).')
    const nueva = { id: crypto.randomUUID(), nombre: n, monto: m }
    setQueue(prev => [...prev, nueva]) // enqueue al final
    setNombre('')
    setMonto('')
  }

  function atender(){
    if (q.size() === 0) return
    const atendida = q.dequeue()
    setQueue(q.toArray())
    alert(`Atendido: ${atendida.nombre} — Retiro: ${formatoCOP(atendida.monto)}`)
  }

  function vaciar(){
    if (!confirm('¿Vaciar toda la cola?')) return
    setQueue([])
  }

  function cargarMock(){
    if (!confirm('Esto reemplazará la cola actual por datos de ejemplo. ¿Continuar?')) return
    setQueue(MOCK)
  }

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h1>Cola de Cajero Automático (ATM)</h1>
          <span className="badge">FIFO</span>
        </div>

        <p className="small">
          La cola funciona en orden <strong>primero en entrar, primero en salir</strong>.
          Agrega personas con el formulario y atiéndelas en orden.
        </p>

        <div className="grid" style={{marginTop: 12}}>
          <form className="card" onSubmit={agregarPersona} style={{padding:16}}>
            <h2 style={{marginTop:0, fontSize:18}}>Nueva persona</h2>
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input id="nombre" placeholder="p. ej., Laura Méndez" value={nombre} onChange={e=>setNombre(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="monto">Monto a retirar (COP)</label>
              <input id="monto" type="number" min="1" step="1000" placeholder="p. ej., 150000" value={monto} onChange={e=>setMonto(e.target.value)} />
            </div>
            <div className="row" style={{marginTop:12}}>
              <button type="submit" className="primary">Agregar a la cola</button>
              <button type="button" className="ghost" onClick={()=>{setNombre(''); setMonto('')}}>Limpiar</button>
            </div>
          </form>

          <div className="card" style={{padding:16}}>
            <h2 style={{marginTop:0, fontSize:18}}>Estado de la cola</h2>
            <div className="meta" style={{marginBottom:10}}>
              <span><strong>Personas:</strong> {totalPersonas}</span>
              <span><strong>Total a retirar:</strong> {formatoCOP(totalMonto)}</span>
              <span><strong>Primero en la cola:</strong> {primeraPersona ? primeraPersona.nombre : '—'}</span>
            </div>
            <div className="row" style={{marginBottom:12}}>
              <button className="ok" onClick={atender} disabled={totalPersonas===0}>Atender</button>
              <button className="warn" onClick={cargarMock}>Cargar datos simulados</button>
              <button className="danger" onClick={vaciar} disabled={totalPersonas===0}>Vaciar cola</button>
            </div>

            <div style={{overflowX:'auto'}}>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Monto</th>
                    <th>ID</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="small">No hay personas en la cola.</td>
                    </tr>
                  ) : queue.map((p, i) => (
                    <tr key={p.id}>
                      <td>{i+1}</td>
                      <td>{p.nombre}</td>
                      <td>{formatoCOP(p.monto)}</td>
                      <td className="small">{p.id.slice(0,8)}…</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
