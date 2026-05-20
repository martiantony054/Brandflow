import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // Any request to /api/* is forwarded to the Express server.
      // This means the browser never sees cross-origin requests in dev.
      '/api': {
        target:       'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
