import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: 'all',
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
