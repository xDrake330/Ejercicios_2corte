import React, { useMemo, useState } from 'react'
import SinglyLinkedList from '../structures/SinglyLinkedList'
import { mockSongs } from '../data/mockSongs'

export default function LinkedListPage(){
  const list = useMemo(()=>{
    const l = new SinglyLinkedList()
    mockSongs.forEach(s => l.push(s))
    return l
  },[])

  const [current, setCurrent] = useState(list.current())

  const handlePlay = () => setCurrent(list.reset())
  const handleNext = () => setCurrent(list.next())
  const disabledNext = !list.hasNext()

  return (
    <section className="card">
      <h2 className="title">Canciones (Lista enlazada simple)</h2>
      <p className="small">Reproduce en orden: <span className="badge">{mockSongs.length} pistas</span></p>

      <div className="btn-row" style={{marginTop:12}}>
        <button className="btn" onClick={handlePlay}>▶️ Reproducir</button>
        <button className="btn" onClick={handleNext} disabled={disabledNext}>⏭️ Siguiente</button>
      </div>

      <div style={{marginTop:16}}>
        <div className="badge">Actual</div>
        {current ? (
          <div style={{marginTop:8}}>
            <div><strong>{current.title}</strong> — {current.artist}</div>
            <div className="small">Duración: {current.duration}</div>
          </div>
        ) : <p className="small">Sin selección.</p>}
      </div>

      <hr />
      <details>
        <summary>Ver cola</summary>
        <ol className="list">
          {list.toArray().map(s => (
            <li key={s.id}>{s.title} — <span className="small">{s.artist}</span></li>
          ))}
        </ol>
      </details>
    </section>
  )
}
