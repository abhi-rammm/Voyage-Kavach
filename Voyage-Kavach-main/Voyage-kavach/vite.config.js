import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        serviceWorker: 'firebase-messaging-sw.js', // Ensure SW is included in the build
      },
    },
  },
});
