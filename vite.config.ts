import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    fs: {
      allow: ['.'],
    },
  },
  optimizeDeps: {
    entries: [path.resolve(__dirname, 'index.html')],
  },
})