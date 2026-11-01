import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { ProgressProvider } from './lib/progress'
import './index.css'

// Tarnybinis scenarijus (service worker): programėlė veikia ir be ryšio.
// Jei aplinka to neleidžia (pvz., peržiūra svetimame domene), tyliai praleidžiame.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    try {
      navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(() => { /* neprieinama */ })
    } catch { /* neprieinama */ }
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </HashRouter>
  </StrictMode>,
)
