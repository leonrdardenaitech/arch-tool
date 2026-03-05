import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import VoxApp from './VoxApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <VoxApp />
  </StrictMode>,
)
