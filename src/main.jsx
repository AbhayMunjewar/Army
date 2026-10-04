import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'leaflet/dist/leaflet.css'
import './index.css'
import App from './App.jsx'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register RAKSHAK PWA Service Worker for offline zero-internet support
serviceWorkerRegistration.register();

