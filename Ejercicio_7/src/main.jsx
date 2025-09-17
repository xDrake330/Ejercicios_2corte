import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import LinkedListPage from './pages/LinkedListPage.jsx'
import DoublyLinkedListPage from './pages/DoublyLinkedListPage.jsx'
import './styles.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <LinkedListPage /> },
      { path: '/doble', element: <DoublyLinkedListPage /> },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
