import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AlertProvider } from './components/AlertProvider'
import { AppStateProvider } from './providers/AppStateProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AlertProvider>
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </AlertProvider>
  </StrictMode>,
)
