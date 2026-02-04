import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Polyfill para window.storage (localStorage wrapper)
if (!window.storage) {
  window.storage = {
    get: async (key) => {
      const value = localStorage.getItem(key)
      return value ? { value } : null
    },
    set: async (key, value) => {
      localStorage.setItem(key, value)
    },
    remove: async (key) => {
      localStorage.removeItem(key)
    }
  }
}

// Service Worker é registrado automaticamente pelo vite-plugin-pwa

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
