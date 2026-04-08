import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'
import useAuthStore from '@features/auth/store/auth.store'

// 🔥 Initialize auth on startup (hydrate JWT + customer profile)
useAuthStore.getState().init();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)