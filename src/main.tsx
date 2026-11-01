import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, MemoryRouter } from 'react-router-dom'
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

// Įterpta į svetimą rėmelį (pvz., peržiūra claude.ai) – adreso eilutė neprieinama, tad maršrutai laikomi atmintyje.
let embedded = false
try { embedded = window.top !== window.self } catch { embedded = true }
const Router = embedded ? MemoryRouter : HashRouter

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </Router>
  </StrictMode>,
)
