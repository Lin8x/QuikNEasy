import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  base: '/',      // served from domain root
  build: { outDir: 'dist', sourcemap: true }
})
