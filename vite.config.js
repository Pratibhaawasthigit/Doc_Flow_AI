import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Doc_Flow_AI/',
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/wandbox': {
        target: 'https://wandbox.org',
        changeOrigin: true,
        rewrite: (path) => path.replace('/wandbox', '')
      }
    },
  },
})
