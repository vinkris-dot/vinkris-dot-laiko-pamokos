import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// base './' – veikia ir GitHub Pages poaplankyje, ir Netlify šaknyje
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: null,            // registruojame patys, su try/catch (žr. main.tsx)
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Laiko pamokos',
        short_name: 'Laiko pamokos',
        description: 'Vaizdinis kursas apie kvantinę fiziką, laiką, smegenis ir kūno laikrodžius',
        lang: 'lt',
        start_url: './',
        scope: './',
        display: 'standalone',
        background_color: '#f7f5f0',
        theme_color: '#f7f5f0',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'],
        navigateFallback: 'index.html',
      },
    }),
  ],
})
