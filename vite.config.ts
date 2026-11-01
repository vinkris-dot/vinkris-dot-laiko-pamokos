import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' – veikia ir GitHub Pages poaplankyje, ir Netlify šaknyje
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
