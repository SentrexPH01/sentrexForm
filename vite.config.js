import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


const proxyConfig = {
  '/send-iam-data': {
    target: 'http://localhost:3001', // Replace with your actual backend server URL
    changeOrigin: true,
    ws: true,
  },
  '/generate-pdf': {
    target: 'http://localhost:3001', // Replace with your actual backend server URL
    changeOrigin: true,
    ws: true,
  },
};


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: proxyConfig,
  },
});
