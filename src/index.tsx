import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { App } from './App'
import { ReactrisProvider } from './ReactrisContext'

ReactDOM.render(
  <React.StrictMode>
    <ReactrisProvider>
      <App />
    </ReactrisProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
