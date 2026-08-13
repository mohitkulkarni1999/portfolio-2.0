import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite config: React plugin + Tailwind v4 plugin.
// The proxy forwards /api and /uploads to the backend on port 5000,
// so the frontend can use simple relative URLs like /api/profile.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
    },
  },
})
