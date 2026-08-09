import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Burn1App from './Burn1App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Burn1App />
  </StrictMode>,
)
