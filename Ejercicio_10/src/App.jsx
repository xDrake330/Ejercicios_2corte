import Counter from './components/Counter'
import Stack from './components/Stack'

export default function App(){
  return (
    <div className="container">
      <h1>Ejercicio 10</h1>
      <div className="grid">
        <div className="card"><Counter/></div>
        <div className="card"><Stack/></div>
      </div>
    </div>
  )
}
