import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/index.css'
import SlimeApp from './SlimeApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SlimeApp />
  </StrictMode>,
)
