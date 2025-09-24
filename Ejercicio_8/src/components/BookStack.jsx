import React from 'react'

export default function BookStack({ items = [] }){
  if(items.length === 0){
    return <p className="meta">La pila está vacía. Agrega tu primer libro desde el formulario.</p>
  }

  // Show top at the bottom visually (to emphasize LIFO), but list downwards
  return (
    <ol className="stack-list" reversed>
      {items.map((b, idx) => (
        <li key={b.id} className="stack-item">
          <div style={{flex:1}}>
            <strong>{b.name}</strong>
            <div className="meta">Autor: {b.author} · Editorial: {b.publisher}</div>
            <div className="meta">ISBN: {b.isbn}</div>
          </div>
          <div style={{textAlign:'right'}}>
            <span className="badge">#{idx+1}</span>
          </div>
        </li>
      ))}
    </ol>
  )
}
