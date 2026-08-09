import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CommandCenterApp from './components/CommandCenter/CommandCenterApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CommandCenterApp />
  </StrictMode>,
)
