import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5177,
    host: true
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
})
