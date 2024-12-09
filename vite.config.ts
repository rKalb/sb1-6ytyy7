import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@headlessui/react', '@heroicons/react'],
          state: ['zustand', 'immer'],
          aws: ['@aws-sdk/client-dynamodb', '@aws-sdk/lib-dynamodb']
        }
      }
    }
  },
  base: process.env.NODE_ENV === 'development' ? '/' : './'
});