import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Watz4DinnerApp from './Watz4DinnerApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Watz4DinnerApp />
  </StrictMode>,
)
