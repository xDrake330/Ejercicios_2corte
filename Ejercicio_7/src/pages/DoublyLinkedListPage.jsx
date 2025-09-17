import React, { useMemo, useState } from 'react'
import DoublyLinkedList from '../structures/DoublyLinkedList'
import { mockHistory } from '../data/mockHistory'

export default function DoublyLinkedListPage(){
  const history = useMemo(()=>{
    const l = new DoublyLinkedList()
    mockHistory.forEach(x => l.push(x))
    return l
  },[])

  const [current, setCurrent] = useState(history.current())

  const goStart = () => setCurrent(history.resetToHead())
  const goEnd = () => setCurrent(history.resetToTail())
  const goPrev = () => setCurrent(history.prev())
  const goNext = () => setCurrent(history.next())

  return (
    <section className="card">
      <h2 className="title">Historial (Lista doblemente enlazada)</h2>
      <p className="small">Navega atrás y adelante como en un navegador.</p>

      <div className="btn-row" style={{marginTop:12}}>
        <button className="btn" onClick={goStart}>⏮️ Inicio</button>
        <button className="btn" onClick={goPrev} disabled={!history.hasPrev()}>⬅️ Atrás</button>
        <button className="btn" onClick={goNext} disabled={!history.hasNext()}>➡️ Adelante</button>
        <button className="btn" onClick={goEnd}>⏭️ Final</button>
      </div>

      <div style={{marginTop:16}}>
        <div className="badge">Página actual</div>
        {current ? (
          <div style={{marginTop:8}}>
            <div><strong>{current.title}</strong></div>
            <div className="small">{current.url}</div>
          </div>
        ) : <p className="small">Sin selección.</p>}
      </div>

      <hr />
      <details>
        <summary>Ver recorrido</summary>
        <ol className="list">
          {history.toArray().map((h,i) => (
            <li key={i}>{h.title} — <span className="small">{h.url}</span></li>
          ))}
        </ol>
      </details>
    </section>
  )
}
