import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ResumeApp from './ResumeApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ResumeApp />
  </StrictMode>,
)
