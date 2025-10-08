import { useDispatch, useSelector } from 'react-redux'
import { push, pop, clear } from '../features/stackSlice'
import { useState } from 'react'

export default function Stack(){
  const { items, peek } = useSelector(state => state.stack)
  const dispatch = useDispatch()
  const [value, setValue] = useState('')

  return (
    <div>
      <h2>Pila</h2>
      <div className="row">
        <input
          placeholder="Valor a apilar (push)"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <button onClick={() => { if(value!==''){ dispatch(push(value)); setValue('') } }}>push</button>
        <button onClick={() => dispatch(pop())}>pop</button>
        <button className="ghost" onClick={() => dispatch(clear())}>clear</button>
      </div>

      <div className="peek">cima: <strong>{peek ?? '—'}</strong></div>

      <ol className="stack">
        {[...items].reverse().map((it, idx) => (
          <li key={idx} className={idx===0 ? 'top' : ''}>
            {it}{idx===0 ? '  ← top' : ''}
          </li>
        ))}
      </ol>
      <p className="help">La pila se muestra desde la cima (arriba) hacia la base.</p>
    </div>
  )
}
