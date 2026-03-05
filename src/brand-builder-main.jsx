import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import BrandBuilderApp from './BrandBuilderApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrandBuilderApp />
  </StrictMode>,
)
