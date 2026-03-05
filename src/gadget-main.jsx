import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import GadgetApp from './GadgetApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GadgetApp />
  </StrictMode>,
)
