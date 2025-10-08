import { useDispatch, useSelector } from 'react-redux'
import { decrement, incrementBy, reset } from '../features/counterSlice'
import { useState } from 'react'

export default function Counter(){
  const value = useSelector(state => state.counter.value)
  const dispatch = useDispatch()
  const [input, setInput] = useState('')

  const onInc = () => {
    dispatch(incrementBy(input))
    setInput('')
  }

  return (
    <div>
      <h2>Counter</h2>
      <div className="counter-display">{value}</div>
      <div className="row">
        <button onClick={() => dispatch(decrement())}>decrement</button>
        <input
          aria-label="increment value"
          type="number"
          step="1"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="¿Cuánto quieres sumar?"
        />
        <button onClick={onInc}>incrementBy(VALUE)</button>
        <button className="ghost" onClick={() => dispatch(reset())}>reset</button>
      </div>
      <p className="help">
        Escribe un número en el campo y pulsa <strong>incrementBy(VALUE)</strong>.
      </p>
    </div>
  )
}
