import React from 'react'

type State = { hasError: boolean; message?: string }

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, message: String(error) }
  }
  componentDidCatch(error: any, info: any) {
    console.error('UI error:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{maxWidth: 800, margin: '2rem auto', fontFamily: 'system-ui'}}>
          <h2>Se produjo un error en la UI</h2>
          <p style={{opacity:.8}}>Revisa la consola del navegador para más detalles.</p>
          {this.state.message && <pre style={{whiteSpace:'pre-wrap', background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'1rem'}}>{this.state.message}</pre>}
        </div>
      )
    }
    return this.props.children
  }
}