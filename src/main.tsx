import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './api/interceptors' // Attach interceptors to the initialized Axios instance
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
