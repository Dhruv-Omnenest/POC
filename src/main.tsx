import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './api/interceptors' // Attach interceptors to the initialized Axios instance
import App from './App.tsx'

// Quick wipe of legacy chunk cookies that cause 431 Request Header Errors
document.cookie.split(";").forEach((c) => {
  if (c.trim().startsWith("auth_token_") || c.trim().startsWith("refresh_token_")) {
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
