import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

export default function App(){
  return (
    <div className="container">
      <header className="header">
        <div>
          <h1 className="title">Listas enlazadas en React</h1>
        </div>
        <nav>
          <NavLink className="btn" to="/">Canciones</NavLink>
          <NavLink className="btn" to="/doble">Historial</NavLink>
        </nav>
      </header>
      <Outlet />
      <hr />
      <p className="small">Proyecto de clase - Fabio Jordan C</p>
    </div>
  )
}
