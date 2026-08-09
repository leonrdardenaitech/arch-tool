import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import FriedBrainsApp from './FriedBrainsApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FriedBrainsApp />
  </StrictMode>,
)
