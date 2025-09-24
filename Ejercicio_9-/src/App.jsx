import React, { useMemo, useState, useEffect } from 'react'
import { Queue } from './components.Queue.js'

const formatoCOP = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n || 0)
const formatoFechaHora = (iso) => {
  try{
    const d = new Date(iso)
    const fecha = d.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' })
    const hora = d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false })
    return `${fecha} ${hora}`
  }catch{ return '—' }
}

// Utilidad para crear fechas "hoy" escalonadas por minutos
const addMinutes = (baseDate, mins) => {
  const d = new Date(baseDate.getTime() + mins * 60000)
  return d.toISOString()
}

const now = new Date()

const MOCK = [
  { id: crypto.randomUUID(), nombre: 'Ana Gómez', monto: 120000, scheduledAt: addMinutes(now, 5) },
  { id: crypto.randomUUID(), nombre: 'Carlos Ruiz', monto: 300000, scheduledAt: addMinutes(now, 10) },
  { id: crypto.randomUUID(), nombre: 'María López', monto: 80000, scheduledAt: addMinutes(now, 15) },
]

const STORAGE_KEY = 'cola_atm_v2'

export default function App(){
  const [nombre, setNombre] = useState('')
  const [monto, setMonto] = useState('')
  const [fecha, setFecha] = useState('') // yyyy-mm-dd
  const [hora, setHora] = useState('')  // HH:mm

  const [queue, setQueue] = useState(() => {
    const prev = localStorage.getItem(STORAGE_KEY)
    if (prev) {
      try { return JSON.parse(prev) } catch {}
    }
    return MOCK
  })

  // Mantener orden por fecha/hora (scheduledAt) ASC
  const ordenada = useMemo(() => {
    return [...queue].sort((a,b) => {
      const ta = new Date(a.scheduledAt || 0).getTime()
      const tb = new Date(b.scheduledAt || 0).getTime()
      return ta - tb
    })
  }, [queue])

  // Persistencia
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
  }, [queue])

  const q = useMemo(() => new Queue(ordenada), [ordenada])

  const totalPersonas = q.size()
  const totalMonto = useMemo(() => ordenada.reduce((acc, p) => acc + Number(p.monto || 0), 0), [ordenada])
  const primeraPersona = q.peek()

  function agregarPersona(e){
    e.preventDefault()
    const n = nombre.trim()
    const m = Number(monto)
    if (!n) return alert('Por favor ingresa el nombre.')
    if (!Number.isFinite(m) || m <= 0) return alert('Ingresa un monto de retiro válido (> 0).')
    if (!fecha) return alert('Selecciona la fecha de atención.')
    if (!hora) return alert('Selecciona la hora de atención.')
    const iso = new Date(`${fecha}T${hora}:00`).toISOString()
    const nueva = { id: crypto.randomUUID(), nombre: n, monto: m, scheduledAt: iso }
    setQueue(prev => [...prev, nueva]) // se re-ordena vía 'ordenada'
    setNombre('')
    setMonto('')
    setFecha('')
    setHora('')
  }

  function atender(){
    if (q.size() === 0) return
    const atendida = q.dequeue() // siempre la más próxima por orden
    // quitar del arreglo original por id
    setQueue(prev => prev.filter(p => p.id !== atendida.id))
    alert(`Atendido: ${atendida.nombre} — Retiro: ${formatoCOP(atendida.monto)} — Programado: ${formatoFechaHora(atendida.scheduledAt)}`)
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
          <span className="badge">Atención por fecha y hora</span>
        </div>

        <p className="small">
          La atención respeta la <strong>fecha y hora programadas</strong> (más próxima primero). 
          Agrega personas con el formulario y atiéndelas en ese orden.
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
            <div className="row" style={{marginTop:12, gap:12}}>
              <div className="form-group" style={{flex:'1 1 160px'}}>
                <label htmlFor="fecha">Fecha</label>
                <input id="fecha" type="date" value={fecha} onChange={e=>setFecha(e.target.value)} />
              </div>
              <div className="form-group" style={{flex:'1 1 140px'}}>
                <label htmlFor="hora">Hora</label>
                <input id="hora" type="time" value={hora} onChange={e=>setHora(e.target.value)} />
              </div>
            </div>
            <div className="row" style={{marginTop:12}}>
              <button type="submit" className="primary">Agregar a la cola</button>
              <button type="button" className="ghost" onClick={()=>{setNombre(''); setMonto(''); setFecha(''); setHora('')}}>Limpiar</button>
            </div>
          </form>

          <div className="card" style={{padding:16}}>
            <h2 style={{marginTop:0, fontSize:18}}>Estado de la cola</h2>
            <div className="meta" style={{marginBottom:10}}>
              <span><strong>Personas:</strong> {totalPersonas}</span>
              <span><strong>Total a retirar:</strong> {formatoCOP(totalMonto)}</span>
              <span><strong>Próximo turno:</strong> {primeraPersona ? `${primeraPersona.nombre} (${formatoFechaHora(primeraPersona.scheduledAt)})` : '—'}</span>
            </div>
            <div className="row" style={{marginBottom:12}}>
              <button className="ok" onClick={atender} disabled={totalPersonas===0}>Atender siguiente</button>
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
                    <th>Fecha y hora</th>
                    <th>ID</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenada.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="small">No hay personas en la cola.</td>
                    </tr>
                  ) : ordenada.map((p, i) => (
                    <tr key={p.id}>
                      <td>{i+1}</td>
                      <td>{p.nombre}</td>
                      <td>{formatoCOP(p.monto)}</td>
                      <td>{formatoFechaHora(p.scheduledAt)}</td>
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
