import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AtlasCoreV2App from './components/AtlasCoreV2/AtlasCoreV2App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AtlasCoreV2App />
  </StrictMode>,
)
