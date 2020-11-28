import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { App } from './App'
import { ViewProvider } from './ViewContext'

ReactDOM.render(
  <React.StrictMode>
    <ViewProvider width={14}>
      <App />
    </ViewProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
