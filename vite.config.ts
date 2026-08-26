import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

// Eigene Domain (cafe.garciahub.de) → die App liegt im Wurzelverzeichnis.
// DEPLOY_BASE bleibt als Notausgang, falls wieder unter /<repo>/ ausgeliefert
// werden muss.
const BASE = process.env.DEPLOY_BASE ?? '/'

export default defineConfig({
  base: BASE,
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@domain': fileURLToPath(new URL('./types/domain.ts', import.meta.url)),
      '@data': fileURLToPath(new URL('./data', import.meta.url)),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Café — dein Dial-in',
        short_name: 'Café',
        description: 'Persönliches Dial-in-Werkzeug für Espresso, V60 und AeroPress',
        lang: 'de',
        theme_color: '#171310',
        background_color: '#171310',
        display: 'standalone',
        orientation: 'portrait',
        start_url: BASE,
        scope: BASE,
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Die App macht keine Netzwerkanfragen zur Laufzeit —
        // alles wird beim ersten Laden gecacht.
        navigateFallback: `${BASE}index.html`,
        // Statische Dokumente (Cheat Sheet) nie durch die App-Shell ersetzen.
        navigateFallbackDenylist: [/asc-barista-cheatsheet\.html$/],
      },
    }),
  ],
  build: {
    target: 'es2022',
    sourcemap: false,
  },
})
