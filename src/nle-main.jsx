import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import VideoEditorApp from './components/VideoEditor/VideoEditorApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <VideoEditorApp />
  </StrictMode>,
)
