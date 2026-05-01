import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate', // Actualiza el Service Worker automáticamente
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-safe-icon.svg'],
      manifest: {
        name: 'Mi Calculadora de Gastos',
        short_name: 'Calculadora',
        description: 'Controla tus gastos diarios incluso sin internet',
        theme_color: '#4ade80', // El verde de tu app (green-400)
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-515x512.png', // Usa el mismo mientras consigues uno de 512 real
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable', // <--- AGREGA ESTO (es vital para Android)
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
