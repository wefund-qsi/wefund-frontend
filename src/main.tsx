import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './infrastructure/i18n/index.ts'
import './styles/fonts.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
