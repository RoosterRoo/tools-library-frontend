import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // <-- Triple check this port! Is your backend on 5000 or something else like 4000 or 8000?
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
